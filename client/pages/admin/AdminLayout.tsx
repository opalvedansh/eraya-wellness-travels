import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
    LayoutDashboard,
    Map,
    Compass,
    Calendar,
    Settings,
    LogOut,
    Menu,
    X,
    Home,
    Sparkles,
} from "lucide-react";

interface AdminLayoutProps {
    children: ReactNode;
}

const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Tours", href: "/admin/tours", icon: Map },
    { name: "Treks", href: "/admin/treks", icon: Compass },
    { name: "Bookings", href: "/admin/bookings", icon: Calendar },
    { name: "Blog Posts", href: "/admin/blog", icon: Settings },
    { name: "Spiritual Insights", href: "/admin/spiritual-posts", icon: Sparkles },
    { name: "About Page", href: "/admin/about", icon: Settings },
    { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between h-16 px-6 border-b">
                        <Link to="/admin" className="flex items-center space-x-3">
                            <img
                                src="/eraya-logo.png"
                                alt="Eraya Wellness Travels"
                                className="h-16 w-auto"
                            />
                            <span className="text-xl font-bold text-gray-900">Admin</span>
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden text-gray-500 hover:text-gray-700"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition ${isActive
                                        ? "bg-green-50 text-green-primary"
                                        : "text-gray-700 hover:bg-gray-50"
                                        }`}
                                >
                                    <Icon className={`w-5 h-5 mr-3 ${isActive ? "text-green-primary" : "text-gray-400"}`} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User info & actions */}
                    <div className="border-t p-4 space-y-2">
                        <Link
                            to="/"
                            className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition"
                        >
                            <Home className="w-5 h-5 mr-3 text-gray-400" />
                            View Website
                        </Link>

                        <div className="px-4 py-3 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-500">Signed in as</p>
                            <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                            <LogOut className="w-5 h-5 mr-3" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Mobile header */}
                <div className="sticky top-0 z-10 bg-white shadow lg:hidden">
                    <div className="flex items-center justify-between h-16 px-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <Link to="/admin" className="flex items-center space-x-2">
                            <img
                                src="/eraya-logo.png"
                                alt="Eraya"
                                className="h-12 w-auto"
                            />
                        </Link>
                        <div className="w-6" /> {/* Spacer for alignment */}
                    </div>
                </div>

                {/* Page content */}
                <main>{children}</main>
            </div>
        </div>
    );
}
