import axios from "axios";

const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8000";

async function getMessages(id) {
  try {
    const { data } = await axios.get(
      `${serverUrl}/api/chat/get-messages/${id}`,
      {
        withCredentials: true,
      },
    );

    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export default getMessages;