import { motion } from "framer-motion";
import NavBar from "./NavBar";
import { Mountain, TrendingUp } from "lucide-react";

export default function TrekPageHero() {
    return (
        <div className="relative w-full min-h-[500px] lg:min-h-[550px] overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: `url("/WhatsApp Image 2026-01-09 at 23.02.55.jpeg")`,
                }}
            />

            {/* Diagonal Gradient Overlay - Bottom-left to Top-right */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/50 to-transparent" />

            {/* Navigation Bar */}
            <NavBar />

            {/* Content */}
            <div className="relative z-10 pt-20 sm:pt-24 lg:pt-28 pb-8 px-3 sm:px-6 lg:px-12 flex items-center min-h-[500px] lg:min-h-[550px]">
                <div className="max-w-7xl mx-auto w-full">
                    {/* Title & Tagline */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="mb-8"
                    >
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
                            Our Treks
                        </h1>
                        <p className="text-white/90 text-lg sm:text-xl font-semibold mb-2">
                            Epic Altitude • Real Challenge • Life-Changing Views
                        </p>
                        <p className="text-white/70 text-sm sm:text-base max-w-2xl">
                            Curated high-altitude adventures that test your limits and expand your horizons
                        </p>
                    </motion.div>

                    {/* Stats Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex flex-wrap gap-4"
                    >
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20">
                            <Mountain className="h-5 w-5 text-white" />
                            <span className="text-white font-semibold text-sm">Max Altitude: 6,189m</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20">
                            <TrendingUp className="h-5 w-5 text-green-400" />
                            <span className="text-white font-semibold text-sm">14 Treks Available</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
