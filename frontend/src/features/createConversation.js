import axios from "axios";

const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8000";

export const createConversation = async () => {
  try {
    const { data } = await axios.get(
      `${serverUrl}/api/chat/create-conversation`,
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