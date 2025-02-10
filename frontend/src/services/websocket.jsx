import React, { useEffect, useState } from "react";

const WebSocketComponent = ({ docId }) => {
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/documents/${docId}/`);

    ws.onopen = () => console.log("WebSocket connected");
    ws.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };
    ws.onclose = () => console.log("WebSocket disconnected");

    return () => ws.close(); // Cleanup when component unmounts
  }, [docId]);

  return (
    <div>
      <h2>Real-time Document Updates</h2>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg.content}</li>
        ))}
      </ul>
    </div>
  );
};

export default WebSocketComponent;
