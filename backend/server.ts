import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import http from "http";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import profileRoutes from "./routes/profileRoutes";
import teamRoutes from "./routes/teamRoutes";

// Load environment variables
dotenv.config();
const env = process.env.NODE_ENV || "development";
dotenv.config({ path: `.env.${env}` });

// Validate critical environment variables
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.warn("⚠️  WARNING: Email configuration (EMAIL_USER, EMAIL_PASS) is missing. Email functionality will not work.");
}

if (!process.env.MONGO_URI) {
  console.error("❌ ERROR: MONGO_URI is required but not set.");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error("❌ ERROR: JWT_SECRET is required but not set.");
  process.exit(1);
}

// Connect to database
connectDB();

// Initialize Express app
const app = express();

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : [
      'http://localhost:3000', // Default for development
    ];

// Production origin
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

// Middleware
app.use(cors({
  credentials: true,
  origin: (origin, callback) => {
    // Allow requests with no origin only in development (for testing with Postman)
    if (!origin) {
      if (env === 'development') {
        return callback(null, true);
      }
      // In production, reject requests without origin for security
      return callback(new Error('CORS: Origin header is required'), false);
    }
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

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
