import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Calendar, Clock, User, ArrowLeft, Tag, Share2 } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

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
    readTime?: string;
}

export default function SpiritualPostDetail() {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [post, setPost] = useState<SpiritualPost | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug) return;

        fetch(`${API_BASE_URL}/api/spiritual-posts/${slug}`)
            .then((res) => {
                if (!res.ok) throw new Error("Post not found");
                return res.json();
            })
            .then((data) => {
                setPost(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch post:", err);
                setLoading(false);
            });
    }, [slug]);

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: post?.title,
                text: post?.excerpt,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-beige flex flex-col">
                <NavBar />
                <div className="flex-grow flex items-center justify-center">
                    <p className="text-gray-500">Loading...</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-beige flex flex-col">
                <NavBar />
                <div className="flex-grow flex flex-col items-center justify-center px-4">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Post Not Found</h1>
                    <p className="text-gray-600 mb-8">The spiritual insight you're looking for doesn't exist.</p>
                    <button
                        onClick={() => navigate("/spiritual-insights")}
                        className="flex items-center gap-2 px-6 py-3 bg-green-primary text-white rounded-lg hover:bg-green-secondary transition"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Insights
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-beige flex flex-col">
            <Helmet>
                <title>{post.title} - Eraya Wellness Travels</title>
                <meta name="description" content={post.excerpt} />
                <meta property="og:title" content={post.title} />
                <meta property="og:description" content={post.excerpt} />
                {post.coverImage && <meta property="og:image" content={post.coverImage} />}
                <meta property="og:type" content="article" />
            </Helmet>

            <NavBar />

            <div className="flex-grow">
                {/* Header */}
                <div className="bg-white border-b">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <button
                            onClick={() => navigate("/spiritual-insights")}
                            className="flex items-center gap-2 text-green-primary hover:text-green-secondary mb-6 transition"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Insights
                        </button>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-text-dark mb-4 leading-tight">
                                {post.title}
                            </h1>

                            <p className="text-lg text-text-dark/70 mb-6">{post.excerpt}</p>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                <span className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    {post.author}
                                </span>
                                <span className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(post.publishDate).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </span>
                                {post.readTime && (
                                    <span className="flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        {post.readTime}
                                    </span>
                                )}
                                <button
                                    onClick={handleShare}
                                    className="flex items-center gap-2 ml-auto text-green-primary hover:text-green-secondary transition"
                                >
                                    <Share2 className="w-4 h-4" />
                                    Share
                                </button>
                            </div>

                            {post.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {post.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="inline-flex items-center gap-1 px-3 py-1 bg-green-primary/10 text-green-primary rounded-full text-sm"
                                        >
                                            <Tag className="w-3 h-3" />
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>

                {/* Cover Image */}
                {post.coverImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
                    >
                        <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
                            <img
                                src={post.coverImage}
                                alt={post.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </motion.div>
                )}

                {/* Content */}
                <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
                >
                    <div className="prose prose-lg prose-green max-w-none">
                        <ReactMarkdown
                            components={{
                                h1: ({ node, ...props }) => (
                                    <h1 className="text-3xl font-bold text-green-primary mt-8 mb-4" {...props} />
                                ),
                                h2: ({ node, ...props }) => (
                                    <h2 className="text-2xl font-bold text-text-dark mt-8 mb-4" {...props} />
                                ),
                                h3: ({ node, ...props }) => (
                                    <h3 className="text-xl font-semibold text-text-dark mt-6 mb-3" {...props} />
                                ),
                                p: ({ node, ...props }) => (
                                    <p className="text-text-dark/80 leading-relaxed mb-4" {...props} />
                                ),
                                ul: ({ node, ...props }) => (
                                    <ul className="list-disc list-inside space-y-2 mb-6 text-text-dark/80" {...props} />
                                ),
                                ol: ({ node, ...props }) => (
                                    <ol className="list-decimal list-inside space-y-2 mb-6 text-text-dark/80" {...props} />
                                ),
                                li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
                                blockquote: ({ node, ...props }) => (
                                    <blockquote
                                        className="border-l-4 border-green-primary pl-4 italic text-text-dark/70 my-6"
                                        {...props}
                                    />
                                ),
                                code: ({ node, inline, ...props }: any) =>
                                    inline ? (
                                        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono" {...props} />
                                    ) : (
                                        <code
                                            className="block bg-gray-100 p-4 rounded-lg text-sm font-mono overflow-x-auto"
                                            {...props}
                                        />
                                    ),
                                a: ({ node, ...props }) => (
                                    <a className="text-green-primary hover:text-green-secondary underline" {...props} />
                                ),
                            }}
                        >
                            {post.content}
                        </ReactMarkdown>
                    </div>
                </motion.article>

                {/* Reflection / CTA */}
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-gradient-to-r from-green-primary/10 to-blue-accent/10 rounded-xl p-8 text-center border border-green-primary/20">
                        <h3 className="text-2xl font-bold text-text-dark mb-4">
                            Ready to Experience This Journey?
                        </h3>
                        <p className="text-text-dark/70 mb-6">
                            Transform your life through authentic spiritual experiences
                        </p>
                        <button
                            onClick={() => navigate("/contact")}
                            className="px-8 py-3 bg-green-primary text-white rounded-lg hover:bg-green-secondary transition font-bold"
                        >
                            Connect With Us
                        </button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
