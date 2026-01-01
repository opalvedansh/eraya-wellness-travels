import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import AdminLayout from "./AdminLayout";
import { authenticatedFetch } from "@/lib/api";

interface Tour {
    id: string;
    name: string;
    slug: string;
    description: string;
    location: string;
    duration: string;
    price: number;
    currency: string;
    difficulty: number;
    rating: number;
    isActive: boolean;
    isFeatured: boolean;
    coverImage?: string;
    createdAt: string;
}

export default function ToursManagement() {
    const [tours, setTours] = useState<Tour[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    useEffect(() => {
        fetchTours();
    }, []);

    const fetchTours = async () => {
        try {
            const response = await authenticatedFetch("/api/admin/tours");
            if (response.ok) {
                const data = await response.json();
                setTours(data);
            }
        } catch (error) {
            console.error("Failed to fetch tours:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this tour?")) {
            return;
        }

        setDeleteId(id);
        try {
            const response = await authenticatedFetch(`/api/admin/tours/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setTours(tours.filter((tour) => tour.id !== id));
                alert("Tour deleted successfully!");
            } else {
                alert("Failed to delete tour");
            }
        } catch (error) {
            console.error("Failed to delete tour:", error);
            alert("Failed to delete tour");
        } finally {
            setDeleteId(null);
        }
    };

    const toggleActive = async (tour: Tour) => {
        try {
            const response = await authenticatedFetch(`/api/admin/tours/${tour.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...tour, isActive: !tour.isActive }),
            });

            if (response.ok) {
                setTours(tours.map((t) => (t.id === tour.id ? { ...t, isActive: !t.isActive } : t)));
            }
        } catch (error) {
            console.error("Failed to toggle tour status:", error);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-primary mx-auto mb-4"></div>
                        <p className="text-text-dark">Loading tours...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Tours Management</h1>
                        <p className="text-gray-600 mt-1">Manage your tour packages</p>
                    </div>
                    <Link
                        to="/admin/tours/new"
                        className="flex items-center px-4 py-2 bg-green-primary text-white rounded-lg hover:bg-green-secondary transition"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Add New Tour
                    </Link>
                </div>

                {/* Tours Grid */}
                {tours.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tours.map((tour) => (
                            <div key={tour.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition">
                                {/* Cover Image */}
                                <div className="relative h-48 bg-gray-200">
                                    {tour.coverImage ? (
                                        <img
                                            src={tour.coverImage}
                                            alt={tour.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-400">
                                            No Image
                                        </div>
                                    )}

                                    {/* Status Badge */}
                                    <div className="absolute top-3 right-3">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${tour.isActive
                                                ? "bg-green-100 text-green-800"
                                                : "bg-gray-100 text-gray-800"
                                                }`}
                                        >
                                            {tour.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </div>

                                    {tour.isFeatured && (
                                        <div className="absolute top-3 left-3">
                                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                                                Featured
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    <h3 className="font-bold text-lg text-gray-900 mb-2 truncate">{tour.name}</h3>

                                    <div className="space-y-1 text-sm text-gray-600 mb-4">
                                        <p>📍 {tour.location}</p>
                                        <p>⏱️ {tour.duration}</p>
                                        <p className="font-semibold text-green-primary">
                                            ${tour.price} {tour.currency}
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        <Link
                                            to={`/admin/tours/edit/${tour.id}`}
                                            className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-medium"
                                        >
                                            <Edit className="w-4 h-4 mr-1" />
                                            Edit
                                        </Link>

                                        <button
                                            onClick={() => toggleActive(tour)}
                                            className="flex items-center justify-center px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition"
                                            title={tour.isActive ? "Deactivate" : "Activate"}
                                        >
                                            {tour.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>

                                        <button
                                            onClick={() => handleDelete(tour.id)}
                                            disabled={deleteId === tour.id}
                                            className="flex items-center justify-center px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition disabled:opacity-50"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                        <div className="max-w-md mx-auto">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Plus className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No tours yet</h3>
                            <p className="text-gray-600 mb-6">Get started by creating your first tour package</p>
                            <Link
                                to="/admin/tours/new"
                                className="inline-flex items-center px-6 py-3 bg-green-primary text-white rounded-lg hover:bg-green-secondary transition"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Create Your First Tour
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
