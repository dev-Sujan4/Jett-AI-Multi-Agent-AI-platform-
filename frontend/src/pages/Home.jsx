    
    import { signInWithPopup } from "firebase/auth";
    import { auth, googleProvider } from "../../utils/firebase";
    import { FcGoogle } from "react-icons/fc";

    import Axios from "axios";
    import { useDispatch, useSelector } from "react-redux";
    import { setUserdata } from "../redux/userSlice";
  import ChatArea from "../components/ChatArea";
  import Artifact from "../components/Artifact";
  import SideBar from "../components/SideBar";

    function Home() {
      const dispatch= useDispatch()

    const {userData} = useSelector(state=>state.user)
    
      const handleLogin = async (token) => {
        try {
          const { data } = await Axios.post(
            "http://localhost:8000/api/auth/login",
            { token },
            { withCredentials: true },
          );
          dispatch(setUserdata(data))
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
          <Artifact />

          {!userData && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-85 bg-[#13151c] border border-white/8 rounded-2xl p-7 flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <h2 className="text-[17px] font-semibold text-slate-100 tracking-right">
                  Welcome to JettAI
                </h2>
                <p className="text-[13px] text-slate-500">
                  Please login to continue using the app.{" "}
                </p>
              </div>
    <button onClick={googleLogin} className="group w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-medium text-black bg-white border border-white hover:bg-gray-50 hover:border-gray-200 hover:shadow-[0_8px_25px_rgba(0,0,0,0.18)] hover:-translate-y-0.5 active:bg-gray-100 active:translate-y-0 transition-all duration-200 cursor-pointer">
      <FcGoogle
        size={18}
        className="transition-transform duration-200 group-hover:scale-110"
      />
      <span>Continue with Google</span>
    </button>
            </div>
          </div>}
          
        </div>
      );
    }

    export default Home;
