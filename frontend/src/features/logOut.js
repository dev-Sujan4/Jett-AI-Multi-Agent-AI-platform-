import axios from "axios";

async function logOut() {
  try {
    const { data } = await axios.get(
      "http://localhost:8000/api/auth/logout",
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
