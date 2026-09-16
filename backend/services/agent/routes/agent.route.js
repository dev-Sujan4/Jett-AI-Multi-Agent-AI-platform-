import express from "express";
import { agent, removeDocumentController } from "../controllers/agent.controller.js";
import multer from "../config/multer.js";

const router = express.Router();

router.post("/chat", multer.single("file"), agent);
router.delete("/document/:conversationId", removeDocumentController);

export default router;