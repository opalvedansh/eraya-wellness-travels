import { Shield, Award, Users, Globe, Clock, Heart } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

function AnimatedNumber({ value, duration = 2000 }: { value: string; duration?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    if (!isInView) return;

    // Check if value has numbers to animate
    const numMatch = value.match(/[\d.]+/);
    if (!numMatch) {
      setDisplayValue(value);
      return;
    }

    const targetNum = parseFloat(numMatch[0]);
    const suffix = value.replace(numMatch[0], "");
    const isDecimal = value.includes(".");
    const startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const current = targetNum * progress;

      if (isDecimal) {
        setDisplayValue(current.toFixed(1) + suffix);
      } else {
        setDisplayValue(Math.floor(current).toLocaleString() + suffix);
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [isInView, value, duration]);

  return <span ref={ref}>{displayValue}</span>;
}

export default function TrustIndicators() {
  const stats = [
    {
      icon: Users,
      number: "2,000+",
      label: "Happy Travelers",
      description: "Trusted by adventurers worldwide",
      color: "text-green-primary",
      bgColor: "bg-green-primary/10",
    },
    {
      icon: Globe,
      number: "20+",
      label: "Destinations",
      description: "All over nepal",
      color: "text-blue-accent",
      bgColor: "bg-blue-accent/10",
    },
    {
      icon: Clock,
      number: "2+",
      label: "Years Experience",
      description: "Since 2023",
      color: "text-green-primary",
      bgColor: "bg-green-primary/10",
    },
    {
      icon: Award,
      number: "4.9/5",
      label: "Average Rating",
      description: "From 847 reviews",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
  ];

  const badges = [
    {
      icon: Shield,
      title: "Fully Insured",
      description: "Comprehensive travel insurance included",
      color: "text-green-primary",
      bgColor: "bg-green-primary/10",
    },
    {
      icon: Award,
      title: "Certified Guides",
      description: "Licensed and experienced professionals",
      color: "text-blue-accent",
      bgColor: "bg-blue-accent/10",
    },
    {
      icon: Heart,
      title: "Sustainable Travel",
      description: "Committed to responsible tourism",
      color: "text-green-primary",
      bgColor: "bg-green-primary/10",
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="py-14 sm:py-18 md:py-24 lg:py-32 px-3 sm:px-6 md:px-8 lg:px-12 bg-background"
    >
      <div className="max-w-7xl mx-auto">
        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 md:gap-7 lg:gap-8 mb-14 sm:mb-16 md:mb-20 lg:mb-20">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="text-center p-6 sm:p-7 md:p-8 lg:p-8 bg-beige-light rounded-xl border border-beige-dark/40 shadow-premium-sm hover:shadow-premium-lg transition-all duration-300 cursor-pointer group"
              >
                <motion.div
                  className={`p-3 ${stat.bgColor} rounded-lg w-fit mx-auto mb-4 sm:mb-5 md:mb-6 lg:mb-6`}
                  whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <Icon className={`h-6 sm:h-7 md:h-8 lg:h-8 w-6 sm:w-7 md:w-8 lg:w-8 ${stat.color} group-hover:scale-110 transition-transform`} />
                </motion.div>
                <div className={`text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-black ${stat.color} mb-2 sm:mb-3 md:mb-3 lg:mb-4 tracking-tight`}>
                  <AnimatedNumber value={stat.number} />
                </div>
                <div className="text-sm sm:text-base md:text-base lg:text-lg font-bold text-text-dark mb-1.5 sm:mb-2 md:mb-2 lg:mb-2 tracking-tight">
                  {stat.label}
                </div>
                <div className="text-xs sm:text-sm md:text-sm lg:text-base text-text-dark/70 font-medium">
                  {stat.description}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 md:gap-8 lg:gap-8">
          {badges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="flex items-start gap-4 sm:gap-5 md:gap-5 lg:gap-5 p-6 sm:p-7 md:p-8 lg:p-8 bg-beige-light rounded-xl border border-beige-dark/40 shadow-premium-sm hover:shadow-premium-lg transition-all duration-300 cursor-pointer group"
              >
                <motion.div
                  className={`flex-shrink-0 p-3 ${badge.bgColor} rounded-lg`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Icon className={`h-7 sm:h-8 md:h-9 lg:h-9 w-7 sm:w-8 md:w-9 lg:w-9 ${badge.color}`} />
                </motion.div>
                <div className="flex-grow">
                  <h3 className="font-bold text-text-dark mb-1.5 sm:mb-2 md:mb-2 lg:mb-2 text-base sm:text-lg md:text-lg lg:text-lg tracking-tight group-hover:text-green-primary transition-colors">
                    {badge.title}
                  </h3>
                  <p className="text-xs sm:text-sm md:text-sm lg:text-base text-text-dark/75 leading-relaxed">
                    {badge.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
