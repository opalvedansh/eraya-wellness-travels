import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Loader2, AlertCircle } from "lucide-react";

interface ForgotPasswordPanelProps {
  onLoginClick: () => void;
  onClose: () => void;
}

export default function ForgotPasswordPanel({
  onLoginClick,
  onClose,
}: ForgotPasswordPanelProps) {
  const { requestPasswordReset, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isValid =
    email.trim() !== "" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await requestPasswordReset(email);
      setIsSubmitted(true);
    } catch (err) {
      setError("Failed to send reset link. Please try again.");
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-card rounded-lg border border-border p-8 text-center">
        <div className="w-12 h-12 bg-green-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-6 h-6 text-green-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-text-dark mb-2">
          Check your email
        </h3>
        <p className="text-text-dark/70 text-sm mb-6">
          If an account exists for this email, a password reset link has been
          sent.
        </p>
        <button
          onClick={onLoginClick}
          className="w-full bg-green-primary hover:bg-green-primary/90 text-white font-bold py-3 px-4 rounded-lg transition-colors"
        >
          Return to login
        </button>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border p-8 shadow-md">
      <h2 className="text-2xl font-black text-green-primary mb-2">
        Reset your password
      </h2>
      <p className="text-text-dark/70 text-sm mb-6">
        Enter your registered email address and we'll send you a password reset
        link.
      </p>

      {error && (
        <div className="mb-4 p-3 bg-muted rounded-lg flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-text-dark/60 flex-shrink-0 mt-0.5" />
          <p className="text-text-dark/70 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="reset-email"
            className="block text-sm font-semibold text-text-dark mb-2"
          >
            Email Address
          </label>
          <input
            id="reset-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-text-dark placeholder-text-dark/50 focus:outline-none focus:ring-2 focus:ring-green-primary"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={!isValid || isLoading}
          className="w-full bg-green-primary hover:bg-green-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send reset link"
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={onLoginClick}
          className="text-blue-accent hover:text-blue-accent-dark text-sm font-semibold transition-colors"
        >
          Back to login
        </button>
      </div>
    </div>
  );
}
