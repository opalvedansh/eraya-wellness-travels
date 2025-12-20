import { useState } from "react";

export default function SubscriptionBar() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setEmail("");
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  return (
    <div className="w-full max-w-md">
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col sm:flex-row gap-2.5 sm:gap-3 px-2 sm:px-0"
      >
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 px-5 sm:px-6 py-4 rounded-xl text-sm sm:text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-lg transition-all duration-300 touch-target-min backdrop-blur-sm bg-white/95"
          required
        />
        <button
          type="submit"
          className="px-6 sm:px-10 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-sm sm:text-base rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 whitespace-nowrap touch-target-min hover:scale-105 hover:-translate-y-1"
        >
          {isSubmitted ? "✓ Subscribed!" : "Subscribe"}
        </button>
      </form>

      {/* Trust Indicators */}
      <div className="mt-3 flex items-center justify-center gap-4 text-white/70 text-xs sm:text-sm px-2 sm:px-0">
        <span className="flex items-center gap-1">
          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Instant deals
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          No spam
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Unsubscribe anytime
        </span>
      </div>
    </div>
  );
}
