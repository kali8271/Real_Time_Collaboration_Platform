import React, { useState, useEffect, useRef } from "react";
import { useWebSocket } from "../services/websocket";
import { toast } from "react-toastify";
import { Picker } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';

const chatRoomId = "demo-chat"; // Replace with real room id as needed
const WS_URL = `ws://127.0.0.1:8000/ws/chat/${chatRoomId}/`;

const ChatBox = () => {
  const [text, setText] = useState("");
  const { messages, sendMessage, status, error } = useWebSocket(WS_URL);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notification, setNotification] = useState("");
  const [typingUsers, setTypingUsers] = useState([]);
  const typingTimeout = useRef(null);
  const isTyping = useRef(false);
  const currentUser = localStorage.getItem("username") || "You";
  const [showEmoji, setShowEmoji] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(null); // message index or null
  const [messageReactions, setMessageReactions] = useState({}); // {message_id: {emoji: [usernames]}}

  useEffect(() => {
    // Listen for presence events and update online users
    const lastPresence = messages.filter(m => m.event === "user_joined" || m.event === "user_left").slice(-1)[0];
    if (lastPresence) {
      setOnlineUsers(lastPresence.users || []);
      setNotification(
        lastPresence.event === "user_joined"
          ? `${lastPresence.username} joined the chat.`
          : `${lastPresence.username} left the chat.`
      );
      toast.info(
        lastPresence.event === "user_joined"
          ? `${lastPresence.username} joined the chat.`
          : `${lastPresence.username} left the chat.`
      );
      // Clear notification after 3s
      const timeout = setTimeout(() => setNotification(""), 3000);
      return () => clearTimeout(timeout);
    }
  }, [messages]);

  useEffect(() => {
    // Listen for typing events
    const lastTyping = messages.filter(m => m.event === "typing").slice(-1)[0];
    if (lastTyping) {
      setTypingUsers(lastTyping.users || []);
    }
  }, [messages]);

  useEffect(() => {
    // Toast for new messages (not from self)
    const lastMsg = messages.filter(m => !m.event && (m.text || m.message)).slice(-1)[0];
    if (lastMsg && (lastMsg.sender || lastMsg.username) && (lastMsg.sender || lastMsg.username) !== currentUser) {
      const msgText = lastMsg.text || lastMsg.message || "";
      if (msgText.toLowerCase().includes(currentUser.toLowerCase())) {
        toast.warn(`You were mentioned: ${msgText}`);
      } else {
        toast.info(`${lastMsg.sender || lastMsg.username}: ${msgText}`);
      }
    }
  }, [messages, currentUser]);

  useEffect(() => {
    // Listen for reaction events
    const lastReaction = messages.filter(m => m.event === 'reaction').slice(-1)[0];
    if (lastReaction && lastReaction.message_id) {
      setMessageReactions(prev => ({ ...prev, [lastReaction.message_id]: lastReaction.reactions }));
    }
    // Listen for reactions in chat_message events
    messages.filter(m => m.message_id).forEach(m => {
      if (m.reactions) {
        setMessageReactions(prev => ({ ...prev, [m.message_id]: m.reactions }));
      }
    });
  }, [messages]);

  const handleSend = () => {
    if (text.trim()) {
      sendMessage({ message: text });
      setText("");
      isTyping.current = false;
      sendMessage({ typing: false });
    }
  };

  const handleTyping = (e) => {
    setText(e.target.value);
    if (!isTyping.current) {
      isTyping.current = true;
      sendMessage({ typing: true });
    }
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      isTyping.current = false;
      sendMessage({ typing: false });
    }, 1200);
  };

  const addEmoji = (emoji) => {
    setText(text + emoji.native);
    setShowEmoji(false);
  };

  const handleReact = (message_id, emoji) => {
    setShowReactionPicker(null);
    sendMessage({ reaction: { message_id, emoji, username: currentUser } });
  };

  return (
    <div className="p-4 border rounded shadow-md" style={{ position: 'relative' }}>
      <h2 className="font-bold">Chat</h2>
      <div className="mb-2 text-sm text-gray-700">
        <strong>Online:</strong> {onlineUsers.join(", ") || "No one"}
      </div>
      {notification && <div className="mb-2 text-green-700">{notification}</div>}
      <div className="h-40 overflow-y-auto border p-2 mt-2">
        {messages.filter(m => !m.event).map((msg, idx) => (
          <div key={idx} style={{ position: 'relative', marginBottom: 8 }}>
            <p className="bg-gray-100 p-2 rounded mb-1" style={{ marginBottom: 2 }}>
              {msg.text || msg.message || JSON.stringify(msg)}
              {msg.message_id && messageReactions[msg.message_id] && (
                <span style={{ marginLeft: 8 }}>
                  {Object.entries(messageReactions[msg.message_id]).map(([emoji, users]) => (
                    <span key={emoji} style={{ marginRight: 4, cursor: 'pointer', fontSize: 18 }} title={users.join(', ')}>
                      {emoji} {users.length}
                    </span>
                  ))}
                </span>
              )}
              {msg.message_id && (
                <button
                  style={{ marginLeft: 8, fontSize: 16, background: 'none', border: 'none', cursor: 'pointer' }}
                  onClick={() => setShowReactionPicker(idx)}
                  title="React"
                >
                  😃
                </button>
              )}
            </p>
            {showReactionPicker === idx && (
              <div style={{ position: 'absolute', zIndex: 20, top: 32, left: 0 }}>
                <Picker
                  onSelect={emoji => handleReact(msg.message_id, emoji.native)}
                  theme="light"
                  title="Pick your reaction"
                />
              </div>
            )}
          </div>
        ))}
        {typingUsers.length > 0 && (
          <div className="text-xs text-blue-600 mt-2">{typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing...</div>
        )}
      </div>
      <div className="mt-2">
        <strong>Status:</strong> {status}
        {error && <span style={{ color: 'red' }}> | {error}</span>}
      </div>
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          className="border rounded w-full p-2 mt-2"
          value={text}
          onChange={handleTyping}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />
        <button
          type="button"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-200 rounded p-1"
          style={{ right: 8, top: '60%' }}
          onClick={() => setShowEmoji(v => !v)}
        >
          😊
        </button>
        {showEmoji && (
          <div style={{ position: 'absolute', right: 0, top: 48, zIndex: 10 }}>
            <Picker onSelect={addEmoji} theme="light" />
          </div>
        )}
      </div>
      <button
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleSend}
        disabled={!text.trim()}
      >
        Send
      </button>
    </div>
  );
};

export default ChatBox;
