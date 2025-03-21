"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const profileRoutes_1 = __importDefault(require("./routes/profileRoutes"));
const teamRoutes_1 = __importDefault(require("./routes/teamRoutes"));
const messageRoutes_1 = __importDefault(require("./routes/messageRoutes"));
const app = (0, express_1.default)();
// Load common environment variables
dotenv_1.default.config();
// Load environment-specific variables
const env = process.env.NODE_ENV || 'development';
dotenv_1.default.config({ path: `.env.${env}` });
//Middleware
app.use((0, cors_1.default)({ credentials: true, origin: process.env.FRONTEND_URL, }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("dev"));
//Routes
app.use("/api/auth", authRoutes_1.default);
app.use("/api", profileRoutes_1.default);
app.use("/api", teamRoutes_1.default);
app.use("/api/messages", messageRoutes_1.default);
//Create HTTP Server
const server = http_1.default.createServer(app);
//Setup Socket.IO
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true,
    },
});
//Store online users
const onlineUsers = new Map();
io.on("connection", (socket) => {
    console.log("🟢 A user connected:", socket.id);
    // Add user to online users
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
    });
    // Handle message sending
    socket.on("send-msg", (data) => {
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
exports.default = app;
