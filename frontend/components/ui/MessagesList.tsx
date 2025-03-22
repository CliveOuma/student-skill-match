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
    <div className="flex flex-col p-2 sm:p-3 space-y-2 overflow-y-auto max-h-[60vh] sm:max-h-[70vh] w-full bg-gray-100 rounded-lg shadow-inner">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`p-2 sm:p-3 rounded-lg flex flex-col w-fit max-w-[80%] break-words ${
            msg.fromSelf ? "bg-blue-500 text-white self-end" : "bg-gray-300 text-black self-start"
          }`}
        >
          <span className="text-sm sm:text-base">{msg.message}</span>
          <div className="text-xs text-gray-200 mt-1 flex justify-between items-center">
            <span>{msg.timestamp}</span>
            {msg.fromSelf && (
              <button onClick={() => onDeleteMessage(index)} className="ml-2 text-red-400">
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
