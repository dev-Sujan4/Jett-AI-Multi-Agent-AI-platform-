import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserdata } from "../redux/userSlice";
import { Sparkles, ArrowRight } from "lucide-react";

function DemoUserModal() {
  const dispatch = useDispatch();
  const [nameInput, setNameInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = nameInput.trim();
    if (!trimmed) return;

    // Generate safe user ID e.g. "demo-sujan"
    const slug =
      trimmed
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "user";
    const userId = `demo-${slug}`;

    // Store in localStorage
    localStorage.setItem("demo_user_name", trimmed);
    localStorage.setItem("demo_user_id", userId);

    // Store in cookies for withCredentials backend requests
    document.cookie = `demo_name=${encodeURIComponent(
      trimmed
    )}; path=/; max-age=2592000; SameSite=Lax`;
    document.cookie = `demo_user=${encodeURIComponent(
      userId
    )}; path=/; max-age=2592000; SameSite=Lax`;

    // Configure axios default headers
    axios.defaults.headers.common["x-demo-name"] = trimmed;
    axios.defaults.headers.common["x-demo-user"] = userId;

    // Set Redux userData to unlock the UI
    dispatch(
      setUserdata({
        _id: userId,
        userId: userId,
        name: trimmed,
        email: `${userId}@demo.com`,
      })
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="w-full max-w-[360px] bg-[#13151c] border border-white/10 rounded-2xl p-6 sm:p-7 flex flex-col gap-5 shadow-2xl">
        <div className="flex flex-col gap-1.5 text-center items-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 mb-1">
            <Sparkles size={22} className="text-white" />
          </div>
          <h2 className="text-[19px] font-bold text-slate-100 tracking-tight">
            Welcome to JettAI Demo
          </h2>
          <p className="text-[13px] text-slate-400">
            Please enter your name to start exploring
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <input
            type="text"
            autoFocus
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Your name (e.g. Sujan)"
            className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-sm outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            maxLength={40}
          />
          <button
            type="submit"
            disabled={!nameInput.trim()}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
          >
            <span>Continue to JettAI</span>
            <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default DemoUserModal;

