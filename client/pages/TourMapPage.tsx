import React, { useState, useEffect, useMemo, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import { ArrowLeft, Grid } from "lucide-react";
import { API_BASE_URL } from "@/lib/config";

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

    if (loading) {
        return (
            <div className="min-h-screen bg-beige flex flex-col">
                <div className="flex-grow flex items-center justify-center py-20">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-primary mx-auto mb-4"></div>
                        <p className="text-xl text-text-dark/60">Loading map...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-beige flex flex-col">
                <div className="flex-grow flex items-center justify-center py-20">
                    <div className="text-center">
                        <p className="text-xl text-text-dark/60 mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-3 bg-green-primary text-white rounded-lg hover:bg-green-secondary transition"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-beige flex flex-col">
            {/* Header with back button */}
            <div className="pt-20 sm:pt-24 px-3 sm:px-6 lg:px-12 max-w-7xl mx-auto w-full">
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => navigate("/tour")}
                        className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg shadow-sm border border-border hover:bg-beige transition-colors"
                    >
                        <Grid className="h-4 w-4" />
                        <span className="font-semibold">Grid View</span>
                    </button>
                    <h1 className="text-2xl sm:text-3xl font-black text-green-primary">Tours Map</h1>
                    <div className="w-24"></div> {/* Spacer for centering */}
                </div>
            </div>

            {/* Full-height Map */}
            <div className="flex-grow px-3 sm:px-6 lg:px-12 pb-6">
                <div className="max-w-7xl mx-auto h-full">
                    <Suspense
                        fallback={
                            <div className="h-[calc(100vh-200px)] rounded-xl overflow-hidden shadow-premium border border-border flex items-center justify-center bg-beige-light">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-primary mx-auto mb-4"></div>
                                    <p className="text-text-dark/70">Loading map...</p>
                                </div>
                            </div>
                        }
                    >
                        <TourMap
                            tours={mapTours}
                            onTourClick={(slug) => navigate(`/tour/${slug}`)}
                            className="h-[calc(100vh-200px)] rounded-xl overflow-hidden shadow-premium border border-border"
                        />
                    </Suspense>
                </div>
            </div>

            <Footer />
        </div>
    );
}
