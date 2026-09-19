import axios from "axios";

const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8000";

async function logOut() {
  try {
    localStorage.removeItem("demo_user_name");
    localStorage.removeItem("demo_user_id");
    document.cookie = "demo_name=; path=/; max-age=0";
    document.cookie = "demo_user=; path=/; max-age=0";
    delete axios.defaults.headers.common["x-demo-name"];
    delete axios.defaults.headers.common["x-demo-user"];

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
