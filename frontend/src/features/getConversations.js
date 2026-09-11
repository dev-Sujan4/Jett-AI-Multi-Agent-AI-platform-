import axios from "axios";

export const getConversations = async () => {
  try {
    const { data } = await axios.get(
      "http://localhost:8000/api/chat/get-conversations",
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