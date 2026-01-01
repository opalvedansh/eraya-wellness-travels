import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export function VerifyEmail() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        // Check if user is authenticated after Supabase magic link redirect
        const checkAuth = async () => {
            // Give Supabase a moment to process the auth callback
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (user) {
                setStatus('success');
                // Redirect to home after 2 seconds
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } else {
                setStatus('error');
                setErrorMessage('Email verification failed. Please try again or request a new link.');
            }
        };

        checkAuth();
    }, [user, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50 px-4">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                    {status === 'loading' && (
                        <>
                            <div className="mb-6">
                                <Loader2 className="w-16 h-16 mx-auto text-primary-600 animate-spin" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                Verifying Your Email
                            </h1>
                            <p className="text-gray-600">
                                Please wait while we verify your email address...
                            </p>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <div className="mb-6">
                                <CheckCircle2 className="w-16 h-16 mx-auto text-green-600" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                Email Verified!
                            </h1>
                            <p className="text-gray-600 mb-4">
                                Your email has been successfully verified. You are now logged in.
                            </p>
                            <p className="text-sm text-gray-500">
                                Redirecting you to home page...
                            </p>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <div className="mb-6">
                                <XCircle className="w-16 h-16 mx-auto text-red-600" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                Verification Failed
                            </h1>
                            <p className="text-gray-600 mb-6">
                                {errorMessage}
                            </p>
                            <button
                                onClick={() => navigate('/')}
                                className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors font-medium"
                            >
                                Go to Home
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
