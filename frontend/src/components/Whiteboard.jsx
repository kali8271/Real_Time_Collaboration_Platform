import React, { useRef, useEffect, useState } from "react";
import { useWebSocket } from "../services/websocket";

const documentId = "demo-whiteboard"; // Replace with real docId as needed
const WS_URL = `ws://127.0.0.1:8000/ws/documents/${documentId}/`;

const Whiteboard = () => {
  const canvasRef = useRef(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // WebSocket hook
  const { messages, sendMessage, status, error: wsError } = useWebSocket(WS_URL);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = 800;
    canvas.height = 500;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  useEffect(() => {
    // Listen for presence events and update online users
    const lastPresence = messages.filter(m => m.event === "user_joined" || m.event === "user_left").slice(-1)[0];
    if (lastPresence) {
      setOnlineUsers(lastPresence.users || []);
      setNotification(
        lastPresence.event === "user_joined"
          ? `${lastPresence.username} joined the whiteboard.`
          : `${lastPresence.username} left the whiteboard.`
      );
      // Clear notification after 3s
      const timeout = setTimeout(() => setNotification(""), 3000);
      return () => clearTimeout(timeout);
    }
  }, [messages]);

  // Example: send a test message
  const handleSendTest = () => {
    sendMessage({ action: "draw", drawing_data: { x: Math.random() * 800, y: Math.random() * 500 } });
  };

  const handleSave = async () => {
    setError("");
    setSaveSuccess(false);
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 700));
      setSaveSuccess(true);
    } catch (err) {
      setError(err.message || "Failed to save whiteboard.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-2 text-sm text-gray-700">
        <strong>Online:</strong> {onlineUsers.join(", ") || "No one"}
      </div>
      {notification && <div className="mb-2 text-green-700">{notification}</div>}
      <canvas ref={canvasRef} className="border shadow-lg" />
      <div className="mt-2">
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Whiteboard"}
        </button>
        <button
          className="ml-2 bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleSendTest}
        >
          Send Test Message
        </button>
        <div className="mt-2">
          <strong>Status:</strong> {status}
          {wsError && <span style={{ color: "red" }}> | {wsError}</span>}
        </div>
        {error && <div style={{ color: "red" }} className="mt-2">{error}</div>}
        {saveSuccess && <div style={{ color: "green" }} className="mt-2">Saved successfully!</div>}
      </div>
      <div className="mt-4">
        <h4>Received Messages:</h4>
        <ul>
          {messages.map((msg, idx) => (
            <li key={idx}>{JSON.stringify(msg)}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Whiteboard;
