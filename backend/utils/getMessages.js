import Message from "../models/message.model.js";

export const getMessages = async (conversationId) => {
    try {
        const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });
        return messages;
    } catch (error) {
         console.log("GET MESSAGES ERROR:", error);
        return null;
    }
}