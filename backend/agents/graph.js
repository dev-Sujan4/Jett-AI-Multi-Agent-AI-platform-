import { StateGraph } from "@langchain/langgraph";
import { agentState } from "../graph/state.js";
import { router } from "../graph/router.js";
import { searchAgent } from "./search.agent.js";
import { codingAgent } from "./coding.agent.js";
import { pptAgent } from "./ppt.agent.js";
import { chatAgent } from "./chat.agent.js";
import { visionAgent } from "./vision.js";
import { pdfRag } from "./pdfRag.agent.js";
import { imageAnalyzer } from "./imageAnalyzer.agent.js";

const workflow = new StateGraph(agentState);

workflow.addNode("router", router);
workflow.addNode("chat", chatAgent);
workflow.addNode("search", searchAgent);
workflow.addNode("coding", codingAgent);
workflow.addNode("ppt", pptAgent);
workflow.addNode("vision", visionAgent);
workflow.addNode("pdfRag", pdfRag); 
workflow.addNode("imageAnalyzer", imageAnalyzer); 

workflow.addEdge("__start__", "router");
workflow.addConditionalEdges("router", (state) => {
    console.log("========== GRAPH ROUTING ==========");
    console.log("SELECTED AGENT:", state.agent);
  switch (state.agent) {
    case "chat":
      return "chat";
    case "search":    
      return "search";
    case "coding":
      return "coding";
    case "ppt":
      return "ppt";
    case "vision":
      return "vision"
    case "pdfRag":
      return "pdfRag"
    case "imageAnalyzer":
      return "imageAnalyzer"
    default :
      return "chat"
  }
},{
    chat:"chat",
    search:"search",
    coding:"coding",
    ppt:"ppt",
    vision:"vision",
    pdfRag:"pdfRag",
    imageAnalyzer:"imageAnalyzer",
});

workflow.addEdge("search","chat")
workflow.addEdge("chat","__end__")
workflow.addEdge("coding","__end__")
workflow.addEdge("ppt","__end__")
workflow.addEdge("vision","__end__")
workflow.addEdge("pdfRag","__end__")
workflow.addEdge("imageAnalyzer","__end__")

export const graph = workflow.compile()