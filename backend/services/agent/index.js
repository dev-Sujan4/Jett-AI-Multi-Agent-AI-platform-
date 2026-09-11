import "dotenv/config";
import express from "express";
// import dotenv from "dotenv";
import connectDB from "./config/db.js";
import router from "./routes/agent.route.js";


// dotenv.config();
console.log("APP GROQ:", !!process.env.GROQ_API_KEY);
console.log("APP REDIS:", !!process.env.REDIS_URL);

const port = process.env.PORT || 8003;

const app = express();
app.use (express.json())
app.use("/",router)


app.get("/", (req, res) => {
  res.send({ message: "Hello from agent" });
});

app.listen(port, () => {
  console.log(`agent started on port ${port}`);
  connectDB()
});
