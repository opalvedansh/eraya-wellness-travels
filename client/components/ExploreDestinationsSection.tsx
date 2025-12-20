import { motion } from "framer-motion";

export default function ExploreDestinationsSection() {
  return (
    <section className="py-12 sm:py-16 md:py-24 lg:py-32 px-3 sm:px-4 md:px-6 lg:px-12 bg-beige">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center order-2 lg:order-1"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif text-text-dark leading-tight mb-4 sm:mb-5 md:mb-7 lg:mb-6 tracking-tight">
              Let's explore new destinations
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-text-dark/75 mb-6 sm:mb-8 md:mb-10 lg:mb-8 leading-relaxed max-w-md">
              Experience unforgettable adventures. Discover your next getaway.
            </p>
            <div>
              <motion.button
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="relative bg-green-primary hover:bg-green-primary/85 text-white font-bold py-3.5 sm:py-4 md:py-4 lg:py-4 px-7 sm:px-8 md:px-10 lg:px-10 rounded-full shadow-premium hover:shadow-premium-lg transition-all duration-300 text-sm sm:text-base md:text-lg lg:text-lg touch-target-min overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <span className="relative z-10">Start Your Adventure Today</span>
              </motion.button>
            </div>
          </motion.div>

          <div className="relative h-56 sm:h-72 md:h-80 lg:h-[600px] order-1 lg:order-2 flex items-center justify-center">
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

            <div className="lg:hidden grid grid-cols-2 gap-3 auto-rows-min">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                className="rounded-3xl overflow-hidden shadow-premium h-32 sm:h-40 transition-all duration-300"
              >
                <img
                  src="/mountain-peak.jpg"
                  alt="Mountain landscape"
                  className="w-full h-full object-cover"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="rounded-3xl overflow-hidden shadow-premium-sm h-32 sm:h-40 transition-all duration-300"
              >
                <img
                  src="/trekking-trail.jpg"
                  alt="Trekking trail"
                  className="w-full h-full object-cover"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ y: -4 }}
                className="col-span-2 rounded-xl shadow-premium p-4 sm:p-5 bg-white border-l-4 border-green-primary transition-all duration-300"
              >
                <p className="text-text-dark text-xs sm:text-sm leading-relaxed mb-4 font-medium">
                  "A remarkable journey! Each location was breathtaking, and the service was top-notch."
                </p>
                <div className="flex items-center gap-2">
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
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ scale: 1.05 }}
                className="rounded-3xl overflow-hidden shadow-premium h-32 sm:h-40 col-span-2 transition-all duration-300"
              >
                <img
                  src="/buddhist-stupa.jpg"
                  alt="Buddhist stupa"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
