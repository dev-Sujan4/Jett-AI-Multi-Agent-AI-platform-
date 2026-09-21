import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../utils/firebase";
import { FcGoogle } from "react-icons/fc";
import { X } from "lucide-react";

import Axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUserdata, setShowLoginPrompt } from "../redux/userSlice";
import ChatArea from "../components/ChatArea";
import SideBar from "../components/SideBar";

function Home() {
  const dispatch = useDispatch();

  const { showLoginPrompt } = useSelector((state) => state.user);

  const handleLogin = async (token) => {
    try {
      const serverUrl =
        import.meta.env.VITE_SERVER_URL || "http://localhost:8000";
      const { data } = await Axios.post(
        `${serverUrl}/api/auth/login`,
        { token },
        { withCredentials: true },
      );
      dispatch(setUserdata(data));
      dispatch(setShowLoginPrompt(false));
    } catch (error) {
      console.log(error);
    }
  };

  const googleLogin = async () => {
    const data = await signInWithPopup(auth, googleProvider);
    const token = await data.user.getIdToken();
    console.log(token);
    await handleLogin(token);
    console.log(data);
  };
  return (
    <div className="h-screen w-full flex bg-[#0d0f14] text-white overflow-hidden">
      <SideBar />
      <ChatArea />

      {showLoginPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-[340px] sm:max-w-md md:max-w-lg bg-[#13151c] border border-white/8 rounded-2xl p-5 sm:p-7 flex flex-col gap-5">
            <button
              onClick={() => dispatch(setShowLoginPrompt(false))}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
            <div className="flex flex-col gap-1 pr-6 ">
              <h2 className="text-[17px] font-semibold text-slate-100 tracking-tight">
                Welcome to JettAI
              </h2>
              <p className="text-[14px] mt-2 text-slate-500">
                Sign in to continue <br />{" "}
              </p>
            </div>
            <button
              onClick={googleLogin}
              className="group w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-medium text-black bg-white border border-white hover:bg-gray-50 hover:border-gray-200 hover:shadow-[0_8px_25px_rgba(0,0,0,0.18)] hover:-translate-y-0.5 active:bg-gray-100 active:translate-y-0 transition-all duration-200 cursor-pointer"
            >
              <FcGoogle
                size={18}
                className="transition-transform duration-200 group-hover:scale-110"
              />
              <span>Continue with Google</span>
            </button>
            <p className="text-[14px] mt-2 text-slate-500">
              This application uses Google authentication through Firebase. <br />
              Sign-in is required to access the AI services, which use the
              application's configured API credentials.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
