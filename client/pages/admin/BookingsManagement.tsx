import { useEffect, useState } from "react";
import { Calendar, DollarSign, User, Mail, Phone } from "lucide-react";
import AdminLayout from "./AdminLayout";
import { API_BASE_URL } from "@/lib/config";

interface Booking {
    id: string;
    type: string;
    itemName: string;
    fullName: string;
    email: string;
    phone?: string;
    guests: number;
    travelDate: string;
    amount: number;
    currency: string;
    paymentStatus: string;
    status: string;
    createdAt: string;
    user: {
        name: string | null;
        email: string;
    };
}

export default function BookingsManagement() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>("all");

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/bookings`, {
                credentials: "include",
            });
            if (response.ok) {
                const data = await response.json();
                setBookings(data);
            }
        } catch (error) {
            console.error("Failed to fetch bookings:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateBookingStatus = async (id: string, status: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/bookings/${id}/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ status }),
            });

            if (response.ok) {
                setBookings(bookings.map((b) => (b.id === id ? { ...b, status } : b)));
                alert("Booking status updated!");
            } else {
                alert("Failed to update booking status");
            }
        } catch (error) {
            console.error("Failed to update booking:", error);
            alert("Failed to update booking status");
        }
    };

    const filteredBookings = bookings.filter((booking) => {
        if (filter === "all") return true;
        if (filter === "pending") return booking.status === "pending";
        if (filter === "confirmed") return booking.status === "confirmed";
        if (filter === "cancelled") return booking.status === "cancelled";
        return true;
    });

    const stats = {
        total: bookings.length,
        pending: bookings.filter((b) => b.status === "pending").length,
        confirmed: bookings.filter((b) => b.status === "confirmed").length,
        totalRevenue: bookings
            .filter((b) => b.paymentStatus === "paid")
            .reduce((sum, b) => sum + b.amount, 0),
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-primary mx-auto mb-4"></div>
                        <p className="text-text-dark">Loading bookings...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="p-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Bookings Management</h1>
                    <p className="text-gray-600 mt-1">Manage all tour and trek bookings</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Bookings</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                            </div>
                            <Calendar className="w-10 h-10 text-blue-500" />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Pending</p>
                                <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
                            </div>
                            <Calendar className="w-10 h-10 text-yellow-500" />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Confirmed</p>
                                <p className="text-2xl font-bold text-green-600 mt-1">{stats.confirmed}</p>
                            </div>
                            <Calendar className="w-10 h-10 text-green-500" />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Revenue</p>
                                <p className="text-2xl font-bold text-purple-600 mt-1">
                                    ${stats.totalRevenue.toFixed(2)}
                                </p>
                            </div>
                            <DollarSign className="w-10 h-10 text-purple-500" />
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                    <div className="flex gap-2">
                        {["all", "pending", "confirmed", "cancelled"].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === status
                                    ? "bg-green-primary text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Bookings Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {filteredBookings.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                                            Booking Details
                                        </th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                                            Customer
                                        </th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                                            Travel Date
                                        </th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                                            Amount
                                        </th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                                            Payment
                                        </th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                                            Status
                                        </th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredBookings.map((booking) => (
                                        <tr key={booking.id} className="border-b last:border-0 hover:bg-gray-50">
                                            <td className="py-4 px-4">
                                                <div>
                                                    <p className="font-semibold text-gray-900">{booking.itemName}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {booking.type === "tour" ? "Tour" : "Trek"} • {booking.guests} guests
                                                    </p>
                                                    <p className="text-xs text-gray-400">
                                                        Booked: {new Date(booking.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div>
                                                    <p className="font-medium text-gray-900">{booking.fullName}</p>
                                                    <p className="text-sm text-gray-600">{booking.email}</p>
                                                    {booking.phone && (
                                                        <p className="text-sm text-gray-600">{booking.phone}</p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <p className="text-gray-900">
                                                    {new Date(booking.travelDate).toLocaleDateString()}
                                                </p>
                                            </td>
                                            <td className="py-4 px-4">
                                                <p className="font-semibold text-gray-900">
                                                    ${booking.amount.toFixed(2)}
                                                </p>
                                                <p className="text-xs text-gray-500">{booking.currency}</p>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-medium ${booking.paymentStatus === "paid"
                                                        ? "bg-green-100 text-green-800"
                                                        : booking.paymentStatus === "pending"
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : "bg-red-100 text-red-800"
                                                        }`}
                                                >
                                                    {booking.paymentStatus}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <select
                                                    value={booking.status}
                                                    onChange={(e) => updateBookingStatus(booking.id, e.target.value)}
                                                    className={`px-3 py-1 rounded-lg text-sm font-medium border-2 ${booking.status === "confirmed"
                                                        ? "border-green-200 bg-green-50 text-green-800"
                                                        : booking.status === "pending"
                                                            ? "border-yellow-200 bg-yellow-50 text-yellow-800"
                                                            : booking.status === "cancelled"
                                                                ? "border-red-200 bg-red-50 text-red-800"
                                                                : "border-gray-200 bg-gray-50 text-gray-800"
                                                        }`}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="confirmed">Confirmed</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </td>
                                            <td className="py-4 px-4">
                                                <a
                                                    href={`mailto:${booking.email}`}
                                                    className="text-green-primary hover:text-green-secondary text-sm font-medium"
                                                >
                                                    Contact
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-12 text-center">
                            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">No bookings found</p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
