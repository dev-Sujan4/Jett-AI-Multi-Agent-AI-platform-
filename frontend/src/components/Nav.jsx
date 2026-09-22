import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { useSelector } from "react-redux";
import FeedbackModal from "./FeedbackModal";

function Nav() {
  const { selectedConversation } = useSelector((state) => state.conversation);
  const { messages } = useSelector((state) => state.message);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  return (
    <>
      <div className="h-14 flex items-center justify-between gap-2 sm:gap-2.5 pl-13 lg:pl-5 pr-3 sm:pr-5 border-b border-white/[0.06] bg-[#0d0f14] min-w-0 shrink-0">
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          {selectedConversation ? (
            <>
              <div className="flex items-center justify-center shrink-0 w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                <MessageSquare size={13} className="text-indigo-400" />
              </div>

              <div className="text-[13px] sm:text-[14px] font-semibold text-slate-100 tracking-tight truncate min-w-0 max-w-[150px] xs:max-w-[200px] sm:max-w-xs md:max-w-md">
                {selectedConversation?.title || "New Chat"}
              </div>

              <div className="text-[10px] font-medium text-slate-500 sm:text-slate-600 bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap hidden xs:inline-block">
                {messages?.length || 0} Messages
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500/15 to-violet-500/15 border border-indigo-400/15 shadow-[0_0_18px_rgba(99,102,241,0.1)]">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.9)]" />
              </div>

              <div className="text-[14px] sm:text-[15px] font-semibold tracking-tight text-slate-200">
                Jett<span className="text-indigo-400">AI</span>
              </div>
            </div>
          )}
        </div>

        {/* Top-right "💬 Feedback" trigger */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            type="button"
            onClick={() => setIsFeedbackOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-500 border border-indigo-300/30 shadow-md shadow-indigo-500/20 hover:from-indigo-400 hover:to-violet-400 hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-200 cursor-pointer shrink-0 active:scale-95"
            aria-label="Give feedback"
          >
            <span className="text-[15px]">💬</span>
            <span>Feedback</span>
          </button>
        </div>
      </div>

      {/* Centered Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />
    </>
  );
}

export default Nav;
