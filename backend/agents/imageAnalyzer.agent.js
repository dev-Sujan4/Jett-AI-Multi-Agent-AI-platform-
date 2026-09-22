import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { getModel } from "../config/llmModels.js";
import fs from "fs";

const isImageFile = (file) => {
  if (!file) return false;
  return (
    file.mimetype?.startsWith("image/") ||
    /\.(png|jpe?g|webp|gif|svg|bmp)$/i.test(file.originalname || "")
  );
};

export const imageAnalyzer = async (state) => {
  const tempFilePath = state.file?.path;

  try {
    // If router already determined that no image was provided, return the message immediately
    if (state.aiResponse && state.aiResponse.includes("Please upload an image first")) {
      return state;
    }

    if (!isImageFile(state.file) || !tempFilePath || !fs.existsSync(tempFilePath)) {
      return {
        ...state,
        aiResponse: "Please upload an image first.",
      };
    }

    const llm = await getModel("imageAnalyzer");

    const imageBuffer = fs.readFileSync(tempFilePath);
    const base64Image = imageBuffer.toString("base64");
    const mimeType = state.file.mimetype || "image/jpeg";

    const messages = [
      new SystemMessage(
        `You are JettAI Vision Analyst — a precise multimodal image analysis engine.

CORE RULES:
- Analyze ONLY the uploaded image. NEVER use outside knowledge, assumptions, or web searches.
- Answer the user's question using ONLY information clearly visible or determinable from the image.
- If text exists in the image, extract it accurately and completely.
- If charts, tables, or data exist, interpret and explain them based solely on what is visible.

WHEN THE USER ASKS A VAGUE QUESTION (e.g. "What is this?" or "Analyze this image"):
Provide a structured response:
- **Subject**: What is the main subject of the image?
- **Context**: What is the setting, background, or environment?
- **Details**: Notable elements, text, colors, objects, or patterns.

FALLBACK:
- If the requested information genuinely cannot be determined from the image, respond EXACTLY:
"I couldn't determine this from the uploaded image."

FORMATTING:
- Use clean Markdown with **bold** for key findings.
- Keep responses focused and concise.`
      ),
      new HumanMessage({
        content: [
          {
            type: "text",
            text: state.prompt || "Analyze this image.",
          },
          {
            type: "image_url",
            image_url: {
              url: `data:${mimeType};base64,${base64Image}`,
            },
          },
        ],
      }),
    ];

    const response = await llm.invoke(messages);

    return {
      ...state,
      aiResponse: response.content,
    };
  } catch (error) {
    console.error("[Image Analyzer Error]:", error);
    return {
      ...state,
      aiResponse: "An error occurred while analyzing the image. Please try again.",
    };
  } finally {
    // Safe temp file cleanup so missing files never throw
    try {
      if (tempFilePath && fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
    } catch (cleanupErr) {
      console.warn("[Image Analyzer Cleanup]: Could not remove temp file:", cleanupErr.message);
    }
  }
};