import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import connectDB from "./config/db.js";
import protect from "./middleware/auth.middleware.js";
import dailyLimit from "./middleware/dailyLimit.middleware.js";

import authRouter from "./routes/auth.routes.js";
import chatRouter from "./routes/chat.routes.js";
import agentRouter from "./routes/agent.route.js";
import { getCurrentUser } from "./controllers/user.controller.js";
import { createFeedback } from "./controllers/chat.controller.js";

const port = process.env.PORT || 8000;
const app = express();

app.use(morgan("dev"));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Public Routes
app.use("/api/auth", authRouter);
app.post("/api/chat/feedback", createFeedback);

// Protected Routes
app.use("/api/chat", protect, chatRouter);
app.use("/api/agent", protect, agentRouter);
app.get("/api/me", protect, getCurrentUser);

// Health check
app.get("/", (req, res) => {
  res.send({ message: "JettAI Single Backend Live" });
});

app.listen(port, () => {
  console.log(`Backend server started on port ${port}`);
  connectDB().catch((err) => {
    console.error("Failed to connect to database on startup:", err);
  });
});

