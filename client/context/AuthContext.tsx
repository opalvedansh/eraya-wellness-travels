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

  // Convert Supabase user to our User type
  const convertSupabaseUser = (supabaseUser: SupabaseUser): User => {
    return {
      id: supabaseUser.id,
      name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
      email: supabaseUser.email || '',
      photoURL: supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture,
      createdAt: supabaseUser.created_at,
    };
  };

  // Listen to auth state changes
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(convertSupabaseUser(session.user));
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(convertSupabaseUser(session.user));
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        setUser(convertSupabaseUser(data.user));

        // Check for intended booking and redirect
        const intendedBooking = sessionStorage.getItem('intendedBooking');
        if (intendedBooking) {
          sessionStorage.removeItem('intendedBooking');
          setTimeout(() => window.location.href = intendedBooking, 100);
        }
      }
    } catch (error: any) {
      console.error("Login error:", error);
      throw new Error(error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) throw error;

      // Check for intended booking and redirect (handled after OAuth callback)
      const intendedBooking = sessionStorage.getItem('intendedBooking');
      if (intendedBooking) {
        // Store in localStorage temporarily as sessionStorage may be cleared during OAuth flow
        localStorage.setItem('intendedBookingOAuth', intendedBooking);
        sessionStorage.removeItem('intendedBooking');
      }
    } catch (error: any) {
      console.error("Google login error:", error);
      setIsLoading(false);
      throw new Error(error.message || "Google authentication failed");
    }
    // Don't set isLoading to false here - the auth state change listener will handle it
  };

  const loginWithFacebook = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) throw error;

      // Check for intended booking and redirect (handled after OAuth callback)
      const intendedBooking = sessionStorage.getItem('intendedBooking');
      if (intendedBooking) {
        // Store in localStorage temporarily as sessionStorage may be cleared during OAuth flow
        localStorage.setItem('intendedBookingOAuth', intendedBooking);
        sessionStorage.removeItem('intendedBooking');
      }
    } catch (error: any) {
      console.error("Facebook login error:", error);
      setIsLoading(false);
      throw new Error(error.message || "Facebook authentication failed");
    }
    // Don't set isLoading to false here - the auth state change listener will handle it
  };

  const loginWithInstagram = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'instagram' as any, // Instagram OAuth - types may not be updated but Supabase supports it
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) throw error;

      // Check for intended booking and redirect (handled after OAuth callback)
      const intendedBooking = sessionStorage.getItem('intendedBooking');
      if (intendedBooking) {
        // Store in localStorage temporarily as sessionStorage may be cleared during OAuth flow
        localStorage.setItem('intendedBookingOAuth', intendedBooking);
        sessionStorage.removeItem('intendedBooking');
      }
    } catch (error: any) {
      console.error("Instagram login error:", error);
      setIsLoading(false);
      throw new Error(error.message || "Instagram authentication failed");
    }
    // Don't set isLoading to false here - the auth state change listener will handle it
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      if (data.user) {
        setUser(convertSupabaseUser(data.user));
      }
    } catch (error: any) {
      console.error("Signup error:", error);
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
      console.error("Password reset error:", error);
      throw new Error(error.message || "Password reset request failed");
    } finally {
      setIsLoading(false);
    }
  };

  const requestVerification = async (email: string) => {
    setIsLoading(true);
    try {
      console.log('Requesting verification for:', email);
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${window.location.origin}/verify-email`,
        },
      });

      console.log('Supabase OTP response:', { data, error });

      if (error) {
        console.error('Supabase error details:', error);

        // Provide more helpful error messages based on common issues
        if (error.message.includes('Email rate limit exceeded')) {
          throw new Error('Too many requests. Please wait a minute before trying again.');
        }

        if (error.message.includes('SMTP') || error.message.includes('email') || error.message.includes('mail')) {
          throw new Error('Email service not configured. Please contact support or try again later.');
        }

        throw error;
      }

      console.log('Verification email sent successfully via Supabase');
    } catch (error: any) {
      console.error("Request verification error:", error);
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
        // Supabase has built-in rate limiting
        if (error.message.includes('Email rate limit exceeded')) {
          return { cooldownMs: 60000 }; // 1 minute cooldown
        }
        throw error;
      }

      return { cooldownMs: undefined };
    } catch (error: any) {
      console.error("Resend verification error:", error);
      throw new Error(error.message || "Failed to resend verification email");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        loginWithGoogle,
        loginWithFacebook,
        loginWithInstagram,
        signup,
        logout,
        requestPasswordReset,
        requestVerification,
        resendVerification,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
