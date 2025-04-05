import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { Server } from "socket.io";
import http from "http";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import profileRoutes from "./routes/profileRoutes";
import teamRoutes from "./routes/teamRoutes";

// Load environment variables
dotenv.config();
const env = process.env.NODE_ENV || "development";
dotenv.config({ path: `.env.${env}` });

// Connect to database
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(cors({ credentials: true, origin: process.env.FRONTEND_URL }));
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", profileRoutes);
app.use("/api", teamRoutes);

// Create HTTP server and attach Express
const server = http.createServer(app);


// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(` Server running on port ${PORT}`));

export { server};
