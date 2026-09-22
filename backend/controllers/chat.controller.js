import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import Feedback from "../models/feedback.model.js";

export const createConversation = async (req, res) => {
  try {
    const userId = req.user?.userId;
    console.log(userId);
    const conversation = await Conversation.create({
      userId: userId,
    });

    return res.status(200).json(conversation);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `create conversation error ${error}` });
  }
};

export const updateConversation = async (req, res) => {
  try {
    const { id, title } = req.body;
    const conversation = await Conversation.findByIdAndUpdate(id,{
        title
    })

    return res.status(200).json(conversation);
  } catch (error) {
    return res.status(500).json({ message: `update conversation error ${error}` });
  }
};

export const getConversations = async (req, res) => {
  try {
    const userId = req.user?.userId;
    console.log(userId);
    const conversation = await Conversation.find({
      userId: userId,
    }).sort({ updatedAt: -1 });

    return res.status(200).json(conversation);
  } catch (error) {
    return res.status(500).json({ message: `get conversation error ${error}` });
  }
};

export const saveMessage = async (req, res) => {
  try {
    const { conversationId, role, content,images } = req.body;
    const message = await Message.create({
      conversationId,
      content,
      role,
      images
    });

    return res.status(200).json(message);
  } catch (error) {
    return res.status(500).json({ message: `create message error ${error}` });
  }
};

export const getMessages = async (req, res) => {
  try {
    const message = await Message.find({
      conversationId:req.params.conversationId,
    })

    return res.status(200).json(message);
  } catch (error) {
    return res.status(500).json({ message: `get message error ${error}` });
  }
};

export const createFeedback = async (req, res) => {
  try {
    const { rating, email, feedback } = req.body;

    const newFeedback = await Feedback.create({
      rating,
      email,
      feedback,
    });


   return res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      feedback: newFeedback,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
