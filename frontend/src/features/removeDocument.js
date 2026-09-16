import axios from 'axios';

const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8000";

export const removeDocument = async (conversationId) => {
  try {
    const { data } = await axios.delete(
      `${serverUrl}/api/agent/document/${conversationId}`,
      {
        withCredentials: true,
      },
    );
    return data;
  } catch (error) {
    console.error("Failed to remove document:", error);
    return null;
  }
};

export default removeDocument;

