import axios from "axios";

async function getMessages(id) {
  try {
    const { data } = await axios.get(
      `http://localhost:8000/api/chat/get-messages/${id}`,
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