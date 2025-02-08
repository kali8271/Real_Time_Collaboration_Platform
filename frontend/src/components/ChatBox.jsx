import React, { useState } from "react";

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const sendMessage = () => {
    setMessages([...messages, { text, id: messages.length }]);
    setText("");
  };

  return (
    <div className="p-4 border rounded shadow-md">
      <h2 className="font-bold">Chat</h2>
      <div className="h-40 overflow-y-auto border p-2 mt-2">
        {messages.map((msg) => (
          <p key={msg.id} className="bg-gray-100 p-2 rounded mb-1">{msg.text}</p>
        ))}
      </div>
      <input
        type="text"
        className="border rounded w-full p-2 mt-2"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded" onClick={sendMessage}>
        Send
      </button>
    </div>
  );
};

export default ChatBox;
