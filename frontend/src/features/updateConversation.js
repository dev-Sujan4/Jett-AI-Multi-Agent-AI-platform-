import axios from "axios";

const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8000";

export const updateConversation = async (payload) => {
  try {
    const { data } = await axios.post(
      `${serverUrl}/api/chat/update-conversation`,
      payload,
      {
        withCredentials: true,
      },
    );

    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
};