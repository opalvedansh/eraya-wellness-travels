import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import AdminLayout from "./AdminLayout";
import { authenticatedFetch } from "@/lib/api";
import {
    LayoutDashboard,
    Mountain,
    Map,
    Calendar,
    DollarSign,
    TrendingUp,
    Users,
    Settings as SettingsIcon
} from "lucide-react";

interface DashboardStats {
    stats: {
        totalTours: number;
        totalTreks: number;
        totalBookings: number;
        pendingBookings: number;
    };
    recentBookings: Array<{
        id: string;
        itemName: string;
        fullName: string;
        email: string;
        amount: number;
        status: string;
        createdAt: string;
    }>;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await authenticatedFetch("/api/admin/dashboard/stats");

            if (response.ok) {
                const data = await response.json();
                setStats(data);
            }
        } catch (error) {
            console.error("Failed to fetch stats:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-primary mx-auto mb-4"></div>
                        <p className="text-text-dark">Loading dashboard...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    const statCards = [
        {
            title: "Total Tours",
            value: stats?.stats.totalTours || 0,
            icon: Map,
            color: "bg-blue-500",
            link: "/admin/tours"
        },
        {
            title: "Total Treks",
            value: stats?.stats.totalTreks || 0,
            icon: Mountain,
            color: "bg-green-500",
            link: "/admin/treks"
        },
        {
            title: "Total Bookings",
            value: stats?.stats.totalBookings || 0,
            icon: Calendar,
            color: "bg-purple-500",
            link: "/admin/bookings"
        },
        {
            title: "Pending Bookings",
            value: stats?.stats.pendingBookings || 0,
            icon: TrendingUp,
            color: "bg-orange-500",
            link: "/admin/bookings?filter=pending"
        },
    ];

    return (
        <AdminLayout>
            <div className="p-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600 mt-1">Welcome to your admin panel</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statCards.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div
                                key={stat.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link to={stat.link}>
                                    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition cursor-pointer">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                                                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                                            </div>
                                            <div className={`${stat.color} p-3 rounded-lg`}>
                                                <Icon className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Link
                        to="/admin/tours/new"
                        className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition group"
                    >
                        <Map className="w-8 h-8 text-blue-500 mb-3" />
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Add New Tour</h3>
                        <p className="text-gray-600 text-sm">Create a new tour package</p>
                    </Link>

                    <Link
                        to="/admin/treks/new"
                        className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition group"
                    >
                        <Mountain className="w-8 h-8 text-green-500 mb-3" />
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Add New Trek</h3>
                        <p className="text-gray-600 text-sm">Create a new trekking adventure</p>
                    </Link>

                    <Link
                        to="/admin/settings"
                        className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition group"
                    >
                        <SettingsIcon className="w-8 h-8 text-purple-500 mb-3" />
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Settings</h3>
                        <p className="text-gray-600 text-sm">Configure your website</p>
                    </Link>
                </div>

                {/* Recent Bookings */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
                        <Link
                            to="/admin/bookings"
                            className="text-green-primary hover:text-green-secondary text-sm font-medium"
                        >
                            View All →
                        </Link>
                    </div>

                    {stats?.recentBookings && stats.recentBookings.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                                            Tour/Trek
                                        </th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                                            Customer
                                        </th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                                            Amount
                                        </th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                                            Status
                                        </th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                                            Date
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.recentBookings.map((booking) => (
                                        <tr key={booking.id} className="border-b last:border-0 hover:bg-gray-50">
                                            <td className="py-3 px-4">
                                                <p className="font-medium text-gray-900">{booking.itemName}</p>
                                            </td>
                                            <td className="py-3 px-4">
                                                <p className="text-gray-900">{booking.fullName}</p>
                                                <p className="text-sm text-gray-500">{booking.email}</p>
                                            </td>
                                            <td className="py-3 px-4">
                                                <p className="font-semibold text-gray-900">
                                                    ${booking.amount.toFixed(2)}
                                                </p>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-medium ${booking.status === "confirmed"
                                                        ? "bg-green-100 text-green-800"
                                                        : booking.status === "pending"
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : "bg-gray-100 text-gray-800"
                                                        }`}
                                                >
                                                    {booking.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-gray-600 text-sm">
                                                {new Date(booking.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">No bookings yet</p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
