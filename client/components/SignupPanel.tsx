import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import GoogleSignInButton from "./GoogleSignInButton";

interface SignupPanelProps {
  onLoginClick: () => void;
  onClose: () => void;
}

export default function SignupPanel({
  onLoginClick,
  onClose,
}: SignupPanelProps) {
  const { loginWithGoogle } = useAuth();
  const [error, setError] = useState("");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setError("");
    setIsGoogleLoading(true);
    try {
      await loginWithGoogle();
      onClose();
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

  return (
    <div className="bg-card rounded-lg border border-border p-8 shadow-md">
      <h2 className="text-2xl font-black text-green-primary mb-3">
        Get Started
      </h2>
      <p className="text-text-dark/70 text-sm mb-6">
        Create your account with Google to start booking amazing adventures
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

      <p className="mt-6 text-center text-text-dark/70 text-sm">
        Already have an account?{" "}
        <button
          onClick={onLoginClick}
          className="text-blue-accent hover:text-blue-accent-dark font-semibold transition-colors"
        >
          Sign in
        </button>
      </p>
    </div>
  );
}
