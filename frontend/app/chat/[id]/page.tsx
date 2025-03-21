"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import io from "socket.io-client";
import MessageInput from "@/components/ui/MessageInput";
import MessagesList from "@/components/ui/MessagesList";
import LoadingSpinner from "@/components/ui/loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const socket = io(`${process.env.NEXT_PUBLIC_API_URL}`, { transports: ["websocket"] });

export default function ChatPage() {
  const { id } = useParams();
  const [messages, setMessages] = useState<{ fromSelf: boolean; message: string; timestamp: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const savedMessages = localStorage.getItem(`chat-${id}`);
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        if (Array.isArray(parsedMessages)) {
          setMessages(parsedMessages);
        }
      } catch (error) {
        console.error("Error parsing stored messages:", error);
      }
    }

    const fetchMessages = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/messages/getMsg`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ from: "user_id", to: id }),
        });

        if (!res.ok) throw new Error("Failed to fetch messages");

        const data = await res.json();
        setMessages(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching messages:", error);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [id]);

  useEffect(() => {
    socket.emit("add-user", id);

    const handleMessageReceive = (data: { message: string; timestamp: string }) => {
      setMessages((prev) => {
        const updatedMessages = [...prev, { fromSelf: false, ...data }];
        localStorage.setItem(`chat-${id}`, JSON.stringify(updatedMessages));
        return updatedMessages;
      });
    };

    socket.on("msg-receive", handleMessageReceive);
    socket.on("typing", (userId) => {
      if (userId === id) {
        setTyping(true);
        setTimeout(() => setTyping(false), 2000);
      }
    });

    return () => {
      socket.off("msg-receive", handleMessageReceive);
      socket.off("typing");
    };
  }, [id]);

  const sendMessage = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const messageData = { to: id, message, timestamp };

    socket.emit("send-msg", messageData);
    setMessages((prev) => {
      const updatedMessages = [...prev, { fromSelf: true, message, timestamp }];
      localStorage.setItem(`chat-${id}`, JSON.stringify(updatedMessages));
      return updatedMessages;
    });
  };

  const deleteMessage = (index: number) => {
    setMessages((prev) => {
      const updatedMessages = prev.filter((_, i) => i !== index);
      localStorage.setItem(`chat-${id}`, JSON.stringify(updatedMessages));
      return updatedMessages;
    });
  };

  return (
    <div className="flex justify-center items-center p-2 sm:p-4 h-screen bg-gray-100">
      <Card className="w-full max-w-[95%] sm:max-w-md md:max-w-2xl lg:max-w-3xl shadow-lg h-[85vh] sm:h-[80vh] flex flex-col overflow-hidden">
        <CardHeader className="bg-gray-900 text-white rounded-t-lg p-3 sm:p-4">
          <CardTitle className="text-center text-lg sm:text-2xl">Chat</CardTitle>
        </CardHeader>

        <CardContent className="p-3 sm:p-4 flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              {Array.isArray(messages) && messages.length > 0 ? (
                <MessagesList messages={messages} onDeleteMessage={deleteMessage} />
              ) : (
                <p className="text-gray-500 text-center">No messages yet, start a chat</p>
              )}
              {typing && <div className="p-2 text-gray-500 text-center">User is typing...</div>}
            </>
          )}
        </CardContent>

        <div className="p-3 sm:p-4 bg-gray-200 border-t rounded-b-lg">
          <MessageInput onSendMessage={sendMessage} />
        </div>
      </Card>
    </div>
  );
}
