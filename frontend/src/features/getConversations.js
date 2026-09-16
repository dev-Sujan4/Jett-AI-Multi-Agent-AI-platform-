import axios from "axios";

const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8000";

export const getConversations = async () => {
  try {
    const { data } = await axios.get(
      `${serverUrl}/api/chat/get-conversations`,
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