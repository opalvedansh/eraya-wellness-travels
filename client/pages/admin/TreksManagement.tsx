import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import AdminLayout from "./AdminLayout";
import { authenticatedFetch } from "@/lib/api";

interface Trek {
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
    altitude?: string;
    isActive: boolean;
    isFeatured: boolean;
    coverImage?: string;
    createdAt: string;
}

export default function TreksManagement() {
    const [treks, setTreks] = useState<Trek[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    useEffect(() => {
        fetchTreks();
    }, []);

    const fetchTreks = async () => {
        try {
            const response = await authenticatedFetch("/api/admin/treks");
            if (response.ok) {
                const data = await response.json();
                setTreks(data);
            }
        } catch (error) {
            console.error("Failed to fetch treks:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this trek?")) {
            return;
        }

        setDeleteId(id);
        try {
            const response = await authenticatedFetch(`/api/admin/treks/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setTreks(treks.filter((trek) => trek.id !== id));
                alert("Trek deleted successfully!");
            } else {
                alert("Failed to delete trek");
            }
        } catch (error) {
            console.error("Failed to delete trek:", error);
            alert("Failed to delete trek");
        } finally {
            setDeleteId(null);
        }
    };

    const toggleActive = async (trek: Trek) => {
        try {
            const response = await authenticatedFetch(`/api/admin/treks/${trek.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...trek, isActive: !trek.isActive }),
            });

            if (response.ok) {
                setTreks(treks.map((t) => (t.id === trek.id ? { ...t, isActive: !t.isActive } : t)));
            }
        } catch (error) {
            console.error("Failed to toggle trek status:", error);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-primary mx-auto mb-4"></div>
                        <p className="text-text-dark">Loading treks...</p>
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
                        <h1 className="text-3xl font-bold text-gray-900">Treks Management</h1>
                        <p className="text-gray-600 mt-1">Manage your trekking adventures</p>
                    </div>
                    <Link
                        to="/admin/treks/new"
                        className="flex items-center px-4 py-2 bg-green-primary text-white rounded-lg hover:bg-green-secondary transition"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Add New Trek
                    </Link>
                </div>

                {/* Treks Grid */}
                {treks.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {treks.map((trek) => (
                            <div key={trek.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition">
                                {/* Cover Image */}
                                <div className="relative h-48 bg-gray-200">
                                    {trek.coverImage ? (
                                        <img
                                            src={trek.coverImage}
                                            alt={trek.name}
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
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${trek.isActive
                                                ? "bg-green-100 text-green-800"
                                                : "bg-gray-100 text-gray-800"
                                                }`}
                                        >
                                            {trek.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </div>

                                    {trek.isFeatured && (
                                        <div className="absolute top-3 left-3">
                                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                                                Featured
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    <h3 className="font-bold text-lg text-gray-900 mb-2 truncate">{trek.name}</h3>

                                    <div className="space-y-1 text-sm text-gray-600 mb-4">
                                        <p>📍 {trek.location}</p>
                                        <p>⏱️ {trek.duration}</p>
                                        {trek.altitude && <p>⛰️ {trek.altitude}</p>}
                                        <p className="font-semibold text-green-primary">
                                            ${trek.price} {trek.currency}
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        <Link
                                            to={`/admin/treks/edit/${trek.id}`}
                                            className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-medium"
                                        >
                                            <Edit className="w-4 h-4 mr-1" />
                                            Edit
                                        </Link>

                                        <button
                                            onClick={() => toggleActive(trek)}
                                            className="flex items-center justify-center px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition"
                                            title={trek.isActive ? "Deactivate" : "Activate"}
                                        >
                                            {trek.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>

                                        <button
                                            onClick={() => handleDelete(trek.id)}
                                            disabled={deleteId === trek.id}
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
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No treks yet</h3>
                            <p className="text-gray-600 mb-6">Get started by creating your first trek adventure</p>
                            <Link
                                to="/admin/treks/new"
                                className="inline-flex items-center px-6 py-3 bg-green-primary text-white rounded-lg hover:bg-green-secondary transition"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Create Your First Trek
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
