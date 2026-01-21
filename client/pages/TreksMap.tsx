import { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    MapPin,
    Loader2,
    Search,
    SlidersHorizontal,
    Sparkles,
    Mountain,
    Calendar,
    DollarSign,
    TrendingUp
} from "lucide-react";
import NavBar from "@/components/NavBar";
import { motion, AnimatePresence } from "framer-motion";
import MapBottomSheet from "@/components/MapBottomSheet";
import { API_BASE_URL } from "@/lib/config";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default icon logic
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom Icons
const activeIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const defaultMarkerIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Map Controller Component
function MapController({ selectedTrekId, treks }: { selectedTrekId: number | null, treks: any[] }) {
    const map = useMap();

    // Auto-center on load
    useEffect(() => {
        if (treks.length > 0 && !selectedTrekId) {
            const validPoints = treks
                .filter(t => t.coordinates && t.coordinates[0] !== 0)
                .map(t => L.latLng(t.coordinates[0], t.coordinates[1]));

            if (validPoints.length > 0) {
                const bounds = L.latLngBounds(validPoints);
                map.fitBounds(bounds, { padding: [50, 50], maxZoom: 10 });
            }
        }
    }, [treks, map, selectedTrekId]);

    // Pan to selected trek
    useEffect(() => {
        if (selectedTrekId) {
            const trek = treks.find(t => t.id === selectedTrekId);
            if (trek && trek.coordinates && trek.coordinates[0] !== 0) {
                map.flyTo(trek.coordinates, 10, { duration: 1.5 });
            }
        }
    }, [selectedTrekId, treks, map]);

    return null;
}

export default function TreksMap() {
    const navigate = useNavigate();
    const [treks, setTreks] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDifficulty, setSelectedDifficulty] = useState<number[]>([]);
    const [selectedTrek, setSelectedTrek] = useState<number | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [bottomSheetOpen, setBottomSheetOpen] = useState(true);

    const sidebarScrollRef = useRef<HTMLDivElement>(null);
    const trekCardRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});
    const bottomSheetScrollRef = useRef<HTMLDivElement | null>(null);

    // Fetch Treks
    useEffect(() => {
        const fetchTreks = async () => {
            try {
                setIsLoading(true);
                // Fetch with cache busting
                const response = await fetch(`${API_BASE_URL}/api/treks?_t=${Date.now()}`);
                if (!response.ok) throw new Error("Failed to fetch treks");
                const data = await response.json();

                // Process coordinates (handle parsing)
                const processed = data.map((trek: any) => {
                    let lat = Number(trek.latitude);
                    let lng = Number(trek.longitude);
                    let coords: [number, number] = [27.7, 85.3]; // Default Kathmandu

                    if (!isNaN(lat) && !isNaN(lng) && lat !== 0) {
                        coords = [lat, lng];
                    }

                    return {
                        ...trek,
                        coordinates: coords,
                        image: trek.image || "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&fit=crop",
                        rating: trek.rating || 4.5,
                        price: trek.price || 0,
                        duration: trek.duration || "N/A",
                        difficulty: trek.difficulty || 1,
                    };
                });

                setTreks(processed);
            } catch (error) {
                console.error("Error fetching treks:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTreks();
    }, []);

    const filteredTreks = useMemo(() => {
        return treks.filter((trek) => {
            const matchesSearch = trek.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesDifficulty = selectedDifficulty.length === 0 || selectedDifficulty.includes(trek.difficulty);
            return matchesSearch && matchesDifficulty;
        });
    }, [treks, searchQuery, selectedDifficulty]);

    const handleTrekClick = (trek: any) => {
        setSelectedTrek(trek.id);

        // Scroll logic (Desktop)
        const cardElement = trekCardRefs.current[trek.id];
        if (cardElement && sidebarScrollRef.current) {
            cardElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        // Mobile
        setBottomSheetOpen(true);
    };

    const getDifficultyLabel = (level: number) => {
        const labels = ["Easy", "Moderate", "Challenging", "Difficult", "Extreme"];
        return labels[level - 1] || "Easy";
    };

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center bg-beige">
                <Loader2 className="h-12 w-12 animate-spin text-green-primary" />
            </div>
        );
    }

    return (
        <div className="h-screen bg-beige flex flex-col overflow-hidden">
            <NavBar />

            {/* Header */}
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
                        onClick={() => navigate("/trek")}
                        className="group flex items-center gap-3 bg-white/90 backdrop-blur-xl px-6 py-3 rounded-2xl shadow-2xl hover:shadow-green-primary/20 transition-all duration-300 border border-white/20"
                    >
                        <ArrowLeft className="h-5 w-5 text-green-primary group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold text-text-dark">Back to Treks</span>
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
                            <span className="text-lg">{filteredTreks.length}</span>
                            <span className="hidden sm:inline">Epic Treks</span>
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            <div className="flex-1 flex relative overflow-hidden pt-20">
                {/* Sidebar */}
                <AnimatePresence>
                    {sidebarOpen && (
                        <motion.div
                            initial={{ x: -400, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -400, opacity: 0 }}
                            className="hidden lg:flex w-[380px] bg-white/95 backdrop-blur-sm shadow-xl flex-col border-r border-border"
                        >
                            <div className="flex-1 overflow-y-auto overscroll-contain" ref={sidebarScrollRef}>
                                <div className="p-6 space-y-6">
                                    {/* Search */}
                                    <div className="relative group">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-green-primary" />
                                        <input
                                            type="text"
                                            placeholder="Search your next adventure..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 border-2 border-border focus:border-green-primary rounded-2xl focus:outline-none"
                                        />
                                    </div>

                                    {/* Filters */}
                                    <div className="bg-white rounded-2xl p-5 shadow-lg border border-border">
                                        <button onClick={() => setShowFilters(!showFilters)} className="flex items-center justify-between w-full">
                                            <div className="flex items-center gap-3">
                                                <SlidersHorizontal className="h-5 w-5 text-green-primary" />
                                                <span className="font-bold text-text-dark">Difficulty Filters</span>
                                            </div>
                                            {selectedDifficulty.length > 0 && (
                                                <span className="bg-green-primary text-white text-sm px-3 py-1 rounded-full font-bold">{selectedDifficulty.length}</span>
                                            )}
                                        </button>
                                        <AnimatePresence>
                                            {showFilters && (
                                                <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="mt-4 overflow-hidden">
                                                    <div className="flex flex-wrap gap-2">
                                                        {[1, 2, 3, 4, 5].map((level) => (
                                                            <button
                                                                key={level}
                                                                onClick={() => setSelectedDifficulty(prev => prev.includes(level) ? prev.filter(d => d !== level) : [...prev, level])}
                                                                className={`px-4 py-2 rounded-xl text-sm font-bold ${selectedDifficulty.includes(level) ? "bg-green-primary text-white" : "bg-gray-100"}`}
                                                            >
                                                                {getDifficultyLabel(level)}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Results Count */}
                                    <div className="flex items-center justify-between px-2">
                                        <p className="text-sm font-bold text-text-dark/70 flex items-center gap-2">
                                            <Mountain className="h-4 w-4 text-green-primary" />
                                            {filteredTreks.length} adventures await
                                        </p>
                                    </div>

                                    {/* Trek Cards */}
                                    <div className="space-y-4">
                                        {filteredTreks.map((trek, index) => (
                                            <motion.button
                                                key={trek.id}
                                                ref={(el) => { trekCardRefs.current[trek.id] = el; }}
                                                onClick={() => handleTrekClick(trek)}
                                                className={`w-full text-left relative overflow-hidden rounded-xl transition-all duration-300 p-5 space-y-3 ${selectedTrek === trek.id ? "border-2 border-green-primary shadow-lg" : "border border-border shadow-sm"}`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-black text-base text-text-dark truncate">{trek.name}</h3>
                                                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                                                        <span className="text-yellow-600">★</span>
                                                        <span className="font-bold text-yellow-700">{trek.rating}</span>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-text-dark/60 line-clamp-2">{trek.description}</p>
                                                <div className="grid grid-cols-3 gap-2">
                                                    <div className="bg-gray-50 rounded-lg p-2 text-center text-xs font-bold">{trek.duration}</div>
                                                    <div className="bg-green-50 rounded-lg p-2 text-center text-xs font-bold text-green-700">${trek.price}</div>
                                                    <div className="bg-purple-50 rounded-lg p-2 text-center text-xs font-bold text-purple-700">{trek.difficulty}</div>
                                                </div>
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Map */}
                <div className="flex-1 w-full h-full relative z-0">
                    <MapContainer
                        center={[27.7, 85.3]}
                        zoom={7}
                        style={{ height: "100%", width: "100%" }}
                        scrollWheelZoom={true}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <MapController selectedTrekId={selectedTrek} treks={treks} />

                        {filteredTreks.map((trek) => (
                            <Marker
                                key={trek.id}
                                position={trek.coordinates}
                                icon={selectedTrek === trek.id ? activeIcon : defaultMarkerIcon}
                                eventHandlers={{
                                    click: () => handleTrekClick(trek)
                                }}
                            >
                                <Popup>
                                    <div className="p-2 min-w-[200px]">
                                        <h3 className="font-bold text-lg mb-2">{trek.name}</h3>
                                        <div className="flex gap-2 mb-2">
                                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-bold">${trek.price}</span>
                                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-bold">{trek.duration}</span>
                                        </div>
                                        <button
                                            className="w-full bg-green-primary text-white py-2 rounded-lg text-sm font-bold hover:bg-green-secondary transition-colors"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/trek/${trek.slug}`);
                                            }}
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>

                <MapBottomSheet isOpen={bottomSheetOpen} onOpenChange={setBottomSheetOpen}>
                    {/* Mobile List Content (Simplified) */}
                    <div className="p-4">
                        <h3 className="font-bold mb-4">{filteredTreks.length} Treks Found</h3>
                        <div className="space-y-3">
                            {filteredTreks.map(trek => (
                                <div key={trek.id} onClick={() => handleTrekClick(trek)} className={`p-3 border rounded-lg ${selectedTrek === trek.id ? 'border-green-primary bg-green-50' : ''}`}>
                                    <div className="font-bold">{trek.name}</div>
                                    <div className="text-sm text-gray-600">${trek.price} • {trek.duration}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </MapBottomSheet>
            </div>
        </div>
    );
}
