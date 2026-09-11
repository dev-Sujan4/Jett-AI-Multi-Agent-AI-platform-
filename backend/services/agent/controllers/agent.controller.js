import axios from "axios";
import { graph } from "../agents/graph.js";
import { addMessage } from "../config/memory.js";

export const agent = async (req, res) => {
  try {
    const { prompt, conversationId, agent } = req.body;

    const result = await graph.invoke({ prompt, conversationId, agent });

    // const response = result.aiResponse.replace(/^\n+/, "");

    await addMessage(conversationId, "user", prompt);

    await addMessage(conversationId, "assistant", result.aiResponse);

    await axios.post(`${process.env.CHAT_SERVICE}/save-message`, {
      conversationId,
      role: "user",
      content: prompt,
    });

    await axios.post(`${process.env.CHAT_SERVICE}/save-message`, {
      conversationId,
      role: "assistant",
      content: result?.aiResponse,
      images:result.images
    });

    return res.status(200).json({ response: result?.aiResponse,
      images:result.images
     });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: `agent error ${error}` });
  }
};
