import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";
import { getCurrentUser } from "./controllers/user.controller.js";
import { ProxyWithHeader } from "./utils/ProxyWithHeader.js";
import morgan from "morgan";
const port = process.env.PORT || 8000;

const DEMO_USER = {
  _id: "demo-user",
  userId: "demo-user",
  name: "Demo User",
  email: "demo@example.com",
};

const app = express();
app.use(morgan("dev"))
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "x-demo-name", "x-demo-user", "x-user-id"],
  }),
);

app.use(cookieParser())

// Populate req.user with custom demo user if provided, otherwise fixed demo user
app.use((req, res, next) => {
  const customName = req.cookies?.demo_name || req.headers["x-demo-name"];
  const customId = req.cookies?.demo_user || req.headers["x-demo-user"];

  if (customName || customId) {
    const safeName = (customName || "Demo User").trim();
    const slug = safeName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "user";
    const safeId = customId || `demo-${slug}`;

    req.user = {
      _id: safeId,
      userId: safeId,
      name: safeName,
      email: `${safeId}@demo.com`,
    };
  } else {
    req.user = DEMO_USER;
  }
  next();
});


app.get("/api/auth/logout", (req, res) => {
  res.status(200).json({ message: "logout successfully" });
});

app.use("/api/chat", ProxyWithHeader(process.env.CHAT_SERVICE));
app.use("/api/agent", ProxyWithHeader(process.env.AGENT_SERVICE));
app.get("/api/me", getCurrentUser)

app.get("/", (req, res) => {
  res.send({ message: "Hello from gateway" });
});

app.listen(port, () => {
  console.log(`gateway started on port ${port}`);
});
