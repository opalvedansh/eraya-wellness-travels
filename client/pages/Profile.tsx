import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    User,
    Mail,
    Phone,
    Calendar,
    Edit2,
    Save,
    X,
    Camera,
    MapPin,
    Package,
    TrendingUp,
    Sparkles,
    Bell,
    Shield,
    LogOut,
    ChevronDown,
    Check,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordSection, setShowPasswordSection] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: user?.name || "",
        phone: "",
        newsletter: true,
        notifications: true,
    });

    useEffect(() => {
        if (!user) {
            navigate("/");
            return;
        }
        setFormData((prev) => ({
            ...prev,
            name: user.name || "",
        }));
    }, [user, navigate]);

    const stats = [
        {
            icon: Package,
            label: "Total Bookings",
            value: 0,
            gradient: "from-green-primary to-green-primary/80",
            iconBg: "bg-green-primary/10",
            iconColor: "text-green-primary",
        },
        {
            icon: MapPin,
            label: "Countries Visited",
            value: 0,
            gradient: "from-blue-accent to-blue-accent/80",
            iconBg: "bg-blue-accent/10",
            iconColor: "text-blue-accent",
        },
        {
            icon: TrendingUp,
            label: "Adventures",
            value: 0,
            gradient: "from-green-primary to-blue-accent",
            iconBg: "bg-gradient-to-br from-green-primary/10 to-blue-accent/10",
            iconColor: "text-green-primary",
        },
        {
            icon: Calendar,
            label: "Member Since",
            value: user?.createdAt
                ? new Date(user.createdAt).getFullYear().toString()
                : new Date().getFullYear().toString(),
            gradient: "from-green-primary/80 to-green-primary",
            iconBg: "bg-green-primary/10",
            iconColor: "text-green-primary",
        },
    ];

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsSaving(false);
        setIsEditing(false);
        toast({
            title: "Profile Updated!",
            description: "Your profile has been successfully updated.",
        });
    };

    const handleCancel = () => {
        setFormData({
            name: user?.name || "",
            phone: "",
            newsletter: true,
            notifications: true,
        });
        setIsEditing(false);
    };

    const handleLogout = () => {
        logout();
        navigate("/");
        toast({
            title: "Logged Out",
            description: "You have been successfully logged out.",
        });
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-beige via-beige-light to-beige">
            <NavBar />
            <FloatingWhatsAppButton />

            {/* Spectacular Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-green-primary via-green-primary/90 to-blue-accent pt-24 sm:pt-28 md:pt-32 pb-32 sm:pb-40">
                {/* Animated Background Elements */}
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, 0],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, -5, 0],
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-accent/20 rounded-full blur-3xl"
                />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm mb-8 text-white/80">
                        <Link to="/" className="hover:text-white transition-colors">
                            Home
                        </Link>
                        <span>→</span>
                        <span className="font-semibold text-white">Profile</span>
                    </div>

                    {/* Avatar and Name */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center text-center"
                    >
                        {/* Avatar with Glow Effect */}
                        <div className="relative group mb-6">
                            <motion.div
                                animate={{
                                    boxShadow: [
                                        "0 0 40px rgba(255, 255, 255, 0.3)",
                                        "0 0 60px rgba(255, 255, 255, 0.5)",
                                        "0 0 40px rgba(255, 255, 255, 0.3)",
                                    ],
                                }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white/50 overflow-hidden bg-white"
                            >
                                {user.photoURL ? (
                                    <img
                                        src={user.photoURL}
                                        alt={user.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-primary to-blue-accent">
                                        <User className="h-16 w-16 sm:h-20 sm:w-20 text-white" />
                                    </div>
                                )}
                            </motion.div>
                            <button className="absolute bottom-2 right-2 bg-white text-green-primary p-2 rounded-full shadow-lg hover:scale-110 transition-transform">
                                <Camera className="h-4 w-4" />
                            </button>
                        </div>

                        <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">
                            {user.name}
                        </h1>
                        <p className="text-lg text-white/80 mb-2">{user.email}</p>
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                            <Sparkles className="h-4 w-4 text-white" />
                            <span className="text-sm font-semibold text-white">
                                Member since {user.createdAt ? new Date(user.createdAt).getFullYear() : new Date().getFullYear()}
                            </span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 -mt-20 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Profile Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Profile Information Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-premium-lg border border-white/50"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-primary/10 to-transparent rounded-full blur-3xl" />

                            <div className="relative">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-black text-text-dark flex items-center gap-2">
                                        <User className="h-6 w-6 text-green-primary" />
                                        Personal Information
                                    </h2>
                                    {!isEditing ? (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="flex items-center gap-2 px-4 py-2 bg-green-primary/10 text-green-primary hover:bg-green-primary hover:text-white rounded-lg font-semibold transition-all duration-300"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                            Edit
                                        </button>
                                    ) : (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleSave}
                                                disabled={isSaving}
                                                className="flex items-center gap-2 px-4 py-2 bg-green-primary text-white hover:bg-green-primary/90 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50"
                                            >
                                                {isSaving ? (
                                                    <>Saving...</>
                                                ) : (
                                                    <>
                                                        <Save className="h-4 w-4" />
                                                        Save
                                                    </>
                                                )}
                                            </button>
                                            <button
                                                onClick={handleCancel}
                                                disabled={isSaving}
                                                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white rounded-lg font-semibold transition-all duration-300"
                                            >
                                                <X className="h-4 w-4" />
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-6">
                                    {/* Name Field */}
                                    <div>
                                        <label className="block text-sm font-bold text-text-dark mb-2">
                                            Full Name
                                        </label>
                                        {isEditing ? (
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-dark/40" />
                                                <input
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full pl-12 pr-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-transparent transition-all"
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-3 p-4 bg-beige/30 rounded-lg">
                                                <User className="h-5 w-5 text-green-primary" />
                                                <span className="font-semibold text-text-dark">{user.name}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Email Field (Read-only) */}
                                    <div>
                                        <label className="block text-sm font-bold text-text-dark mb-2">
                                            Email Address
                                        </label>
                                        <div className="flex items-center gap-3 p-4 bg-beige/30 rounded-lg">
                                            <Mail className="h-5 w-5 text-green-primary" />
                                            <span className="font-semibold text-text-dark">{user.email}</span>
                                            <span className="ml-auto text-xs bg-green-primary/10 text-green-primary px-2 py-1 rounded-full font-semibold">
                                                Verified
                                            </span>
                                        </div>
                                    </div>

                                    {/* Phone Field */}
                                    <div>
                                        <label className="block text-sm font-bold text-text-dark mb-2">
                                            Phone Number
                                        </label>
                                        {isEditing ? (
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-dark/40" />
                                                <input
                                                    type="tel"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    placeholder="+1 (555) 000-0000"
                                                    className="w-full pl-12 pr-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-transparent transition-all"
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-3 p-4 bg-beige/30 rounded-lg">
                                                <Phone className="h-5 w-5 text-green-primary" />
                                                <span className="font-semibold text-text-dark">
                                                    {formData.phone || "Not provided"}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Preferences Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-premium-lg border border-white/50"
                        >
                            <h2 className="text-2xl font-black text-text-dark flex items-center gap-2 mb-6">
                                <Bell className="h-6 w-6 text-blue-accent" />
                                Preferences
                            </h2>

                            <div className="space-y-4">
                                <label className="flex items-center justify-between p-4 bg-beige/30 rounded-lg cursor-pointer hover:bg-beige/50 transition-all group">
                                    <div className="flex items-center gap-3">
                                        <Mail className="h-5 w-5 text-blue-accent" />
                                        <div>
                                            <p className="font-bold text-text-dark">Newsletter Subscription</p>
                                            <p className="text-sm text-text-dark/60">Receive updates about new tours and offers</p>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={formData.newsletter}
                                            onChange={(e) => setFormData({ ...formData, newsletter: e.target.checked })}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-primary"></div>
                                    </div>
                                </label>

                                <label className="flex items-center justify-between p-4 bg-beige/30 rounded-lg cursor-pointer hover:bg-beige/50 transition-all group">
                                    <div className="flex items-center gap-3">
                                        <Bell className="h-5 w-5 text-blue-accent" />
                                        <div>
                                            <p className="font-bold text-text-dark">Booking Notifications</p>
                                            <p className="text-sm text-text-dark/60">Get notified about booking updates</p>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={formData.notifications}
                                            onChange={(e) => setFormData({ ...formData, notifications: e.target.checked })}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-primary"></div>
                                    </div>
                                </label>
                            </div>
                        </motion.div>

                        {/* Account Management */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-premium-lg border border-white/50"
                        >
                            <h2 className="text-2xl font-black text-text-dark flex items-center gap-2 mb-6">
                                <Shield className="h-6 w-6 text-green-primary" />
                                Account Management
                            </h2>

                            <div className="space-y-4">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-between p-4 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <LogOut className="h-5 w-5 text-red-600" />
                                        <div className="text-left">
                                            <p className="font-bold text-red-600">Logout</p>
                                            <p className="text-sm text-red-600/70">Sign out of your account</p>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column - Stats */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="sticky top-24 space-y-4"
                        >
                            <h3 className="text-xl font-black text-text-dark mb-4">Your Stats</h3>
                            {stats.map((stat, index) => {
                                const Icon = stat.icon;
                                return (
                                    <motion.div
                                        key={stat.label}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 + index * 0.1 }}
                                        whileHover={{ scale: 1.05, y: -4 }}
                                        className={`relative overflow-hidden bg-gradient-to-br ${stat.gradient} rounded-2xl p-6 shadow-premium hover:shadow-premium-hover transition-all duration-300`}
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                                        <div className="relative text-white">
                                            <div className={`inline-flex p-3 ${stat.iconBg} rounded-xl mb-4`}>
                                                <Icon className={`h-6 w-6 ${stat.iconColor === 'text-green-primary' ? 'text-green-primary' : 'text-blue-accent'}`} />
                                            </div>
                                            <p className="text-3xl font-black mb-1">{stat.value}</p>
                                            <p className="text-sm font-semibold opacity-90">{stat.label}</p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
