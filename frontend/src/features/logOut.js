import axios from "axios";

const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8000";

async function logOut() {
  try {
    const { data } = await axios.get(
      `${serverUrl}/api/auth/logout`,
      {
        withCredentials: true,
      },
    );
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}

export default logOut;
