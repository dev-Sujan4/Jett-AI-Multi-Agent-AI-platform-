import express from "express";
import dotenv from "dotenv";
import proxy from "express-http-proxy";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";
import protect from "./middleware/auth.middleware.js";
import dailyLimit from "./middleware/dailyLimit.middleware.js";
import { getCurrentUser } from "./controllers/user.controller.js";
import { ProxyWithHeader } from "./utils/ProxyWithHeader.js";
import morgan from "morgan";
const port = process.env.PORT || 8000;

const app = express();
app.use(morgan("dev"))
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(cookieParser())
app.use("/api/auth", proxy(process.env.AUTH_SERVICE));
app.use("/api/chat",protect, ProxyWithHeader(process.env.CHAT_SERVICE));
app.use("/api/agent", protect, dailyLimit, ProxyWithHeader(process.env.AGENT_SERVICE));
app.get("/api/me",protect,getCurrentUser)

app.get("/", (req, res) => {
  res.send({ message: "Hello from gateway" });
});

app.listen(port, () => {
  console.log(`gateway started on port ${port}`);
});
