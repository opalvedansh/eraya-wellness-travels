import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import NavBar from "./NavBar";
import { Award, Users, MapPin, Star } from "lucide-react";

export default function AboutPageHero() {
    const [counts, setCounts] = useState({
        travelers: 0,
        destinations: 0,
        rating: 0,
    });

    // Animate counters on mount
    useEffect(() => {
        const duration = 2000; // 2 seconds
        const steps = 60;
        const interval = duration / steps;

        const targets = {
            travelers: 40000,
            destinations: 50,
            rating: 4.9,
        };

        let step = 0;
        const timer = setInterval(() => {
            step++;
            const progress = step / steps;

            setCounts({
                travelers: Math.floor(targets.travelers * progress),
                destinations: Math.floor(targets.destinations * progress),
                rating: Number((targets.rating * progress).toFixed(1)),
            });

            if (step >= steps) {
                clearInterval(timer);
                setCounts(targets);
            }
        }, interval);

        return () => clearInterval(timer);
    }, []);

    const stats = [
        {
            icon: Users,
            value: `${counts.travelers.toLocaleString()}+`,
            label: "Happy Travelers",
            color: "text-green-primary",
            bgColor: "bg-green-primary/10",
        },
        {
            icon: MapPin,
            value: `${counts.destinations}+`,
            label: "Destinations",
            color: "text-blue-accent",
            bgColor: "bg-blue-accent/10",
        },
        {
            icon: Star,
            value: counts.rating.toFixed(1),
            label: "Average Rating",
            color: "text-yellow-500",
            bgColor: "bg-yellow-500/10",
        },
    ];

    return (
        <div className="relative w-full bg-beige overflow-hidden">
            {/* Navigation Bar */}
            <NavBar />

            {/* Hero Content */}
            <div className="pt-16 sm:pt-20 lg:pt-24 pb-12 lg:pb-16">
                <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-12">
                    {/* Timeline Breadcrumb */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex items-center justify-center gap-2 mb-8 text-sm text-text-dark/60 flex-wrap"
                    >
                        <span className="font-semibold text-green-primary">2015</span>
                        <span>→</span>
                        <span>First Trek</span>
                        <span>→</span>
                        <span>40K Lives Changed</span>
                        <span>→</span>
                        <span className="font-semibold text-green-primary">Your Adventure</span>
                    </motion.div>

                    {/* Main Hero Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        {/* Left Side - Image */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="relative order-2 lg:order-1"
                        >
                            <div className="relative rounded-2xl overflow-hidden shadow-premium aspect-[4/3]">
                                {/* Founding Year Badge */}
                                <div className="absolute top-4 left-4 z-10 bg-green-primary text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg flex items-center gap-2">
                                    <Award className="h-4 w-4" />
                                    Since 2015
                                </div>

                                {/* Main Image */}
                                <img
                                    src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop"
                                    alt="Eraya Wellness - Our Journey"
                                    className="w-full h-full object-cover"
                                />

                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                            </div>

                            {/* Floating Quote Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                className="absolute -bottom-6 -right-4 lg:right-0 bg-white p-4 sm:p-6 rounded-xl shadow-premium-lg border border-border max-w-xs"
                            >
                                <p className="text-sm italic text-text-dark/80 leading-relaxed mb-2">
                                    "Travel isn't about ticking boxes—it's about transformation"
                                </p>
                                <p className="text-xs font-bold text-green-primary">— Rajesh Kumar, Founder</p>
                            </motion.div>
                        </motion.div>

                        {/* Right Side - Content */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="order-1 lg:order-2 space-y-6"
                        >
                            {/* Title */}
                            <div>
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-green-primary mb-4 leading-tight">
                                    About Eraya
                                </h1>
                                <p className="text-base sm:text-lg text-text-dark/70 leading-relaxed">
                                    Discover our mission to create meaningful adventure travel experiences that transform lives
                                </p>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-3 gap-3 sm:gap-4">
                                {stats.map((stat, index) => {
                                    const Icon = stat.icon;
                                    return (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                                            className="bg-card p-3 sm:p-4 rounded-lg border border-border text-center hover:shadow-md transition-shadow"
                                        >
                                            <div className={`w-10 h-10 ${stat.bgColor} rounded-full flex items-center justify-center mx-auto mb-2`}>
                                                <Icon className={`h-5 w-5 ${stat.color}`} />
                                            </div>
                                            <div className="text-xl sm:text-2xl font-black text-text-dark mb-1">
                                                {stat.value}
                                            </div>
                                            <div className="text-xs text-text-dark/60 font-semibold">
                                                {stat.label}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Trust Badges */}
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1.5 bg-green-primary/10 text-green-primary rounded-full text-xs font-bold">
                                    🌱 Carbon Neutral
                                </span>
                                <span className="px-3 py-1.5 bg-blue-accent/10 text-blue-accent rounded-full text-xs font-bold">
                                    🏆 Award Winner
                                </span>
                                <span className="px-3 py-1.5 bg-yellow-500/10 text-yellow-600 rounded-full text-xs font-bold">
                                    🤝 Community Partner
                                </span>
                            </div>

                            {/* CTA */}
                            <motion.a
                                href="#team"
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-green-primary text-white rounded-lg font-bold hover:bg-green-primary/90 transition-colors shadow-md"
                            >
                                Meet Our Team
                                <span className="text-lg">↓</span>
                            </motion.a>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
