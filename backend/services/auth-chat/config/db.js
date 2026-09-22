import mongoose from "mongoose";

let authConnection = null;
let chatConnection = null;

const connectDB = async () => {
  try {
    const mongoUri =
      process.env.MONGODB_URI ||
      "mongodb+srv://mailsujansingh_db_user:MJXI95WaWm9VPXBA@cluster0.dilvj8z.mongodb.net/chat";

    await mongoose.connect(mongoUri);
    console.log("db connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};

export const getAuthConnection = () => {
  if (authConnection) {
    return authConnection;
  }
  const uri = process.env.MONGODB_URI || "";
  if (uri.includes("/chat") && mongoose.connection.readyState !== 0) {
    return mongoose.connection.useDb("auth", { useCache: true });
  }
  return mongoose.connection;
};

export const getChatConnection = () => {
  if (chatConnection) {
    return chatConnection;
  }
  const uri = process.env.MONGODB_URI || "";
  if (uri.includes("/auth") && mongoose.connection.readyState !== 0) {
    return mongoose.connection.useDb("chat", { useCache: true });
  }
  return mongoose.connection;
};

export default connectDB;
