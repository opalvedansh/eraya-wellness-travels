import { useState } from "react";
import { X } from "lucide-react";
import LoginPanel from "./LoginPanel";
import SignupPanel from "./SignupPanel";
import ForgotPasswordPanel from "./ForgotPasswordPanel";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "signup" | "forgot-password";
}

export default function AuthModal({
  isOpen,
  onClose,
  initialMode = "login",
}: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup" | "forgot-password">(
    initialMode,
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-background rounded-lg">
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-border bg-background">
          <h1 className="text-lg font-black text-green-primary">
            {mode === "login"
              ? "Login"
              : mode === "signup"
                ? "Create Account"
                : "Reset Password"}
          </h1>
          <button
            onClick={onClose}
            className="text-text-dark/60 hover:text-text-dark transition-colors p-1"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {mode === "login" ? (
            <LoginPanel
              onSignupClick={() => setMode("signup")}
              onForgotPasswordClick={() => setMode("forgot-password")}
              onClose={onClose}
            />
          ) : mode === "signup" ? (
            <SignupPanel
              onLoginClick={() => setMode("login")}
              onClose={onClose}
            />
          ) : (
            <ForgotPasswordPanel
              onLoginClick={() => setMode("login")}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
}
