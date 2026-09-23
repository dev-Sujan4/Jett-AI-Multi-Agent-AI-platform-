import axios from "axios";
import { graph } from "../agents/graph.js";
import { addMessage } from "../config/memory.js";
import Document from "../models/document.model.js";
import Message from "../models/message.model.js";
import { deleteVectorCollection } from "../config/vectorDb.js";

export const agent = async (req, res) => {
  try {
    const { prompt, conversationId, agent } = req.body;
    const userId = req.user?.userId;
    const file = req.file;

    let activeDoc = null;
    if (conversationId) {
      try {
        activeDoc = await Document.findOne({
          conversationId,
          status: "active",
        }).sort({ createdAt: -1 });
      } catch (docErr) {
        console.warn("Could not query active document:", docErr.message);
      }
    }

    const result = await graph.invoke({
      prompt,
      conversationId,
      agent,
      file,
      documentId: activeDoc?.documentId,
      collectionName: activeDoc?.collectionName,
    });

    const aiResponse = result?.aiResponse || "No response generated";

    // Best-effort message persistence
    try {
      await addMessage(conversationId, "user", prompt);
      await addMessage(conversationId, "assistant", aiResponse);

      // Save user prompt
      await Message.create({
        conversationId,
        userId,
        role: "user",
        content: prompt,
      }).catch((err) => console.warn("Database save user msg failed:", err.message));

      // Save AI response
      await Message.create({
        conversationId,
        userId,
        role: "assistant",
        content: aiResponse,
        images: result?.images,
      }).catch((err) => console.warn("Database save assistant msg failed:", err.message));
    } catch (saveErr) {
      console.warn("Message memory save warning:", saveErr.message);
    }

    return res.status(200).json({
      response: aiResponse,
      images: result?.images,
      documentId: result?.documentId,
      collectionName: result?.collectionName,
    });
  } catch (error) {
    console.error("Agent Controller Error:", error);
    return res.status(500).json({ message: "An unexpected error occurred while processing your request." });
  }
};

export const removeDocumentController = async (req, res) => {
  try {
    const { conversationId } = req.params;

    if (!conversationId) {
      return res.status(400).json({ message: "conversationId is required" });
    }

    const activeDocs = await Document.find({
      conversationId,
      status: "active",
    });

    for (const doc of activeDocs) {
      if (doc.collectionName) {
        await deleteVectorCollection(doc.collectionName);
      }
      doc.status = "inactive";
      await doc.save();
    }

    return res.status(200).json({
      success: true,
      message: "Document deactivated and vector collection deleted successfully",
    });
  } catch (error) {
    console.error("Error removing document:", error);
    return res.status(500).json({ message: "Failed to remove document" });
  }
};
