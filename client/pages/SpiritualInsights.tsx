import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import { Clock, Tag, Calendar } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

interface SpiritualPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    coverImage?: string;
    tags: string[];
    author: string;
    publishDate: string;
    readTime?: string;
    isFeatured: boolean;
}

export default function SpiritualInsights() {
    const navigate = useNavigate();
    const [posts, setPosts] = useState<SpiritualPost[]>([]);
    const [featuredPosts, setFeaturedPosts] = useState<SpiritualPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    useEffect(() => {
        // Fetch featured posts
        fetch(`${API_BASE_URL}/api/spiritual-posts?featured=true&limit=3`)
            .then((res) => res.json())
            .then((data) => setFeaturedPosts(data.posts || []))
            .catch((err) => console.error("Failed to fetch featured posts:", err));

        // Fetch all posts
        fetch(`${API_BASE_URL}/api/spiritual-posts?limit=20`)
            .then((res) => res.json())
            .then((data) => {
                setPosts(data.posts || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch posts:", err);
                setLoading(false);
            });
    }, []);

    // Get all unique tags
    const allTags = Array.from(new Set(posts.flatMap((post) => post.tags)));

    // Filter posts by selected tag
    const filteredPosts = selectedTag
        ? posts.filter((post) => post.tags.includes(selectedTag))
        : posts;

    return (
        <div className="min-h-screen bg-beige flex flex-col">
            {/* Hero Banner */}
            <PageHero
                title="Spiritual Insights"
                subtitle="Journey inward through wisdom, reflection, and transformative experiences"
                backgroundImage="/spiritual-insights-hero.jpeg"
            />

            {/* Main Content */}
            <div className="flex-grow">
                {/* Featured Posts */}
                {featuredPosts.length > 0 && (
                    <section className="py-8 sm:py-12 lg:py-16 px-3 sm:px-6 lg:px-12 max-w-7xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-green-primary mb-6 sm:mb-9">
                            Featured Insights
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredPosts.map((post) => (
                                <motion.div
                                    key={post.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all cursor-pointer border border-border group"
                                    onClick={() => navigate(`/spiritual-insights/${post.slug}`)}
                                >
                                    {post.coverImage && (
                                        <div className="h-48 overflow-hidden">
                                            <img
                                                src={post.coverImage}
                                                alt={post.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    )}
                                    <div className="p-5">
                                        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(post.publishDate).toLocaleDateString()}
                                            </span>
                                            {post.readTime && (
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {post.readTime}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-lg font-bold text-text-dark mb-2 group-hover:text-green-primary transition">
                                            {post.title}
                                        </h3>
                                        <p className="text-sm text-text-dark/70 mb-4 line-clamp-2">
                                            {post.excerpt}
                                        </p>
                                        {post.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {post.tags.slice(0, 3).map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="px-2 py-1 bg-green-primary/10 text-green-primary text-xs rounded-full"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Tag Filter */}
                {allTags.length > 0 && (
                    <section className="py-6 px-3 sm:px-6 lg:px-12 max-w-7xl mx-auto">
                        <div className="flex items-center gap-2 flex-wrap">
                            <Tag className="w-4 h-4 text-gray-500" />
                            <button
                                onClick={() => setSelectedTag(null)}
                                className={`px-3 py-1 rounded-full text-sm transition ${selectedTag === null
                                    ? "bg-green-primary text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                All
                            </button>
                            {allTags.map((tag) => (
                                <button
                                    key={tag}
                                    onClick={() => setSelectedTag(tag)}
                                    className={`px-3 py-1 rounded-full text-sm transition ${selectedTag === tag
                                        ? "bg-green-primary text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </section>
                )}

                {/* All Posts Grid */}
                <section className="py-8 sm:py-12 lg:py-16 px-3 sm:px-6 lg:px-12 max-w-7xl mx-auto">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-green-primary mb-6 sm:mb-9">
                        {selectedTag ? `Posts about "${selectedTag}"` : "All Insights"}
                    </h2>

                    {loading ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500">Loading spiritual insights...</p>
                        </div>
                    ) : filteredPosts.length === 0 ? (
                        <div className="text-center py-12 bg-card rounded-lg border">
                            <p className="text-gray-500">
                                {selectedTag
                                    ? `No posts found with tag "${selectedTag}"`
                                    : "No posts published yet. Check back soon!"}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredPosts.map((post, index) => (
                                <motion.div
                                    key={post.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all cursor-pointer border border-border group"
                                    onClick={() => navigate(`/spiritual-insights/${post.slug}`)}
                                >
                                    {post.coverImage && (
                                        <div className="h-40 overflow-hidden">
                                            <img
                                                src={post.coverImage}
                                                alt={post.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    )}
                                    <div className="p-5">
                                        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(post.publishDate).toLocaleDateString()}
                                            </span>
                                            {post.readTime && (
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {post.readTime}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-lg font-bold text-text-dark mb-2 group-hover:text-green-primary transition">
                                            {post.title}
                                        </h3>
                                        <p className="text-sm text-text-dark/70 mb-4 line-clamp-3">
                                            {post.excerpt}
                                        </p>
                                        {post.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {post.tags.slice(0, 2).map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="px-2 py-1 bg-green-primary/10 text-green-primary text-xs rounded-full"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                                {post.tags.length > 2 && (
                                                    <span className="px-2 py-1 text-gray-500 text-xs">
                                                        +{post.tags.length - 2}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </section>

                {/* CTA Banner */}
                <section className="py-12 sm:py-16 lg:py-20 px-3 sm:px-6 lg:px-12 bg-gradient-to-r from-green-primary to-green-primary/80 text-white">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-4">
                            Begin Your Spiritual Journey
                        </h2>
                        <p className="text-sm sm:text-base lg:text-lg mb-8 text-white/90">
                            Discover inner peace and wisdom through our carefully curated spiritual experiences
                        </p>
                        <button
                            onClick={() => navigate("/contact")}
                            className="bg-white hover:bg-gray-100 text-green-primary font-bold px-6 sm:px-8 py-3 rounded-lg transition-colors"
                        >
                            Connect With Us
                        </button>
                    </div>
                </section>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
}
