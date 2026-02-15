"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import GoogleSignInButton from "./GoogleSignInButton";

interface LoginPanelProps {
    onClose: () => void;
}

export default function LoginPanel({ onClose }: LoginPanelProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isSignup, setIsSignup] = useState(false);
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login, signup, requestVerification } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            if (isSignup) {
                await signup(name, email, password);
            } else {
                await login(email, password);
            }
            onClose();
        } catch (err: any) {
            setError(err.message || "Authentication failed");
        } finally {
            setLoading(false);
        }
    };

    const handleMagicLink = async () => {
        if (!email) { setError("Please enter your email"); return; }
        setError("");
        setLoading(true);
        try {
            await requestVerification(email);
            setError("Check your email for a login link!");
        } catch (err: any) {
            setError(err.message || "Failed to send magic link");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 space-y-4">
            <div className="text-center">
                <h2 className="text-xl font-bold text-text-dark">
                    {isSignup ? "Create Account" : "Welcome Back"}
                </h2>
                <p className="text-sm text-text-dark/60 mt-1">
                    {isSignup ? "Join Eraya Wellness Travels" : "Sign in to your account"}
                </p>
            </div>

            <GoogleSignInButton />

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-beige-dark/30" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-beige px-2 text-text-dark/50">Or continue with email</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
                {isSignup && (
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-beige-dark/30 bg-white text-text-dark placeholder:text-text-dark/40 focus:outline-none focus:ring-2 focus:ring-green-primary/30 text-sm"
                            required
                        />
                    </div>
                )}
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-dark/40" />
                    <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-beige-dark/30 bg-white text-text-dark placeholder:text-text-dark/40 focus:outline-none focus:ring-2 focus:ring-green-primary/30 text-sm"
                        required
                    />
                </div>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-dark/40" />
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-3 rounded-lg border border-beige-dark/30 bg-white text-text-dark placeholder:text-text-dark/40 focus:outline-none focus:ring-2 focus:ring-green-primary/30 text-sm"
                        required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dark/40">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                </div>

                {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-green-primary text-white rounded-lg font-semibold hover:bg-green-primary/90 transition-colors text-sm disabled:opacity-50"
                >
                    {loading ? "Please wait..." : isSignup ? "Create Account" : "Sign In"}
                </button>
            </form>

            <button
                onClick={handleMagicLink}
                className="w-full py-2.5 border border-green-primary/30 text-green-primary rounded-lg font-medium hover:bg-green-primary/5 transition-colors text-sm"
            >
                Send Magic Link
            </button>

            <p className="text-center text-sm text-text-dark/60">
                {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
                <button onClick={() => { setIsSignup(!isSignup); setError(""); }} className="text-green-primary font-semibold hover:underline">
                    {isSignup ? "Sign In" : "Sign Up"}
                </button>
            </p>
        </div>
    );
}
