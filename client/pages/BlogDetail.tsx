import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Footer from "@/components/Footer";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton";
import {
    ArrowLeft,
    Clock,
    Calendar,
    User,
    Share2,
    Facebook,
    Twitter,
    Linkedin,
    Copy,
    Check,
    ChevronLeft,
    ChevronRight,
    BookOpen,
    Heart,
    MessageCircle,
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

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
}

// Floating Share Panel
function FloatingSharePanel({ post }: { post: BlogPost }) {
    const [copied, setCopied] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const url = window.location.href;

    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > 400);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareButtons = [
        {
            icon: Facebook,
            color: "bg-blue-600 hover:bg-blue-700",
            onClick: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank")
        },
        {
            icon: Twitter,
            color: "bg-sky-500 hover:bg-sky-600",
            onClick: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(url)}`, "_blank")
        },
        {
            icon: Linkedin,
            color: "bg-blue-700 hover:bg-blue-800",
            onClick: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank")
        },
        {
            icon: copied ? Check : Copy,
            color: "bg-gray-600 hover:bg-gray-700",
            onClick: copyToClipboard
        },
    ];

    return (
        <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: isVisible ? 0 : -100, opacity: isVisible ? 1 : 0 }}
            className="fixed left-8 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3"
        >
            <div className="bg-white rounded-full shadow-xl p-2 flex flex-col gap-2 border border-gray-200">
                {shareButtons.map((button, idx) => (
                    <button
                        key={idx}
                        onClick={button.onClick}
                        className={`${button.color} p-3 rounded-full text-white transition-all transform hover:scale-110`}
                        aria-label="Share"
                    >
                        <button.icon className="h-4 w-4" />
                    </button>
                ))}
            </div>
        </motion.div>
    );
}

// Reading Progress Bar with blur effect
function ReadingProgressBar() {
    const { scrollYProgress } = useScroll();
    const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-primary via-blue-accent to-purple-600 origin-left z-50"
            style={{ scaleX }}
        />
    );
}

// Enhanced Related Posts Carousel with 3D Effect
function RelatedPostsCarousel({ posts }: { posts: BlogPost[] }) {
    const navigate = useNavigate();
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: "start" });

    return (
        <div className="relative">
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex gap-6">
                    {posts.map((post, idx) => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0"
                        >
                            <div
                                onClick={() => navigate(`/blog/${post.slug}`)}
                                className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 flex flex-col h-full"
                            >
                                <div className="relative h-52 overflow-hidden">
                                    <img
                                        src={post.featuredImage}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="absolute top-4 left-4">
                                        <span className="inline-block px-4 py-1.5 bg-green-primary text-white text-xs font-bold rounded-full shadow-lg">
                                            {post.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6 flex flex-col flex-grow">
                                    <h3 className="font-black text-gray-900 text-xl mb-3 line-clamp-2 group-hover:text-green-primary transition-colors">
                                        {post.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow leading-relaxed">
                                        {post.excerpt}
                                    </p>
                                    <div className="flex items-center gap-3 text-xs text-gray-500 pt-4 border-t border-gray-100">
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-3.5 w-3.5" />
                                            <span>{post.readTime}</span>
                                        </div>
                                        <span>•</span>
                                        <span>{new Date(post.publishDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function BlogDetail() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll();
    const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
    const heroScale = useTransform(scrollY, [0, 300], [1, 1.1]);

    useEffect(() => {
        if (!slug) return;

        fetch(`${API_BASE_URL}/api/blog-posts/${slug}`)
            .then(res => {
                if (!res.ok) throw new Error("Not found");
                return res.json();
            })
            .then(data => {
                setPost(data);
                return fetch(`${API_BASE_URL}/api/blog-posts/category/${data.category}`);
            })
            .then(res => res.json())
            .then(data => {
                setRelatedPosts(data.filter((p: BlogPost) => p.slug !== slug).slice(0, 3));
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch post:", err);
                setLoading(false);
            });
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 mx-auto mb-6"></div>
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-primary absolute top-0 left-1/2 -translate-x-1/2"></div>
                    </div>
                    <p className="text-lg text-gray-600 font-semibold">Loading article...</p>
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-beige flex flex-col">
                <FloatingWhatsAppButton />
                <div className="flex-grow flex items-center justify-center px-4 py-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <h1 className="text-4xl font-black text-gray-900 mb-4">Article Not Found</h1>
                        <p className="text-gray-600 mb-8 text-lg">The article you're looking for doesn't exist.</p>
                        <button
                            onClick={() => navigate("/blog")}
                            className="bg-green-primary hover:bg-green-600 text-white font-bold px-8 py-3.5 rounded-xl transition-all transform hover:scale-105 shadow-lg"
                        >
                            Back to Blog
                        </button>
                    </motion.div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            <FloatingWhatsAppButton />
            <ReadingProgressBar />
            <FloatingSharePanel post={post} />

            {/* Hero Section with Parallax */}
            <motion.div
                ref={heroRef}
                style={{ opacity: heroOpacity }}
                className="relative h-[70vh] overflow-hidden"
            >
                <motion.div
                    style={{ scale: heroScale }}
                    className="absolute inset-0"
                >
                    <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                </motion.div>

                {/* Hero Content */}
                <div className="absolute inset-0 flex items-end">
                    <div className="container mx-auto px-6 lg:px-12 pb-16 max-w-5xl">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="mb-4">
                                <span className="inline-block px-5 py-2 bg-green-primary text-white text-sm font-bold rounded-full shadow-xl">
                                    {post.category}
                                </span>
                            </div>
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight drop-shadow-2xl">
                                {post.title}
                            </h1>
                            <p className="text-xl text-white/90 mb-6 leading-relaxed max-w-3xl drop-shadow-lg">
                                {post.excerpt}
                            </p>

                            {/* Author Info */}
                            <div className="flex items-center gap-4">
                                <img
                                    src={post.authorAvatar || "/default-avatar.png"}
                                    alt={post.authorName}
                                    className="w-14 h-14 rounded-full border-4 border-white shadow-xl"
                                />
                                <div>
                                    <p className="font-bold text-white text-lg">{post.authorName}</p>
                                    <div className="flex items-center gap-3 text-white/80 text-sm">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            {new Date(post.publishDate).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' })}
                                        </span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            {post.readTime}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Back Button */}
                <div className="absolute top-8 left-8">
                    <motion.button
                        onClick={() => navigate("/blog")}
                        whileHover={{ x: -4 }}
                        className="flex items-center gap-2 text-white font-semibold bg-black/30 backdrop-blur-md px-5 py-3 rounded-full hover:bg-black/50 transition-all shadow-xl"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span className="hidden sm:inline">Back to Blog</span>
                    </motion.button>
                </div>
            </motion.div>

            {/* Article Content */}
            <article className="container mx-auto px-6 lg:px-12 -mt-32 relative z-10 pb-20 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-3xl shadow-2xl overflow-hidden"
                >
                    {/* Content */}
                    <div className="p-8 sm:p-12 lg:p-16">
                        {/* Drop Cap Paragraph */}
                        <div
                            className="prose prose-lg max-w-none mb-8
                                first-letter:text-7xl first-letter:font-black first-letter:text-green-primary 
                                first-letter:float-left first-letter:mr-3 first-letter:leading-none first-letter:mt-1
                                text-gray-700 leading-relaxed"
                            dangerouslySetInnerHTML={{
                                __html: post.content
                                    .replace(/\n/g, '<br/>')
                                    .replace(/^# (.+)$/gm, '<h2 class="text-4xl font-black text-gray-900 mt-12 mb-6 leading-tight">$1</h2>')
                                    .replace(/^## (.+)$/gm, '<h3 class="text-3xl font-black text-gray-900 mt-10 mb-5 leading-tight">$1</h3>')
                                    .replace(/^### (.+)$/gm, '<h4 class="text-2xl font-bold text-gray-900 mt-8 mb-4">$1</h4>')
                                    .replace(/^\*\*(.+)\*\*$/gm, '<p class="font-bold text-gray-900 text-xl mt-6 mb-4">$1</p>')
                                    .replace(/^- (.+)$/gm, '<li class="ml-6 mb-2 text-gray-700">• $1</li>')
                            }}
                        />
                    </div>

                    {/* Tags */}
                    <div className="px-12 pb-8">
                        <div className="flex flex-wrap gap-3">
                            {post.tags.map(tag => (
                                <span
                                    key={tag}
                                    className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 font-semibold rounded-full text-sm hover:from-green-primary hover:to-green-600 hover:text-white transition-all cursor-pointer"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Author Card */}
                    <div className="mx-12 mb-8 p-8 bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl border-2 border-green-100">
                        <div className="flex items-start gap-6">
                            <img
                                src={post.authorAvatar || "/default-avatar.png"}
                                alt={post.authorName}
                                className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
                            />
                            <div className="flex-1">
                                <p className="text-sm text-green-primary font-bold mb-1">WRITTEN BY</p>
                                <h4 className="text-2xl font-black text-gray-900 mb-2">{post.authorName}</h4>
                                {post.authorBio && <p className="text-gray-600 leading-relaxed">{post.authorBio}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Newsletter CTA */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="mx-12 mb-12 p-10 bg-gradient-to-br from-green-primary via-green-600 to-blue-600 rounded-2xl text-white shadow-2xl"
                    >
                        <div className="text-center">
                            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-90" />
                            <h3 className="text-3xl font-black mb-3">Love this content?</h3>
                            <p className="text-white/90 mb-6 text-lg">
                                Subscribe to get the latest travel insights and wellness tips delivered weekly.
                            </p>
                            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                                <input
                                    type="email"
                                    placeholder="Your email address"
                                    className="flex-1 px-5 py-4 rounded-xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-white/30"
                                />
                                <button
                                    type="submit"
                                    className="px-8 py-4 bg-white text-green-primary font-bold rounded-xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
                                >
                                    Subscribe
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-20"
                    >
                        <h3 className="text-4xl font-black text-gray-900 mb-8 text-center">
                            Continue Reading
                        </h3>
                        <RelatedPostsCarousel posts={relatedPosts} />
                    </motion.div>
                )}
            </article>

            <Footer />
        </div>
    );
}
