import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { getModel } from "../config/llmModels.js";
import { getMemory } from "../config/memory.js";

export const chatAgent = async (state) => {

try {
  const agentType = state.searchResults ? "search" : "chat";
  const llm = await getModel(agentType);

  const history = (await getMemory(state.conversationId)) || [];

  const searchContext = state.searchResults? `
   Web Search Results:
  
  ${JSON.stringify(state.searchResults)}
  Answer the user using only the above search results.
  `
    : '';

  const systemPrompt = `You are JettAI — a sharp, knowledgeable, and articulate AI assistant.


${searchContext}

Response Rules:
- For greetings, short questions, or simple factual queries — respond in plain conversational text. No markdown overhead.
- For technical, educational, multi-step, or detailed topics — use clean, well-structured Markdown.
- When you have search/reference data, weave the facts naturally into your answer. State information authoritatively. NEVER say "Based on the search results" or "According to my sources" — just answer directly.
- Be concise. Avoid repeating the user's question back to them. Get to the answer fast.

Markdown Formatting :
- Use ## for sections (not # — reserve that for the user's topic).
- Always leave a blank line after headings.
- Use **bold** for key terms and emphasis.
- Use bullet points for lists, numbered lists for sequential steps.
- Use fenced code blocks with language tags (e.g. \`\`\`javascript).
- Keep paragraphs to 2-3 sentences maximum.
- Never produce a wall of unbroken text.`;

  const messages = [new SystemMessage(systemPrompt)];

const MAX_HISTORY_TOKENS = 800;

const estimateTokens = (text = "") => {
  return Math.ceil(text.length / 4);
};

let historyTokens = 0;

const recentHistory = Array.isArray(history)
  ? [...history].reverse()
  : [];

for (const msg of recentHistory) {
  const msgTokens = estimateTokens(msg.content || "");

  if (historyTokens + msgTokens > MAX_HISTORY_TOKENS) {
    break;
  }

  if (msg.role === "user") {
    messages.splice(1, 0,
      new HumanMessage({
        content: msg.content,
      })
    );
  }

  if (msg.role === "assistant") {
    messages.splice(1, 0,
      new AIMessage({
        content: msg.content,
      })
    );
  }

  historyTokens += msgTokens;
}


  messages.push(
    new HumanMessage({
      content: state.prompt,
    }),
  );
  console.log(messages);

  const response = await llm.invoke(messages);

  return {
    ...state,
    aiResponse: response.content,
  };
} catch (error) {
  return {
    ...state,
    aiResponse: "Failed to generate response"
  };
}

};
