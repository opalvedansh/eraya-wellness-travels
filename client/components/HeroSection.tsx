import { useState, useRef } from "react";
import { Volume2, VolumeX, MapPin, Calendar } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import NavBar from "./NavBar";

export default function HeroSection() {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { scrollY } = useScroll();
  const textOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const textY = useTransform(scrollY, [0, 300], [0, -50]);

  const handleSoundToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="relative w-full min-h-screen md:min-h-screen lg:min-h-screen overflow-hidden flex items-center justify-center pt-16 sm:pt-20 md:pt-20 lg:pt-24">
      {/* Background Video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>

      {/* Enhanced Animated Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-green-primary/30 to-black/60 gradient-animate" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

      {/* Navigation Bar */}
      <NavBar />

      {/* Content Container */}
      <motion.div
        style={{ opacity: textOpacity, y: textY }}
        className="relative z-10 px-3 sm:px-4 md:px-6 lg:px-12 py-16 sm:py-20 md:py-16 lg:py-0 flex flex-col items-center justify-center text-center max-w-5xl mx-auto"
      >
        {/* Aspirational Tagline */}
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 font-light mb-3 sm:mb-4 md:mb-5 tracking-wide"
        >
          Discover Wellness in the Himalayas
        </motion.p>

        {/* Main Headline with Shimmer Effect */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white leading-tight mb-4 sm:mb-5 md:mb-6 lg:mb-7 tracking-tight relative"
        >
          <span className="relative inline-block">
            Explore the World
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent blur-xl"
            />
          </span>
          <span className="block bg-gradient-to-r from-white via-green-100 to-white bg-clip-text text-transparent">
            Beyond Boundaries
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-sm sm:text-base md:text-lg lg:text-xl mb-8 sm:mb-10 md:mb-12 lg:mb-14 max-w-3xl font-light leading-relaxed px-2 sm:px-0 text-white/95"
        >
          Embark on unforgettable journeys through breathtaking landscapes. From spiritual retreats to thrilling treks, create memories that last a lifetime.
        </motion.p>

        {/* CTA Buttons with Enhanced Effects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 sm:gap-5 md:gap-6 items-center justify-center w-full sm:w-auto"
        >
          <Link to="/tour">
            <motion.button
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="group relative bg-white hover:bg-white/95 text-text-dark font-bold py-4 sm:py-4 md:py-5 lg:py-5 px-8 sm:px-9 md:px-10 lg:px-12 rounded-full shadow-premium-lg hover:shadow-premium-hover transition-all duration-300 text-sm sm:text-base md:text-lg lg:text-lg touch-target-min w-full sm:w-auto flex items-center justify-center gap-2 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <MapPin className="w-5 h-5 group-hover:scale-110 transition-transform relative z-10" />
              <span className="relative z-10">Explore Destinations</span>
            </motion.button>
          </Link>

          <Link to="/contact">
            <motion.button
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="group relative bg-transparent hover:bg-white/10 text-white font-bold py-4 sm:py-4 md:py-5 lg:py-5 px-8 sm:px-9 md:px-10 lg:px-12 rounded-full border-2 border-white/80 hover:border-white shadow-premium hover:shadow-premium-lg transition-all duration-300 text-sm sm:text-base md:text-lg lg:text-lg touch-target-min w-full sm:w-auto flex items-center justify-center gap-2 backdrop-blur-sm overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform relative z-10" />
              <span className="relative z-10">Plan Your Journey</span>
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Sound Toggle Button */}
      <button
        onClick={handleSoundToggle}
        className="absolute top-20 sm:top-24 md:top-24 lg:top-28 right-3 sm:right-4 md:right-6 lg:right-12 z-20 bg-white/20 hover:bg-white/30 text-white p-2.5 sm:p-3 md:p-3 lg:p-3 rounded-full transition-all duration-200 backdrop-blur-sm touch-target-min hover:scale-110"
        aria-label={isMuted ? "Enable sound" : "Disable sound"}
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-6 lg:h-6" />
        ) : (
          <Volume2 className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-6 lg:h-6" />
        )}
      </button>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        style={{ opacity: textOpacity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-1.5 bg-white rounded-full"
            />
          </div>
          <span className="text-white/60 text-xs font-light tracking-wider">SCROLL</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
