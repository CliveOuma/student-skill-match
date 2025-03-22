"use client";
import { useState } from "react";
import io from "socket.io-client";

const socket = io(`${process.env.NEXT_PUBLIC_API_URL}`);

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
    <div className="flex items-center gap-2 p-2 sm:p-3 border-t bg-white w-full">
      <input
        type="text"
        className="flex-1 p-2 sm:p-3 border rounded-lg focus:outline-none text-sm sm:text-base w-full"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          handleTyping();
        }}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <button
        className="px-3 py-2 sm:px-4 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all text-sm sm:text-base"
        onClick={handleSend}
      >
        Send
      </button>
    </div>
  );
}
