import { useEffect, useRef, useState, useCallback } from "react";

/**
 * useWebSocket - A reusable React hook for robust WebSocket management.
 * @param {string} url - The WebSocket server URL (without token).
 * @param {object} [options] - Optional settings (e.g., reconnectInterval).
 * @returns {object} { messages, sendMessage, status, error, clearMessages }
 */
export function useWebSocket(url, options = {}) {
  const reconnectInterval = options.reconnectInterval || 3000;
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("connecting"); // connecting | open | closed | error
  const [error, setError] = useState(null);
  const wsRef = useRef(null);
  const reconnectTimeout = useRef(null);

  // Helper to append JWT token from localStorage
  function withToken(wsUrl) {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const sep = wsUrl.includes("?") ? "&" : "?";
        return wsUrl + sep + "token=" + encodeURIComponent(token);
      }
    } catch {}
    return wsUrl;
  }

  const connect = useCallback(() => {
    if (wsRef.current) wsRef.current.close();
    setStatus("connecting");
    setError(null);
    const ws = new window.WebSocket(withToken(url));
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus("open");
      setError(null);
    };
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setMessages((prev) => [...prev, data]);
      } catch (e) {
        setError("Invalid message format");
      }
    };
    ws.onerror = (e) => {
      setStatus("error");
      setError("WebSocket error");
    };
    ws.onclose = () => {
      setStatus("closed");
      // Try to reconnect after a delay
      reconnectTimeout.current = setTimeout(connect, reconnectInterval);
    };
  }, [url, reconnectInterval]);

  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, [connect]);

  const sendMessage = useCallback((msg) => {
    if (wsRef.current && wsRef.current.readyState === 1) {
      wsRef.current.send(JSON.stringify(msg));
    } else {
      setError("WebSocket not connected");
    }
  }, []);

  const clearMessages = useCallback(() => setMessages([]), []);

  return { messages, sendMessage, status, error, clearMessages };
}
