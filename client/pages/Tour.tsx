import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import TourPageHero from "@/components/TourPageHero";
import Footer from "@/components/Footer";
import WhyTravelWithUs from "@/components/WhyTravelWithUs";
import MobileStickyBottomCTA from "@/components/MobileStickyBottomCTA";
import {
  MapPin,
  Calendar,
  Users,
  ArrowRight,
  Heart,
  Star,
  TrendingUp,
  AlertCircle,
  X,
  Check,
  Grid,
  Map as MapIcon,
  ArrowUpDown,
  SlidersHorizontal,
  GitCompare,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import { API_BASE_URL } from "@/lib/config";

// Fix Leaflet default icon issue
const defaultIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Quick View Modal Component
function QuickViewModal({ tour, isOpen, onClose }: any) {
  if (!isOpen || !tour) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-card rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors z-10"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="relative h-64 sm:h-80 overflow-hidden rounded-t-2xl">
            <img src={tour.image} alt={tour.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h2 className="text-3xl font-black mb-2">{tour.name}</h2>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{tour.location}</span>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-beige rounded-lg">
                <Calendar className="h-5 w-5 mx-auto mb-2 text-green-primary" />
                <p className="text-sm font-bold text-text-dark">{tour.duration}</p>
              </div>
              <div className="text-center p-4 bg-beige rounded-lg">
                <Users className="h-5 w-5 mx-auto mb-2 text-green-primary" />
                <p className="text-sm font-bold text-text-dark">{tour.groupSize}</p>
              </div>
              <div className="text-center p-4 bg-beige rounded-lg">
                <Star className="h-5 w-5 mx-auto mb-2 text-green-primary" />
                <p className="text-sm font-bold text-text-dark">{tour.rating}/5</p>
              </div>
            </div>

            <p className="text-text-dark/70 leading-relaxed mb-6">
              {tour.description}
            </p>

            <div className="mb-6">
              <h3 className="font-bold text-lg mb-3">Highlights</h3>
              <ul className="space-y-2">
                {tour.highlights?.map((highlight: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-primary flex-shrink-0 mt-0.5" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-green-primary to-green-primary/85 rounded-xl text-white">
              <div>
                <p className="text-sm opacity-80">Starting from</p>
                <p className="text-3xl font-black">${tour.price}</p>
              </div>
              <button
                onClick={() => (window.location.href = `/tour/${tour.slug}`)}
                className="bg-white text-green-primary px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
              >
                View Full Details
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Comparison Modal Component
function ComparisonModal({ tours, isOpen, onClose }: any) {
  if (!isOpen || tours.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-card rounded-2xl max-w-6xl w-full my-8 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="text-2xl font-black text-green-primary">Compare Tours</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-beige rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left p-3 font-bold">Feature</th>
                  {tours.map((tour: any) => (
                    <th key={tour.id} className="p-3 text-center min-w-[200px]">
                      <img
                        loading="lazy" src={tour.image}
                        alt={tour.name}
                        className="w-full h-32 object-cover rounded-lg mb-2"
                      />
                      <p className="font-bold text-sm">{tour.name}</p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-border">
                  <td className="p-3 font-semibold">Price</td>
                  {tours.map((tour: any) => (
                    <td key={tour.id} className="p-3 text-center font-black text-green-primary">
                      ${tour.price}
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-border bg-beige/30">
                  <td className="p-3 font-semibold">Duration</td>
                  {tours.map((tour: any) => (
                    <td key={tour.id} className="p-3 text-center">
                      {tour.duration}
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-border">
                  <td className="p-3 font-semibold">Group Size</td>
                  {tours.map((tour: any) => (
                    <td key={tour.id} className="p-3 text-center">
                      {tour.groupSize}
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-border bg-beige/30">
                  <td className="p-3 font-semibold">Difficulty</td>
                  {tours.map((tour: any) => (
                    <td key={tour.id} className="p-3 text-center">
                      <div className="flex justify-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`h-2 w-2 rounded-full ${i < tour.difficulty ? "bg-green-primary" : "bg-gray-300"
                              }`}
                          />
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-border">
                  <td className="p-3 font-semibold">Rating</td>
                  {tours.map((tour: any) => (
                    <td key={tour.id} className="p-3 text-center">
                      ⭐ {tour.rating} ({tour.reviewCount})
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-border bg-beige/30">
                  <td className="p-3 font-semibold">Location</td>
                  {tours.map((tour: any) => (
                    <td key={tour.id} className="p-3 text-center">
                      {tour.location}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-6 border-t border-border flex justify-end gap-3">
            {tours.map((tour: any) => (
              <button
                key={tour.id}
                onClick={() => (window.location.href = `/tour/${tour.slug}`)}
                className="px-4 py-2 bg-green-primary text-white rounded-lg font-semibold hover:bg-green-primary/90 transition-colors text-sm"
              >
                View {tour.name.split(" ")[0]}
              </button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

interface Tour {
  id: string;
  name: string;
  slug: string;
  location: string;
  coverImage?: string;
  description: string;
  longDescription?: string;
  price: number;
  duration: string;
  maxGroupSize: number;
  vibe?: string;
  difficulty: number;
  rating: number;
  latitude?: number;
  longitude?: number;
  highlights?: string[];
  images?: string[];
  isActive: boolean;
  isFeatured: boolean;
  tags?: string[];
  // Computed fields added in displayTours
  image?: string;
  groupSize?: string;
  reviewCount?: number;
  badges?: string[];
  spotsLeft?: number;
  coordinates?: [number, number];
}

export default function Tour() {
  const navigate = useNavigate();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredTours, setFilteredTours] = useState<Tour[]>([]);
  const [hasFiltered, setHasFiltered] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [quickViewTour, setQuickViewTour] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [sortBy, setSortBy] = useState<string>("default");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [comparisonList, setComparisonList] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);

  // Advanced filters
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 3000]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<number[]>([]);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagSearch, setTagSearch] = useState<string>("");

  // Compute available tags from all tours
  const availableTags = useMemo(() => {
    const tagsSet = new Set<string>();
    tours.forEach(tour => {
      if (tour.tags && Array.isArray(tour.tags)) {
        tour.tags.forEach(tag => tagsSet.add(tag));
      }
    });
    return Array.from(tagsSet).sort();
  }, [tours]);

  // Fetch tours from API
  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/tours`);
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

  useEffect(() => {
    const saved = localStorage.getItem("favoriteTours");
    if (saved) {
      setFavorites(JSON.parse(saved));
    }

    const viewed = localStorage.getItem("recentlyViewedTours");
    if (viewed) {
      setRecentlyViewed(JSON.parse(viewed));
    }
  }, []);

  // Sticky filter bar on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Transform data for display - add computed fields that UI expects
  const displayTours = useMemo(() => {
    return tours.map(tour => ({
      ...tour,
      image: tour.coverImage || tour.images?.[0] || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
      groupSize: `${tour.maxGroupSize || 12} people`,
      vibe: tour.vibe || "Cultural Tour",
      reviewCount: Math.floor(Math.random() * 300) + 50,
      badges: tour.tags && tour.tags.length > 0 ? tour.tags : (tour.isFeatured ? ["Popular"] : []),
      spotsLeft: Math.floor(Math.random() * 10) + 3,
      coordinates: (tour.latitude && tour.longitude ? [tour.latitude, tour.longitude] : [27.7, 85.3]) as [number, number],
    }));
  }, [tours]);

  // REMOVED: Hardcoded tours array (176 lines) - now fetched from database
  const _removedHardcodedTours = [
    {
      id: 1,
      name: "Chitwan tour",
      slug: "chitwan-tour",
      location: "Nepal",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
      description: "Explore the wildlife and natural beauty of Chitwan",
      fullDescription: "Discover the rich biodiversity of Chitwan National Park, home to rare one-horned rhinoceros and Bengal tigers.",
      price: 899,
      duration: "5 days",
      groupSize: "8-12 people",
      vibe: "Wildlife Adventure",
      difficulty: 1,
      rating: 4.7,
      reviewCount: 145,
      badges: ["Wildlife", "Nature"],
      spotsLeft: 8,
      coordinates: [27.5291, 84.3542],
      highlights: [
        "Jungle safari in Chitwan National Park",
        "Canoe ride on Rapti River",
        "Visit elephant breeding center",
        "Bird watching experience",
      ],
    },
    {
      id: 2,
      name: "Kathmandu tour",
      slug: "kathmandu-tour",
      location: "Nepal",
      image: "https://images.unsplash.com/photo-1548013146-72d440642117?w=600&h=400&fit=crop",
      description: "Discover the ancient temples and culture of Kathmandu",
      fullDescription: "Immerse in the vibrant capital city with its UNESCO World Heritage sites and rich cultural heritage.",
      price: 699,
      duration: "4 days",
      groupSize: "10-15 people",
      vibe: "Cultural Heritage",
      difficulty: 1,
      rating: 4.9,
      reviewCount: 287,
      badges: ["Popular", "Cultural"],
      spotsLeft: 12,
      coordinates: [27.7172, 85.3240],
      highlights: [
        "Visit Swayambhunath Stupa",
        "Explore Durbar Square",
        "Tour Pashupatinath Temple",
        "Experience local markets",
      ],
    },
    {
      id: 3,
      name: "Pokhara tour",
      slug: "pokhara-tour",
      location: "Nepal",
      image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600&h=400&fit=crop",
      description: "Experience the lakeside beauty and mountain views of Pokhara",
      fullDescription: "Relax by Phewa Lake with stunning Annapurna mountain range as your backdrop in Nepal's adventure capital.",
      price: 799,
      duration: "6 days",
      groupSize: "8-12 people",
      vibe: "Lake & Mountains",
      difficulty: 2,
      rating: 4.8,
      reviewCount: 198,
      badges: ["Trending", "Adventure"],
      spotsLeft: 6,
      coordinates: [28.2096, 83.9856],
      highlights: [
        "Boat ride on Phewa Lake",
        "Sunrise at Sarangkot",
        "Visit Davis Falls",
        "Paragliding experience",
      ],
    },
    {
      id: 4,
      name: "Lumbini tour",
      slug: "lumbini-tour",
      location: "Nepal",
      image: "https://images.unsplash.com/photo-1516214104703-3e691de8e4ad?w=600&h=400&fit=crop",
      description: "Visit the birthplace of Lord Buddha",
      fullDescription: "Explore the sacred pilgrimage site where Buddha was born, featuring ancient monasteries and peaceful gardens.",
      price: 599,
      duration: "3 days",
      groupSize: "10-15 people",
      vibe: "Spiritual Journey",
      difficulty: 1,
      rating: 4.9,
      reviewCount: 165,
      badges: ["Spiritual", "UNESCO Site"],
      spotsLeft: 10,
      coordinates: [27.4833, 83.2833],
      highlights: [
        "Maya Devi Temple visit",
        "Meditation in sacred gardens",
        "Tour international monasteries",
        "Ancient Ashoka Pillar",
      ],
    },
    {
      id: 5,
      name: "Rara tour",
      slug: "rara-tour",
      location: "Nepal",
      image: "https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=600&h=400&fit=crop",
      description: "Trek to Nepal's largest and deepest lake",
      fullDescription: "Journey to the pristine Rara Lake, Nepal's hidden gem surrounded by pine forests and snow-capped peaks.",
      price: 1299,
      duration: "10 days",
      groupSize: "6-10 people",
      vibe: "Remote Wilderness",
      difficulty: 4,
      rating: 4.9,
      reviewCount: 89,
      badges: ["Remote", "Trekking"],
      spotsLeft: 4,
      coordinates: [29.5300, 82.0800],
      highlights: [
        "Camp by Rara Lake shores",
        "Trek through Rara National Park",
        "Wildlife spotting",
        "Pristine mountain scenery",
      ],
    },
    {
      id: 6,
      name: "Illam tour",
      slug: "illam-tour",
      location: "Nepal",
      image: "https://images.unsplash.com/photo-1531065208531-4036c0dba3f5?w=600&h=400&fit=crop",
      description: "Explore the tea gardens and scenic hills of Illam",
      fullDescription: "Discover the lush green tea estates and breathtaking sunrise views from the eastern hills of Nepal.",
      price: 699,
      duration: "5 days",
      groupSize: "8-12 people",
      vibe: "Tea Gardens & Hills",
      difficulty: 2,
      rating: 4.7,
      reviewCount: 112,
      badges: ["Scenic", "Nature"],
      spotsLeft: 8,
      coordinates: [26.9094, 87.9283],
      highlights: [
        "Visit tea plantation estates",
        "Sunrise at Kanyam",
        "Local tea tasting experience",
        "Explore Antu Danda viewpoint",
      ],
    },
    {
      id: 7,
      name: "Rara Lake tour",
      slug: "rara-lake-tour",
      location: "Nepal",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
      description: "Experience the crystal clear waters of Rara Lake",
      fullDescription: "Visit Nepal's largest lake, a hidden paradise in the remote northwest with stunning alpine scenery.",
      price: 1199,
      duration: "8 days",
      groupSize: "6-10 people",
      vibe: "Alpine Lake Adventure",
      difficulty: 3,
      rating: 4.8,
      reviewCount: 95,
      badges: ["Hidden Gem", "Nature"],
      spotsLeft: 5,
      coordinates: [29.5400, 82.0700],
      highlights: [
        "Crystal clear lake views",
        "Forest trekking experience",
        "Local Thakuri culture",
        "Photography opportunities",
      ],
    },
  ];

  const handleFilterChange = (filters: any) => {
    let results = displayTours;

    if (filters.search) {
      results = results.filter(
        (tour) =>
          tour.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          tour.location.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.destination && filters.destination !== "all") {
      results = results.filter((tour) =>
        tour.location.toLowerCase().includes(filters.destination.toLowerCase())
      );
    }

    setFilteredTours(results);
    setHasFiltered(true);
  };

  // Apply advanced filters and sorting
  const processedTours = useMemo(() => {
    let results = hasFiltered ? filteredTours : displayTours;

    // Price filter
    results = results.filter(
      (tour) => tour.price >= priceRange[0] && tour.price <= priceRange[1]
    );

    // Difficulty filter
    if (selectedDifficulty.length > 0) {
      results = results.filter((tour) => selectedDifficulty.includes(tour.difficulty));
    }

    // Duration (Days) filter
    if (selectedDays.length > 0) {
      results = results.filter((tour) => {
        const days = parseInt(tour.duration);
        return selectedDays.some(range => {
          if (range === "1-5") return days >= 1 && days <= 5;
          if (range === "5-10") return days >= 5 && days <= 10;
          if (range === "11-15") return days >= 11 && days <= 15;
          if (range === "15-20") return days >= 15 && days <= 20;
          return false;
        });
      });
    }

    // Tags filter
    if (selectedTags.length > 0) {
      results = results.filter((tour) => {
        if (!tour.tags || !Array.isArray(tour.tags)) return false;
        return selectedTags.some(tag => tour.tags?.includes(tag));
      });
    }

    // Sorting
    switch (sortBy) {
      case "price-low":
        results = [...results].sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        results = [...results].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        results = [...results].sort((a, b) => b.rating - a.rating);
        break;
      case "duration":
        results = [...results].sort((a, b) => {
          const aDays = parseInt(a.duration);
          const bDays = parseInt(b.duration);
          return aDays - bDays;
        });
        break;
      case "popular":
        results = [...results].sort((a, b) => b.reviewCount - a.reviewCount);
        break;
    }

    return results;
  }, [hasFiltered, filteredTours, displayTours, priceRange, selectedDifficulty, selectedDays, selectedTags, sortBy]);

  const toggleFavorite = (tourId: string) => {
    const newFavorites = favorites.includes(tourId)
      ? favorites.filter((id) => id !== tourId)
      : [...favorites, tourId];
    setFavorites(newFavorites);
    localStorage.setItem("favoriteTours", JSON.stringify(newFavorites));
  };

  const toggleComparison = (tourId: string) => {
    if (comparisonList.includes(tourId)) {
      setComparisonList(comparisonList.filter((id) => id !== tourId));
    } else {
      if (comparisonList.length < 3) {
        setComparisonList([...comparisonList, tourId]);
      }
    }
  };

  const trackRecentlyViewed = (tourId: string) => {
    const updated = [tourId, ...recentlyViewed.filter(id => id !== tourId)].slice(0, 6);
    setRecentlyViewed(updated);
    localStorage.setItem("recentlyViewedTours", JSON.stringify(updated));
  };

  const getDifficultyLabel = (level: number) => {
    const labels = ["Easy", "Moderate", "Challenging", "Difficult", "Extreme"];
    return labels[level - 1] || "Easy";
  };

  const uniqueLocations = [...new Set(displayTours.map((t) => t.location))];

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-beige flex flex-col">
        <TourPageHero />
        <div className="flex-grow flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-primary mx-auto mb-4"></div>
            <p className="text-xl text-text-dark/60">Loading tours...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-beige flex flex-col">
        <TourPageHero />
        <div className="flex-grow flex items-center justify-center py-20">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
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

  // No tours state
  if (tours.length === 0) {
    return (
      <div className="min-h-screen bg-beige flex flex-col">
        <TourPageHero />
        <div className="flex-grow flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-xl text-text-dark/60">No tours available at the moment.</p>
            <p className="text-sm text-text-dark/40 mt-2">Please check back later!</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige flex flex-col">
      <TourPageHero />
      <div className="flex-grow">
        {/* View Controls & Sort - Sticky on Scroll */}
        <section className={`py-4 px-3 sm:px-6 lg:px-12 max-w-7xl mx-auto transition-all ${isSticky
          ? 'fixed top-0 left-0 right-0 bg-beige shadow-lg z-40 border-b border-border'
          : 'relative'
          }`}>
          <div className={isSticky ? 'max-w-7xl mx-auto' : ''}>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              {/* Left: View Toggle + Advanced Filters */}
              <div className="flex items-center gap-3">
                {/* View Mode Toggle */}
                <div className="flex bg-card rounded-lg shadow-sm border border-border">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`px-4 py-2 rounded-l-lg flex items-center gap-2 transition-colors ${viewMode === "grid"
                      ? "bg-green-primary text-white"
                      : "text-text-dark hover:bg-beige"
                      }`}
                  >
                    <Grid className="h-4 w-4" />
                    <span className="hidden sm:inline">Grid</span>
                  </button>
                  <button
                    onClick={() => navigate("/tour/map")}
                    className={`px-4 py-2 rounded-r-lg flex items-center gap-2 transition-colors text-text-dark hover:bg-beige`}
                  >
                    <MapIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">Map</span>
                  </button>
                </div>

                {/* Advanced Filters Button */}
                <button
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm border ${showAdvancedFilters
                    ? "bg-green-primary text-white border-green-primary"
                    : "bg-card text-text-dark border-border hover:bg-beige"
                    }`}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="hidden sm:inline">Filters</span>
                </button>
              </div>

              {/* Right: Sort + Comparison */}
              <div className="flex items-center gap-3">
                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4 text-text-dark/60" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 bg-card border border-border rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-green-primary"
                  >
                    <option value="default">Default</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="duration">Shortest Duration</option>
                    <option value="popular">Most Popular</option>
                  </select>
                </div>

                {/* Compare Button */}
                {comparisonList.length > 0 && (
                  <button
                    onClick={() => setShowComparison(true)}
                    className="px-4 py-2 bg-blue-accent text-white rounded-lg font-semibold hover:bg-blue-accent-dark transition-colors flex items-center gap-2"
                  >
                    <GitCompare className="h-4 w-4" />
                    Compare ({comparisonList.length})
                  </button>
                )}
              </div>
            </div>

            {/* Advanced Filters Panel */}
            <AnimatePresence>
              {showAdvancedFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-6 bg-card rounded-xl shadow-sm border border-border overflow-hidden"
                >
                  <div className="p-6 space-y-6">
                    {/* Price Range */}
                    <div>
                      <label className="block text-sm font-bold mb-3">
                        Price Range: ${priceRange[0]} - ${priceRange[1]}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="3000"
                        step="100"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full"
                      />
                    </div>

                    {/* Difficulty */}
                    <div>
                      <label className="block text-sm font-bold mb-3">Difficulty Level</label>
                      <div className="flex flex-wrap gap-2">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <button
                            key={level}
                            onClick={() => {
                              if (selectedDifficulty.includes(level)) {
                                setSelectedDifficulty(selectedDifficulty.filter((d) => d !== level));
                              } else {
                                setSelectedDifficulty([...selectedDifficulty, level]);
                              }
                            }}
                            className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors ${selectedDifficulty.includes(level)
                              ? "bg-green-primary text-white"
                              : "bg-beige text-text-dark hover:bg-green-primary/10"
                              }`}
                          >
                            {getDifficultyLabel(level)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Days (Duration) */}
                    <div>
                      <label className="block text-sm font-bold mb-3">Trip Duration</label>
                      <div className="flex flex-wrap gap-2">
                        {["1-5", "5-10", "11-15", "15-20"].map((range) => (
                          <button
                            key={range}
                            onClick={() => {
                              if (selectedDays.includes(range)) {
                                setSelectedDays(selectedDays.filter((d) => d !== range));
                              } else {
                                setSelectedDays([...selectedDays, range]);
                              }
                            }}
                            className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors ${selectedDays.includes(range)
                              ? "bg-green-primary text-white"
                              : "bg-beige text-text-dark hover:bg-green-primary/10"
                              }`}
                          >
                            {range} days
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Tags Filter */}
                    <div>
                      <label className="block text-sm font-bold mb-3">Search by Tags</label>
                      <input
                        type="text"
                        value={tagSearch}
                        onChange={(e) => setTagSearch(e.target.value)}
                        placeholder="Type to search tags..."
                        className="w-full px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-primary mb-3"
                      />
                      {availableTags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {availableTags
                            .filter(tag => tag.toLowerCase().includes(tagSearch.toLowerCase()))
                            .map((tag) => (
                              <button
                                key={tag}
                                onClick={() => {
                                  if (selectedTags.includes(tag)) {
                                    setSelectedTags(selectedTags.filter((t) => t !== tag));
                                  } else {
                                    setSelectedTags([...selectedTags, tag]);
                                  }
                                }}
                                className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors ${selectedTags.includes(tag)
                                  ? "bg-blue-accent text-white"
                                  : "bg-beige text-text-dark hover:bg-blue-accent/10"
                                  }`}
                              >
                                {tag}
                              </button>
                            ))}
                        </div>
                      )}
                      {tagSearch && availableTags.filter(tag => tag.toLowerCase().includes(tagSearch.toLowerCase())).length === 0 && (
                        <p className="text-sm text-text-dark/50 italic">No matching tags found</p>
                      )}
                    </div>

                    {/* Reset Filters */}
                    <button
                      onClick={() => {
                        setPriceRange([0, 3000]);
                        setSelectedDifficulty([]);
                        setSelectedDays([]);
                        setSelectedTags([]);
                        setTagSearch("");
                      }}
                      className="text-sm text-blue-accent hover:text-blue-accent-dark font-semibold"
                    >
                      Reset All Filters
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Tours Display: Grid or Map */}
        <section className="py-8 px-3 sm:px-6 lg:px-12 max-w-7xl mx-auto">
          {viewMode === "grid" ? (
            // Grid View
            processedTours.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl text-text-dark/60">No tours found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {processedTours.map((tour, index) => (
                  <motion.div
                    key={tour.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="group bg-card rounded-xl overflow-hidden shadow-premium-sm hover:shadow-premium-lg transition-all border border-border relative"
                  >
                    {/* Comparison Checkbox */}
                    <div className="absolute top-3 left-3 z-10">
                      <label className="cursor-pointer">
                        <input
                          type="checkbox"
                          checked={comparisonList.includes(tour.id)}
                          onChange={() => toggleComparison(tour.id)}
                          className="sr-only peer"
                        />
                        <div className="w-6 h-6 rounded-full border-2 border-white shadow-md bg-white/90 backdrop-blur-sm peer-checked:bg-green-primary peer-checked:border-green-primary transition-all flex items-center justify-center">
                          {comparisonList.includes(tour.id) && (
                            <Check className="h-4 w-4 text-white" />
                          )}
                        </div>
                      </label>
                    </div>

                    {/* Favorite Button */}
                    <button
                      onClick={() => toggleFavorite(tour.id)}
                      className="absolute top-3 right-3 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:scale-110 transition-transform"
                    >
                      <Heart
                        className={`h-5 w-5 ${favorites.includes(tour.id) ? "fill-red-500 text-red-500" : "text-gray-600"
                          }`}
                      />
                    </button>

                    {/* Image */}
                    <div className="relative h-48 sm:h-56 overflow-hidden">
                      <img
                        loading="lazy" src={tour.image}
                        alt={tour.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                      {/* Badges */}
                      <div className="absolute top-3 left-14 flex flex-wrap gap-2">
                        {tour.badges?.map((badge, i) => (
                          <span
                            key={i}
                            className={`px-3 py-1 rounded-full text-xs font-bold shadow-md ${badge === "Popular"
                              ? "bg-green-primary text-white"
                              : badge === "Trending"
                                ? "bg-blue-accent text-white"
                                : badge === "Limited Spots"
                                  ? "bg-red-500 text-white"
                                  : "bg-blue-accent text-white"
                              }`}
                          >
                            {badge === "Trending" && "🔥 "}
                            {badge}
                          </span>
                        ))}
                      </div>

                      {/* Spots Left */}
                      {tour.spotsLeft && tour.spotsLeft <= 5 && (
                        <div className="absolute bottom-3 left-3">
                          <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-bold shadow-md flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Only {tour.spotsLeft} spots left!
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-center gap-2 text-green-primary text-sm font-semibold mb-2">
                        <MapPin className="h-4 w-4" />
                        {tour.location}
                      </div>

                      <h3 className="text-xl font-black text-text-dark mb-2 line-clamp-2">
                        {tour.name}
                      </h3>

                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-bold text-sm">{tour.rating}</span>
                          <span className="text-xs text-text-dark/60">({tour.reviewCount})</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`h-2 w-2 rounded-full ${i < tour.difficulty ? "bg-green-primary" : "bg-gray-300"
                                }`}
                            />
                          ))}
                          <span className="text-xs text-text-dark/60 ml-1">
                            {getDifficultyLabel(tour.difficulty)}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-text-dark/70 mb-4 line-clamp-2">{tour.description}</p>

                      <div className="flex items-center gap-4 text-xs text-text-dark/60 mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {tour.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {tour.groupSize}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div>
                          <p className="text-xs text-text-dark/60">From</p>
                          <p className="text-2xl font-black text-green-primary">${tour.price}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              trackRecentlyViewed(tour.id);
                              setQuickViewTour(tour);
                            }}
                            className="px-4 py-2 bg-beige hover:bg-beige-light text-text-dark font-semibold rounded-lg transition-colors text-sm"
                          >
                            Quick View
                          </button>
                          <button
                            onClick={() => {
                              trackRecentlyViewed(tour.id);
                              navigate(`/tour/${tour.slug}`);
                            }}
                            className="px-4 py-2 bg-green-primary hover:bg-green-primary/90 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 text-sm"
                          >
                            View <ArrowRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )
          ) : (
            // Map View
            <div className="h-[600px] rounded-xl overflow-hidden shadow-premium border border-border">
              <MapContainer
                // @ts-ignore
                center={[20, 0]}
                zoom={2}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  // @ts-ignore
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {processedTours.map((tour) => (
                  <Marker
                    key={tour.id}
                    // @ts-ignore
                    position={tour.coordinates as [number, number]}
                    // @ts-ignore
                    icon={defaultIcon}
                  >
                    <Popup>
                      <div className="p-2">
                        <img
                          loading="lazy" src={tour.image}
                          alt={tour.name}
                          className="w-48 h-32 object-cover rounded-lg mb-2"
                        />
                        <h3 className="font-bold text-sm mb-1">{tour.name}</h3>
                        <p className="text-xs text-gray-600 mb-2">{tour.location}</p>
                        <div className="flex items-center justify-between">
                          <span className="font-black text-green-primary">${tour.price}</span>
                          <button
                            onClick={() => navigate(`/tour/${tour.slug}`)}
                            className="px-3 py-1 bg-green-primary text-white rounded text-xs font-semibold"
                          >
                            View Tour
                          </button>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          )}
        </section>

        {/* Recently Viewed Tours */}
        {recentlyViewed.length > 0 && (
          <section className="py-12 px-3 sm:px-6 lg:px-12 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl sm:text-3xl font-black text-green-primary">
                Recently Viewed
              </h2>
              <button
                onClick={() => {
                  setRecentlyViewed([]);
                  localStorage.removeItem("recentlyViewedTours");
                }}
                className="text-sm text-text-dark/60 hover:text-text-dark transition-colors"
              >
                Clear History
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {recentlyViewed.map((tourId) => {
                const tour = tours.find(t => t.id === tourId);
                if (!tour) return null;

                return (
                  <motion.div
                    key={tour.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="group cursor-pointer"
                    onClick={() => {
                      trackRecentlyViewed(tour.id);
                      navigate(`/tour/${tour.slug}`);
                    }}
                  >
                    <div className="relative aspect-square rounded-lg overflow-hidden mb-2">
                      <img
                        loading="lazy" src={tour.image}
                        alt={tour.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <h3 className="text-sm font-bold text-text-dark line-clamp-2 mb-1">
                      {tour.name}
                    </h3>
                    <p className="text-xs text-text-dark/60">{tour.location}</p>
                    <p className="text-sm font-black text-green-primary mt-1">
                      ${tour.price}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {/* Why Travel With Us */}
        <WhyTravelWithUs />
      </div>

      {/* Mobile CTA */}
      <MobileStickyBottomCTA />

      {/* Footer */}
      <Footer />

      {/* Quick View Modal */}
      <QuickViewModal tour={quickViewTour} isOpen={!!quickViewTour} onClose={() => setQuickViewTour(null)} />

      {/* Comparison Modal */}
      <ComparisonModal
        tours={tours.filter((t) => comparisonList.includes(t.id))}
        isOpen={showComparison}
        onClose={() => setShowComparison(false)}
      />
    </div>
  );
}
