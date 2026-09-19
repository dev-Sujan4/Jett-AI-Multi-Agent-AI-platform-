import { getModel } from "../config/llmModels.js";
import Document from "../models/document.model.js";

const isPdfFile = (file) => {
  if (!file) return false;
  return (
    file.mimetype === "application/pdf" ||
    /\.pdf$/i.test(file.originalname || "")
  );
};

const isImageFile = (file) => {
  if (!file) return false;
  return (
    file.mimetype?.startsWith("image/") ||
    /\.(png|jpe?g|webp|gif|svg|bmp)$/i.test(file.originalname || "")
  );
};

export const router = async (state) => {
  const selectedAgent = state.agent ? state.agent.toLowerCase().trim() : "auto";

  // Rule A: PDF agent selected
  if (selectedAgent === "pdf" || selectedAgent === "pdfrag") {
    const hasUploadedPdf = isPdfFile(state.file);
    let hasActivePdfDoc = false;

    if (state.conversationId) {
      try {
        const activeDoc = await Document.findOne({
          conversationId: state.conversationId,
          status: "active",
        });
        if (activeDoc) {
          hasActivePdfDoc = true;
        }
      } catch (err) {
        console.error("Error looking up active document in router:", err.message);
      }
    }

    if (hasUploadedPdf || hasActivePdfDoc) {
      return {
        ...state,
        agent: "pdfRag",
      };
    } else {
      return {
        ...state,
        agent: "pdfRag",
        aiResponse: "Please upload a PDF first.",
      };
    }
  }

  // Rule B: Image/Vision agent selected
  if (
    selectedAgent === "vision" ||
    selectedAgent === "image" ||
    selectedAgent === "imageanalyzer"
  ) {
    const hasUploadedImage = isImageFile(state.file);

    if (hasUploadedImage) {
      return {
        ...state,
        agent: "imageAnalyzer",
      };
    } else {
      return {
        ...state,
        agent: "imageAnalyzer",
        aiResponse: "Please upload an image first.",
      };
    }
  }

  // Rule C: Auto selected
  if (selectedAgent === "auto") {
    if (isPdfFile(state.file)) {
      return {
        ...state,
        agent: "pdfRag",
      };
    }

    if (isImageFile(state.file)) {
      return {
        ...state,
        agent: "imageAnalyzer",
      };
    }

    // Fast path: Simple greetings, gratitude, acknowledgments bypass LLM router
    const trimmedPrompt = state.prompt?.trim() || "";
    const isSmallTalk = /^(hi|hello|hey|greetings|hola|good\s(morning|afternoon|evening)|howdy|sup|thanks|thank\syou|ok|okay|bye|goodbye)\b/i.test(trimmedPrompt);
    if (isSmallTalk) {
      return {
        ...state,
        agent: "chat",
      };
    }

    // No file: use LLM router
    const llm = await getModel("router");
    const prompt = `
You are an agent router.

Classify ONLY the latest user request.
Ignore all previous messages and conversation history.

Choose exactly one:

chat = general conversation, explanations, learning
search = current, latest, live, recent, or web information
coding = programming, code, debugging, software development
pdf = PDF/document tasks
ppt = PowerPoint/slides/presentations
vision = image understanding, analysis, generation, or editing

Return ONLY the agent name.
No explanation, punctuation, or extra text.

Latest user request:
${state.prompt}
`;

    try {
      const response = await llm.invoke(prompt);
      const routedAgent = response.content.trim().toLowerCase();
      return {
        ...state,
        agent: routedAgent,
      };
    } catch (err) {
      console.error("LLM router error:", err.message);
      return {
        ...state,
        agent: "chat",
      };
    }
  }

  // Rule D: Explicit normal agents (chat, search, coding, ppt, etc.)
  return {
    ...state,
    agent: selectedAgent,
  };
};