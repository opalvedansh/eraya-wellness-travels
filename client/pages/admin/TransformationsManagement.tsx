import { useState, useEffect } from 'react';
import { Check, X, Star, Trash2, Edit2 } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { authenticatedFetch } from '@/lib/api';

interface TransformationStory {
    id: string;
    name: string;
    age: string;
    location: string;
    storyTitle: string;
    story: string;
    avatar?: string;
    isApproved: boolean;
    isFeatured: boolean;
    createdAt: string;
}

export default function TransformationsManagement() {
    const [stories, setStories] = useState<TransformationStory[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        location: '',
        storyTitle: '',
        story: '',
        avatar: ''
    });

    useEffect(() => {
        fetchStories();
    }, []);

    const fetchStories = async () => {
        try {
            const response = await authenticatedFetch('/api/admin/transformations');
            const data = await response.json();
            setStories(data);
        } catch (error) {
            console.error('Failed to fetch transformation stories:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleApprove = async (id: string) => {
        try {
            const response = await authenticatedFetch(`/api/admin/transformations/${id}/approve`, {
                method: 'PUT'
            });
            const updated = await response.json();
            setStories(prev => prev.map(t => t.id === id ? updated : t));
        } catch (error) {
            console.error('Failed to toggle approval:', error);
        }
    };

    const toggleFeature = async (id: string) => {
        try {
            const response = await authenticatedFetch(`/api/admin/transformations/${id}/feature`, {
                method: 'PUT'
            });
            const updated = await response.json();
            setStories(prev => prev.map(t => t.id === id ? updated : t));
        } catch (error) {
            console.error('Failed to toggle featured:', error);
        }
    };

    const deleteStory = async (id: string) => {
        if (!confirm('Are you sure you want to delete this transformation story?')) return;

        try {
            await authenticatedFetch(`/api/admin/transformations/${id}`, {
                method: 'DELETE'
            });
            setStories(prev => prev.filter(t => t.id !== id));
        } catch (error) {
            console.error('Failed to delete story:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const url = editingId
                ? `/api/admin/transformations/${editingId}`
                : '/api/admin/transformations';

            const method = editingId ? 'PUT' : 'POST';

            const response = await authenticatedFetch(url, {
                method,
                body: JSON.stringify(formData)
            });

            const saved = await response.json();

            if (editingId) {
                setStories(prev => prev.map(t => t.id === editingId ? saved : t));
            } else {
                setStories(prev => [saved, ...prev]);
            }

            // Reset form
            setFormData({ name: '', age: '', location: '', storyTitle: '', story: '', avatar: '' });
            setEditingId(null);
        } catch (error) {
            console.error('Failed to save transformation story:', error);
        }
    };

    const startEdit = (story: TransformationStory) => {
        setFormData({
            name: story.name,
            age: story.age,
            location: story.location,
            storyTitle: story.storyTitle,
            story: story.story,
            avatar: story.avatar || ''
        });
        setEditingId(story.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const filteredStories = stories.filter(t => {
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
                        <h1 className="text-3xl font-bold text-gray-900">Transformation Stories Management</h1>
                        <p className="text-gray-600">Manage traveler transformation stories</p>
                    </div>
                </div>

                {/* Add/Edit Form */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
                    <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit' : 'Add New'} Transformation Story</h2>
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
                            placeholder="Age *"
                            value={formData.age}
                            onChange={e => setFormData({ ...formData, age: e.target.value })}
                            className="border p-2 rounded"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Location (e.g., Mumbai, India) *"
                            value={formData.location}
                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                            className="border p-2 rounded"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Story Title *"
                            value={formData.storyTitle}
                            onChange={e => setFormData({ ...formData, storyTitle: e.target.value })}
                            className="border p-2 rounded"
                            required
                        />
                        <textarea
                            placeholder="Transformation Story * (minimum 50 characters)"
                            value={formData.story}
                            onChange={e => setFormData({ ...formData, story: e.target.value })}
                            className="border p-2 rounded md:col-span-2"
                            rows={4}
                            required
                            minLength={50}
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
                                {editingId ? 'Update' : 'Add'} Story
                            </button>
                            {editingId && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingId(null);
                                        setFormData({ name: '', age: '', location: '', storyTitle: '', story: '', avatar: '' });
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
                            {f === 'pending' && ` (${stories.filter(t => !t.isApproved).length})`}
                        </button>
                    ))}
                </div>

                {/* Stories List */}
                <div className="space-y-4">
                    {filteredStories.map(story => (
                        <div key={story.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="font-bold text-lg">{story.name}</h3>
                                        <span className="text-sm text-gray-500">• Age {story.age}</span>
                                        {story.location && (
                                            <span className="text-sm text-gray-500">• {story.location}</span>
                                        )}
                                    </div>
                                    <p className="font-semibold text-green-primary mb-2">{story.storyTitle}</p>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="flex gap-2">
                                            {story.isApproved && (
                                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Approved</span>
                                            )}
                                            {!story.isApproved && (
                                                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">Pending</span>
                                            )}
                                            {story.isFeatured && (
                                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded flex items-center gap-1">
                                                    <Star className="w-3 h-3" /> Featured
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-gray-700 italic">"{story.story}"</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 mt-4 pt-4 border-t">
                                <button
                                    onClick={() => toggleApprove(story.id)}
                                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition ${story.isApproved
                                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                                        }`}
                                >
                                    {story.isApproved ? (
                                        <><X className="w-4 h-4" /> Unapprove</>
                                    ) : (
                                        <><Check className="w-4 h-4" /> Approve</>
                                    )}
                                </button>
                                <button
                                    onClick={() => toggleFeature(story.id)}
                                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition ${story.isFeatured
                                        ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    <Star className="w-4 h-4" />
                                    {story.isFeatured ? 'Unfeature' : 'Feature'}
                                </button>
                                <button
                                    onClick={() => startEdit(story)}
                                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                                >
                                    <Edit2 className="w-4 h-4" /> Edit
                                </button>
                                <button
                                    onClick={() => deleteStory(story.id)}
                                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition ml-auto"
                                >
                                    <Trash2 className="w-4 h-4" /> Delete
                                </button>
                            </div>
                        </div>
                    ))}

                    {filteredStories.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            No transformation stories found for this filter.
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
