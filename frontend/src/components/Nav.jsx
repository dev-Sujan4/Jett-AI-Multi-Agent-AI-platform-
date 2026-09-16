import { MessageSquare } from "lucide-react";
import { useSelector } from "react-redux";

function Nav() {
  const { selectedConversation } = useSelector((state) => state.conversation);
  const { messages } = useSelector((state) => state.message);

return (
  <>
    {selectedConversation && (
      <div className="h-14 flex items-center gap-2 sm:gap-2.5 pl-13 lg:pl-5 pr-3 sm:pr-5 border-b border-white/[0.06] bg-[#0d0f14] min-w-0">
        
        <div className="flex items-center justify-center shrink-0 w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
          <MessageSquare size={13} className="text-indigo-400" />
        </div>

        <div className="text-[13px] sm:text-[14px] font-semibold text-slate-100 tracking-tight truncate min-w-0 max-w-[150px] xs:max-w-[200px] sm:max-w-xs md:max-w-md">
          {selectedConversation?.title || "New Chat"}
        </div>

        <div className="text-[10px] font-medium text-slate-500 sm:text-slate-600 bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap ml-auto sm:ml-0">
          {messages?.length} Messages
        </div>

      </div>
    )}
  </>
)
}

export default Nav;
