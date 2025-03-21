import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from 'dotenv';
import { Server } from "socket.io";
import http from "http";
import authRoutes from "./routes/authRoutes";
import profileRoutes from "./routes/profileRoutes";
import teamRoutes from "./routes/teamRoutes";
import messageRoutes from "./routes/messageRoutes";

const app = express();

// Load common environment variables
dotenv.config();

// Load environment-specific variables
const env = process.env.NODE_ENV || 'development';
dotenv.config({ path: `.env.${env}` });

//Middleware
app.use(cors({ credentials: true, origin: process.env.FRONTEND_URL,}));
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(morgan("dev"));

//Routes
app.use("/api/auth", authRoutes);
app.use("/api", profileRoutes);
app.use("/api", teamRoutes);
app.use("/api/messages", messageRoutes);

//Create HTTP Server
const server = http.createServer(app);

//Setup Socket.IO
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true,
    },
});

//Store online users
const onlineUsers = new Map<string, string>();

io.on("connection", (socket) => {
    console.log("🟢 A user connected:", socket.id);

    // Add user to online users
    socket.on("add-user", (userId: string) => {
        onlineUsers.set(userId, socket.id);
    });

    // Handle message sending
    socket.on("send-msg", (data: { to: string; message: string }) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            io.to(sendUserSocket).emit("msg-receive", data.message);
        }
    });

    // Handle user disconnect
    socket.on("disconnect", () => {
        console.log(" A user disconnected:", socket.id);
        onlineUsers.forEach((value, key) => {
            if (value === socket.id) {
                onlineUsers.delete(key);
            }
        });
    });
});


export default app;
