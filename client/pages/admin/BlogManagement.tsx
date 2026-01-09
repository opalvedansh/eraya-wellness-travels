import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Eye, EyeOff, Save, X, Star } from "lucide-react";
import AdminLayout from "./AdminLayout";
import { authenticatedFetch } from "@/lib/api";
import ImageUpload from "@/components/ImageUpload";

interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    featuredImage?: string;
    category: string;
    tags: string[];
    authorName: string;
    authorAvatar?: string;
    authorBio?: string;
    publishDate: string;
    readTime?: string;
    featured: boolean;
    isPublished: boolean;
}

const categories = [
    "Travel Tips",
    "Wellness Tips",
    "Cultural Insights",
    "Adventure Stories",
    "Spiritual Journey",
    "Local Cuisine",
];

export default function BlogManagement() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        excerpt: "",
        content: "",
        featuredImage: "",
        category: "Travel Tips",
        tags: [] as string[],
        authorName: "Eraya Team",
        authorAvatar: "",
        authorBio: "",
        readTime: "",
        featured: false,
        isPublished: false,
    });
    const [tagInput, setTagInput] = useState("");

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await authenticatedFetch("/api/blog-posts/admin/all");
            if (response.ok) {
                const data = await response.json();
                setPosts(data);
            }
        } catch (error) {
            console.error("Failed to fetch posts:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setIsCreating(true);
        setEditingPost(null);
        setFormData({
            title: "",
            excerpt: "",
            content: "",
            featuredImage: "",
            category: "Travel Tips",
            tags: [],
            authorName: "Eraya Team",
            authorAvatar: "",
            authorBio: "",
            readTime: "",
            featured: false,
            isPublished: false,
        });
    };

    const handleEdit = (post: BlogPost) => {
        setEditingPost(post);
        setIsCreating(false);
        setFormData({
            title: post.title,
            excerpt: post.excerpt,
            content: post.content,
            featuredImage: post.featuredImage || "",
            category: post.category,
            tags: post.tags,
            authorName: post.authorName,
            authorAvatar: post.authorAvatar || "",
            authorBio: post.authorBio || "",
            readTime: post.readTime || "",
            featured: post.featured,
            isPublished: post.isPublished,
        });
    };

    const handleSave = async () => {
        try {
            const endpoint = editingPost
                ? `/api/blog-posts/admin/${editingPost.id}`
                : "/api/blog-posts/admin";

            const method = editingPost ? "PUT" : "POST";

            const response = await authenticatedFetch(endpoint, {
                method,
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert(editingPost ? "Post updated!" : "Post created!");
                setIsCreating(false);
                setEditingPost(null);
                fetchPosts();
            } else {
                const error = await response.json();
                alert(`Failed: ${error.error}`);
            }
        } catch (error) {
            console.error("Failed to save post:", error);
            alert("Failed to save post");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this post?")) return;

        try {
            const response = await authenticatedFetch(`/api/blog-posts/admin/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                alert("Post deleted!");
                fetchPosts();
            }
        } catch (error) {
            console.error("Failed to delete:", error);
        }
    };

    const handleTogglePublish = async (id: string) => {
        try {
            const response = await authenticatedFetch(`/api/blog-posts/admin/${id}/publish`, {
                method: "PATCH",
            });
            if (response.ok) fetchPosts();
        } catch (error) {
            console.error("Failed to toggle publish:", error);
        }
    };

    const handleToggleFeatured = async (id: string) => {
        try {
            const response = await authenticatedFetch(`/api/blog-posts/admin/${id}/feature`, {
                method: "PATCH",
            });
            if (response.ok) fetchPosts();
        } catch (error) {
            console.error("Failed to toggle featured:", error);
        }
    };

    const handleAddTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
            setTagInput("");
        }
    };

    const handleRemoveTag = (tag: string) => {
        setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="p-8 text-center">Loading...</div>
            </AdminLayout>
        );
    }

    if (isCreating || editingPost) {
        return (
            <AdminLayout>
                <div className="p-6 max-w-5xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">
                            {editingPost ? "Edit Post" : "Create New Post"}
                        </h1>
                        <button
                            onClick={() => { setIsCreating(false); setEditingPost(null); }}
                            className="flex items-center px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-50"
                        >
                            <X className="w-5 h-5 mr-2" />
                            Cancel
                        </button>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                            <textarea
                                rows={3}
                                value={formData.excerpt}
                                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Content (Markdown)</label>
                            <textarea
                                rows={15}
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg font-mono text-sm"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image</label>

                                {/* Image Preview */}
                                {formData.featuredImage && (
                                    <div className="mb-3">
                                        <img
                                            src={formData.featuredImage}
                                            alt="Featured image preview"
                                            className="w-full max-w-md h-48 object-cover rounded-lg border"
                                        />
                                    </div>
                                )}

                                {/* Upload Component */}
                                <ImageUpload
                                    label=""
                                    type="about"
                                    subType="general"
                                    currentImage={formData.featuredImage}
                                    onUploadComplete={(url) => setFormData({ ...formData, featuredImage: url })}
                                    helpText="Upload featured image (JPG, PNG, or WebP)"
                                />

                                <p className="text-xs text-gray-500 mt-3 mb-1">Or paste image URL:</p>
                                <input
                                    type="url"
                                    value={formData.featuredImage}
                                    onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    placeholder="https://..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                >
                                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                                    className="flex-1 px-4 py-2 border rounded-lg"
                                />
                                <button onClick={handleAddTag} className="px-4 py-2 bg-green-primary text-white rounded-lg">
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.tags.map((tag) => (
                                    <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-green-primary/10 text-green-primary rounded-full text-sm">
                                        {tag}
                                        <button onClick={() => handleRemoveTag(tag)} className="hover:text-red-500">×</button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Author Name</label>
                                <input
                                    type="text"
                                    value={formData.authorName}
                                    onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Author Avatar URL</label>
                                <input
                                    type="url"
                                    value={formData.authorAvatar}
                                    onChange={(e) => setFormData({ ...formData, authorAvatar: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Read Time</label>
                                <input
                                    type="text"
                                    value={formData.readTime}
                                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    placeholder="5 min read"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Author Bio</label>
                            <textarea
                                rows={2}
                                value={formData.authorBio}
                                onChange={(e) => setFormData({ ...formData, authorBio: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg"
                            />
                        </div>

                        <div className="flex gap-6">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.isPublished}
                                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                                    className="w-4 h-4"
                                />
                                <span className="text-sm font-medium text-gray-700">Published</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.featured}
                                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                    className="w-4 h-4"
                                />
                                <span className="text-sm font-medium text-gray-700">Featured</span>
                            </label>
                        </div>

                        <div className="flex justify-end">
                            <button onClick={handleSave} className="flex items-center px-6 py-3 bg-green-primary text-white rounded-lg hover:bg-green-secondary">
                                <Save className="w-5 h-5 mr-2" />
                                Save Post
                            </button>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
                        <p className="text-gray-600">Manage your blog content</p>
                    </div>
                    <button onClick={handleCreate} className="flex items-center px-4 py-2 bg-green-primary text-white rounded-lg hover:bg-green-secondary">
                        <Plus className="w-5 h-5 mr-2" />
                        New Post
                    </button>
                </div>

                {posts.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border">
                        <p className="text-gray-500">No posts yet. Create your first blog post!</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Title</th>
                                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Category</th>
                                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Status</th>
                                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Date</th>
                                    <th className="text-right px-6 py-3 text-sm font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {posts.map((post) => (
                                    <tr key={post.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="font-medium text-gray-900">{post.title}</div>
                                                <div className="text-sm text-gray-500 line-clamp-1">{post.excerpt}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{post.category}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium w-fit ${post.isPublished ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                                                    }`}>
                                                    {post.isPublished ? "Published" : "Draft"}
                                                </span>
                                                {post.featured && (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 w-fit">
                                                        <Star className="w-3 h-3 mr-1" /> Featured
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(post.publishDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleTogglePublish(post.id)}
                                                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                                                    title={post.isPublished ? "Unpublish" : "Publish"}
                                                >
                                                    {post.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                                <button
                                                    onClick={() => handleToggleFeatured(post.id)}
                                                    className={`p-2 hover:bg-yellow-50 rounded ${post.featured ? "text-yellow-600" : "text-gray-400"}`}
                                                    title="Toggle Featured"
                                                >
                                                    <Star className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(post)}
                                                    className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(post.id)}
                                                    className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
