import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import GoogleSignInButton from "./GoogleSignInButton";

interface SignupPanelProps {
  onLoginClick: () => void;
  onClose: () => void;
}

export default function SignupPanel({
  onLoginClick,
  onClose,
}: SignupPanelProps) {
  const { requestOTP, verifyOTP, resendOTP, loginWithGoogle, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showOTPStep, setShowOTPStep] = useState(false);
  const [otp, setOTP] = useState(["", "", "", "", "", ""]);
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

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
      await requestOTP(formData.email);
      setShowOTPStep(true);
      setOTP(["", "", "", "", "", ""]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to request OTP. Please try again.",
      );
    }
  };

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


  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(0, 1);
    }
    if (!/^[0-9]*$/.test(value)) {
      return;
    }

    const newOTP = [...otp];
    newOTP[index] = value;
    setOTP(newOTP);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) {
        (nextInput as HTMLInputElement).focus();
      }
    }
  };

  const handleOTPKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) {
        (prevInput as HTMLInputElement).focus();
      }
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      setError("Please enter a 6-digit OTP.");
      return;
    }

    setIsVerifyingOTP(true);
    try {
      await verifyOTP(formData.email, otpValue);
      setIsSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "OTP verification failed. Please try again.",
      );
    } finally {
      setIsVerifyingOTP(false);
    }
  };

  const handleResendOTP = async () => {
    setError("");
    try {
      const result = await resendOTP(formData.email);

      if (result.cooldownMs) {
        setResendCooldown(Math.ceil(result.cooldownMs / 1000));
        const interval = setInterval(() => {
          setResendCooldown((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setOTP(["", "", "", "", "", ""]);
        const firstInput = document.getElementById("otp-0");
        if (firstInput) {
          (firstInput as HTMLInputElement).focus();
        }
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to resend OTP. Try again.",
      );
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-card rounded-lg border border-border p-8 text-center">
        <CheckCircle2 className="h-16 w-16 text-green-primary mx-auto mb-4" />
        <h3 className="text-xl font-bold text-text-dark mb-2">
          Account Created!
        </h3>
        <p className="text-text-dark/70 text-sm">
          Welcome to Eraya Wellness Travels. Logging you in...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border p-8 shadow-md">
      <h2 className="text-2xl font-black text-green-primary mb-6">
        {showOTPStep ? "Verify Your Email" : "Create Account"}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-muted rounded-lg flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-text-dark/60 flex-shrink-0 mt-0.5" />
          <p className="text-text-dark/70 text-sm">{error}</p>
        </div>
      )}

      {!showOTPStep ? (
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
            disabled={!isValid || isLoading || isGoogleLoading}
            className="w-full bg-green-primary hover:bg-green-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating Account...
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
            disabled={isLoading}
          />
        </form>
      ) : (
        <form onSubmit={handleVerifyOTP} className="space-y-6">
          <div>
            <p className="text-text-dark/70 text-sm mb-4">
              We've sent a verification code to your email
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-dark mb-4">
              Enter OTP
            </label>
            <div className="flex gap-3 justify-center mb-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOTPChange(index, e.target.value)}
                  onKeyDown={(e) => handleOTPKeyDown(index, e)}
                  className="w-12 h-12 text-center text-lg font-semibold border border-border rounded-lg bg-background text-text-dark focus:outline-none focus:ring-2 focus:ring-green-primary transition-all"
                  disabled={isVerifyingOTP}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={otp.join("").length !== 6 || isVerifyingOTP}
            className="w-full bg-green-primary hover:bg-green-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isVerifyingOTP ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Verifying OTP...
              </>
            ) : (
              "Verify OTP"
            )}
          </button>

          <div className="text-center pt-2">
            <p className="text-text-dark/70 text-sm">
              Didn't receive the code?{" "}
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={resendCooldown > 0 || isVerifyingOTP}
                className={`font-semibold transition-colors ${resendCooldown > 0 || isVerifyingOTP
                  ? "text-text-dark/50 cursor-not-allowed"
                  : "text-blue-accent hover:text-blue-accent-dark"
                  }`}
              >
                {resendCooldown > 0
                  ? `Resend in ${resendCooldown}s`
                  : "Resend OTP"}
              </button>
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setShowOTPStep(false);
              setOTP(["", "", "", "", "", ""]);
              setError("");
            }}
            className="w-full text-text-dark/70 hover:text-text-dark font-semibold py-2 px-4 transition-colors text-sm"
          >
            Back to Form
          </button>
        </form>
      )}

      {!showOTPStep && (
        <p className="mt-6 text-center text-text-dark/70 text-sm">
          Already have an account?{" "}
          <button
            onClick={onLoginClick}
            className="text-blue-accent hover:text-blue-accent-dark font-semibold transition-colors"
          >
            Login
          </button>
        </p>
      )}
    </div>
  );
}
