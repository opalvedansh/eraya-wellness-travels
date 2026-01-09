import { motion } from "framer-motion";
import NavBar from "./NavBar";
import { Globe, MapPin, Star } from "lucide-react";

export default function TourPageHero() {
    return (
        <div className="relative w-full min-h-[500px] lg:min-h-[550px] overflow-hidden">
            {/* Background Image - Cultural/Diverse scene */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: `url("/hero.jpeg")`,
                }}
            />

            {/* Radial Gradient Overlay - Warmer, more inviting */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

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
                            Our Tours
                        </h1>
                        <p className="text-white/90 text-lg sm:text-xl font-semibold mb-2">
                            Culture • Adventure • Wellness - Journeys that Transform
                        </p>
                        <p className="text-white/80 text-sm sm:text-base max-w-2xl">
                            Curated experiences blending cultural immersion with natural beauty
                        </p>
                    </motion.div>

                    {/* Stats Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex flex-wrap gap-4"
                    >
                        <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-2 rounded-lg border border-white/30 shadow-lg">
                            <MapPin className="h-5 w-5 text-green-400" />
                            <span className="text-white font-semibold text-sm">7 Tours Available</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-2 rounded-lg border border-white/30 shadow-lg">
                            <Globe className="h-5 w-5 text-blue-400" />
                            <span className="text-white font-semibold text-sm">Covers all Nepal</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-2 rounded-lg border border-white/30 shadow-lg">
                            <Star className="h-5 w-5 text-yellow-400" />
                            <span className="text-white font-semibold text-sm">4.9 Average Rating</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
