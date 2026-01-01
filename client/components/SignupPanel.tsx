import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import GoogleSignInButton from "./GoogleSignInButton";
import FacebookSignInButton from "./FacebookSignInButton";
import InstagramSignInButton from "./InstagramSignInButton";

interface SignupPanelProps {
  onLoginClick: () => void;
  onClose: () => void;
}

export default function SignupPanel({
  onLoginClick,
  onClose,
}: SignupPanelProps) {
  const { requestVerification, loginWithGoogle, loginWithFacebook, loginWithInstagram, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isFacebookLoading, setIsFacebookLoading] = useState(false);
  const [isInstagramLoading, setIsInstagramLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const isValid =
    formData.name.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.password.trim() !== "" &&
    formData.confirmPassword.trim() !== "" &&
    formData.password === formData.confirmPassword &&
    formData.password.length >= 6;

  const isAnyOAuthLoading = isGoogleLoading || isFacebookLoading || isInstagramLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      // Send magic link to user's email
      await requestVerification(formData.email);
      setEmailSent(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to send verification email. Please try again.",
      );
    }
  };

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

  const handleFacebookSignIn = async () => {
    setError("");
    setIsFacebookLoading(true);
    try {
      await loginWithFacebook();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Facebook sign-in failed. Please try again."
      );
    } finally {
      setIsFacebookLoading(false);
    }
  };

  const handleInstagramSignIn = async () => {
    setError("");
    setIsInstagramLoading(true);
    try {
      await loginWithInstagram();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Instagram sign-in failed. Please try again."
      );
    } finally {
      setIsInstagramLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="bg-card rounded-lg border border-border p-8 text-center">
        <CheckCircle2 className="h-16 w-16 text-green-primary mx-auto mb-4" />
        <h3 className="text-xl font-bold text-text-dark mb-2">
          Check Your Email!
        </h3>
        <p className="text-text-dark/70 text-sm mb-4">
          We've sent a verification link to <strong>{formData.email}</strong>
        </p>
        <p className="text-text-dark/60 text-xs">
          Click the link in the email to complete your signup and log in.
        </p>
        <button
          onClick={onClose}
          className="mt-6 text-blue-accent hover:text-blue-accent-dark font-semibold text-sm"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border p-8 shadow-md">
      <h2 className="text-2xl font-black text-green-primary mb-6">
        Create Account
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-muted rounded-lg flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-text-dark/60 flex-shrink-0 mt-0.5" />
          <p className="text-text-dark/70 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-semibold text-text-dark mb-2"
          >
            Full Name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-text-dark placeholder-text-dark/50 focus:outline-none focus:ring-2 focus:ring-green-primary"
            disabled={isLoading}
          />
        </div>

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
            name="email"
            value={formData.email}
            onChange={handleChange}
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
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="At least 6 characters"
            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-text-dark placeholder-text-dark/50 focus:outline-none focus:ring-2 focus:ring-green-primary"
            disabled={isLoading}
          />
          {formData.password && formData.password.length < 6 && (
            <p className="text-text-dark/60 text-xs mt-1">
              Password must be at least 6 characters
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-semibold text-text-dark mb-2"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-text-dark placeholder-text-dark/50 focus:outline-none focus:ring-2 focus:ring-green-primary"
            disabled={isLoading}
          />
          {formData.confirmPassword &&
            formData.password !== formData.confirmPassword && (
              <p className="text-text-dark/60 text-xs mt-1">
                Passwords do not match
              </p>
            )}
        </div>

        <button
          type="submit"
          disabled={!isValid || isLoading || isAnyOAuthLoading}
          className="w-full bg-green-primary hover:bg-green-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending verification email...
            </>
          ) : (
            "Create Account"
          )}
        </button>

        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-border"></div>
          <span className="text-text-dark/50 text-sm font-medium">or</span>
          <div className="flex-1 h-px bg-border"></div>
        </div>

        <GoogleSignInButton
          onClick={handleGoogleSignIn}
          isLoading={isGoogleLoading}
          disabled={isLoading || isFacebookLoading || isInstagramLoading}
        />

        <FacebookSignInButton
          onClick={handleFacebookSignIn}
          isLoading={isFacebookLoading}
          disabled={isLoading || isGoogleLoading || isInstagramLoading}
        />

        <InstagramSignInButton
          onClick={handleInstagramSignIn}
          isLoading={isInstagramLoading}
          disabled={isLoading || isGoogleLoading || isFacebookLoading}
        />
      </form>

      <p className="mt-6 text-center text-text-dark/70 text-sm">
        Already have an account?{" "}
        <button
          onClick={onLoginClick}
          className="text-blue-accent hover:text-blue-accent-dark font-semibold transition-colors"
        >
          Login
        </button>
      </p>
    </div>
  );
}
