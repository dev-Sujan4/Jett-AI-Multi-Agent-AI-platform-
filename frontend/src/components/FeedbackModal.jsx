import { useState } from "react";
import axios from "axios";
import { Star, X, } from "lucide-react";

function FeedbackModal({ isOpen, onClose }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !feedback.trim()) return;

    try {
      setIsSubmitting(true);
      const serverUrl =
        import.meta.env.VITE_SERVER_URL || "http://localhost:8000";
      await axios.post(
        `${serverUrl}/api/chat/feedback`,
        {
          rating: rating > 0 ? rating : undefined,
          email: email.trim(),
          feedback: feedback.trim(),
        },
        { withCredentials: true },
      );
      setIsSubmitted(true);
    } catch (err) {
      console.error("Feedback submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setRating(0);
    setHoverRating(0);
    setEmail("");
    setFeedback("");
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div
        className={`w-full ${
          isSubmitted ? "max-w-[430px]" : "max-w-[320px]"
        } bg-[#13151c] border border-white/10 rounded-2xl p-5 flex flex-col gap-3.5 shadow-2xl relative transition-all duration-200`}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-3.5 right-3.5 flex items-center justify-center w-6 h-6 rounded-md text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X size={14} />
        </button>

        {isSubmitted ? (
          <div className="flex flex-col items-center text-center py-3 gap-2.5">

            <div className="space-y-5 px-2">
              <p className="text-sm font-semibold text-slate-100">
                Liked the demo?
              </p>

              <p className="text-sm text-slate-300 leading-relaxed">
                I’m actively looking for opportunities across{" "}
                <span className="text-white font-medium">
                  Full-Stack, Agentic AI systems, and DevOps / Backend
                  engineering
                </span>
                .
              </p>

              <p className="text-sm text-slate-400 leading-relaxed">
                If you think I could be a good fit for the company,{" "}I’d love
                to connect.{" "}
                Please leave an email.
              </p>
            </div>

            <div className="flex flex-col space-y-5 items-center justify-center gap-2 mt-1.5">
              <a
                href="mailto:mail.sujansingh@gmail.com?subject=Opportunity%20to%20Connect"
                className="text-slate-200 font-medium hover:underline"
              >
                mail.sujansingh@gmail.com
              </a>

              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-1.5">
              <span className="text-sm">💬</span>
              <h2 className="text-sm font-semibold text-slate-100">
                Liked the demo? You'll love the full product.
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
              {/* 1-5 Star Rating */}
              <div className="flex items-center justify-center gap-1 py-0.5">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = (hoverRating || rating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 rounded transition-transform hover:scale-110 cursor-pointer"
                      aria-label={`${star} star`}
                    >
                      <Star
                        size={18}
                        className={`transition-colors ${
                          isFilled
                            ? "text-amber-400 fill-amber-400"
                            : "text-slate-600 hover:text-slate-500"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Email Input */}
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-xs outline-none focus:border-indigo-500/50 transition-all"
              />

              {/* Feedback Textarea */}
              <textarea
                rows={2}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your thoughts or ideas..."
                className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-xs outline-none focus:border-indigo-500/50 transition-all resize-none leading-relaxed"
              />

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!email.trim() || !feedback.trim() || isSubmitting}
                className="w-full py-2 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-indigo-500/20 transition-all cursor-pointer mt-0.5 active:scale-[0.99]"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default FeedbackModal;