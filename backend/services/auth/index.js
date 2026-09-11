import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import router from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
dotenv.config();

const port = process.env.PORT || 8001;

const app = express();
app.use (express.json())
app.use(cookieParser());

app.use("/",router)

app.get("/", (req, res) => {
  res.send({ message: "Hello from auth" });
});

app.listen(port, () => {
  console.log(`auth started on port ${port}`);
  connectDB()
});
