import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useRef } from "react";

export default function ExploreDestinationsSection() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Parallax effects for different layers
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -20]);

  return (
    <section ref={sectionRef} className="relative py-12 sm:py-16 md:py-24 lg:py-32 px-3 sm:px-4 md:px-6 lg:px-12 bg-gradient-to-br from-beige via-beige-light to-beige overflow-hidden">
      {/* Floating Background Shapes - Mobile Only */}
      <div className="absolute inset-0 overflow-hidden lg:hidden">
        <motion.div
          animate={{
            y: [0, -30, 0],
            rotate: [0, 10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 right-5 w-32 h-32 rounded-full bg-green-primary/5 blur-2xl"
        />
        <motion.div
          animate={{
            y: [0, 40, 0],
            rotate: [0, -15, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-20 left-5 w-40 h-40 rounded-full bg-green-primary/8 blur-3xl"
        />
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/4 w-24 h-24 border-2 border-green-primary/10 rounded-lg"
          style={{ transform: "rotate(45deg)" }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center order-2 lg:order-1"
          >
            {/* Gradient Animated Heading - Mobile Enhanced */}
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative text-4xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif leading-tight mb-4 sm:mb-5 md:mb-7 lg:mb-6 tracking-tight"
            >
              <span className="block lg:hidden text-transparent bg-clip-text bg-gradient-to-r from-green-primary via-[#2d5016] to-green-primary/80 animate-gradient-x">
                Let's explore new destinations
              </span>
              <span className="hidden lg:block text-text-dark">
                Let's explore new destinations
              </span>
              {/* Shimmer overlay - Mobile only */}
              <motion.div
                animate={{
                  x: ["-100%", "200%"]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                  repeatDelay: 2
                }}
                className="lg:hidden absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none"
              />
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm sm:text-base md:text-lg lg:text-xl text-text-dark/75 mb-6 sm:mb-8 md:mb-10 lg:mb-8 leading-relaxed max-w-md"
            >
              Experience unforgettable adventures. Discover your next getaway.
            </motion.p>

            {/* Spectacular CTA Button */}
            <div className="flex justify-center md:justify-start">
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.08, y: -6 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    "0 10px 30px rgba(45, 80, 22, 0.3)",
                    "0 15px 45px rgba(45, 80, 22, 0.5)",
                    "0 10px 30px rgba(45, 80, 22, 0.3)"
                  ]
                }}
                transition={{
                  duration: 0.6,
                  delay: 0.3,
                  boxShadow: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
                }}
                className="relative bg-green-primary hover:bg-green-primary/90 text-white font-bold py-4 sm:py-4 md:py-4 lg:py-4 px-8 sm:px-8 md:px-10 lg:px-10 rounded-full shadow-premium-lg transition-all duration-300 text-sm sm:text-base md:text-lg lg:text-lg touch-target-min overflow-hidden group"
              >
                {/* Shimmer effect */}
                <motion.div
                  animate={{
                    x: ["-100%", "200%"]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                    repeatDelay: 3
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                />
                {/* Sparkle icon */}
                <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 opacity-80 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10">Start Your Adventure Today</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Images Section */}
          <div className="relative h-56 sm:h-72 md:h-80 lg:h-[600px] order-1 lg:order-2 flex items-center justify-center">
            {/* Desktop Layout - Unchanged */}
            <div className="relative w-full h-full hidden lg:block">
              {/* Top right - small mountain image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                whileHover={{ scale: 1.05, rotate: 2, y: -8 }}
                className="absolute top-0 right-0 w-56 h-56 xl:w-64 xl:h-64 rounded-3xl overflow-hidden shadow-premium-lg hover:shadow-premium-hover transition-all duration-300 z-20 cursor-pointer"
                style={{ perspective: "1000px" }}
              >
                <img
                  src="/mountain-peak.jpg"
                  alt="Mountain landscape"
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Center right - large horizontal mountain image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ scale: 1.05, rotate: -2, y: -8 }}
                className="absolute top-16 right-12 w-80 h-64 xl:w-[400px] xl:h-80 rounded-3xl overflow-hidden shadow-premium-lg hover:shadow-premium-hover transition-all duration-300 z-10 cursor-pointer"
                style={{ perspective: "1000px" }}
              >
                <img
                  src="/trekking-trail.jpg"
                  alt="Mountain trekking trail"
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Bottom left - camping/tent image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                whileHover={{ scale: 1.1, rotate: 3, y: -10 }}
                className="absolute bottom-20 left-0 w-44 h-44 xl:w-52 xl:h-52 rounded-3xl overflow-hidden shadow-premium-lg hover:shadow-premium-hover transition-all duration-300 z-20 cursor-pointer"
                style={{ perspective: "1000px" }}
              >
                <img
                  src="/buddhist-stupa.jpg"
                  alt="Buddhist stupa at night"
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Bottom center - testimonial card overlapping the main image */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="absolute bottom-6 left-32 xl:left-40 z-30 w-72 xl:w-80"
              >
                <div className="bg-white rounded-xl shadow-premium-lg hover:shadow-premium-hover p-5 xl:p-6 border-l-4 border-green-primary transition-all duration-300">
                  <p className="text-text-dark text-sm leading-relaxed mb-4 font-medium">
                    "A remarkable journey! Each location was breathtaking, and
                    the service was top-notch."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-green-primary flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-black text-lg">DD</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-text-dark text-sm">
                        Dr. Dibyanshi
                      </p>
                      <p className="text-text-dark/60 text-xs truncate">
                        Eraya Wellness Experience
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Mobile Layout - SPECTACULAR REDESIGN */}
            <div className="lg:hidden relative w-full h-full">
              {/* Stacked Card 1 - Top (Mountain Peak) with Parallax */}
              <motion.div
                initial={{ opacity: 0, y: 50, rotate: -5 }}
                whileInView={{ opacity: 1, y: 0, rotate: -3 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1, type: "spring", bounce: 0.4 }}
                whileTap={{ scale: 1.05, rotate: 0 }}
                style={{ y: y1 }}
                className="absolute top-0 left-2 right-2 h-44 sm:h-52 rounded-3xl overflow-hidden shadow-premium-lg z-30"
              >
                <div className="relative w-full h-full group">
                  <img
                    src="/mountain-peak.jpg"
                    alt="Mountain landscape"
                    className="w-full h-full object-cover transition-transform duration-500 group-active:scale-110"
                  />
                  {/* Green glow overlay on tap */}
                  <div className="absolute inset-0 bg-gradient-to-t from-green-primary/30 via-transparent to-transparent opacity-0 group-active:opacity-100 transition-opacity duration-300" />
                  {/* Shimmer effect */}
                  <motion.div
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 5 }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  />
                </div>
              </motion.div>

              {/* Stacked Card 2 - Middle Left (Trekking) with Parallax */}
              <motion.div
                initial={{ opacity: 0, y: 50, rotate: 3 }}
                whileInView={{ opacity: 1, y: 0, rotate: 2 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2, type: "spring", bounce: 0.4 }}
                whileTap={{ scale: 1.05, rotate: 0 }}
                style={{ y: y2 }}
                className="absolute top-32 sm:top-40 left-1 w-[48%] h-36 sm:h-44 rounded-3xl overflow-hidden shadow-premium z-20"
              >
                <div className="relative w-full h-full group">
                  <img
                    src="/trekking-trail.jpg"
                    alt="Trekking trail"
                    className="w-full h-full object-cover transition-transform duration-500 group-active:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-green-primary/20 via-transparent to-transparent opacity-0 group-active:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>

              {/* Stacked Card 3 - Middle Right (Buddhist Stupa) with Parallax */}
              <motion.div
                initial={{ opacity: 0, y: 50, rotate: -2 }}
                whileInView={{ opacity: 1, y: 0, rotate: -1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.25, type: "spring", bounce: 0.4 }}
                whileTap={{ scale: 1.05, rotate: 0 }}
                style={{ y: y3 }}
                className="absolute top-32 sm:top-40 right-1 w-[48%] h-36 sm:h-44 rounded-3xl overflow-hidden shadow-premium z-20"
              >
                <div className="relative w-full h-full group">
                  <img
                    src="/buddhist-stupa.jpg"
                    alt="Buddhist stupa"
                    className="w-full h-full object-cover transition-transform duration-500 group-active:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-bl from-green-primary/20 via-transparent to-transparent opacity-0 group-active:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>

              {/* Testimonial Card - Bottom with Enhanced Shadow */}
              <motion.div
                initial={{ opacity: 0, y: 60, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.35, type: "spring", bounce: 0.3 }}
                whileTap={{ y: -4, scale: 1.02 }}
                className="absolute bottom-0 left-2 right-2 z-40"
              >
                <div className="relative bg-white rounded-2xl shadow-premium-lg p-4 sm:p-5 border-l-4 border-green-primary">
                  {/* Subtle pulse glow */}
                  <motion.div
                    animate={{
                      boxShadow: [
                        "0 0 0 0 rgba(45, 80, 22, 0)",
                        "0 0 0 8px rgba(45, 80, 22, 0.1)",
                        "0 0 0 0 rgba(45, 80, 22, 0)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                  />
                  <p className="text-text-dark text-xs sm:text-sm leading-relaxed mb-3 font-medium relative z-10">
                    "A remarkable journey! Each location was breathtaking, and the service was top-notch."
                  </p>
                  <div className="flex items-center gap-2 relative z-10">
                    <div className="w-10 h-10 rounded-full bg-green-primary flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-black text-sm">DD</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-text-dark text-xs sm:text-sm">
                        Dr. Dibyanshi
                      </p>
                      <p className="text-text-dark/60 text-xs truncate">
                        India
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
