"use client";
import { useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

export default function MessageInput({ onSendMessage }: MessageInputProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleTyping = () => {
    socket.emit("typing");
  };

  return (
    <div className="flex items-center p-4 border-t bg-white">
      <input
        type="text"
        className="flex-1 p-2 border rounded-lg focus:outline-none"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          handleTyping();
        }}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <button
        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
        onClick={handleSend}
      >
        Send
      </button>
    </div>
  );
}
