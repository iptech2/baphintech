
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import codeSnippetRoutes from "./routes/codeSnippetRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import adminUserRoutes from "./routes/adminUserRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import consultationRoutes from "./routes/consultationRoutes.js";
import websiteContentRoutes from "./routes/websiteContentRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Render proxy configuration
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// Connect to MongoDB
connectDB();

// Allowed frontend origins
const allowedOrigins = (
  process.env.CLIENT_URL || "http://localhost:5173"
)
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      const normalizedOrigin = origin.replace(/\/$/, "");

      if (allowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Security
app.use(helmet());
app.use(morgan("combined"));

// Request body limits
app.use(express.json({ limit: "5mb" }));
app.use(
  express.urlencoded({
    extended: false,
    limit: "5mb",
  })
);

app.use(cookieParser());

// General API rate limit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

// Login rate limit
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many failed login attempts. Please try again later.",
  },
});

// Apply general API rate limit
app.use("/api", apiLimiter);

// Apply stricter limit to login only
app.use("/api/auth/login", authLimiter);
app.use("/api/auth", authRoutes);

// Other API routes
app.use("/api/projects", projectRoutes);
app.use("/api/code-library", codeSnippetRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/consultations", consultationRoutes);
app.use("/api/content", websiteContentRoutes);
app.use("/api/settings", settingsRoutes);

// Root route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Baphin Tech API is running",
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Baphin Tech backend is healthy",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
  });
});

// Centralized error handler
app.use((error, req, res, next) => {
  console.error("Server error:", error.message);

  if (res.headersSent) {
    return next(error);
  }

  if (error.message === "Not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "Origin not allowed",
    });
  }

  return res.status(500).json({
    success: false,
    message: "An unexpected server error occurred",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Baphin Tech server running on port ${PORT}`);
});
