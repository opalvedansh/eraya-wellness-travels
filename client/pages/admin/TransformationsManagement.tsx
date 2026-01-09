import { useState, useEffect } from 'react';
import { Check, X, Star, Trash2, Edit2, Plus } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { authenticatedFetch } from '@/lib/api';

interface Testimonial {
    id: string;
    name: string;
    location?: string;
    experience?: string;
    rating: number;
    review: string;
    avatar?: string;
    isApproved: boolean;
    isFeatured: boolean;
    createdAt: string;
}

export default function TestimonialsManagement() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        experience: '',
        rating: 5,
        review: '',
        avatar: ''
    });

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            const response = await authenticatedFetch('/api/admin/testimonials');
            const data = await response.json();
            setTestimonials(data);
        } catch (error) {
            console.error('Failed to fetch testimonials:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleApprove = async (id: string) => {
        try {
            const response = await authenticatedFetch(`/api/admin/testimonials/${id}/approve`, {
                method: 'PUT'
            });
            const updated = await response.json();
            setTestimonials(prev => prev.map(t => t.id === id ? updated : t));
        } catch (error) {
            console.error('Failed to toggle approval:', error);
        }
    };

    const toggleFeature = async (id: string) => {
        try {
            const response = await authenticatedFetch(`/api/admin/testimonials/${id}/feature`, {
                method: 'PUT'
            });
            const updated = await response.json();
            setTestimonials(prev => prev.map(t => t.id === id ? updated : t));
        } catch (error) {
            console.error('Failed to toggle featured:', error);
        }
    };

    const deleteTestimonial = async (id: string) => {
        if (!confirm('Are you sure you want to delete this testimonial?')) return;

        try {
            await authenticatedFetch(`/api/admin/testimonials/${id}`, {
                method: 'DELETE'
            });
            setTestimonials(prev => prev.filter(t => t.id !== id));
        } catch (error) {
            console.error('Failed to delete testimonial:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const url = editingId
                ? `/api/admin/testimonials/${editingId}`
                : '/api/admin/testimonials';

            const method = editingId ? 'PUT' : 'POST';

            const response = await authenticatedFetch(url, {
                method,
                body: JSON.stringify(formData)
            });

            const saved = await response.json();

            if (editingId) {
                setTestimonials(prev => prev.map(t => t.id === editingId ? saved : t));
            } else {
                setTestimonials(prev => [saved, ...prev]);
            }

            // Reset form
            setFormData({ name: '', location: '', experience: '', rating: 5, review: '', avatar: '' });
            setEditingId(null);
        } catch (error) {
            console.error('Failed to save testimonial:', error);
        }
    };

    const startEdit = (testimonial: Testimonial) => {
        setFormData({
            name: testimonial.name,
            location: testimonial.location || '',
            experience: testimonial.experience || '',
            rating: testimonial.rating,
            review: testimonial.review,
            avatar: testimonial.avatar || ''
        });
        setEditingId(testimonial.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const filteredTestimonials = testimonials.filter(t => {
        if (filter === 'pending') return !t.isApproved;
        if (filter === 'approved') return t.isApproved;
        return true;
    });

    if (loading) return <AdminLayout><div className="p-8">Loading...</div></AdminLayout>;

    return (
        <AdminLayout>
            <div className="p-6 max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Testimonials Management</h1>
                        <p className="text-gray-600">Manage traveler reviews and testimonials</p>
                    </div>
                </div>

                {/* Add/Edit Form */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
                    <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit' : 'Add New'} Testimonial</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Name *"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="border p-2 rounded"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Location (e.g., India, Nepal)"
                            value={formData.location}
                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                            className="border p-2 rounded"
                        />
                        <input
                            type="text"
                            placeholder="Experience (e.g., Eraya Wellness Experience)"
                            value={formData.experience}
                            onChange={e => setFormData({ ...formData, experience: e.target.value })}
                            className="border p-2 rounded"
                        />
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Rating</label>
                            <select
                                value={formData.rating}
                                onChange={e => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                                className="border p-2 rounded w-full"
                            >
                                {[5, 4, 3, 2, 1].map(n => (
                                    <option key={n} value={n}>{'⭐'.repeat(n)} - {n} stars</option>
                                ))}
                            </select>
                        </div>
                        <textarea
                            placeholder="Review *"
                            value={formData.review}
                            onChange={e => setFormData({ ...formData, review: e.target.value })}
                            className="border p-2 rounded md:col-span-2"
                            rows={3}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Avatar URL (optional)"
                            value={formData.avatar}
                            onChange={e => setFormData({ ...formData, avatar: e.target.value })}
                            className="border p-2 rounded md:col-span-2"
                        />
                        <div className="md:col-span-2 flex gap-2">
                            <button
                                type="submit"
                                className="bg-green-primary text-white px-4 py-2 rounded-lg hover:bg-green-secondary transition"
                            >
                                {editingId ? 'Update' : 'Add'} Testimonial
                            </button>
                            {editingId && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingId(null);
                                        setFormData({ name: '', location: '', experience: '', rating: 5, review: '', avatar: '' });
                                    }}
                                    className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-4">
                    {(['all', 'pending', 'approved'] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg font-medium transition ${filter === f
                                ? 'bg-green-primary text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                            {f === 'pending' && ` (${testimonials.filter(t => !t.isApproved).length})`}
                        </button>
                    ))}
                </div>

                {/* Testimonials List */}
                <div className="space-y-4">
                    {filteredTestimonials.map(testimonial => (
                        <div key={testimonial.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="font-bold text-lg">{testimonial.name}</h3>
                                        {testimonial.location && (
                                            <span className="text-sm text-gray-500">• {testimonial.location}</span>
                                        )}
                                    </div>
                                    {testimonial.experience && (
                                        <p className="text-sm text-gray-600 mb-2">{testimonial.experience}</p>
                                    )}
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="text-yellow-500">
                                            {'⭐'.repeat(testimonial.rating)}
                                        </div>
                                        <div className="flex gap-2">
                                            {testimonial.isApproved && (
                                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Approved</span>
                                            )}
                                            {!testimonial.isApproved && (
                                                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">Pending</span>
                                            )}
                                            {testimonial.isFeatured && (
                                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded flex items-center gap-1">
                                                    <Star className="w-3 h-3" /> Featured
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-gray-700 italic">"{testimonial.review}"</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 mt-4 pt-4 border-t">
                                <button
                                    onClick={() => toggleApprove(testimonial.id)}
                                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition ${testimonial.isApproved
                                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                                        }`}
                                >
                                    {testimonial.isApproved ? (
                                        <><X className="w-4 h-4" /> Unapprove</>
                                    ) : (
                                        <><Check className="w-4 h-4" /> Approve</>
                                    )}
                                </button>
                                <button
                                    onClick={() => toggleFeature(testimonial.id)}
                                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition ${testimonial.isFeatured
                                        ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    <Star className="w-4 h-4" />
                                    {testimonial.isFeatured ? 'Unfeature' : 'Feature'}
                                </button>
                                <button
                                    onClick={() => startEdit(testimonial)}
                                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                                >
                                    <Edit2 className="w-4 h-4" /> Edit
                                </button>
                                <button
                                    onClick={() => deleteTestimonial(testimonial.id)}
                                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition ml-auto"
                                >
                                    <Trash2 className="w-4 h-4" /> Delete
                                </button>
                            </div>
                        </div>
                    ))}

                    {filteredTestimonials.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            No testimonials found for this filter.
                        </div>
                    )}
                </div>
            </div >
        </AdminLayout >
    );
}
