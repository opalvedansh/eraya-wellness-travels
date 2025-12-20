import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Loader2, AlertCircle } from "lucide-react";

interface LoginPanelProps {
  onSignupClick: () => void;
  onForgotPasswordClick: () => void;
  onClose: () => void;
}

export default function LoginPanel({
  onSignupClick,
  onForgotPasswordClick,
  onClose,
}: LoginPanelProps) {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isValid = email.trim() !== "" && password.trim() !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      setIsSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-card rounded-lg border border-border p-8 text-center">
        <div className="w-12 h-12 bg-green-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="w-6 h-6 border-2 border-green-primary border-r-transparent rounded-full animate-spin"></div>
        </div>
        <h3 className="text-xl font-bold text-text-dark mb-2">Welcome Back!</h3>
        <p className="text-text-dark/70 text-sm">
          Redirecting to your account...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border p-8 shadow-md">
      <h2 className="text-2xl font-black text-green-primary mb-6">Login</h2>

      {error && (
        <div className="mb-4 p-3 bg-muted rounded-lg flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-text-dark/60 flex-shrink-0 mt-0.5" />
          <p className="text-text-dark/70 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-text-dark mb-2"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-text-dark placeholder-text-dark/50 focus:outline-none focus:ring-2 focus:ring-green-primary"
            disabled={isLoading}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-semibold text-text-dark mb-2"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-text-dark placeholder-text-dark/50 focus:outline-none focus:ring-2 focus:ring-green-primary"
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            id="remember"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded border-border text-green-primary focus:ring-green-primary"
            disabled={isLoading}
          />
          <label
            htmlFor="remember"
            className="text-sm text-text-dark/70 cursor-pointer"
          >
            Remember me
          </label>
        </div>

        <button
          type="submit"
          disabled={!isValid || isLoading}
          className="w-full bg-green-primary hover:bg-green-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>
      </form>

      <div className="mt-6 space-y-3 text-center">
        <button
          onClick={onForgotPasswordClick}
          className="text-blue-accent hover:text-blue-accent-dark text-sm font-semibold transition-colors bg-none border-none cursor-pointer p-0"
        >
          Forgot password?
        </button>
        <p className="text-text-dark/70 text-sm">
          Don't have an account?{" "}
          <button
            onClick={onSignupClick}
            className="text-blue-accent hover:text-blue-accent-dark font-semibold transition-colors"
          >
            Create one
          </button>
        </p>
      </div>
    </div>
  );
}
