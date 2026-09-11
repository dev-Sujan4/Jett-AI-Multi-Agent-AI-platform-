import axios from "axios";

const getCurrentUser = async () => {
  try {
    const { data } = await axios.get(
      "http://localhost:8000/api/me",
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