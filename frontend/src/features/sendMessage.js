import axios  from 'axios'


const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8000";

async function sendMessage(payload) {
try {
    const { data } = await axios.post(
      `${serverUrl}/api/agent/chat`,
      payload,
      {
        withCredentials: true,
      },
    );
    return data
} catch (error) {
    console.log(error)

    if (error.response?.data?.message) {
      return {
        response: error.response.data.message
      }
    }

     return { response: "An unexpected error occurred. Please try again."}; 
}
}

export default sendMessage
