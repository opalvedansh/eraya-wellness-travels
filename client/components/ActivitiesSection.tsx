import { motion } from "framer-motion";

export default function ActivitiesSection() {
    const activities = [
        {
            id: 1,
            label: "Spiritual Travels",
            image: "/spiritual-travels.jpg",
            gridClass: "col-span-1"
        },
        {
            id: 2,
            label: "Yoga and Meditation",
            image: "/yoga-meditation.jpg",
            gridClass: "col-span-1"
        },
        {
            id: 3,
            label: "Sound Healing",
            image: "/sound-healing.jpg",
            gridClass: "col-span-1"
        },
        {
            id: 4,
            label: "Yoga Trekking",
            image: "/yoga-trekking.jpg",
            gridClass: "col-span-1"
        },
        {
            id: 5,
            label: "Adventure Activities",
            image: "/adventure-activities.jpg",
            gridClass: "col-span-1"
        }
    ];

    return (
        <section className="py-14 sm:py-18 md:py-24 lg:py-32 px-3 sm:px-4 md:px-6 lg:px-12 bg-background">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-10 sm:mb-12 md:mb-14 lg:mb-16"
                >
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-serif text-text-dark mb-3 sm:mb-4 tracking-tight">
                        Activities in <span className="italic">Nepal</span>
                    </h2>
                    <p className="text-sm sm:text-base md:text-lg text-text-dark/60 font-light tracking-wide">
                        Culture · Food · Mountains
                    </p>
                </motion.div>

                {/* Desktop Grid (≥1024px) - 2 large + 3 equal */}
                <div className="hidden lg:grid lg:grid-cols-2 lg:gap-6 lg:mb-6">
                    {/* Row 1: 2 large cards */}
                    {activities.slice(0, 2).map((activity, index) => (
                        <motion.div
                            key={activity.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-premium"
                        >
                            {/* Image */}
                            <div className="relative w-full h-full overflow-hidden">
                                <motion.img
                                    src={activity.image}
                                    alt={activity.label}
                                    className="w-full h-full object-cover transition-transform duration-500"
                                    whileHover={{ scale: 1.04 }}
                                />
                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent group-hover:from-black/60 group-hover:via-black/30 transition-all duration-500" />
                            </div>
                            {/* Label Badge */}
                            <motion.div
                                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
                                whileHover={{ y: -4 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full shadow-premium group-hover:shadow-premium-lg transition-all duration-300">
                                    <span className="text-text-dark font-semibold text-sm tracking-wide uppercase">
                                        {activity.label}
                                    </span>
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>

                {/* Desktop Row 2: 3 equal cards */}
                <div className="hidden lg:grid lg:grid-cols-3 lg:gap-6">
                    {activities.slice(2, 5).map((activity, index) => (
                        <motion.div
                            key={activity.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: (index + 2) * 0.1 }}
                            className="group relative h-72 rounded-2xl overflow-hidden cursor-pointer shadow-premium"
                        >
                            {/* Image */}
                            <div className="relative w-full h-full overflow-hidden">
                                <motion.img
                                    src={activity.image}
                                    alt={activity.label}
                                    className="w-full h-full object-cover transition-transform duration-500"
                                    whileHover={{ scale: 1.04 }}
                                />
                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent group-hover:from-black/60 group-hover:via-black/30 transition-all duration-500" />
                            </div>
                            {/* Label Badge */}
                            <motion.div
                                className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
                                whileHover={{ y: -4 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="bg-white/95 backdrop-blur-sm px-5 py-2.5 rounded-full shadow-premium group-hover:shadow-premium-lg transition-all duration-300">
                                    <span className="text-text-dark font-semibold text-xs tracking-wide uppercase">
                                        {activity.label}
                                    </span>
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>

                {/* Tablet Grid (768px - 1023px) - 2 columns */}
                <div className="hidden md:grid lg:hidden md:grid-cols-2 md:gap-5">
                    {activities.map((activity, index) => (
                        <motion.div
                            key={activity.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="relative h-64 rounded-2xl overflow-hidden shadow-premium"
                        >
                            {/* Image */}
                            <img
                                src={activity.image}
                                alt={activity.label}
                                className="w-full h-full object-cover"
                            />
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                            {/* Label Badge */}
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
                                <div className="bg-white/95 backdrop-blur-sm px-5 py-2.5 rounded-full shadow-premium">
                                    <span className="text-text-dark font-semibold text-xs tracking-wide uppercase">
                                        {activity.label}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Mobile Grid (≤767px) - Single column */}
                <div className="grid md:hidden grid-cols-1 gap-4">
                    {activities.map((activity, index) => (
                        <motion.div
                            key={activity.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            whileTap={{ scale: 0.98 }}
                            className="relative h-56 rounded-2xl overflow-hidden shadow-premium active:shadow-premium-lg transition-shadow duration-300"
                        >
                            {/* Image */}
                            <img
                                src={activity.image}
                                alt={activity.label}
                                className="w-full h-full object-cover"
                            />
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                            {/* Label Badge */}
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
                                <div className="bg-white/95 backdrop-blur-sm px-5 py-2.5 rounded-full shadow-premium">
                                    <span className="text-text-dark font-semibold text-xs tracking-wide uppercase">
                                        {activity.label}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
