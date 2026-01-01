import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar,
    MapPin,
    Clock,
    DollarSign,
    Filter,
    Search,
    ChevronDown,
    Package,
    TrendingUp,
    Sparkles,
    ArrowRight,
    CheckCircle,
    XCircle,
    AlertCircle,
    Loader2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton";

interface Booking {
    id: string;
    type: string;
    itemName: string;
    itemSlug: string;
    location: string;
    duration: string;
    price: number;
    travelDate: string;
    fullName: string;
    email: string;
    phone?: string;
    status: "pending" | "confirmed" | "cancelled" | "completed";
    createdAt: string;
    updatedAt: string;
}

const statusConfig = {
    pending: {
        color: "bg-yellow-500",
        textColor: "text-yellow-700",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        label: "Pending",
        icon: AlertCircle,
    },
    confirmed: {
        color: "bg-green-500",
        textColor: "text-green-700",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        label: "Confirmed",
        icon: CheckCircle,
    },
    cancelled: {
        color: "bg-red-500",
        textColor: "text-red-700",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        label: "Cancelled",
        icon: XCircle,
    },
    completed: {
        color: "bg-blue-500",
        textColor: "text-blue-700",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        label: "Completed",
        icon: CheckCircle,
    },
};

export default function MyBooking() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("date");

    useEffect(() => {
        if (!user) {
            navigate("/");
            return;
        }

        // Mock data for demonstration
        setTimeout(() => {
            setBookings([]);
            setIsLoading(false);
        }, 1000);
    }, [user, navigate]);

    const filterOptions = [
        { value: "all", label: "All Bookings" },
        { value: "upcoming", label: "Upcoming" },
        { value: "past", label: "Past" },
        { value: "cancelled", label: "Cancelled" },
    ];

    const filteredBookings = bookings.filter((booking) => {
        // Filter logic
        if (activeFilter === "upcoming") {
            return (
                (booking.status === "confirmed" || booking.status === "pending") &&
                new Date(booking.travelDate) > new Date()
            );
        }
        if (activeFilter === "past") {
            return booking.status === "completed" || new Date(booking.travelDate) < new Date();
        }
        if (activeFilter === "cancelled") {
            return booking.status === "cancelled";
        }
        return true;
    }).filter((booking) =>
        booking.itemName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const stats = {
        total: bookings.length,
        upcoming: bookings.filter(
            (b) =>
                (b.status === "confirmed" || b.status === "pending") &&
                new Date(b.travelDate) > new Date()
        ).length,
        totalSpent: bookings.reduce((sum, b) => sum + b.price, 0),
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-beige via-beige-light to-beige">
            <NavBar />
            <FloatingWhatsAppButton />

            {/* Hero Header */}
            <div className="relative bg-gradient-to-br from-green-primary/10 via-beige to-blue-accent/10 pt-24 sm:pt-28 md:pt-32 pb-16">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-green-primary/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm mb-6">
                        <Link to="/" className="text-text-dark/60 hover:text-green-primary transition-colors">
                            Home
                        </Link>
                        <span className="text-text-dark/40">→</span>
                        <span className="text-green-primary font-semibold">My Bookings</span>
                    </div>

                    {/* Welcome Message */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12"
                    >
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-text-dark mb-4 tracking-tight">
                            Welcome back, <span className="text-green-primary">{user?.name}</span>!
                        </h1>
                        <p className="text-lg text-text-dark/70 max-w-2xl">
                            Track your adventures and manage your upcoming journeys all in one place
                        </p>
                    </motion.div>

                    {/* Stats Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6"
                    >
                        <motion.div
                            whileHover={{ y: -4, scale: 1.02 }}
                            className="relative overflow-hidden bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-premium border border-white/50"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-primary/20 to-transparent rounded-full blur-2xl" />
                            <div className="relative">
                                <div className="flex items-center justify-between mb-2">
                                    <Package className="h-8 w-8 text-green-primary" />
                                    <Sparkles className="h-5 w-5 text-green-primary/50" />
                                </div>
                                <p className="text-3xl font-black text-text-dark mb-1">{stats.total}</p>
                                <p className="text-sm font-semibold text-text-dark/60">Total Bookings</p>
                            </div>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -4, scale: 1.02 }}
                            className="relative overflow-hidden bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-premium border border-white/50"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-accent/20 to-transparent rounded-full blur-2xl" />
                            <div className="relative">
                                <div className="flex items-center justify-between mb-2">
                                    <TrendingUp className="h-8 w-8 text-blue-accent" />
                                    <Calendar className="h-5 w-5 text-blue-accent/50" />
                                </div>
                                <p className="text-3xl font-black text-text-dark mb-1">{stats.upcoming}</p>
                                <p className="text-sm font-semibold text-text-dark/60">Upcoming Adventures</p>
                            </div>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -4, scale: 1.02 }}
                            className="relative overflow-hidden bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-premium border border-white/50"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-primary/20 via-blue-accent/20 to-transparent rounded-full blur-2xl" />
                            <div className="relative">
                                <div className="flex items-center justify-between mb-2">
                                    <DollarSign className="h-8 w-8 text-green-primary" />
                                    <Sparkles className="h-5 w-5 text-green-primary/50" />
                                </div>
                                <p className="text-3xl font-black text-text-dark mb-1">${stats.totalSpent.toLocaleString()}</p>
                                <p className="text-sm font-semibold text-text-dark/60">Total Investment</p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12">
                {/* Filters & Search */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8"
                >
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
                        {/* Filter Tabs */}
                        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
                            {filterOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => setActiveFilter(option.value)}
                                    className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all duration-300 ${activeFilter === option.value
                                            ? "bg-green-primary text-white shadow-lg scale-105"
                                            : "bg-white/70 text-text-dark/70 hover:bg-white hover:text-text-dark"
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>

                        {/* Search */}
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-dark/40" />
                            <input
                                type="text"
                                placeholder="Search bookings..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white/70 backdrop-blur-sm border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-transparent transition-all"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Bookings Grid or Empty State */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-12 w-12 animate-spin text-green-primary" />
                    </div>
                ) : filteredBookings.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative overflow-hidden bg-gradient-to-br from-white/70 via-white/50 to-white/30 backdrop-blur-xl rounded-3xl p-12 sm:p-16 shadow-2xl border border-white/50 text-center"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-green-primary/5 via-blue-accent/5 to-transparent" />
                        <div className="absolute top-10 left-10 w-64 h-64 bg-green-primary/10 rounded-full blur-3xl" />
                        <div className="absolute bottom-10 right-10 w-64 h-64 bg-blue-accent/10 rounded-full blur-3xl" />

                        <div className="relative z-10">
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                className="mb-6 inline-block"
                            >
                                <Sparkles className="h-20 w-20 text-green-primary mx-auto" />
                            </motion.div>
                            <h2 className="text-3xl sm:text-4xl font-black text-text-dark mb-4">
                                No Bookings Yet
                            </h2>
                            <p className="text-lg text-text-dark/70 mb-8 max-w-md mx-auto">
                                Your adventure awaits! Start exploring our amazing tours and treks to create unforgettable memories.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link to="/tour">
                                    <motion.button
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="group bg-gradient-to-r from-green-primary to-green-primary/90 hover:from-green-primary/90 hover:to-green-primary text-white font-bold px-8 py-4 rounded-xl shadow-premium-lg hover:shadow-premium-hover transition-all duration-300 flex items-center gap-2"
                                    >
                                        Browse Tours
                                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </motion.button>
                                </Link>
                                <Link to="/trek">
                                    <motion.button
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="group bg-white/80 backdrop-blur-sm text-green-primary font-bold px-8 py-4 rounded-xl shadow-premium hover:shadow-premium-lg border-2 border-green-primary/20 hover:border-green-primary/40 transition-all duration-300 flex items-center gap-2"
                                    >
                                        Explore Treks
                                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </motion.button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        <AnimatePresence>
                            {filteredBookings.map((booking, index) => {
                                const status = statusConfig[booking.status];
                                const StatusIcon = status.icon;

                                return (
                                    <motion.div
                                        key={booking.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ y: -8, scale: 1.02 }}
                                        className="group relative overflow-hidden bg-white/70 backdrop-blur-lg rounded-2xl shadow-premium hover:shadow-premium-hover border border-white/50 transition-all duration-300"
                                    >
                                        {/* Status Indicator Border */}
                                        <div className={`absolute top-0 left-0 right-0 h-1 ${status.color}`} />

                                        <div className="p-6">
                                            {/* Status Badge */}
                                            <div className="flex items-center justify-between mb-4">
                                                <div className={`flex items-center gap-2 px-3 py-1.5 ${status.bgColor} ${status.borderColor} border rounded-full`}>
                                                    <StatusIcon className={`h-4 w-4 ${status.textColor}`} />
                                                    <span className={`text-xs font-bold ${status.textColor}`}>
                                                        {status.label}
                                                    </span>
                                                </div>
                                                <span className="text-xs font-semibold text-text-dark/50 uppercase">
                                                    {booking.type}
                                                </span>
                                            </div>

                                            {/* Booking Details */}
                                            <h3 className="text-xl font-black text-text-dark mb-4 line-clamp-2 group-hover:text-green-primary transition-colors">
                                                {booking.itemName}
                                            </h3>

                                            <div className="space-y-3 mb-6">
                                                <div className="flex items-center gap-2 text-sm text-text-dark/70">
                                                    <MapPin className="h-4 w-4 text-green-primary flex-shrink-0" />
                                                    <span className="font-medium">{booking.location}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-text-dark/70">
                                                    <Calendar className="h-4 w-4 text-blue-accent flex-shrink-0" />
                                                    <span className="font-medium">
                                                        {new Date(booking.travelDate).toLocaleDateString("en-US", {
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                        })}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-text-dark/70">
                                                    <Clock className="h-4 w-4 text-green-primary flex-shrink-0" />
                                                    <span className="font-medium">{booking.duration}</span>
                                                </div>
                                            </div>

                                            {/* Price */}
                                            <div className="flex items-baseline justify-between pt-4 border-t border-border/30">
                                                <span className="text-sm font-semibold text-text-dark/60">Total Price</span>
                                                <span className="text-2xl font-black text-green-primary">${booking.price}</span>
                                            </div>

                                            {/* View Details Button */}
                                            <Link to={`/${booking.type}/${booking.itemSlug}`}>
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="mt-4 w-full bg-gradient-to-r from-green-primary to-green-primary/90 text-white font-bold py-3 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                                                >
                                                    View Details
                                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                                </motion.button>
                                            </Link>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>

            <Footer />
        </div>
    );
}
