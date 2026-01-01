import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton";
import { XCircle, ArrowLeft, RefreshCw, Headphones } from "lucide-react";

export default function PaymentCancel() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const bookingId = searchParams.get("booking_id");

    const handleRetry = () => {
        // Navigate back to booking page
        navigate(-1);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-accent/5 via-beige to-beige-light flex flex-col">
            <FloatingWhatsAppButton />

            {/* Cancel Message */}
            <div className="flex-grow flex items-center justify-center px-4 py-12">
                <div className="max-w-2xl w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        {/* Cancel Icon */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="inline-block mb-6"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-orange-accent/20 rounded-full blur-xl"></div>
                                <div className="relative bg-orange-accent rounded-full p-6">
                                    <XCircle className="h-16 w-16 text-white" strokeWidth={2.5} />
                                </div>
                            </div>
                        </motion.div>

                        {/* Cancel Message */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-4xl sm:text-5xl font-black text-text-dark mb-4"
                        >
                            Payment Cancelled
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-lg text-text-dark/80 mb-8 leading-relaxed"
                        >
                            Your payment was cancelled and no charges were made.
                            {bookingId && " Your booking is still saved and awaiting payment."}
                        </motion.p>

                        {/* Info Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-white rounded-2xl shadow-lg border border-border/40 p-8 mb-8 text-left"
                        >
                            <h2 className="text-2xl font-black text-text-dark mb-4">What would you like to do?</h2>

                            <p className="text-text-dark/70 mb-6">
                                Don't worry! You can complete your payment at any time. Your booking details have been saved.
                            </p>

                            <div className="bg-beige/50 rounded-xl p-6 border border-border/30">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-blue-accent/10 rounded-lg flex-shrink-0">
                                        <Headphones className="h-6 w-6 text-blue-accent" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-text-dark mb-2">Need Help?</h3>
                                        <p className="text-sm text-text-dark/70 mb-3">
                                            If you encountered any issues or have questions about the payment process, our team is here to assist you.
                                        </p>
                                        <div className="text-sm">
                                            <p className="mb-1">
                                                📧 <a href="mailto:info@erayawellnesstravels.com" className="text-blue-accent hover:underline font-semibold">
                                                    info@erayawellnesstravels.com
                                                </a>
                                            </p>
                                            <p>
                                                📱 <a href="tel:+9779765548080" className="text-blue-accent hover:underline font-semibold">
                                                    +977 976-554-8080
                                                </a>
                                            </p>
                                        </div>
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
                            {bookingId && (
                                <button
                                    onClick={handleRetry}
                                    className="bg-green-primary hover:bg-green-primary/90 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                                >
                                    <RefreshCw className="h-5 w-5" />
                                    Try Payment Again
                                </button>
                            )}
                            <button
                                onClick={() => navigate("/")}
                                className="bg-white hover:bg-beige-light text-text-dark border-2 border-border font-bold px-8 py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <ArrowLeft className="h-5 w-5" />
                                Back to Home
                            </button>
                        </motion.div>

                        {/* Additional Info */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="mt-12"
                        >
                            <div className="inline-block bg-white rounded-lg px-6 py-3 border border-border/30 shadow-sm">
                                <p className="text-sm text-text-dark/70">
                                    💡 <span className="font-semibold">Tip:</span> Make sure your payment details are correct and you have sufficient funds before retrying.
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
