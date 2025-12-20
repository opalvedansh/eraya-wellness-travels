import { Shield, Award, Leaf, Users, MapPin, Heart } from "lucide-react";
import { motion } from "framer-motion";

export default function WhyTravelWithUs() {
  const reasons = [
    {
      icon: Shield,
      title: "Safety First",
      description:
        "All guides certified in first aid. 24/7 emergency support. Insurance included.",
      color: "text-green-primary",
      bgColor: "bg-green-primary/10",
    },
    {
      icon: Award,
      title: "9+ Years Experience",
      description:
        "Since 2015, trusted by 2,000+ travelers. Award-winning service.",
      color: "text-blue-accent",
      bgColor: "bg-blue-accent/10",
    },
    {
      icon: Leaf,
      title: "Sustainable Travel",
      description:
        "Committed to protecting Nepal's environment. Support local communities.",
      color: "text-green-primary",
      bgColor: "bg-green-primary/10",
    },
    {
      icon: Users,
      title: "Expert Guides",
      description:
        "Licensed, experienced, and passionate. Deep local knowledge.",
      color: "text-blue-accent",
      bgColor: "bg-blue-accent/10",
    },
    {
      icon: MapPin,
      title: "Authentic Experiences",
      description:
        "Beyond tourist trails. Real connections with local culture.",
      color: "text-green-primary",
      bgColor: "bg-green-primary/10",
    },
    {
      icon: Heart,
      title: "Traveler First",
      description:
        "Your comfort and happiness is our priority. Flexible itineraries.",
      color: "text-green-primary",
      bgColor: "bg-green-primary/10",
    },
  ];

  return (
    <section className="py-14 sm:py-18 md:py-24 lg:py-32 px-3 sm:px-4 md:px-6 lg:px-12 bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-14 md:mb-18 lg:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black text-green-primary mb-4 sm:mb-5 md:mb-6 lg:mb-6 tracking-tight">
            Why Travel With Us
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-text-dark/75 max-w-3xl mx-auto leading-relaxed">
            Discover what makes Eraya Wellness Travels the trusted choice for
            adventure seekers
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 md:gap-8 lg:gap-8 mb-12 sm:mb-14 md:mb-18 lg:mb-16">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-card p-6 sm:p-7 md:p-8 lg:p-8 rounded-xl border border-border/40 shadow-premium-sm hover:shadow-premium-lg transition-all duration-300 cursor-pointer group"
              >
                <motion.div
                  className={`p-3 ${reason.bgColor} rounded-lg w-fit mb-4 sm:mb-5 md:mb-6 lg:mb-6`}
                  whileHover={{ rotate: [0, -15, 15, -15, 0], scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <Icon className={`h-7 sm:h-8 md:h-9 lg:h-9 w-7 sm:w-8 md:w-9 lg:w-9 ${reason.color}`} />
                </motion.div>
                <h3 className="text-lg sm:text-xl md:text-xl lg:text-xl font-bold text-text-dark mb-2.5 sm:mb-3 md:mb-3 lg:mb-3 tracking-tight group-hover:text-green-primary transition-colors">
                  {reason.title}
                </h3>
                <p className="text-text-dark/75 text-sm sm:text-base md:text-base lg:text-base leading-relaxed">
                  {reason.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 sm:mt-14 md:mt-18 lg:mt-16 bg-gradient-to-br from-green-primary via-green-primary/95 to-green-primary/90 rounded-2xl p-8 sm:p-10 md:p-12 lg:p-12 shadow-premium-lg relative overflow-hidden"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />

          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8 sm:gap-10 md:gap-12 lg:gap-12 text-center relative z-10">
            {[
              { value: "4.9/5", label: "Guest Rating", sublabel: "From 2,847 reviews" },
              { value: "2,000+", label: "Happy Travelers", sublabel: "Across 50+ destinations" },
              { value: "100%", label: "Satisfaction", sublabel: "Or your money back" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-black text-white mb-2 sm:mb-3 md:mb-4 lg:mb-4 tracking-tight">
                  {stat.value}
                </div>
                <p className="text-white font-bold text-base sm:text-lg md:text-lg lg:text-lg mb-1">{stat.label}</p>
                <p className="text-white/80 text-sm sm:text-base md:text-base lg:text-base">
                  {stat.sublabel}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
