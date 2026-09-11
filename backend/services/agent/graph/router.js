import { getModel } from "../config/llmModels.js";

export const router = async (state) => {

  if(state.agent && state.agent!=="auto"){
      return {
    ...state,
    agent : state.agent
  };
};




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

  const response = await llm.invoke(prompt);
// console.log(response)
  return {
    ...state,
    agent : response.content.trim().toLowerCase()
  };
};