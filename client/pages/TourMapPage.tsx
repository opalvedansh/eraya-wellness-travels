import React, { useState, useEffect, useMemo, lazy, Suspense, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import { ArrowLeft, Grid, Map as MapIcon, ChevronRight, Search, SlidersHorizontal, Star, Clock, MapPin } from "lucide-react";
import { API_BASE_URL } from "@/lib/config";
import { motion, AnimatePresence } from "framer-motion";

// Dynamically import TourMap to avoid SSR issues with Leaflet
const TourMap = lazy(() => import("@/components/TourMap"));

interface Tour {
    id: string;
    name: string;
    slug: string;
    location: string;
    coverImage?: string;
    description: string;
    price: number;
    latitude?: number;
    longitude?: number;
    images?: string[];
    isActive: boolean;
    duration?: string;
    difficulty?: 'easy' | 'moderate' | 'difficult';
    rating?: number;
}

export default function TourMapPage() {
    const navigate = useNavigate();
    const [tours, setTours] = useState<Tour[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTourId, setSelectedTourId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<'price' | 'name' | 'rating'>('name');

    // Refs for scrolling to items
    const desktopListRef = useRef<HTMLDivElement>(null);
    const mobileListRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    // Fetch tours from API
    useEffect(() => {
        const fetchTours = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_BASE_URL}/api/tours?_t=${Date.now()}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch tours");
                }
                const data = await response.json();
                setTours(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load tours");
            } finally {
                setLoading(false);
            }
        };

        fetchTours();
    }, []);

    // Scroll to item when selected via map
    useEffect(() => {
        if (selectedTourId && itemRefs.current[selectedTourId]) {
            itemRefs.current[selectedTourId]?.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "center"
            });
        }
    }, [selectedTourId]);

    // Filter and sort tours
    const filteredAndSortedTours = useMemo(() => {
        let filtered = tours.filter(tour =>
            tour.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tour.location.toLowerCase().includes(searchQuery.toLowerCase())
        );

        filtered.sort((a, b) => {
            if (sortBy === 'price') return a.price - b.price;
            if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
            return a.name.localeCompare(b.name);
        });

        return filtered;
    }, [tours, searchQuery, sortBy]);

    // Transform data for map display
    const mapTours = useMemo(() => {
        return filteredAndSortedTours.map(tour => ({
            id: tour.id,
            name: tour.name,
            slug: tour.slug,
            location: tour.location,
            image: tour.coverImage || tour.images?.[0] || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
            price: tour.price,
            coordinates: (tour.latitude !== null && tour.longitude !== null && !isNaN(Number(tour.latitude)) && !isNaN(Number(tour.longitude))
                ? [Number(tour.latitude), Number(tour.longitude)]
                : [27.7, 85.3]) as [number, number],
            description: tour.description,
        }));
    }, [filteredAndSortedTours]);

    const getDifficultyBadge = (difficulty?: string) => {
        if (!difficulty) return null;
        const badges = {
            easy: <span className="badge-easy">Easy</span>,
            moderate: <span className="badge-moderate">Moderate</span>,
            difficult: <span className="badge-difficult">Difficult</span>
        };
        return badges[difficulty as keyof typeof badges];
    };

    const renderStars = (rating?: number) => {
        if (!rating) return null;
        return (
            <div className="star-rating">
                {[1, 2, 3, 4, 5].map(star => (
                    <Star
                        key={star}
                        className={`h-3 w-3 ${star <= rating ? 'star-filled fill-current' : 'star-empty'}`}
                    />
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="h-screen w-full bg-gradient-to-br from-beige-light to-beige flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-primary border-t-transparent mx-auto mb-4"></div>
                    <p className="text-xl font-semibold text-text-dark/70">Loading spectacular map...</p>
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-screen w-full bg-gradient-to-br from-beige-light to-beige flex items-center justify-center">
                <div className="text-center glass-card p-8 rounded-2xl">
                    <p className="text-xl text-text-dark/60 mb-4">{error}</p>
                    <button onClick={() => window.location.reload()} className="btn-premium">Try Again</button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen w-full flex flex-col bg-gradient-to-br from-beige-light via-beige to-beige-dark overflow-hidden">
            {/* Premium Header */}
            <div className="h-20 glass-card border-b border-white/20 px-6 flex items-center justify-between shrink-0 z-30 shadow-premium">
                <div className="flex items-center gap-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/tour")}
                        className="p-3 hover:bg-white/50 rounded-full transition-all"
                    >
                        <ArrowLeft className="h-5 w-5 text-green-primary" />
                    </motion.button>
                    <div>
                        <h1 className="text-2xl font-black text-green-primary flex items-center gap-3">
                            <MapIcon className="h-6 w-6" />
                            Explore Tours
                        </h1>
                        <p className="text-sm text-text-dark/60">Discover amazing destinations</p>
                    </div>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/tour")}
                    className="flex items-center gap-2 px-4 py-2 glass-card hover:glass-card-dark hover:text-white rounded-xl text-sm font-semibold transition-all shadow-premium-sm"
                >
                    <Grid className="h-4 w-4" />
                    <span className="hidden sm:inline">Grid View</span>
                </motion.button>
            </div>

            <div className="flex-1 flex overflow-hidden relative">
                {/* Premium Desktop Sidebar */}
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    ref={desktopListRef}
                    className="hidden lg:flex w-[420px] flex-col glass-card border-r border-white/20 h-full shrink-0 overflow-hidden z-20 shadow-premium-lg"
                >
                    {/* Search and Filter Bar */}
                    <div className="p-6 border-b border-white/10 bg-gradient-to-b from-white/50 to-transparent sticky top-0 z-10 backdrop-blur-xl">
                        <div className="relative search-glow mb-4">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search tours or locations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-primary/20 transition-all"
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <SlidersHorizontal className="h-4 w-4 text-gray-500" />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="flex-1 px-3 py-2 bg-white/80 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-primary/20"
                            >
                                <option value="name">Sort by Name</option>
                                <option value="price">Sort by Price</option>
                                <option value="rating">Sort by Rating</option>
                            </select>
                        </div>
                        <p className="text-xs text-gray-500 mt-3 font-medium">{filteredAndSortedTours.length} tours found</p>
                    </div>

                    {/* Tour List */}
                    <div className="flex-1 overflow-y-auto premium-scrollbar">
                        <AnimatePresence>
                            {filteredAndSortedTours.map((tour, index) => (
                                <motion.div
                                    key={tour.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    ref={el => itemRefs.current[tour.id] = el}
                                    onClick={() => setSelectedTourId(tour.id)}
                                    className={`p-5 cursor-pointer transition-all card-hover-lift border-b border-white/10 ${selectedTourId === tour.id
                                            ? 'bg-gradient-to-r from-green-primary/10 to-transparent border-l-4 border-l-green-primary'
                                            : 'hover:bg-white/30'
                                        }`}
                                >
                                    <div className="flex gap-4">
                                        <div className="relative shrink-0">
                                            <img
                                                src={tour.coverImage || tour.images?.[0] || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop"}
                                                alt={tour.name}
                                                className="w-28 h-28 object-cover rounded-xl shadow-premium-sm"
                                            />
                                            {tour.difficulty && (
                                                <div className="absolute top-2 right-2">
                                                    {getDifficultyBadge(tour.difficulty)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-text-dark line-clamp-2 mb-2 text-base">{tour.name}</h3>
                                            <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                                                <MapPin className="h-3 w-3" />
                                                <span className="truncate">{tour.location}</span>
                                            </div>
                                            {tour.duration && (
                                                <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                                                    <Clock className="h-3 w-3" />
                                                    <span>{tour.duration}</span>
                                                </div>
                                            )}
                                            {tour.rating && (
                                                <div className="mb-2">
                                                    {renderStars(tour.rating)}
                                                </div>
                                            )}
                                            <div className="flex items-center justify-between mt-auto">
                                                <span className="font-black text-green-primary text-lg">${tour.price}</span>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/tour/${tour.slug}`);
                                                    }}
                                                    className="text-xs font-semibold text-green-primary hover:text-green-secondary flex items-center gap-1 transition-colors"
                                                >
                                                    Details <ChevronRight className="h-3 w-3" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Map Area */}
                <div className="flex-1 relative h-full">
                    <Suspense fallback={
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-beige-light to-beige">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-primary border-t-transparent mx-auto mb-4"></div>
                                <p className="text-text-dark/70 font-semibold">Loading map...</p>
                            </div>
                        </div>
                    }>
                        <TourMap
                            tours={mapTours}
                            onTourClick={(slug) => navigate(`/tour/${slug}`)}
                            onMarkerClick={(id) => setSelectedTourId(id)}
                            selectedTourId={selectedTourId}
                            className="h-full w-full"
                        />
                    </Suspense>
                </div>

                {/* Premium Mobile Bottom Sheet */}
                <div className="lg:hidden absolute bottom-0 left-0 right-0 z-30 pointer-events-none">
                    <div className="p-4 bg-gradient-to-t from-black/40 via-black/20 to-transparent pb-8">
                        <div
                            ref={mobileListRef}
                            className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-4 pb-4 pointer-events-auto no-scrollbar"
                        >
                            {filteredAndSortedTours.map((tour) => (
                                <motion.div
                                    key={tour.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    whileHover={{ scale: 1.02 }}
                                    ref={el => { if (window.innerWidth < 1024) itemRefs.current[tour.id] = el }}
                                    onClick={() => setSelectedTourId(tour.id)}
                                    className={`snap-center shrink-0 w-[85vw] sm:w-[380px] glass-card rounded-2xl overflow-hidden shadow-premium-lg transition-all ${selectedTourId === tour.id ? 'ring-4 ring-green-primary/50' : ''
                                        }`}
                                >
                                    <div className="flex h-36">
                                        <img
                                            src={tour.coverImage || tour.images?.[0] || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop"}
                                            alt={tour.name}
                                            className="w-36 h-full object-cover shrink-0"
                                        />
                                        <div className="p-4 flex flex-col flex-1 min-w-0 bg-white/90 backdrop-blur-sm">
                                            <h3 className="font-bold text-text-dark text-sm line-clamp-2 mb-2">{tour.name}</h3>
                                            <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                                                <MapPin className="h-3 w-3" />
                                                <span className="truncate">{tour.location}</span>
                                            </div>
                                            {tour.rating && (
                                                <div className="mb-2">
                                                    {renderStars(tour.rating)}
                                                </div>
                                            )}
                                            <div className="mt-auto flex items-center justify-between">
                                                <span className="font-black text-green-primary text-lg">${tour.price}</span>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/tour/${tour.slug}`);
                                                    }}
                                                    className="px-3 py-1.5 bg-green-primary hover:bg-green-secondary text-white text-xs rounded-lg transition-all font-semibold shadow-premium-sm"
                                                >
                                                    View
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
