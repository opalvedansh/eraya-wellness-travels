import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton";
import { CheckCircle, ArrowLeft, Calendar, Receipt, Mail, Loader2 } from "lucide-react";

export default function PaymentSuccess() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const sessionId = searchParams.get("session_id");

    useEffect(() => {
        // Simulate processing time
        const timer = setTimeout(() => setIsLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    if (!sessionId) {
        return (
            <div className="min-h-screen bg-beige flex flex-col">
                <FloatingWhatsAppButton />
                <div className="flex-grow flex flex-col items-center justify-center px-4 py-12">
                    <h1 className="text-3xl font-black text-green-primary mb-4">
                        Invalid Payment Session
                    </h1>
                    <p className="text-text-dark/70 mb-8">
                        No payment session found.
                    </p>
                    <button
                        onClick={() => navigate("/")}
                        className="bg-blue-accent hover:bg-blue-accent-dark text-white font-bold px-6 py-2.5 rounded-lg transition-colors"
                    >
                        Back to Home
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-beige via-beige-light to-beige flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm mx-4 text-center"
                >
                    <Loader2 className="h-12 w-12 animate-spin text-green-primary mx-auto mb-4" />
                    <p className="text-text-dark font-bold text-lg mb-2">Processing Payment...</p>
                    <p className="text-text-dark/60 text-sm">Please wait while we confirm your booking</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-primary/5 via-beige to-beige-light flex flex-col">
            <FloatingWhatsAppButton />

            {/* Success Animation */}
            <div className="flex-grow flex items-center justify-center px-4 py-12">
                <div className="max-w-2xl w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        {/* Success Icon */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="inline-block mb-6"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-green-primary/20 rounded-full blur-xl"></div>
                                <div className="relative bg-green-primary rounded-full p-6">
                                    <CheckCircle className="h-16 w-16 text-white" strokeWidth={2.5} />
                                </div>
                            </div>
                        </motion.div>

                        {/* Success Message */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-4xl sm:text-5xl font-black text-green-primary mb-4"
                        >
                            Payment Successful! 🎉
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-lg text-text-dark/80 mb-8 leading-relaxed"
                        >
                            Your booking has been confirmed and payment processed successfully.
                        </motion.p>

                        {/* Info Cards */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-white rounded-2xl shadow-lg border border-border/40 p-8 mb-8 text-left"
                        >
                            <h2 className="text-2xl font-black text-text-dark mb-6">What Happens Next?</h2>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-green-primary/10 rounded-lg flex-shrink-0">
                                        <Mail className="h-6 w-6 text-green-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-text-dark mb-1">Check Your Email</h3>
                                        <p className="text-sm text-text-dark/70">
                                            A confirmation email with your booking details has been sent to your inbox.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-blue-accent/10 rounded-lg flex-shrink-0">
                                        <Calendar className="h-6 w-6 text-blue-accent" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-text-dark mb-1">Schedule Preparation</h3>
                                        <p className="text-sm text-text-dark/70">
                                            Our team will contact you within 24 hours with the detailed itinerary and pre-trip briefing.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-orange-accent/10 rounded-lg flex-shrink-0">
                                        <Receipt className="h-6 w-6 text-orange-accent" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-text-dark mb-1">View Your Booking</h3>
                                        <p className="text-sm text-text-dark/70">
                                            Access your booking details anytime from your profile.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Action Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                        >
                            <Link
                                to="/my-bookings"
                                className="bg-green-primary hover:bg-green-primary/90 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                View My Bookings
                            </Link>
                            <Link
                                to="/"
                                className="bg-white hover:bg-beige-light text-green-primary border-2 border-green-primary font-bold px-8 py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <ArrowLeft className="h-5 w-5" />
                                Back to Home
                            </Link>
                        </motion.div>

                        {/* Support Info */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="mt-12 text-sm text-text-dark/60"
                        >
                            <p>Need assistance? Contact us at:</p>
                            <p className="mt-2">
                                <a
                                    href="mailto:info@erayawellnesstravels.com"
                                    className="text-green-primary hover:underline font-semibold"
                                >
                                    info@erayawellnesstravels.com
                                </a>
                                {" or "}
                                <a
                                    href="tel:+9779765548080"
                                    className="text-green-primary hover:underline font-semibold"
                                >
                                    +977 976-554-8080
                                </a>
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
