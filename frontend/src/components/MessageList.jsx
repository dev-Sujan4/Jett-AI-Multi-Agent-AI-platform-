import React from "react";
import { useSelector } from "react-redux";
import MessageBubble from "./messageBubble";

function MessageList() {
  const { selectedConversation } = useSelector(
    (state) => state.conversation
  );

  const { messages } = useSelector((state) => state.message);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {messages.length === 0 || !selectedConversation ? (
        <div className="h-full flex flex-col items-center justify-center gap-5 text-center">
          <div className="flex flex-col gap-1">
            <h1 className="text-[20px] font-semibold text-slate-200 tracking-tight">
              JettAI
            </h1>

            <p className="text-[15px] font-semibold text-slate-400 tracking-tight">
              How can I help you?
            </p>

            <p className="text-[13px] text-slate-600 max-w-[260px] leading-relaxed">
              Ask me anything — code, ideas, explanations, or just a quick
              question.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mt-1">
            {[
              "Write a netflix clone",
              "Send me money",
              "Give me a treat",
            ].map((text, i) => (
              <button
                key={i}
                className="text-[12px] text-slate-400 bg-white/[0.04] border border-white/[0.07] px-3 py-1.5 rounded-lg hover:bg-white/[0.08] hover:text-slate-200 transition-colors duration-150 cursor-pointer"
              >
                {text}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          {messages?.map((msg, i) => (
            <div key={msg?._id || i}>
              <MessageBubble
                role={msg?.role}
                content={msg?.content}
                image={msg.images ||  []}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MessageList;