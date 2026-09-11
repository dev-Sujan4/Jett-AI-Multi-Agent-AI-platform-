import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import router from "./routes/chat.routes.js";

dotenv.config();

const port = process.env.PORT || 8002;

const app = express();
app.use (express.json())
app.use("/",router)



app.get("/", (req, res) => {
  res.send({ message: "Hello from chat" });
});

app.listen(port, () => {
  console.log(`chat started on port ${port}`);
  connectDB()
});
