import { Server, Socket } from "socket.io";
import Message from "../models/message.model";

const setupSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("send-msg", async (data) => {
      const { from, to, message, timestamp } = data;

      try {
        // Save message to MongoDB
        const newMessage = await Message.create({
          message: { text: message },
          users: [from, to],
          sender: from,
          createdAt: timestamp,
        });

        // Emit to recipient
        socket.to(to).emit("msg-receive", {
          message,
          timestamp,
        });
      } catch (error) {
        console.error("Error saving message:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

export default setupSocket;
