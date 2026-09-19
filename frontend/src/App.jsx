import { useEffect } from "react";
import Home from "./pages/Home";
import { useDispatch } from "react-redux";
import { setUserdata } from "./redux/userSlice";
import axios from "axios";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const storedName = localStorage.getItem("demo_user_name");
    const storedId = localStorage.getItem("demo_user_id");

    if (storedName && storedId) {
      axios.defaults.headers.common["x-demo-name"] = storedName;
      axios.defaults.headers.common["x-demo-user"] = storedId;

      dispatch(
        setUserdata({
          _id: storedId,
          userId: storedId,
          name: storedName,
          email: `${storedId}@demo.com`,
        })
      );
    } else {
      dispatch(setUserdata(null));
    }
  }, []);
  return <Home />;
}

export default App;
