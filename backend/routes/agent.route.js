import express from "express";
import { agent, removeDocumentController } from "../controllers/agent.controller.js";
import multer from "../config/multer.js";

const router = express.Router();

router.post(
  "/chat",
  (req, res, next) => {
    multer.single("file")(req, res, (err) => {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            message: "File exceeds 2MB limit. Please upload a smaller document.",
          });
        }
        return res.status(400).json({ message: err.message || "Upload error" });
      }
      next();
    });
  },
  agent
);
router.delete("/document/:conversationId", removeDocumentController);

export default router;