import axios from "axios";

const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8000";

const getCurrentUser = async () => {
  try {
    const { data } = await axios.get(
      `${serverUrl}/api/me`,
      {
        withCredentials: true,
      },
    );

    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default getCurrentUser;