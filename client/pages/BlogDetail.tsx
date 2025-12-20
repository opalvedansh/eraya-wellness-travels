import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
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
} from "lucide-react";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { getPostBySlug, getRelatedPosts, BlogPost } from "@/data/blogPosts";

// Share component
function ShareButtons({ post }: { post: BlogPost }) {
    const [copied, setCopied] = useState(false);
    const url = window.location.href;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareOnWhatsApp = () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(post.title + " " + url)}`, "_blank");
    };

    const shareOnFacebook = () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
    };

    const shareOnTwitter = () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(url)}`, "_blank");
    };

    const shareOnLinkedIn = () => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank");
    };

    return (
        <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold text-text-dark/60 flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Share:
            </span>
            <button
                onClick={shareOnWhatsApp}
                className="p-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
                aria-label="Share on WhatsApp"
            >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
            </button>
            <button
                onClick={shareOnFacebook}
                className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                aria-label="Share on Facebook"
            >
                <Facebook className="h-5 w-5" />
            </button>
            <button
                onClick={shareOnTwitter}
                className="p-2 rounded-lg bg-sky-500 text-white hover:bg-sky-600 transition-colors"
                aria-label="Share on Twitter"
            >
                <Twitter className="h-5 w-5" />
            </button>
            <button
                onClick={shareOnLinkedIn}
                className="p-2 rounded-lg bg-blue-700 text-white hover:bg-blue-800 transition-colors"
                aria-label="Share on LinkedIn"
            >
                <Linkedin className="h-5 w-5" />
            </button>
            <button
                onClick={copyToClipboard}
                className="p-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition-colors flex items-center gap-2"
                aria-label="Copy link"
            >
                {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
            </button>
            {copied && (
                <span className="text-xs text-green-primary font-semibold">Copied!</span>
            )}
        </div>
    );
}

// Related Posts Carousel
function RelatedPostsCarousel({ posts }: { posts: BlogPost[] }) {
    const navigate = useNavigate();
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: "start" });

    return (
        <div className="relative">
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex gap-6">
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0"
                        >
                            <div
                                onClick={() => navigate(`/blog/${post.slug}`)}
                                className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-premium-sm hover:shadow-premium transition-all border border-border flex flex-col h-full"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={post.featuredImage}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute top-3 left-3">
                                        <span className="inline-block px-3 py-1 bg-green-primary text-white text-xs font-bold rounded-full">
                                            {post.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-5 flex flex-col flex-grow">
                                    <h3 className="font-black text-text-dark text-lg mb-2 line-clamp-2 group-hover:text-green-primary transition-colors">
                                        {post.title}
                                    </h3>
                                    <p className="text-text-dark/70 text-sm mb-4 line-clamp-2 flex-grow">
                                        {post.excerpt}
                                    </p>
                                    <div className="flex items-center gap-2 text-xs text-text-dark/60">
                                        <Clock className="h-3 w-3" />
                                        <span>{post.readTime}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Reading Progress Bar
function ReadingProgressBar() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const updateProgress = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            setProgress(scrollPercent);
        };

        window.addEventListener("scroll", updateProgress);
        return () => window.removeEventListener("scroll", updateProgress);
    }, []);

    return (
        <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50">
            <div
                className="h-full bg-green-primary transition-all duration-150"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}

export default function BlogDetail() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const post = getPostBySlug(slug || "");

    if (!post) {
        return (
            <div className="min-h-screen bg-beige flex flex-col">
                <FloatingWhatsAppButton />
                <div className="flex-grow flex items-center justify-center px-4 py-12">
                    <div className="text-center">
                        <h1 className="text-3xl font-black text-green-primary mb-4">Article Not Found</h1>
                        <p className="text-text-dark/70 mb-8">The article you're looking for doesn't exist.</p>
                        <button
                            onClick={() => navigate("/blog")}
                            className="bg-blue-accent hover:bg-blue-accent-dark text-white font-bold px-6 py-2.5 rounded-lg transition-colors"
                        >
                            Back to Blog
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const relatedPosts = getRelatedPosts(post, 4);

    return (
        <div className="min-h-screen bg-beige flex flex-col">
            <FloatingWhatsAppButton />
            <ReadingProgressBar />

            {/* Back Button */}
            <div className="pt-20 sm:pt-24 md:pt-28 px-3 sm:px-6 lg:px-12 max-w-4xl mx-auto w-full mb-6">
                <button
                    onClick={() => navigate("/blog")}
                    className="flex items-center gap-2 text-blue-accent hover:text-blue-accent-dark font-semibold transition-colors hover:-translate-x-0.5"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Blog
                </button>
            </div>

            {/* Article Content */}
            <article className="flex-grow px-3 sm:px-6 lg:px-12 max-w-4xl mx-auto w-full pb-12">
                {/* Header */}
                <header className="mb-8">
                    <div className="mb-4">
                        <span className="inline-block px-4 py-1.5 bg-green-primary text-white text-sm font-bold rounded-full">
                            {post.category}
                        </span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-text-dark mb-6 leading-tight">
                        {post.title}
                    </h1>

                    {/* Author and Meta */}
                    <div className="flex flex-wrap items-center gap-6 mb-6 pb-6 border-b border-border">
                        <div className="flex items-center gap-3">
                            <img
                                src={post.author.avatar}
                                alt={post.author.name}
                                className="w-12 h-12 rounded-full"
                            />
                            <div>
                                <p className="font-bold text-text-dark">{post.author.name}</p>
                                <p className="text-sm text-text-dark/60">{post.author.bio}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-text-dark/60 mb-8">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(post.publishDate).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{post.readTime}</span>
                        </div>
                    </div>

                    {/* Share Buttons */}
                    <ShareButtons post={post} />
                </header>

                {/* Featured Image */}
                <div className="mb-10 rounded-xl overflow-hidden shadow-premium">
                    <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-auto"
                    />
                </div>

                {/* Article Content */}
                <div className="prose prose-lg max-w-none mb-12">
                    <div
                        className="text-text-dark/80 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>').replace(/^# (.+)$/gm, '<h2 class="text-3xl font-black text-text-dark mt-8 mb-4">$1</h2>').replace(/^## (.+)$/gm, '<h3 class="text-2xl font-black text-text-dark mt-6 mb-3">$1</h3>').replace(/^### (.+)$/gm, '<h4 class="text-xl font-bold text-text-dark mt-4 mb-2">$1</h4>').replace(/^\*\*(.+)\*\*.?$/gm, '<p class="font-bold text-text-dark mt-4">$1</p>').replace(/^- (.+)$/gm, '<li class="ml-6">$1</li>') }}
                    />
                </div>

                {/* Tags */}
                <div className="mb-10 pb-10 border-b border-border">
                    <div className="flex flex-wrap gap-2">
                        {post.tags.map(tag => (
                            <span
                                key={tag}
                                className="px-4 py-2 bg-beige-dark text-text-dark font-semibold rounded-lg text-sm"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Share Again */}
                <div className="mb-12">
                    <h3 className="text-xl font-black text-text-dark mb-4">Enjoyed this article?</h3>
                    <ShareButtons post={post} />
                </div>

                {/* Newsletter Signup */}
                <div className="bg-gradient-to-br from-green-primary/10 to-blue-accent/5 rounded-xl p-8 mb-12 border border-green-primary/20">
                    <h3 className="text-2xl font-black text-text-dark mb-2">Subscribe to Our Newsletter</h3>
                    <p className="text-text-dark/70 mb-6">
                        Get the latest travel insights and wellness tips delivered to your inbox weekly.
                    </p>
                    <form className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="email"
                            placeholder="Your email address"
                            className="flex-1 px-4 py-3 rounded-lg border-2 border-border bg-white focus:border-green-primary focus:outline-none transition-colors"
                        />
                        <button
                            type="submit"
                            className="px-6 py-3 bg-green-primary text-white font-bold rounded-lg hover:bg-green-primary/90 transition-colors whitespace-nowrap"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>

                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                    <div>
                        <h3 className="text-2xl sm:text-3xl font-black text-green-primary mb-6">
                            Related Articles
                        </h3>
                        <RelatedPostsCarousel posts={relatedPosts} />
                    </div>
                )}
            </article>

            <Footer />
        </div>
    );
}
