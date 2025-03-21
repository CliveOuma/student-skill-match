import { useEffect, useRef } from "react";
import { Trash2 } from "lucide-react";

interface MessagesListProps {
  messages: { fromSelf: boolean; message: string; timestamp: string }[];
  onDeleteMessage: (index: number) => void;
}

export default function MessagesList({ messages, onDeleteMessage }: MessagesListProps) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col p-4 space-y-2 overflow-auto h-96 bg-gray-100 rounded-lg shadow-inner">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`p-3 max-w-xs rounded-lg flex flex-col ${
            msg.fromSelf ? "bg-blue-500 text-white self-end" : "bg-gray-300 text-black self-start"
          }`}
        >
          <span>{msg.message}</span>
          <div className="text-xs text-gray-200 mt-1 flex justify-between">
            <span>{msg.timestamp}</span>
            {msg.fromSelf && (
              <button onClick={() => onDeleteMessage(index)} className="ml-2 text-red-400">
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
