import React, { useEffect, useState } from "react";
import { getChatRooms, getMessages } from "../services/auth";
import { useUser } from "../context/UserContext";
import LoadingSpinner from "../components/LoadingSpinner";

const WS_BASE = "ws://127.0.0.1:8000/ws/chat/presence/";

const Chat = () => {
  const { user } = useUser();
  const [chatrooms, setChatrooms] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const wsRef = React.useRef(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    async function fetchData() {
      setLoading(true);
      try {
        const [rooms, msgs] = await Promise.all([getChatRooms(), getMessages()]);
        setChatrooms(rooms);
        setMessages(msgs);
      } catch {
        setChatrooms([]);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  // WebSocket for presence
  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem("accessToken");
    const ws = new WebSocket(`${WS_BASE}?token=${token}`);
    wsRef.current = ws;
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "online_users") {
          setOnlineUsers(data.users);
        }
      } catch {}
    };
    ws.onclose = () => {
      setOnlineUsers([]);
    };
    return () => {
      ws.close();
    };
  }, [user]);

  if (loading) return <LoadingSpinner />;
  if (!user) return <div>Please log in to view chat.</div>;

  return (
    <div style={{ maxWidth: 900, margin: "2rem auto", padding: 32, background: "var(--card-bg)", borderRadius: 12, boxShadow: "0 2px 12px #eee" }}>
      <h2>Chatrooms</h2>
      <div style={{ marginBottom: 16 }}>
        <strong>Online Users:</strong> {onlineUsers.length === 0 ? "None" : onlineUsers.join(", ")}
      </div>
      {chatrooms.length === 0 ? (
        <div>No chatrooms found.</div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 32 }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Participants</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {chatrooms.map(room => (
              <tr key={room.id}>
                <td>{room.id}</td>
                <td>{room.name}</td>
                <td>{room.participants ? room.participants.length : 0}</td>
                <td>{room.created_at ? new Date(room.created_at).toLocaleString() : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <h2>Messages</h2>
      {messages.length === 0 ? (
        <div>No messages found.</div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Room</th>
              <th>Sender</th>
              <th>Content</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {messages.map(msg => (
              <tr key={msg.id}>
                <td>{msg.id}</td>
                <td>{msg.chatroom}</td>
                <td>{msg.sender}</td>
                <td>{msg.content}</td>
                <td>{msg.timestamp ? new Date(msg.timestamp).toLocaleString() : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Chat; 