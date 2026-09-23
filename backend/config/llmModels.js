import { ChatGroq } from "@langchain/groq";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenRouter } from "@langchain/openrouter";

const groq = new ChatGroq({
  model: "openai/gpt-oss-120b",
  maxTokens: 2048,
});

const gemini = new ChatGoogleGenerativeAI({
  model: "gemini-3.5-flash-lite",
  maxOutputTokens: 2048,
});

const openrouter = new ChatOpenRouter({
  model: "openai/gpt-oss-120b",
  temperature: 0,
  maxTokens: 2048,
});

export const getModel = async (agent) => {
  switch (agent) {
    case "router":
      return groq;
    case "chat":
      return gemini;
    case "search":
      return groq;
    case "coding":
      return openrouter;
    case "imageAnalyzer":
    case "vision":
      return gemini;
    case "pdfRag":
      return openrouter;
    case "ppt":
      return groq;
      
    default:
      return groq;
  }
};
