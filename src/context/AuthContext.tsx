"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface User {
    id: string;
    name: string;
    email: string;
    photoURL?: string;
    createdAt?: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    loginWithFacebook: () => Promise<void>;
    loginWithInstagram: () => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    requestPasswordReset: (email: string) => Promise<void>;
    requestVerification: (email: string) => Promise<void>;
    resendVerification: (email: string) => Promise<{ cooldownMs?: number }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const convertSupabaseUser = (supabaseUser: SupabaseUser): User => ({
        id: supabaseUser.id,
        name:
            supabaseUser.user_metadata?.full_name ||
            supabaseUser.user_metadata?.name ||
            supabaseUser.email?.split("@")[0] ||
            "User",
        email: supabaseUser.email || "",
        photoURL:
            supabaseUser.user_metadata?.avatar_url ||
            supabaseUser.user_metadata?.picture,
        createdAt: supabaseUser.created_at,
    });

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) setUser(convertSupabaseUser(session.user));
            setIsLoading(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) setUser(convertSupabaseUser(session.user));
            else setUser(null);
            setIsLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            if (data.user) {
                setUser(convertSupabaseUser(data.user));
                const intendedBooking = sessionStorage.getItem("intendedBooking");
                if (intendedBooking) {
                    sessionStorage.removeItem("intendedBooking");
                    setTimeout(() => (window.location.href = intendedBooking), 100);
                }
            }
        } catch (error: any) {
            throw new Error(error.message || "Login failed");
        } finally {
            setIsLoading(false);
        }
    };

    const loginWithGoogle = async () => {
        setIsLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: { redirectTo: window.location.origin },
            });
            if (error) throw error;
            const intendedBooking = sessionStorage.getItem("intendedBooking");
            if (intendedBooking) {
                localStorage.setItem("intendedBookingOAuth", intendedBooking);
                sessionStorage.removeItem("intendedBooking");
            }
        } catch (error: any) {
            setIsLoading(false);
            throw new Error(error.message || "Google authentication failed");
        }
    };

    const loginWithFacebook = async () => {
        setIsLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: "facebook",
                options: { redirectTo: window.location.origin },
            });
            if (error) throw error;
        } catch (error: any) {
            setIsLoading(false);
            throw new Error(error.message || "Facebook authentication failed");
        }
    };

    const loginWithInstagram = async () => {
        setIsLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: "instagram" as any,
                options: { redirectTo: window.location.origin },
            });
            if (error) throw error;
        } catch (error: any) {
            setIsLoading(false);
            throw new Error(error.message || "Instagram authentication failed");
        }
    };

    const signup = async (name: string, email: string, password: string) => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { full_name: name },
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            });
            if (error) throw error;
            if (data.user) setUser(convertSupabaseUser(data.user));
        } catch (error: any) {
            throw new Error(error.message || "Signup failed");
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await supabase.auth.signOut();
            setUser(null);
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const requestPasswordReset = async (email: string) => {
        setIsLoading(true);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });
            if (error) throw error;
        } catch (error: any) {
            throw new Error(error.message || "Password reset request failed");
        } finally {
            setIsLoading(false);
        }
    };

    const requestVerification = async (email: string) => {
        setIsLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    shouldCreateUser: true,
                    emailRedirectTo: `${window.location.origin}/verify-email`,
                },
            });
            if (error) {
                if (error.message.includes("Email rate limit exceeded"))
                    throw new Error("Too many requests. Please wait a minute before trying again.");
                if (error.message.includes("SMTP") || error.message.includes("email"))
                    throw new Error("Email service not configured. Please contact support.");
                throw error;
            }
        } catch (error: any) {
            throw new Error(error.message || "Failed to send verification email");
        } finally {
            setIsLoading(false);
        }
    };

    const resendVerification = async (email: string): Promise<{ cooldownMs?: number }> => {
        setIsLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    shouldCreateUser: true,
                    emailRedirectTo: `${window.location.origin}/verify-email`,
                },
            });
            if (error) {
                if (error.message.includes("Email rate limit exceeded"))
                    return { cooldownMs: 60000 };
                throw error;
            }
            return { cooldownMs: undefined };
        } catch (error: any) {
            throw new Error(error.message || "Failed to resend verification email");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user, isLoading, login, loginWithGoogle, loginWithFacebook,
                loginWithInstagram, signup, logout, requestPasswordReset,
                requestVerification, resendVerification,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
}
