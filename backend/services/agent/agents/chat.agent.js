import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { getModel } from "../config/llmModels.js";
import { getMemory } from "../config/memory.js";

export const chatAgent = async (state) => {

try {
  const llm = await getModel("chat");

  const trimmedPrompt = state.prompt?.trim() || "";
  const isSmallTalk = /^(hi|hello|hey|greetings|hola|good\s(morning|afternoon|evening)|howdy|sup|thanks|thank\syou|ok|okay|bye|goodbye)\b/i.test(trimmedPrompt);

  const history = isSmallTalk ? [] : ((await getMemory(state.conversationId)) || []);

  const searchContext = state.searchResults?` 
  Web Search Results :
  
  ${JSON.stringify(state.searchResults)}

  answer the user using only the above search results. 
   `:''

  const systemPrompt = `
You are JettAI, an intelligent AI assistant.

${searchContext}

If searchContext exists 

- Use search results to answer 
- Do not mention internal tools
- Answer to the point no extra words  

Rules:

- For simple questions, greetings, and short queries, respond naturally in plain text.
- For technical, educational, coding, or detailed topics, use clean Markdown.

Formatting:

- Use # for titles and ## for sections.
- Leave a blank line after headings.
- Use bullet points for lists.
- Use numbered lists for steps.
- Use fenced code blocks with language tags for code.
- Keep paragraphs short and readable.
- Never write headings and content on the same line.
- Never generate large walls of text.
`;

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
  const tokenUsage = response.response_metadata?.tokenUsage || response.usage_metadata;
  if (tokenUsage) {
    console.log("📊 Token Usage:", tokenUsage);
  }

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
