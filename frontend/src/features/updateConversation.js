import axios from "axios";

export const updateConversation = async (payload) => {
  try {
    const { data } = await axios.post(
      "http://localhost:8000/api/chat/update-conversation" ,payload,
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