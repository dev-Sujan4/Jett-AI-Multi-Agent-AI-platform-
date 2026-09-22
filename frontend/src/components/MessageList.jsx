import { useSelector } from "react-redux";
import MessageBubble from "./MessageBubble";

function MessageList() {
  const { selectedConversation } = useSelector((state) => state.conversation);
  const { messages, isLoading } = useSelector((state) => state.message);

  return (
    <div className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 space-y-3 sm:space-y-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {messages.length === 0 || !selectedConversation ? (
        <div className="h-full flex items-center justify-center px-4 sm:px-6 py-8 relative overflow-hidden">
  
  {/* Background glow */}
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[420px] h-[220px] bg-indigo-500/[0.08] blur-[100px] rounded-full" />
    <div className="absolute bottom-0 left-1/4 w-[260px] h-[160px] bg-violet-500/[0.05] blur-[90px] rounded-full" />
    <div className="absolute top-0 right-1/4 w-[220px] h-[140px] bg-cyan-500/[0.04] blur-[80px] rounded-full" />
  </div>

  <div className="relative w-full max-w-4xl text-center">

    {/* Product Identity */}
    <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/[0.08] bg-white/[0.025] backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.18)] mb-7">
      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.9)]" />

      <span className="text-[10px] sm:text-xs font-medium tracking-[0.2em] uppercase text-slate-400">
        Multi-Modal · Multi-Agent · Agentic AI
      </span>

      <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_10px_rgba(167,139,250,0.9)]" />
    </div>


    {/* Main Heading */}
    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.08] text-slate-100">
      Explore AI agents
      <span className="block mt-2 bg-gradient-to-r from-indigo-300 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
        built for different tasks.
      </span>
    </h1>


    {/* Description */}
    <p className="max-w-2xl mx-auto mt-6 text-sm sm:text-base text-slate-400 leading-relaxed">
      Choose an agent from the input area below and describe what you want to accomplish.
      Each agent is designed to handle a different type of task.
    </p>


    {/* Example Prompts */}
    <div className="mt-8">

      <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-slate-600 mb-3">
        Try something like
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2">

        <div className="px-3.5 py-2.5 rounded-xl border border-white/[0.07] bg-white/[0.025] hover:bg-white/[0.05] hover:border-indigo-400/20 transition-all duration-200 text-xs text-slate-400 shadow-sm">
          Explain recursion in Java
        </div>

        <div className="px-3.5 py-2.5 rounded-xl border border-white/[0.07] bg-white/[0.025] hover:bg-white/[0.05] hover:border-indigo-400/20 transition-all duration-200 text-xs text-slate-400 shadow-sm">
          Search the latest AI news
        </div>

        <div className="px-3.5 py-2.5 rounded-xl border border-white/[0.07] bg-white/[0.025] hover:bg-white/[0.05] hover:border-indigo-400/20 transition-all duration-200 text-xs text-slate-400 shadow-sm">
          Analyze this PDF
        </div>

        <div className="px-3.5 py-2.5 rounded-xl border border-white/[0.07] bg-white/[0.025] hover:bg-white/[0.05] hover:border-indigo-400/20 transition-all duration-200 text-xs text-slate-400 shadow-sm">
          Review this image
        </div>

      </div>
    </div>


    {/* Usage Limit */}
    <div className="mt-8 inline-flex items-center gap-3 px-4 py-2.5 rounded-xl border border-indigo-400/10 bg-indigo-500/[0.04]">

      <div className="flex items-center gap-2 text-xs text-slate-500">
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.7)]" />
        Free demo access
      </div>

      <span className="w-px h-3 bg-slate-700" />

      <span className="text-xs font-medium text-indigo-300">
        4 prompts per session
      </span>

    </div>


    {/* Feedback Reminder */}
    <div className="mt-6 flex items-center justify-center gap-2 text-s">

      <span className="text-slate-600">
        Enjoying the experience?
      </span>

      <span className="text-slate-500">
        Please leave a review in the feedback section.
      </span>

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
          {isLoading && (
            <div className="flex items-center gap-3 text-slate-400 p-3.5 rounded-2xl bg-[#13151a] border border-white/[0.05] w-fit ml-2 shadow-sm">
              <div className="flex gap-1.5 items-center">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms', animationDuration: '1s' }}></span>
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms', animationDuration: '1s' }}></span>
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms', animationDuration: '1s' }}></span>
              </div>
              <span className="text-[13px] font-medium tracking-wide">Thinking...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MessageList;
