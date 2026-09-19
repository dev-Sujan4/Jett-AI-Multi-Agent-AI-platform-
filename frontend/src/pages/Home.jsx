import { useSelector } from "react-redux";
import ChatArea from "../components/ChatArea";
import SideBar from "../components/SideBar";
import DemoUserModal from "../components/DemoUserModal";

function Home() {
  const { userData } = useSelector((state) => state.user);

  return (
    <div className="h-screen w-full flex bg-[#0d0f14] text-white overflow-hidden">
      <SideBar />
      <ChatArea />
      {!userData && <DemoUserModal />}
    </div>
  );
}

export default Home;

