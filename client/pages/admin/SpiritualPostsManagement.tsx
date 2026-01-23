import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Eye, EyeOff, Save, X } from "lucide-react";
import AdminLayout from "./AdminLayout";
import { authenticatedFetch } from "@/lib/api";
import ImageUpload from "@/components/ImageUpload";
import RichTextArea from "@/components/RichTextArea";

interface SpiritualPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    coverImage?: string;
    tags: string[];
    author: string;
    publishDate: string;
    isPublished: boolean;
    isFeatured: boolean;
    readTime?: string;
}

export default function SpiritualPostsManagement() {
    const [posts, setPosts] = useState<SpiritualPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingPost, setEditingPost] = useState<SpiritualPost | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        excerpt: "",
        content: "",
        coverImage: "",
        tags: [] as string[],
        author: "Eraya Team",
        isPublished: false,
        isFeatured: false,
        readTime: "",
    });
    const [tagInput, setTagInput] = useState("");

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await authenticatedFetch("/api/spiritual-posts/admin/all");
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
            coverImage: "",
            tags: [],
            author: "Eraya Team",
            isPublished: false,
            isFeatured: false,
            readTime: "",
        });
    };

    const handleEdit = (post: SpiritualPost) => {
        setEditingPost(post);
        setIsCreating(false);
        setFormData({
            title: post.title,
            excerpt: post.excerpt,
            content: post.content,
            coverImage: post.coverImage || "",
            tags: post.tags,
            author: post.author,
            isPublished: post.isPublished,
            isFeatured: post.isFeatured,
            readTime: post.readTime || "",
        });
    };

    const handleSave = async () => {
        try {
            const endpoint = editingPost
                ? `/api/spiritual-posts/admin/${editingPost.id}`
                : "/api/spiritual-posts/admin";

            const method = editingPost ? "PUT" : "POST";

            const response = await authenticatedFetch(endpoint, {
                method,
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert(editingPost ? "Post updated successfully!" : "Post created successfully!");
                setIsCreating(false);
                setEditingPost(null);
                fetchPosts();
            } else {
                const error = await response.json();
                alert(`Failed to save post: ${error.error}`);
            }
        } catch (error) {
            console.error("Failed to save post:", error);
            alert("Failed to save post");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this post?")) return;

        try {
            const response = await authenticatedFetch(`/api/spiritual-posts/admin/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                alert("Post deleted successfully!");
                fetchPosts();
            }
        } catch (error) {
            console.error("Failed to delete post:", error);
            alert("Failed to delete post");
        }
    };

    const handleTogglePublish = async (id: string) => {
        try {
            const response = await authenticatedFetch(`/api/spiritual-posts/admin/${id}/publish`, {
                method: "PATCH",
            });

            if (response.ok) {
                fetchPosts();
            }
        } catch (error) {
            console.error("Failed to toggle publish status:", error);
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
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg"
                                placeholder="Enter post title..."
                            />
                        </div>

                        {/* Excerpt */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                            <textarea
                                rows={3}
                                value={formData.excerpt}
                                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg"
                                placeholder="Brief summary of the post..."
                            />
                        </div>

                        {/* Content */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Content (Markdown supported)
                            </label>
                            <RichTextArea
                                name="content"
                                rows={15}
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                placeholder="Write your post content in Markdown..."
                            />
                        </div>

                        {/* Cover Image */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>

                            {/* Image Preview */}
                            {formData.coverImage && (
                                <div className="mb-3">
                                    <img
                                        src={formData.coverImage}
                                        alt="Cover preview"
                                        className="w-full max-w-md h-48 object-cover rounded-lg border"
                                    />
                                </div>
                            )}

                            {/* Upload Component */}
                            <ImageUpload
                                label=""
                                type="about"
                                subType="general"
                                currentImage={formData.coverImage}
                                onUploadComplete={(url) => setFormData({ ...formData, coverImage: url })}
                                helpText="Upload cover image (JPG, PNG, or WebP)"
                            />

                            <p className="text-xs text-gray-500 mt-3 mb-1">Or paste image URL:</p>
                            <input
                                type="url"
                                value={formData.coverImage}
                                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg"
                                placeholder="https://..."
                            />
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                                    className="flex-1 px-4 py-2 border rounded-lg"
                                    placeholder="Add a tag..."
                                />
                                <button
                                    onClick={handleAddTag}
                                    className="px-4 py-2 bg-green-primary text-white rounded-lg hover:bg-green-secondary"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="inline-flex items-center gap-1 px-3 py-1 bg-green-primary/10 text-green-primary rounded-full text-sm"
                                    >
                                        {tag}
                                        <button
                                            onClick={() => handleRemoveTag(tag)}
                                            className="hover:text-red-500"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Author & Read Time */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                                <input
                                    type="text"
                                    value={formData.author}
                                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
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
                                    placeholder="e.g., 5 min read"
                                />
                            </div>
                        </div>

                        {/* Checkboxes */}
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
                                    checked={formData.isFeatured}
                                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                                    className="w-4 h-4"
                                />
                                <span className="text-sm font-medium text-gray-700">Featured</span>
                            </label>
                        </div>

                        {/* Save Button */}
                        <div className="flex justify-end">
                            <button
                                onClick={handleSave}
                                className="flex items-center px-6 py-3 bg-green-primary text-white rounded-lg hover:bg-green-secondary transition"
                            >
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
                        <h1 className="text-3xl font-bold text-gray-900">Spiritual Insights</h1>
                        <p className="text-gray-600">Manage your spiritual blog posts</p>
                    </div>
                    <button
                        onClick={handleCreate}
                        className="flex items-center px-4 py-2 bg-green-primary text-white rounded-lg hover:bg-green-secondary transition"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        New Post
                    </button>
                </div>

                {posts.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border">
                        <p className="text-gray-500">No posts yet. Create your first spiritual insight!</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Title</th>
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
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium w-fit ${post.isPublished ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                                                    }`}>
                                                    {post.isPublished ? "Published" : "Draft"}
                                                </span>
                                                {post.isFeatured && (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 w-fit">
                                                        Featured
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
                                                    onClick={() => handleEdit(post)}
                                                    className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(post.id)}
                                                    className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
                                                    title="Delete"
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
