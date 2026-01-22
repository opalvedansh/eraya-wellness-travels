import React, { useState, useEffect, useMemo, lazy, Suspense, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import { ArrowLeft, Grid, Map as MapIcon, ChevronRight } from "lucide-react";
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
}

export default function TourMapPage() {
    const navigate = useNavigate();
    const [tours, setTours] = useState<Tour[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTourId, setSelectedTourId] = useState<string | null>(null);

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

    // Transform data for map display
    const mapTours = useMemo(() => {
        return tours.map(tour => ({
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
    }, [tours]);

    const activeTour = useMemo(() =>
        tours.find(t => t.id === selectedTourId),
        [tours, selectedTourId]);

    if (loading) {
        return (
            <div className="h-screen w-full bg-beige flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-primary mx-auto mb-4"></div>
                    <p className="text-xl text-text-dark/60">Loading map...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-screen w-full bg-beige flex items-center justify-center">
                <div className="text-center">
                    <p className="text-xl text-text-dark/60 mb-4">{error}</p>
                    <button onClick={() => window.location.reload()} className="px-6 py-3 bg-green-primary text-white rounded-lg">Try Again</button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen w-full flex flex-col bg-beige overflow-hidden">
            {/* Header */}
            <div className="h-16 bg-white border-b border-border px-4 flex items-center justify-between shrink-0 z-30 shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate("/tour")}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5 text-gray-600" />
                    </button>
                    <h1 className="text-xl font-bold text-green-primary flex items-center gap-2">
                        <MapIcon className="h-5 w-5" />
                        Explore Tours
                    </h1>
                </div>
                <button
                    onClick={() => navigate("/tour")}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                >
                    <Grid className="h-4 w-4" />
                    <span className="hidden sm:inline">Grid View</span>
                </button>
            </div>

            <div className="flex-1 flex overflow-hidden relative">
                {/* Desktop Sidebar */}
                <div
                    ref={desktopListRef}
                    className="hidden lg:flex w-96 flex-col bg-white border-r border-border h-full shrink-0 overflow-y-auto z-20 shadow-xl"
                >
                    <div className="p-4 border-b border-gray-100 bg-white sticky top-0 z-10">
                        <p className="text-sm text-gray-500 font-medium">{tours.length} tours found</p>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {tours.map(tour => (
                            <div
                                key={tour.id}
                                ref={el => itemRefs.current[tour.id] = el}
                                onClick={() => setSelectedTourId(tour.id)}
                                className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${selectedTourId === tour.id ? 'bg-green-primary/5 border-l-4 border-left border-green-primary' : 'border-l-4 border-transparent'}`}
                            >
                                <div className="flex gap-4">
                                    <img
                                        src={tour.coverImage || tour.images?.[0] || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop"}
                                        alt={tour.name}
                                        className="w-24 h-24 object-cover rounded-lg shrink-0 bg-gray-100"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-text-dark line-clamp-2 mb-1">{tour.name}</h3>
                                        <p className="text-xs text-gray-500 mb-2 truncate">{tour.location}</p>
                                        <div className="flex items-center justify-between mt-auto">
                                            <span className="font-bold text-green-primary text-sm">${tour.price}</span>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/tour/${tour.slug}`);
                                                }}
                                                className="text-xs font-semibold text-gray-600 hover:text-green-primary flex items-center gap-1"
                                            >
                                                Details <ChevronRight className="h-3 w-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-auto p-4 border-t border-border bg-gray-50">
                        <Footer minimal={true} />
                    </div>
                </div>

                {/* Map Area */}
                <div className="flex-1 relative h-full bg-gray-100">
                    <Suspense fallback={
                        <div className="absolute inset-0 flex items-center justify-center bg-beige-light">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-primary"></div>
                        </div>
                    }>
                        <TourMap
                            tours={mapTours}
                            onTourClick={(slug) => navigate(`/tour/${slug}`)}
                            onMarkerClick={(id) => setSelectedTourId(id)}
                            selectedTourId={selectedTourId}
                            className="h-full w-full outline-none"
                        />
                    </Suspense>
                </div>

                {/* Mobile Bottom Sheet/List */}
                <div className="lg:hidden absolute bottom-0 left-0 right-0 z-30 pointer-events-none">
                    <div className="p-4 bg-gradient-to-t from-black/20 to-transparent pb-8">
                        <div
                            ref={mobileListRef}
                            className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-4 pb-4 pointer-events-auto no-scrollbar"
                            style={{ paddingRight: '2rem' }}
                        >
                            {tours.map(tour => (
                                <div
                                    key={tour.id}
                                    ref={el => { if (window.innerWidth < 1024) itemRefs.current[tour.id] = el }}
                                    onClick={() => setSelectedTourId(tour.id)}
                                    className={`snap-center shrink-0 w-[85vw] sm:w-[350px] bg-white rounded-xl shadow-2xl overflow-hidden border transition-all ${selectedTourId === tour.id ? 'border-green-primary ring-2 ring-green-primary/20' : 'border-white'}`}
                                >
                                    <div className="flex h-32">
                                        <img
                                            src={tour.coverImage || tour.images?.[0] || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop"}
                                            alt={tour.name}
                                            className="w-32 h-full object-cover shrink-0"
                                        />
                                        <div className="p-3 flex flex-col flex-1 min-w-0">
                                            <h3 className="font-bold text-text-dark text-sm line-clamp-2 mb-1">{tour.name}</h3>
                                            <p className="text-xs text-gray-500 mb-2 truncate">{tour.location}</p>
                                            <div className="mt-auto flex items-center justify-between">
                                                <span className="font-bold text-green-primary">${tour.price}</span>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/tour/${tour.slug}`);
                                                    }}
                                                    className="px-3 py-1 bg-gray-100 hover:bg-green-primary hover:text-white text-xs rounded-md transition-colors font-medium"
                                                >
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
