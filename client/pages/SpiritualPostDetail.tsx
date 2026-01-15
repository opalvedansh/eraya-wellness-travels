import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Calendar, Clock, User, ArrowLeft, Tag, Share2, Sparkles, Heart, Sun, Moon } from "lucide-react";
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

// Floating decorative elements
function FloatingLotus() {
    return (
        <div className="fixed pointer-events-none z-0">
            <motion.div
                animate={{
                    y: [0, -20, 0],
                    rotate: [0, 5, 0],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute top-20 right-10 opacity-5"
            >
                <Sparkles className="w-32 h-32 text-purple-400" />
            </motion.div>
            <motion.div
                animate={{
                    y: [0, 20, 0],
                    rotate: [0, -5, 0],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute bottom-40 left-10 opacity-5"
            >
                <Sun className="w-40 h-40 text-amber-400" />
            </motion.div>
        </div>
    );
}

// Reading Progress
function ZenProgressBar() {
    const { scrollYProgress } = useScroll();
    const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 via-amber-400 to-green-400 origin-left z-50"
            style={{ scaleX }}
        />
    );
}

export default function SpiritualPostDetail() {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [post, setPost] = useState<SpiritualPost | null>(null);
    const [loading, setLoading] = useState(true);
    const { scrollY } = useScroll();
    const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
    const heroY = useTransform(scrollY, [0, 300], [0, 100]);

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
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-amber-50 to-green-50 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="inline-block"
                    >
                        <Sparkles className="w-12 h-12 text-purple-600 mb-4" />
                    </motion.div>
                    <p className="text-lg text-purple-800 font-medium">Loading spiritual insight...</p>
                </motion.div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-amber-50 to-green-50 flex flex-col">
                <NavBar />
                <div className="flex-grow flex flex-col items-center justify-center px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <h1 className="text-4xl font-black text-gray-900 mb-4">Insight Not Found</h1>
                        <p className="text-gray-600 mb-8 text-lg">The spiritual insight you seek is elsewhere.</p>
                        <button
                            onClick={() => navigate("/spiritual-insights")}
                            className="px-8 py-3.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-bold hover:from-purple-700 hover:to-purple-800 transition-all transform hover:scale-105 shadow-xl"
                        >
                            Return to Insights
                        </button>
                    </motion.div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-amber-50 to-green-50 relative overflow-hidden">
            <Helmet>
                <title>{post.title} - Eraya Wellness Travels</title>
                <meta name="description" content={post.excerpt} />
                <meta property="og:title" content={post.title} />
                <meta property="og:description" content={post.excerpt} />
                {post.coverImage && <meta property="og:image" content={post.coverImage} />}
                <meta property="og:type" content="article" />
            </Helmet>

            <FloatingLotus />
            <ZenProgressBar />
            <NavBar />

            {/* Hero Section with Zen Aesthetics */}
            <motion.div
                style={{ opacity: heroOpacity, y: heroY }}
                className="relative min-h-[80vh] flex items-center justify-center overflow-hidden"
            >
                {post.coverImage && (
                    <>
                        <div className="absolute inset-0">
                            <img
                                src={post.coverImage}
                                alt={post.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-purple-900/60 via-purple-900/40 to-transparent" />
                        </div>
                    </>
                )}

                <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-12 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                    >
                        {/* Decorative Icon */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, type: "spring" }}
                            className="inline-block mb-6"
                        >
                            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-amber-400 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
                                <Sparkles className="w-10 h-10 text-white" />
                            </div>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight drop-shadow-2xl"
                        >
                            {post.title}
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="text-xl text-white/90 mb-8 leading-relaxed max-w-2xl mx-auto drop-shadow-lg"
                        >
                            {post.excerpt}
                        </motion.p>

                        {/* Meta Info */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.9 }}
                            className="flex items-center justify-center gap-6 text-white/80 text-sm flex-wrap"
                        >
                            <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full">
                                <User className="w-4 h-4" />
                                {post.author}
                            </span>
                            <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full">
                                <Calendar className="w-4 h-4" />
                                {new Date(post.publishDate).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </span>
                            {post.readTime && (
                                <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full">
                                    <Clock className="w-4 h-4" />
                                    {post.readTime}
                                </span>
                            )}
                        </motion.div>

                        {/* Tags */}
                        {post.tags.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.1 }}
                                className="flex flex-wrap gap-2 mt-6 justify-center"
                            >
                                {post.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-4 py-1.5 bg-white/20 backdrop-blur-md text-white rounded-full text-sm font-medium"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </motion.div>
                        )}
                    </motion.div>
                </div>

                {/* Back Button */}
                <div className="absolute top-24 left-8">
                    <motion.button
                        onClick={() => navigate("/spiritual-insights")}
                        whileHover={{ x: -4 }}
                        className="flex items-center gap-2 text-white font-semibold bg-white/10 backdrop-blur-md px-5 py-3 rounded-full hover:bg-white/20 transition-all shadow-xl"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span className="hidden sm:inline">Back</span>
                    </motion.button>
                </div>

                {/* Share Button */}
                <div className="absolute top-24 right-8">
                    <motion.button
                        onClick={handleShare}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 text-white font-semibold bg-white/10 backdrop-blur-md p-3 rounded-full hover:bg-white/20 transition-all shadow-xl"
                    >
                        <Share2 className="h-5 w-5" />
                    </motion.button>
                </div>
            </motion.div>

            {/* Content Section */}
            <motion.article
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl mx-auto px-6 lg:px-12 -mt-20 relative z-20 pb-20"
            >
                {/* Content Card with Glassmorphism */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-100 overflow-hidden">
                    <div className="p-8 sm:p-12 lg:p-16">
                        {/* Decorative Line */}
                        <div className="flex items-center gap-4 mb-12">
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-300 to-transparent" />
                            <Sparkles className="w-6 h-6 text-purple-600" />
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-300 to-transparent" />
                        </div>

                        {/* Content */}
                        <div className="prose prose-lg prose-purple max-w-none">
                            <ReactMarkdown
                                components={{
                                    h1: ({ node, ...props }) => (
                                        <h1 className="text-4xl font-black text-gray-900 mt-12 mb-6 leading-tight" {...props} />
                                    ),
                                    h2: ({ node, ...props }) => (
                                        <h2 className="text-3xl font-black text-gray-900 mt-10 mb-5 leading-tight" {...props} />
                                    ),
                                    h3: ({ node, ...props }) => (
                                        <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4" {...props} />
                                    ),
                                    p: ({ node, ...props }) => (
                                        <p className="text-gray-700 leading-relaxed mb-6 text-lg first-letter:text-6xl first-letter:font-black first-letter:text-purple-600 first-letter:float-left first-letter:mr-3 first-letter:leading-none first-letter:mt-1" {...props} />
                                    ),
                                    ul: ({ node, ...props }) => (
                                        <ul className="space-y-3 mb-8 text-gray-700" {...props} />
                                    ),
                                    ol: ({ node, ...props }) => (
                                        <ol className="space-y-3 mb-8 text-gray-700" {...props} />
                                    ),
                                    li: ({ node, ...props }) => (
                                        <li className="leading-relaxed flex items-start gap-3">
                                            <span className="text-purple-600 mt-2">✦</span>
                                            <span {...props} />
                                        </li>
                                    ),
                                    blockquote: ({ node, ...props }) => (
                                        <blockquote
                                            className="relative border-l-4 border-purple-400 pl-8 pr-6 py-6 my-8 bg-gradient-to-r from-purple-50 to-transparent rounded-r-xl"
                                            {...props}
                                        >
                                            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-purple-400 rounded-full flex items-center justify-center">
                                                <Heart className="w-3 h-3 text-white" />
                                            </div>
                                        </blockquote>
                                    ),
                                    code: ({ node, inline, ...props }: any) =>
                                        inline ? (
                                            <code className="bg-purple-100 text-purple-900 px-2 py-1 rounded text-sm font-mono" {...props} />
                                        ) : (
                                            <code
                                                className="block bg-gray-100 p-6 rounded-xl text-sm font-mono overflow-x-auto border border-gray-200"
                                                {...props}
                                            />
                                        ),
                                    a: ({ node, ...props }) => (
                                        <a className="text-purple-600 hover:text-purple-800 underline decoration-2 decoration-purple-300 hover:decoration-purple-500 transition-colors" {...props} />
                                    ),
                                }}
                            >
                                {post.content}
                            </ReactMarkdown>
                        </div>

                        {/* Decorative Line */}
                        <div className="flex items-center gap-4 mt-12">
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-300 to-transparent" />
                            <Sun className="w-6 h-6 text-amber-600" />
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-300 to-transparent" />
                        </div>
                    </div>

                    {/* Author & CTA Section */}
                    <div className="bg-gradient-to-br from-purple-100 via-amber-50 to-green-100 p-8 sm:p-12">
                        <div className="text-center max-w-2xl mx-auto">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                viewport={{ once: true }}
                            >
                                <Sparkles className="w-10 h-10 text-purple-600 mx-auto mb-4" />
                                <h3 className="text-3xl font-black text-gray-900 mb-4">
                                    Ready to Begin Your Journey?
                                </h3>
                                <p className="text-gray-700 mb-8 text-lg leading-relaxed">
                                    Transform your life through authentic spiritual experiences in the heart of the Himalayas.
                                </p>
                                <button
                                    onClick={() => navigate("/contact")}
                                    className="px-10 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-full hover:from-purple-700 hover:to-purple-800 transition-all font-bold text-lg shadow-xl transform hover:scale-105"
                                >
                                    Connect With Us
                                </button>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </motion.article>

            <Footer />
        </div>
    );
}
