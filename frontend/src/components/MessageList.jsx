import { useSelector } from "react-redux";
import MessageBubble from "./MessageBubble";

function MessageList() {
  const { selectedConversation } = useSelector((state) => state.conversation);

  const { messages } = useSelector((state) => state.message);

  return (
    <div className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 space-y-3 sm:space-y-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {messages.length === 0 || !selectedConversation ? (
        <div className="h-full flex flex-col items-center justify-center text-center px-4 py-8">
          {/* Intro */}
          <div className="flex flex-col items-center gap-3 max-w-xl">
            <span className="text-[11px] uppercase tracking-[0.25em] text-indigo-400/80 font-medium">
              Multi-Agent AI
            </span>

            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-100">
              Your AI workspace,
              <span className="block text-slate-400">built to explore.</span>
            </h1>
          </div>

          
          <div className="max-w-xl mt-7 text-center">
            

            <div className="flex items-center justify-center gap-2 mt-3 text-[12px]">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />

              <span className="text-slate-500 text-[17px] ">Free plan access</span>

              <span className="text-slate-400">·</span>

              <span className="text-indigo-400 text-[16px] font-medium">
                4 prompts per session
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 mt-7">
              <p className="text-[12px] sm:text-[14px] text-slate-500">
                Have feedback about your experience? {" "}
              <br /> </p> Please leave a review in the feedback section.

            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2 sm:gap-1.5 pt-4 sm:pt-6">
          {messages?.map((msg, i) => (
            <div key={msg?._id || i}>
              <MessageBubble
                role={msg?.role}
                content={msg?.content}
                images={msg?.images || []}
                image={msg?.images || []}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MessageList;
