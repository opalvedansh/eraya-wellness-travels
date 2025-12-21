import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Linkedin, Mail, MapPin, Phone, Send } from "lucide-react";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-green-primary via-green-primary/95 to-green-primary/90 text-white py-12 sm:py-14 md:py-16 lg:py-20 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/3 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-12">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10 lg:gap-12 mb-10 sm:mb-12 md:mb-14 lg:mb-16">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="col-span-1 sm:col-span-2 md:col-span-1 lg:col-span-1"
          >
            <Link to="/" className="inline-block mb-4 sm:mb-5 md:mb-6 lg:mb-6 group">
              <motion.img
                whileHover={{ scale: 1.05 }}
                src="/eraya-logo.png"
                alt="Eraya Wellness Travels"
                className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto drop-shadow-lg brightness-0 invert"
              />
            </Link>
            <p className="text-white/90 text-sm sm:text-base leading-relaxed mb-5 sm:mb-6 md:mb-7 lg:mb-8 max-w-xs">
              Your gateway to unforgettable adventure experiences. Explore sacred destinations, trek mountain peaks, and discover wellness through travel.
            </p>

            {/* Social Media Icons */}
            <div className="flex gap-2 sm:gap-3 md:gap-3 lg:gap-3">
              {[
                { Icon: Facebook, href: "#facebook", label: "Facebook" },
                { Icon: Instagram, href: "#instagram", label: "Instagram" },
                { Icon: Twitter, href: "#twitter", label: "Twitter" },
                { Icon: Linkedin, href: "#linkedin", label: "LinkedIn" }
              ].map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.2, y: -4 }}
                  whileTap={{ scale: 0.9 }}
                  className="group relative bg-white/10 backdrop-blur-sm hover:bg-white/20 p-2.5 sm:p-3 rounded-xl transition-all duration-300 touch-target-min"
                  aria-label={social.label}
                >
                  <social.Icon className="h-4 sm:h-5 md:h-5 lg:h-5 w-4 sm:w-5 md:w-5 lg:w-5 text-white group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] transition-all" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="col-span-1"
          >
            <h4 className="text-sm sm:text-base md:text-lg lg:text-lg font-black mb-4 sm:mb-5 md:mb-6 lg:mb-6 text-white">
              Explore
            </h4>
            <ul className="space-y-2 sm:space-y-2.5 md:space-y-3 lg:space-y-3">
              {[
                { to: "/about", label: "About Us" },
                { to: "/tour", label: "Tours" },
                { to: "/trek", label: "Treks" },
                { to: "/spiritual", label: "Spiritual Travel" },
                { to: "/blog", label: "Blog" },
                { to: "/faq", label: "FAQ" }
              ].map((link) => (
                <motion.li
                  key={link.to}
                  whileHover={{ x: 4 }}
                >
                  <Link
                    to={link.to}
                    className="group inline-flex items-center text-white/80 hover:text-white transition-all text-sm sm:text-base relative py-1 sm:py-0.5 min-h-[44px] sm:min-h-0"
                  >
                    <span className="absolute left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300 bottom-0" />
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="col-span-1"
          >
            <h4 className="text-sm sm:text-base md:text-lg lg:text-lg font-black mb-4 sm:mb-5 md:mb-6 lg:mb-6 text-white">
              Contact
            </h4>
            <ul className="space-y-3 sm:space-y-4 md:space-y-4 lg:space-y-4">
              <motion.li whileHover={{ x: 4 }} className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-white/80 flex-shrink-0 mt-0.5" />
                <span className="text-white/80 text-sm sm:text-base">
                  Kathmandu, Nepal
                </span>
              </motion.li>
              <motion.li whileHover={{ x: 4 }} className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-white/80 flex-shrink-0 mt-0.5" />
                <span className="text-white/80 text-sm sm:text-base">
                  +977-123-456-7890
                </span>
              </motion.li>
              <motion.li whileHover={{ x: 4 }} className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-white/80 flex-shrink-0 mt-0.5" />
                <span className="text-white/80 text-sm sm:text-base">
                  info@erayawellness.com
                </span>
              </motion.li>
            </ul>

            <div className="mt-5 sm:mt-6 md:mt-6 lg:mt-6">
              <Link
                to="/contact"
                className="inline-block"
              >
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-bold py-2.5 px-6 rounded-full transition-all duration-300 text-sm border border-white/30 hover:border-white/50"
                >
                  Get in Touch
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="col-span-1 sm:col-span-2 md:col-span-1 lg:col-span-1"
          >
            <h4 className="text-sm sm:text-base md:text-lg lg:text-lg font-black mb-4 sm:mb-5 md:mb-6 lg:mb-6 text-white">
              Stay Updated
            </h4>
            <p className="text-white/80 text-sm sm:text-base mb-4 sm:mb-5 md:mb-6 lg:mb-6">
              Get the latest travel tips and exclusive offers delivered to your inbox.
            </p>
            <form className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-4 py-3 rounded-xl text-text-dark placeholder-text-dark/50 bg-white/95 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white focus:bg-white text-sm border border-white/20 transition-all"
                />
                <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-dark/40" />
              </div>
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="group w-full bg-white hover:bg-white/95 text-green-primary font-bold py-3 rounded-xl transition-all duration-300 text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <span className="relative z-10">Subscribe Now</span>
                <Send className="h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Decorative Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mb-8 sm:mb-10 md:mb-10 lg:mb-10"
        />

        {/* Footer Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 text-center sm:text-left"
        >
          <p className="text-white/70 text-sm">
            © 2024 Eraya Wellness Travels. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-4 sm:gap-6 text-sm">
            <motion.a
              whileHover={{ y: -2 }}
              href="#terms"
              className="text-white/70 hover:text-white transition-colors inline-block py-2 sm:py-0 min-h-[44px] sm:min-h-0 flex items-center"
            >
              Terms & Conditions
            </motion.a>
            <motion.a
              whileHover={{ y: -2 }}
              href="#privacy"
              className="text-white/70 hover:text-white transition-colors inline-block py-2 sm:py-0 min-h-[44px] sm:min-h-0 flex items-center"
            >
              Privacy Policy
            </motion.a>
            <motion.a
              whileHover={{ y: -2 }}
              href="#cookies"
              className="text-white/70 hover:text-white transition-colors inline-block py-2 sm:py-0 min-h-[44px] sm:min-h-0 flex items-center"
            >
              Cookie Policy
            </motion.a>
          </div>
        </motion.div>

        {/* Made with Love Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-8 sm:mt-10"
        >
          <p className="text-white/60 text-xs flex items-center justify-center gap-2">
            Crafted with
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block"
            >
              ❤️
            </motion.span>
            for adventure seekers and wellness travelers
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
