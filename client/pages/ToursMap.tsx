import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    MapPin,
    Loader2,
    Search,
    SlidersHorizontal,
    X,
    Calendar,
    DollarSign,
    TrendingUp,
    Sparkles,
    Mountain
} from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { loadGoogleMapsAPI } from "@/utils/googleMapsLoader";
import { motion, AnimatePresence } from "framer-motion";
import { TOURS_DATA } from "@/data/tours.map.data.js";
import MapBottomSheet from "@/components/MapBottomSheet";

// Type declaration for Google Maps (loaded at runtime)
declare const google: any;

export default function ToursMap() {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const markersRef = useRef<any[]>([]);
    const tourCardRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});
    const sidebarScrollRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTour, setSelectedTour] = useState<number | null>(null);
    const [hoveredTour, setHoveredTour] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDifficulty, setSelectedDifficulty] = useState<number[]>([]);
    const [showFilters, setShowFilters] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [bottomSheetOpen, setBottomSheetOpen] = useState(true);
    const bottomSheetScrollRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();

    const filteredTours = TOURS_DATA.filter((tour) => {
        const matchesSearch = tour.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDifficulty = selectedDifficulty.length === 0 || selectedDifficulty.includes(tour.difficulty);
        return matchesSearch && matchesDifficulty;
    });

    useEffect(() => {
        const initMap = async () => {
            try {
                setIsLoading(true);
                setError(null);

                await loadGoogleMapsAPI();

                if (!mapRef.current) return;

                const map = new google.maps.Map(mapRef.current, {
                    center: { lat: 27.7172, lng: 85.3240 },
                    zoom: 7,
                    mapTypeControl: true,
                    streetViewControl: false,
                    fullscreenControl: true,
                    zoomControl: true,
                    styles: [
                        {
                            featureType: "poi",
                            elementType: "labels",
                            stylers: [{ visibility: "off" }]
                        },
                        {
                            featureType: "transit",
                            elementType: "labels",
                            stylers: [{ visibility: "off" }]
                        }
                    ],
                });

                mapInstanceRef.current = map;

                filteredTours.forEach((tour) => {
                    // Enhanced marker with custom icon for better visibility
                    const marker = new google.maps.Marker({
                        position: tour.coordinates,
                        map: map,
                        title: tour.name,
                        animation: google.maps.Animation.DROP,
                        icon: {
                            path: google.maps.SymbolPath.CIRCLE,
                            scale: 12,
                            fillColor: "#2D5F3F",
                            fillOpacity: 1,
                            strokeColor: "#ffffff",
                            strokeWeight: 3,
                        },
                        optimized: false,
                    });

                    const infoWindowContent = `
                        <div style="padding: 20px; max-width: 320px; font-family: Inter, sans-serif;">
                            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                                <div style="width: 6px; height: 6px; background: #2D5F3F; border-radius: 50%; animation: pulse 2s infinite;"></div>
                                <h3 style="margin: 0; font-size: 20px; font-weight: 800; color: #1a1a1a; letter-spacing: -0.5px;">
                                    ${tour.name}
                                </h3>
                            </div>
                            <p style="margin: 0 0 16px 0; font-size: 14px; color: #666; line-height: 1.6;">
                                ${tour.description}
                            </p>
                            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 16px;">
                                <div style="text-align: center; padding: 12px; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 12px;">
                                    <div style="font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">Duration</div>
                                    <div style="font-size: 16px; font-weight: 700; color: #1a1a1a;">${tour.duration}</div>
                                </div>
                                <div style="text-align: center; padding: 12px; background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%); border-radius: 12px;">
                                    <div style="font-size: 11px; color: #155724; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">Price</div>
                                    <div style="font-size: 16px; font-weight: 700; color: #155724;">$${tour.price}</div>
                                </div>
                                <div style="text-align: center; padding: 12px; background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%); border-radius: 12px;">
                                    <div style="font-size: 11px; color: #856404; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">Rating</div>
                                    <div style="font-size: 16px; font-weight: 700; color: #856404;">★ ${tour.rating}</div>
                                </div>
                            </div>
                            <div style="display: flex; gap: 10px;">
                                <button 
                                    onclick="window.location.href='/tour/${tour.slug}'"
                                    style="flex: 1; padding: 14px 20px; background: linear-gradient(135deg, #2D5F3F 0%, #1a3d28 100%); color: white; border: none; border-radius: 12px; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 15px rgba(45, 95, 63, 0.3); text-transform: uppercase; letter-spacing: 0.5px;"
                                    onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(45, 95, 63, 0.4)'"
                                    onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(45, 95, 63, 0.3)'"
                                >
                                    Explore Tour
                                </button>
                                <button 
                                    onclick="window.location.href='/booking/tour/${tour.slug}'"
                                    style="padding: 14px 20px; background: white; color: #2D5F3F; border: 2px solid #2D5F3F; border-radius: 12px; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);"
                                    onmouseover="this.style.background='#2D5F3F'; this.style.color='white'; this.style.transform='translateY(-2px)'"
                                    onmouseout="this.style.background='white'; this.style.color='#2D5F3F'; this.style.transform='translateY(0)'"
                                >
                                    Book
                                </button>
                            </div>
                        </div>
                        <style>
                            @keyframes pulse {
                                0%, 100% { opacity: 1; transform: scale(1); }
                                50% { opacity: 0.5; transform: scale(1.2); }
                            }
                        </style>
                    `;

                    const infoWindow = new google.maps.InfoWindow({
                        content: infoWindowContent,
                    });

                    marker.addListener("click", () => {
                        markersRef.current.forEach((m) => {
                            if ((m as any).infoWindow) {
                                (m as any).infoWindow.close();
                            }
                        });
                        infoWindow.open(map, marker);
                        setSelectedTour(tour.id);

                        // Desktop: Scroll to the corresponding tour card in sidebar
                        const cardElement = tourCardRefs.current[tour.id];
                        if (cardElement && sidebarScrollRef.current) {
                            cardElement.scrollIntoView({
                                behavior: 'smooth',
                                block: 'center'
                            });
                        }

                        // Mobile: Expand bottom sheet and scroll to card
                        setBottomSheetOpen(true);
                        setTimeout(() => {
                            const cardElement = tourCardRefs.current[tour.id];
                            if (cardElement && bottomSheetScrollRef.current) {
                                cardElement.scrollIntoView({
                                    behavior: 'smooth',
                                    block: 'center'
                                });
                            }
                        }, 300);
                    });

                    // Hover effect for better visibility
                    marker.addListener("mouseover", () => {
                        marker.setIcon({
                            path: google.maps.SymbolPath.CIRCLE,
                            scale: 15,
                            fillColor: "#2D5F3F",
                            fillOpacity: 1,
                            strokeColor: "#ffffff",
                            strokeWeight: 4,
                        });
                    });

                    marker.addListener("mouseout", () => {
                        marker.setIcon({
                            path: google.maps.SymbolPath.CIRCLE,
                            scale: 12,
                            fillColor: "#2D5F3F",
                            fillOpacity: 1,
                            strokeColor: "#ffffff",
                            strokeWeight: 3,
                        });
                    });

                    (marker as any).infoWindow = infoWindow;
                    (marker as any).tourId = tour.id;
                    markersRef.current.push(marker);
                });

                setIsLoading(false);
            } catch (err) {
                console.error("Error loading map:", err);
                setError("Failed to load map. Please check your API key.");
                setIsLoading(false);
            }
        };

        initMap();

        return () => {
            markersRef.current.forEach((marker) => marker.setMap(null));
            markersRef.current = [];
        };
    }, []); // Only initialize map once - don't depend on filteredTours

    // Separate effect to update markers when filteredTours changes (without reloading map)
    useEffect(() => {
        if (!mapInstanceRef.current || isLoading) return;

        // Clear existing markers
        markersRef.current.forEach((marker) => marker.setMap(null));
        markersRef.current = [];

        const map = mapInstanceRef.current;

        // Create markers for current filtered tours
        filteredTours.forEach((tour) => {
            const marker = new google.maps.Marker({
                position: tour.coordinates,
                map: map,
                title: tour.name,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 12,
                    fillColor: "#2D5F3F",
                    fillOpacity: 1,
                    strokeColor: "#ffffff",
                    strokeWeight: 3,
                },
                optimized: false,
            });

            const infoWindowContent = `
                <div style="padding: 20px; max-width: 320px; font-family: Inter, sans-serif;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                        <div style="width: 6px; height: 6px; background: #2D5F3F; border-radius: 50%; animation: pulse 2s infinite;"></div>
                        <h3 style="margin: 0; font-size: 20px; font-weight: 800; color: #1a1a1a; letter-spacing: -0.5px;">
                            ${tour.name}
                        </h3>
                    </div>
                    <p style="margin: 0 0 16px 0; font-size: 14px; color: #666; line-height: 1.6;">
                        ${tour.description}
                    </p>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 16px;">
                        <div style="text-align: center; padding: 12px; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 12px;">
                            <div style="font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">Duration</div>
                            <div style="font-size: 16px; font-weight: 700; color: #1a1a1a;">${tour.duration}</div>
                        </div>
                        <div style="text-align: center; padding: 12px; background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%); border-radius: 12px;">
                            <div style="font-size: 11px; color: #155724; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">Price</div>
                            <div style="font-size: 16px; font-weight: 700; color: #155724;">$${tour.price}</div>
                        </div>
                        <div style="text-align: center; padding: 12px; background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%); border-radius: 12px;">
                            <div style="font-size: 11px; color: #856404; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">Rating</div>
                            <div style="font-size: 16px; font-weight: 700; color: #856404;">★ ${tour.rating}</div>
                        </div>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button 
                            onclick="window.location.href='/tour/${tour.slug}'"
                            style="flex: 1; padding: 14px 20px; background: linear-gradient(135deg, #2D5F3F 0%, #1a3d28 100%); color: white; border: none; border-radius: 12px; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 15px rgba(45, 95, 63, 0.3); text-transform: uppercase; letter-spacing: 0.5px;"
                            onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(45, 95, 63, 0.4)'"
                            onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(45, 95, 63, 0.3)'"
                        >
                            Explore Tour
                        </button>
                        <button 
                            onclick="window.location.href='/booking/tour/${tour.slug}'"
                            style="padding: 14px 20px; background: white; color: #2D5F3F; border: 2px solid #2D5F3F; border-radius: 12px; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);"
                            onmouseover="this.style.background='#2D5F3F'; this.style.color='white'; this.style.transform='translateY(-2px)'"
                            onmouseout="this.style.background='white'; this.style.color='#2D5F3F'; this.style.transform='translateY(0)'"
                        >
                            Book
                        </button>
                    </div>
                </div>
                <style>
                    @keyframes pulse {
                        0%, 100% { opacity: 1; transform: scale(1); }
                        50% { opacity: 0.5; transform: scale(1.2); }
                    }
                </style>
            `;

            const infoWindow = new google.maps.InfoWindow({
                content: infoWindowContent,
            });

            marker.addListener("click", () => {
                markersRef.current.forEach((m) => {
                    if ((m as any).infoWindow) {
                        (m as any).infoWindow.close();
                    }
                });
                infoWindow.open(map, marker);
                setSelectedTour(tour.id);

                // Desktop: Scroll to card in sidebar
                const cardElement = tourCardRefs.current[tour.id];
                if (cardElement && sidebarScrollRef.current) {
                    cardElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }

                // Mobile: Expand bottom sheet and scroll to card
                setBottomSheetOpen(true);
                setTimeout(() => {
                    const cardElement = tourCardRefs.current[tour.id];
                    if (cardElement && bottomSheetScrollRef.current) {
                        cardElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                        });
                    }
                }, 300);
            });

            marker.addListener("mouseover", () => {
                marker.setIcon({
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 15,
                    fillColor: "#2D5F3F",
                    fillOpacity: 1,
                    strokeColor: "#ffffff",
                    strokeWeight: 4,
                });
            });

            marker.addListener("mouseout", () => {
                marker.setIcon({
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 12,
                    fillColor: "#2D5F3F",
                    fillOpacity: 1,
                    strokeColor: "#ffffff",
                    strokeWeight: 3,
                });
            });

            (marker as any).infoWindow = infoWindow;
            (marker as any).tourId = tour.id;
            markersRef.current.push(marker);
        });
    }, [filteredTours, isLoading]);

    const handleTourClick = (tour: typeof TOURS_DATA[0]) => {
        setSelectedTour(tour.id);

        if (mapInstanceRef.current) {
            // Smooth pan to marker location
            mapInstanceRef.current.panTo(tour.coordinates);
            mapInstanceRef.current.setZoom(10);

            // Find and trigger the marker
            const marker = markersRef.current.find((m) => (m as any).tourId === tour.id);
            if (marker) {
                // Close all info windows first
                markersRef.current.forEach((m) => {
                    if ((m as any).infoWindow) {
                        (m as any).infoWindow.close();
                    }
                });

                // Open this marker's info window
                if ((marker as any).infoWindow) {
                    (marker as any).infoWindow.open(mapInstanceRef.current, marker);
                }
            }
        }
    };

    const handleTourHover = (tourId: number | null) => {
        setHoveredTour(tourId);

        if (tourId !== null) {
            // Highlight the corresponding marker
            const marker = markersRef.current.find((m) => (m as any).tourId === tourId);
            if (marker) {
                marker.setIcon({
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 18,
                    fillColor: "#2D5F3F",
                    fillOpacity: 1,
                    strokeColor: "#FFD700",
                    strokeWeight: 4,
                });
            }
        } else {
            // Reset all markers to normal state
            markersRef.current.forEach((m) => {
                m.setIcon({
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 12,
                    fillColor: "#2D5F3F",
                    fillOpacity: 1,
                    strokeColor: "#ffffff",
                    strokeWeight: 3,
                });
            });
        }
    };

    const getDifficultyLabel = (level: number) => {
        const labels = ["Easy", "Moderate", "Challenging", "Difficult", "Extreme"];
        return labels[level - 1] || "Easy";
    };

    const getDifficultyColor = (level: number) => {
        const colors = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#9333ea"];
        return colors[level - 1] || "#10b981";
    };

    return (
        <div className="h-screen bg-beige flex flex-col overflow-hidden">
            <NavBar />

            {/* Spectacular Floating Header with Glassmorphism */}
            <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-30"
            >
                <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
                    <motion.button
                        whileHover={{ scale: 1.05, x: -5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/tour")}
                        className="group flex items-center gap-3 bg-white/90 backdrop-blur-xl px-6 py-3 rounded-2xl shadow-2xl hover:shadow-green-primary/20 transition-all duration-300 border border-white/20"
                    >
                        <ArrowLeft className="h-5 w-5 text-green-primary group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold text-text-dark">Back to Tours</span>
                    </motion.button>

                    <div className="flex items-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="lg:hidden bg-white/90 backdrop-blur-xl px-4 py-3 rounded-2xl shadow-2xl border border-white/20"
                        >
                            <SlidersHorizontal className="h-5 w-5 text-green-primary" />
                        </motion.button>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="bg-gradient-to-r from-green-primary via-green-secondary to-green-primary bg-[length:200%_100%] hover:bg-right-bottom backdrop-blur-xl text-white px-6 py-3 rounded-2xl shadow-2xl font-bold flex items-center gap-3 transition-all duration-500"
                        >
                            <Sparkles className="h-5 w-5 animate-pulse" />
                            <span className="text-lg">{filteredTours.length}</span>
                            <span className="hidden sm:inline">Epic Tours</span>
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            {/* Main Content - Account for NavBar */}
            <div className="flex-1 flex relative overflow-hidden pt-20">
                {/* Spectacular Sidebar - Desktop Only */}
                <AnimatePresence>
                    {sidebarOpen && (
                        <motion.div
                            initial={{ x: -400, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -400, opacity: 0 }}
                            transition={{ duration: 0.4, easeInOut: "easeInOut" }}
                            className="hidden lg:flex w-[380px] bg-white/95 backdrop-blur-sm shadow-xl flex-col border-r border-border"
                        >
                            <div className="flex-1 overflow-y-auto overscroll-contain" ref={sidebarScrollRef}>
                                <div className="p-6 space-y-6">
                                    {/* Premium Search Bar */}
                                    <div className="relative group">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-green-primary group-focus-within:scale-110 transition-transform" />
                                        <input
                                            type="text"
                                            placeholder="Search your next adventure..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 border-2 border-border focus:border-green-primary rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-primary/10 text-sm font-semibold placeholder:text-text-dark/40 transition-all bg-white shadow-lg"
                                        />
                                    </div>

                                    {/* Filters with Badge */}
                                    <div className="bg-white rounded-2xl p-5 shadow-lg border border-border">
                                        <button
                                            onClick={() => setShowFilters(!showFilters)}
                                            className="flex items-center justify-between w-full group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-green-primary/10 rounded-xl group-hover:bg-green-primary/20 transition-colors">
                                                    <SlidersHorizontal className="h-5 w-5 text-green-primary" />
                                                </div>
                                                <span className="font-bold text-text-dark">Difficulty Filters</span>
                                            </div>
                                            {selectedDifficulty.length > 0 && (
                                                <motion.span
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="bg-green-primary text-white text-sm px-3 py-1 rounded-full font-bold"
                                                >
                                                    {selectedDifficulty.length}
                                                </motion.span>
                                            )}
                                        </button>

                                        <AnimatePresence>
                                            {showFilters && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="mt-4 space-y-3 overflow-hidden"
                                                >
                                                    <div className="flex flex-wrap gap-2">
                                                        {[1, 2, 3, 4, 5].map((level) => (
                                                            <motion.button
                                                                key={level}
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                onClick={() => {
                                                                    setSelectedDifficulty((prev) =>
                                                                        prev.includes(level)
                                                                            ? prev.filter((d) => d !== level)
                                                                            : [...prev, level]
                                                                    );
                                                                }}
                                                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-md ${selectedDifficulty.includes(level)
                                                                    ? "bg-green-primary text-white scale-105 shadow-green-primary/30"
                                                                    : "bg-white text-text-dark hover:bg-beige"
                                                                    }`}
                                                            >
                                                                {getDifficultyLabel(level)}
                                                            </motion.button>
                                                        ))}
                                                    </div>
                                                    {selectedDifficulty.length > 0 && (
                                                        <button
                                                            onClick={() => setSelectedDifficulty([])}
                                                            className="text-sm text-blue-accent hover:text-blue-accent-dark font-bold underline"
                                                        >
                                                            Clear all filters
                                                        </button>
                                                    )}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Results Counter with Animation */}
                                    <motion.div
                                        key={filteredTours.length}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="flex items-center justify-between px-2"
                                    >
                                        <p className="text-sm font-bold text-text-dark/70 flex items-center gap-2">
                                            <Mountain className="h-4 w-4 text-green-primary" />
                                            {filteredTours.length} adventure{filteredTours.length !== 1 ? 's' : ''} await
                                        </p>
                                    </motion.div>

                                    {/* Premium Tour Cards */}
                                    <div className="space-y-4">
                                        <AnimatePresence mode="popLayout">
                                            {filteredTours.map((tour, index) => (
                                                <motion.button
                                                    key={tour.id}
                                                    ref={(el) => { tourCardRefs.current[tour.id] = el; }}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.9 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    whileHover={{ scale: 1.02, y: -2 }}
                                                    onClick={() => handleTourClick(tour)}
                                                    onMouseEnter={() => handleTourHover(tour.id)}
                                                    onMouseLeave={() => handleTourHover(null)}
                                                    className={`w-full text-left relative overflow-hidden rounded-xl transition-all duration-300 ${selectedTour === tour.id
                                                        ? "shadow-lg shadow-green-primary/10 border-2 border-green-primary"
                                                        : "shadow-sm hover:shadow-md border-2 border-border hover:border-green-primary/30"
                                                        }`}
                                                >
                                                    {/* Clean Background */}
                                                    <div className="absolute inset-0 bg-white" />

                                                    {/* Content */}
                                                    <div className="relative p-5 space-y-3">
                                                        {/* Header */}
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    {selectedTour === tour.id && (
                                                                        <motion.div
                                                                            initial={{ scale: 0 }}
                                                                            animate={{ scale: 1 }}
                                                                            className="w-2 h-2 bg-green-primary rounded-full animate-pulse"
                                                                        />
                                                                    )}
                                                                    <h3 className="font-black text-base text-text-dark truncate">
                                                                        {tour.name}
                                                                    </h3>
                                                                </div>
                                                                <p className="text-xs text-text-dark/60 line-clamp-2 leading-relaxed">
                                                                    {tour.description}
                                                                </p>
                                                            </div>

                                                            {/* Rating Badge */}
                                                            <div className="flex flex-col items-center gap-1 bg-gradient-to-br from-yellow-50 to-orange-50 px-3 py-2 rounded-xl border border-yellow-200">
                                                                <span className="text-yellow-600 text-lg">★</span>
                                                                <span className="text-xs font-bold text-yellow-700">{tour.rating}</span>
                                                            </div>
                                                        </div>

                                                        {/* Stats Grid */}
                                                        <div className="grid grid-cols-3 gap-2">
                                                            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-2 text-center border border-border/30">
                                                                <div className="flex items-center justify-center gap-1 mb-1">
                                                                    <Calendar className="h-3 w-3 text-blue-500" />
                                                                </div>
                                                                <div className="text-xs font-bold text-text-dark">{tour.duration}</div>
                                                            </div>
                                                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-2 text-center border border-green-200">
                                                                <div className="flex items-center justify-center gap-1 mb-1">
                                                                    <DollarSign className="h-3 w-3 text-green-600" />
                                                                </div>
                                                                <div className="text-xs font-bold text-green-700">${tour.price}</div>
                                                            </div>
                                                            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-2 text-center border border-border/30">
                                                                <div className="flex items-center justify-center gap-1 mb-1">
                                                                    <TrendingUp className="h-3 w-3 text-purple-500" />
                                                                </div>
                                                                <div className="text-xs font-bold text-text-dark">{tour.altitude}</div>
                                                            </div>
                                                        </div>

                                                        {/* Difficulty Indicator */}
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs font-semibold text-text-dark/60">Difficulty:</span>
                                                            <div className="flex gap-1">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <motion.div
                                                                        key={i}
                                                                        initial={{ scale: 0 }}
                                                                        animate={{ scale: 1 }}
                                                                        transition={{ delay: i * 0.05 }}
                                                                        className={`h-2 w-2 rounded-full transition-all ${i < tour.difficulty
                                                                            ? `bg-${tour.difficulty <= 2 ? 'green' :
                                                                                tour.difficulty === 3 ? 'yellow' :
                                                                                    tour.difficulty === 4 ? 'orange' : 'red'
                                                                            }-500 shadow-md`
                                                                            : "bg-gray-200"
                                                                            }`}
                                                                        style={{
                                                                            backgroundColor: i < tour.difficulty ? getDifficultyColor(tour.difficulty) : '#e5e7eb'
                                                                        }}
                                                                    />
                                                                ))}
                                                            </div>
                                                            <span className="text-xs font-bold" style={{ color: getDifficultyColor(tour.difficulty) }}>
                                                                {getDifficultyLabel(tour.difficulty)}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Hover Indicator */}
                                                    {hoveredTour === tour.id && (
                                                        <motion.div
                                                            initial={{ scaleX: 0 }}
                                                            animate={{ scaleX: 1 }}
                                                            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-primary to-green-secondary origin-left"
                                                        />
                                                    )}
                                                </motion.button>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Mobile Bottom Sheet with Tour Cards */}
                <MapBottomSheet
                    isOpen={bottomSheetOpen}
                    onOpenChange={setBottomSheetOpen}
                >
                    <div ref={bottomSheetScrollRef} className="p-4 space-y-4">
                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-primary" />
                            <input
                                type="text"
                                placeholder="Search tours..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border-2 border-border focus:border-green-primary rounded-xl focus:outline-none text-sm font-semibold"
                            />
                        </div>

                        {/* Filter Button */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="w-full flex items-center justify-between bg-white border-2 border-border rounded-xl p-3"
                        >
                            <div className="flex items-center gap-2">
                                <SlidersHorizontal className="h-4 w-4 text-green-primary" />
                                <span className="font-bold text-sm">Difficulty Filters</span>
                            </div>
                            {selectedDifficulty.length > 0 && (
                                <span className="bg-green-primary text-white text-xs px-2 py-1 rounded-full font-bold">
                                    {selectedDifficulty.length}
                                </span>
                            )}
                        </button>

                        {/* Difficulty Filters */}
                        <AnimatePresence>
                            {showFilters && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="flex flex-wrap gap-2 overflow-hidden"
                                >
                                    {[1, 2, 3, 4, 5].map((level) => (
                                        <button
                                            key={level}
                                            onClick={() => {
                                                setSelectedDifficulty((prev) =>
                                                    prev.includes(level)
                                                        ? prev.filter((d) => d !== level)
                                                        : [...prev, level]
                                                );
                                            }}
                                            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${selectedDifficulty.includes(level)
                                                ? "bg-green-primary text-white"
                                                : "bg-gray-100 text-text-dark"
                                                }`}
                                        >
                                            {getDifficultyLabel(level)}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Results Count */}
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-bold text-text-dark/70">
                                {filteredTours.length} tour{filteredTours.length !== 1 ? 's' : ''} found
                            </p>
                        </div>

                        {/* Tour Cards */}
                        {filteredTours.map((tour) => (
                            <motion.button
                                key={tour.id}
                                ref={(el) => { tourCardRefs.current[tour.id] = el; }}
                                onClick={() => handleTourClick(tour)}
                                className={`w-full bg-white rounded-xl shadow-sm transition-all ${selectedTour === tour.id
                                    ? 'ring-2 ring-green-primary shadow-md'
                                    : 'hover:shadow-md'
                                    }`}
                            >
                                <div className="flex gap-3 p-3">
                                    {/* Image */}
                                    <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                                        <img
                                            src={tour.image}
                                            alt={tour.name}
                                            className="w-full h-full object-cover"
                                        />
                                        {selectedTour === tour.id && (
                                            <div className="absolute inset-0 bg-green-primary/20 flex items-center justify-center">
                                                <div className="w-2 h-2 bg-green-primary rounded-full animate-pulse" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0 text-left">
                                        <h4 className="font-bold text-sm text-text-dark mb-1 truncate">
                                            {tour.name}
                                        </h4>
                                        <p className="text-xs text-text-dark/60 line-clamp-2 mb-2">
                                            {tour.description}
                                        </p>
                                        <div className="flex items-center gap-3 text-xs">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3 text-green-primary" />
                                                {tour.duration}
                                            </span>
                                            <span className="text-yellow-600">★ {tour.rating}</span>
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div className="flex flex-col items-end justify-center">
                                        <span className="text-base font-black text-green-primary">
                                            ${tour.price}
                                        </span>
                                    </div>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </MapBottomSheet>

                {/* Map Container with Premium Shadow */}
                <div className="flex-1 relative">
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-beige to-beige-light z-10">
                            <div className="text-center">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                >
                                    <Loader2 className="h-16 w-16 text-green-primary mx-auto mb-6" />
                                </motion.div>
                                <p className="text-xl font-bold text-text-dark">Loading your adventure map...</p>
                                <p className="text-sm text-text-dark/60 mt-2">Preparing {TOURS_DATA.length} amazing tours</p>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="absolute inset-0 flex items-center justify-center bg-beige-light z-10">
                            <div className="text-center max-w-md px-6">
                                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 shadow-2xl">
                                    <p className="text-red-600 font-bold text-lg mb-2">Map Loading Error</p>
                                    <p className="text-sm text-red-500">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={mapRef} className="w-full h-full absolute inset-0" />

                    {/* Helper Text Overlay */}
                    {!isLoading && !error && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1, duration: 0.5 }}
                            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 pointer-events-none"
                        >
                            <div className="bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-gray-200 flex items-center gap-2">
                                <span className="text-2xl">📍</span>
                                <span className="text-sm font-semibold text-text-dark">Click a marker to explore tour details</span>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
