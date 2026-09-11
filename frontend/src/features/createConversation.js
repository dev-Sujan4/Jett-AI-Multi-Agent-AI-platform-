import axios from "axios";

export const createConversation = async () => {
  try {
    const { data } = await axios.get(
      "http://localhost:8000/api/chat/create-conversation",
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