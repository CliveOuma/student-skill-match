"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import io from "socket.io-client";
import MessageInput from "@/components/ui/MessageInput";
import MessagesList from "@/components/ui/MessagesList";
import LoadingSpinner from "@/components/ui/loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const socket = io(`${process.env.NEXT_PUBLIC_API_URL}`, {
  transports: ["websocket", "polling"],
  withCredentials: true,
});

export default function ChatPage() {
  const { id } = useParams();
  const [messages, setMessages] = useState<{ fromSelf: boolean; message: string; timestamp: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [typing, setTyping] = useState(false);

  // Function to get the user ID from the token
  const getUserIdFromToken = (): string | null => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode JWT
      return decodedToken.userId;
    } catch (error) {
      console.error("Invalid token format:", error);
      return null;
    }
  };

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
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("User not logged in");
        setLoading(false);
        return;
      }

      const fromUserId = getUserIdFromToken();
      if (!fromUserId) {
        console.error("Invalid or missing user ID from token");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/messages/getMsg`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ from: fromUserId, to: id }),
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
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("User not logged in");
      return;
    }

    const fromUserId = getUserIdFromToken();
    if (!fromUserId) {
      console.error("Invalid or missing user ID from token");
      return;
    }

    const timestamp = new Date().toISOString();
    const messageData = { from: fromUserId, to: id, message, timestamp };

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
    <div className="flex justify-center items-center min-h-screen w-full">
      <Card className="w-full max-w-[90vw] sm:max-w-[80vw] md:max-w-xl lg:max-w-3xl shadow-lg h-[85vh] sm:h-[80vh] flex flex-col">
        <CardHeader className="bg-gray-900 text-white rounded-t-lg p-2 sm:p-3">
          <CardTitle className="text-center text-base sm:text-lg md:text-xl">Chat</CardTitle>
        </CardHeader>

        <CardContent className="p-2 sm:p-3 flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              {Array.isArray(messages) && messages.length > 0 ? (
                <MessagesList messages={messages} onDeleteMessage={deleteMessage} />
              ) : (
                <p className="text-gray-500 text-center text-sm sm:text-base">No messages yet, start a chat</p>
              )}
              {typing && <div className="p-1 text-gray-500 text-center text-sm">User is typing...</div>}
            </>
          )}
        </CardContent>

        <div className="p-2 sm:p-3 bg-gray-200 border-t rounded-b-lg">
          <MessageInput onSendMessage={sendMessage} />
        </div>
      </Card>
    </div>
  );
}
