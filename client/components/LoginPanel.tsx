import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import GoogleSignInButton from "./GoogleSignInButton";

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
  const { loginWithGoogle } = useAuth();
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setError("");
    setIsGoogleLoading(true);
    try {
      await loginWithGoogle();
      setIsSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Google sign-in failed. Please try again."
      );
    } finally {
      setIsGoogleLoading(false);
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
      <h2 className="text-2xl font-black text-green-primary mb-3">Welcome Back</h2>
      <p className="text-text-dark/70 text-sm mb-6">
        Sign in with your Google account to continue your adventure
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <GoogleSignInButton
        onClick={handleGoogleSignIn}
        isLoading={isGoogleLoading}
        disabled={isGoogleLoading}
      />

      <div className="mt-6 text-center">
        <p className="text-text-dark/70 text-sm">
          New to our platform?{" "}
          <button
            onClick={onSignupClick}
            className="text-blue-accent hover:text-blue-accent-dark font-semibold transition-colors"
          >
            Get started
          </button>
        </p>
      </div>
    </div>
  );
}
