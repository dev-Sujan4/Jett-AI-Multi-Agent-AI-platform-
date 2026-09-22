import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import chatRouter from "./routes/chat.routes.js";

dotenv.config();

const port = process.env.PORT || 8001;

const app = express();
app.use(express.json());
app.use(cookieParser());

// Root mounts preserve the existing endpoint paths for both services
app.use("/", authRouter);
app.use("/", chatRouter);



app.get("/", (req, res) => {
  res.send({ message: "Hello from auth and chat service" });
});

app.listen(port, () => {
  console.log(`auth and chat service started on port ${port}`);
  connectDB().catch((err) => {
    console.error("Failed to connect to database on startup:", err);
  });
});

export default app;
