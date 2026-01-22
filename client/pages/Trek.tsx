import React, { useState, useEffect, useMemo, useCallback, lazy, Suspense, useRef } from "react";
import { useNavigate } from "react-router-dom";
import TrekPageHero from "@/components/TrekPageHero";
import Footer from "@/components/Footer";
import WhyTravelWithUs from "@/components/WhyTravelWithUs";
import MobileStickyBottomCTA from "@/components/MobileStickyBottomCTA";
import MapBottomSheet from "@/components/MapBottomSheet";
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

// Dynamically import TrekMap to avoid SSR issues with Leaflet
const TrekMap = lazy(() => import("@/components/TrekMap"));
import { API_BASE_URL } from "@/lib/config";

// Quick View Modal Component
function QuickViewModal({ trek, isOpen, onClose }: any) {
  if (!isOpen || !trek) return null;

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
            <img src={trek.image} alt={trek.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h2 className="text-3xl font-black mb-2">{trek.name}</h2>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{trek.location}</span>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-beige rounded-lg">
                <Calendar className="h-5 w-5 mx-auto mb-2 text-green-primary" />
                <p className="text-sm font-bold text-text-dark">{trek.duration}</p>
              </div>
              <div className="text-center p-4 bg-beige rounded-lg">
                <Users className="h-5 w-5 mx-auto mb-2 text-green-primary" />
                <p className="text-sm font-bold text-text-dark">{trek.groupSize}</p>
              </div>
              <div className="text-center p-4 bg-beige rounded-lg">
                <Star className="h-5 w-5 mx-auto mb-2 text-green-primary" />
                <p className="text-sm font-bold text-text-dark">{trek.rating}/5</p>
              </div>
            </div>

            <p className="text-text-dark/70 leading-relaxed mb-6">
              {trek.description}
            </p>

            <div className="mb-6">
              <h3 className="font-bold text-lg mb-3">Highlights</h3>
              <ul className="space-y-2">
                {trek.highlights?.map((highlight: string, i: number) => (
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
                <p className="text-3xl font-black">${trek.price}</p>
              </div>
              <button
                onClick={() => (window.location.href = `/trek/${trek.slug}`)}
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
function ComparisonModal({ treks, isOpen, onClose }: any) {
  if (!isOpen || treks.length === 0) return null;

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
            <h2 className="text-2xl font-black text-green-primary">Compare Treks</h2>
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
                  {treks.map((trek: any) => (
                    <th key={trek.id} className="p-3 text-center min-w-[200px]">
                      <img
                        loading="lazy" src={trek.image}
                        alt={trek.name}
                        className="w-full h-32 object-cover rounded-lg mb-2"
                      />
                      <p className="font-bold text-sm">{trek.name}</p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-border">
                  <td className="p-3 font-semibold">Price</td>
                  {treks.map((trek: any) => (
                    <td key={trek.id} className="p-3 text-center font-black text-green-primary">
                      ${trek.price}
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-border bg-beige/30">
                  <td className="p-3 font-semibold">Duration</td>
                  {treks.map((trek: any) => (
                    <td key={trek.id} className="p-3 text-center">
                      {trek.duration}
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-border">
                  <td className="p-3 font-semibold">Group Size</td>
                  {treks.map((trek: any) => (
                    <td key={trek.id} className="p-3 text-center">
                      {trek.groupSize}
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-border bg-beige/30">
                  <td className="p-3 font-semibold">Difficulty</td>
                  {treks.map((trek: any) => (
                    <td key={trek.id} className="p-3 text-center">
                      <div className="flex justify-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`h-2 w-2 rounded-full ${i < trek.difficulty ? "bg-green-primary" : "bg-gray-300"
                              }`}
                          />
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-border">
                  <td className="p-3 font-semibold">Rating</td>
                  {treks.map((trek: any) => (
                    <td key={trek.id} className="p-3 text-center">
                      ⭐ {trek.rating} ({trek.reviewCount})
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-border bg-beige/30">
                  <td className="p-3 font-semibold">Location</td>
                  {treks.map((trek: any) => (
                    <td key={trek.id} className="p-3 text-center">
                      {trek.location}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-6 border-t border-border flex justify-end gap-3">
            {treks.map((trek: any) => (
              <button
                key={trek.id}
                onClick={() => (window.location.href = `/trek/${trek.slug}`)}
                className="px-4 py-2 bg-green-primary text-white rounded-lg font-semibold hover:bg-green-primary/90 transition-colors text-sm"
              >
                View {trek.name.split(" ")[0]}
              </button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

interface Trek {
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
  altitude?: string;
  latitude?: number;
  longitude?: number;
  highlights?: string[];
  bestSeason?: string[];
  images?: string[];
  isActive: boolean;
  isFeatured: boolean;
  tags?: string[];
  // Computed fields added in displayTreks
  image?: string;
  groupSize?: string;
  reviewCount?: number;
  badges?: string[];
  spotsLeft?: number;
  coordinates?: [number, number];
}

export default function Trek() {
  const navigate = useNavigate();
  const [treks, setTreks] = useState<Trek[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredTreks, setFilteredTreks] = useState<Trek[]>([]);
  const [hasFiltered, setHasFiltered] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [quickViewTrek, setQuickViewTrek] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [sortBy, setSortBy] = useState<string>("default");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [comparisonList, setComparisonList] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [selectedTrekId, setSelectedTrekId] = useState<string | null>(null);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(true);
  const trekCardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const bottomSheetScrollRef = useRef<HTMLDivElement | null>(null);

  // Advanced filters
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 3000]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<number[]>([]);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagSearch, setTagSearch] = useState<string>("");

  // Compute available tags from all treks
  const availableTags = useMemo(() => {
    const tagsSet = new Set<string>();
    treks.forEach(trek => {
      if (trek.tags && Array.isArray(trek.tags)) {
        trek.tags.forEach(tag => tagsSet.add(tag));
      }
    });
    return Array.from(tagsSet).sort();
  }, [treks]);

  // Fetch treks from API
  useEffect(() => {
    const fetchTreks = async () => {
      try {
        setLoading(true);
        // Cache busting to ensure fresh data
        const response = await fetch(`${API_BASE_URL}/api/treks?_t=${Date.now()}`);
        if (!response.ok) {
          throw new Error("Failed to fetch treks");
        }
        const data = await response.json();
        setTreks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load treks");
      } finally {
        setLoading(false);
      }
    };

    fetchTreks();
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("favoriteTreks");
    if (saved) {
      setFavorites(JSON.parse(saved));
    }

    const viewed = localStorage.getItem("recentlyViewedTreks");
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
  const displayTreks = useMemo(() => {
    return treks.map(trek => ({
      ...trek,
      image: trek.coverImage || trek.images?.[0] || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
      groupSize: `${trek.maxGroupSize || 12} people`,
      vibe: trek.vibe || "Adventure Trek",
      reviewCount: Math.floor(Math.random() * 300) + 50,
      badges: trek.tags && trek.tags.length > 0 ? trek.tags : (trek.isFeatured ? ["Featured"] : []),
      spotsLeft: Math.floor(Math.random() * 10) + 3,
      coordinates: (trek.latitude !== null && trek.longitude !== null && !isNaN(Number(trek.latitude)) && !isNaN(Number(trek.longitude))
        ? [Number(trek.latitude), Number(trek.longitude)]
        : [28.0, 84.0]) as [number, number],
    }));
  }, [treks]);

  // REMOVED: Hardcoded treks array (365 lines) - now fetched from database
  const _removedHardcodedTreks = [
    {
      id: 1,
      name: "Annapurna Base Camp Trek",
      slug: "annapurna-base-camp",
      location: "Nepal",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
      description: "Trek to the sanctuary of Annapurna surrounded by towering peaks",
      fullDescription: "Journey through diverse landscapes from lush rhododendron forests to high-altitude alpine meadows, culminating at Annapurna Base Camp at 4,130m with 360-degree mountain views.",
      price: 1299,
      duration: "12 days",
      groupSize: "8-12 people",
      vibe: "Classic Himalayan Trek",
      difficulty: 3, // Moderate
      rating: 4.9,
      reviewCount: 287,
      badges: ["Popular", "Trending"],
      spotsLeft: 6,
      altitude: "4,130m",
      coordinates: [28.5300, 83.8800],
      highlights: [
        "360-degree mountain panorama at base camp",
        "Trek through traditional Gurung villages",
        "Rhododendron forests and alpine meadows",
        "Close-up views of Annapurna I (8,091m)",
      ],
    },
    {
      id: 2,
      name: "Everest Base Camp Trek",
      slug: "everest-base-camp",
      location: "Nepal",
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&h=400&fit=crop",
      description: "Stand at the foot of the world's highest mountain",
      fullDescription: "Follow in the footsteps of legendary mountaineers on this iconic trek to Everest Base Camp. Experience Sherpa culture, visit ancient monasteries, and witness the majesty of Mount Everest up close.",
      price: 1699,
      duration: "14 days",
      groupSize: "6-10 people",
      vibe: "Ultimate Bucket List",
      difficulty: 4, // Challenging
      rating: 4.9,
      reviewCount: 412,
      badges: ["Iconic", "Most Popular"],
      spotsLeft: 4,
      altitude: "5,364m",
      coordinates: [28.0026, 86.8528],
      highlights: [
        "Reach Everest Base Camp at 5,364m",
        "Summit Kala Patthar for panoramic Everest views",
        "Visit Tengboche Monastery",
        "Sherpa villages and mountain culture",
      ],
    },
    {
      id: 3,
      name: "Gokyo Trek",
      slug: "gokyo",
      location: "Nepal",
      image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=400&fit=crop",
      description: "Turquoise alpine lakes and panoramic mountain views",
      fullDescription: "Trek to the stunning Gokyo Lakes, sacred turquoise waters set amid towering Himalayas. Summit Gokyo Ri for one of the best viewpoints in the Everest region.",
      price: 1399,
      duration: "12 days",
      groupSize: "8-12 people",
      vibe: "Scenic Beauty",
      difficulty: 3, // Moderate
      rating: 4.9,
      reviewCount: 203,
      badges: ["Scenic", "Trending"],
      spotsLeft: 8,
      altitude: "5,357m",
      coordinates: [27.9600, 86.6900],
      highlights: [
        "Six sacred turquoise Gokyo Lakes",
        "Summit Gokyo Ri (5,357m)",
        "Views of Everest, Lhotse, Makalu, Cho Oyu",
        "Walk on Ngozumpa Glacier",
      ],
    },
    {
      id: 4,
      name: "Manaslu Trek",
      slug: "manaslu",
      location: "Nepal",
      image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=600&h=400&fit=crop",
      description: "Remote trek around the eighth highest mountain",
      fullDescription: "Circle the majestic Mount Manaslu on this stunning trek. Experience authentic Himalayan culture in remote villages and witness breathtaking mountain scenery.",
      price: 1499,
      duration: "14 days",
      groupSize: "6-10 people",
      vibe: "Wild Adventure",
      difficulty: 4, // Challenging
      rating: 4.8,
      reviewCount: 98,
      badges: ["Remote", "Challenging"],
      spotsLeft: 5,
      altitude: "5,106m",
      coordinates: [28.5500, 84.5600],
      highlights: [
        "Trek around Mount Manaslu (8,163m)",
        "Remote Buddhist monasteries",
        "Authentic mountain village culture",
        "Spectacular Himalayan scenery",
      ],
    },
    {
      id: 5,
      name: "Manaslu Circuit Trek",
      slug: "manaslu-circuit",
      location: "Nepal",
      image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=600&h=400&fit=crop",
      description: "Complete circuit around Mount Manaslu",
      fullDescription: "Experience the full Manaslu Circuit, crossing the challenging Larkya La Pass. This remote trek offers incredible mountain views and authentic cultural experiences.",
      price: 1599,
      duration: "16 days",
      groupSize: "6-10 people",
      vibe: "Epic Circuit",
      difficulty: 4, // Challenging
      rating: 4.9,
      reviewCount: 102,
      badges: ["Remote", "Epic"],
      spotsLeft: 7,
      altitude: "5,106m",
      coordinates: [28.5500, 84.5600],
      highlights: [
        "Cross Larkya La Pass at 5,106m",
        "Complete circuit around Manaslu",
        "Remote mountain villages",
        "Tibetan Buddhist culture",
      ],
    },
    {
      id: 6,
      name: "Langtang Valley Trek",
      slug: "langtang-valley",
      location: "Nepal",
      image: "https://images.unsplash.com/photo-1589182373726-e4f658ab50b0?w=600&h=400&fit=crop",
      description: "Pristine valley trek close to Kathmandu",
      fullDescription: "Explore the stunning Langtang Valley, often called the 'Valley of Glaciers.' This less-crowded trek offers incredible mountain views, Tamang culture, and beautiful forests.",
      price: 899,
      duration: "8 days",
      groupSize: "8-12 people",
      vibe: "Hidden Gem",
      difficulty: 2, // Easy-Moderate
      rating: 4.8,
      reviewCount: 156,
      badges: ["Best Value"],
      spotsLeft: 10,
      altitude: "3,870m",
      coordinates: [28.2096, 85.5500],
      highlights: [
        "Less crowded alternative to popular treks",
        "Tamang cultural immersion",
        "Kyanjin Gompa monastery visit",
        "Glacier views and cheese factory tour",
      ],
    },
    {
      id: 7,
      name: "Gosaikunda Trek",
      slug: "gosaikunda",
      location: "Nepal",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
      description: "Sacred alpine lakes pilgrimage trek",
      fullDescription: "Trek to the sacred Gosaikunda Lakes, a pilgrimage site with stunning alpine scenery. Experience the spiritual significance of these holy waters while enjoying spectacular mountain views.",
      price: 799,
      duration: "7 days",
      groupSize: "8-12 people",
      vibe: "Spiritual Journey",
      difficulty: 2, // Easy-Moderate
      rating: 4.7,
      reviewCount: 142,
      badges: ["Spiritual", "Scenic"],
      spotsLeft: 12,
      altitude: "4,380m",
      coordinates: [28.0800, 85.4100],
      highlights: [
        "Sacred Gosaikunda Lake pilgrimage",
        "Stunning alpine lake scenery",
        "Langtang Himalayan views",
        "Rich spiritual and cultural experience",
      ],
    },
    {
      id: 8,
      name: "Kanchenjunga Trek",
      slug: "kanchenjunga",
      location: "Nepal",
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&h=400&fit=crop",
      description: "Trek to the base of the world's third highest peak",
      fullDescription: "Journey to the remote Kanchenjunga region, home to the world's third highest mountain. Experience pristine wilderness, diverse ecosystems, and authentic local culture.",
      price: 1899,
      duration: "20 days",
      groupSize: "4-8 people",
      vibe: "Ultimate Wilderness",
      difficulty: 5, // Very Challenging
      rating: 4.9,
      reviewCount: 67,
      badges: ["Remote", "Epic"],
      spotsLeft: 4,
      altitude: "5,143m",
      coordinates: [27.7025, 88.1475],
      highlights: [
        "Base camp of third highest peak",
        "Remote and pristine wilderness",
        "Diverse flora and fauna",
        "Authentic Limbu and Sherpa culture",
      ],
    },
    {
      id: 9,
      name: "Makalu Barun Trek",
      slug: "makalu-barun",
      location: "Nepal",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
      description: "Explore the remote Makalu region and national park",
      fullDescription: "Trek through the pristine Makalu Barun National Park to the base of Mount Makalu, the fifth highest mountain in the world. Experience incredible biodiversity and remote mountain culture.",
      price: 1799,
      duration: "18 days",
      groupSize: "4-8 people",
      vibe: "Wild Expedition",
      difficulty: 5, // Very Challenging
      rating: 4.8,
      reviewCount: 54,
      badges: ["Remote", "Wildlife"],
      spotsLeft: 5,
      altitude: "4,870m",
      coordinates: [27.8894, 87.0889],
      highlights: [
        "Base camp of Mount Makalu (8,485m)",
        "Pristine national park biodiversity",
        "Remote Rai and Sherpa villages",
        "Spectacular mountain scenery",
      ],
    },
    {
      id: 10,
      name: "Ama Yangri Trek",
      slug: "ama-yangri",
      location: "Nepal",
      image: "https://images.unsplash.com/photo-1589182373726-e4f658ab50b0?w=600&h=400&fit=crop",
      description: "Short trek with panoramic Himalayan views",
      fullDescription: "A short but rewarding trek to Ama Yangri peak, offering spectacular panoramic views of the Himalayas including Langtang, Ganesh Himal, and Jugal ranges. Perfect for those with limited time.",
      price: 599,
      duration: "5 days",
      groupSize: "8-12 people",
      vibe: "Quick Adventure",
      difficulty: 2, // Easy-Moderate
      rating: 4.6,
      reviewCount: 89,
      badges: ["Best Value", "Short"],
      spotsLeft: 15,
      altitude: "3,771m",
      coordinates: [28.0500, 85.5500],
      highlights: [
        "Panoramic Himalayan sunrise views",
        "Close to Kathmandu valley",
        "Sherpa village cultural experience",
        "Perfect for limited time schedules",
      ],
    },
    {
      id: 11,
      name: "Dolpo Trek",
      slug: "dolpo",
      location: "Nepal",
      image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=600&h=400&fit=crop",
      description: "Journey to the remote Tibetan plateau region",
      fullDescription: "Trek through the mystical Dolpo region, one of Nepal's most remote areas. Experience ancient Tibetan Buddhist culture, dramatic landscapes, and the famous Shey Phoksundo Lake.",
      price: 2299,
      duration: "22 days",
      groupSize: "4-8 people",
      vibe: "Remote Expedition",
      difficulty: 5, // Very Challenging
      rating: 4.9,
      reviewCount: 43,
      badges: ["Remote", "Cultural"],
      spotsLeft: 3,
      altitude: "5,360m",
      coordinates: [29.1500, 82.8500],
      highlights: [
        "Ancient Tibetan Buddhist culture",
        "Shey Phoksundo Lake crystal waters",
        "Remote trans-Himalayan landscapes",
        "Unique Bon Po culture",
      ],
    },
    {
      id: 12,
      name: "Upper Mustang Trek",
      slug: "upper-mustang",
      location: "Nepal",
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&h=400&fit=crop",
      description: "Forbidden kingdom behind the Himalayas",
      fullDescription: "Journey to the ancient kingdom of Lo, Upper Mustang. Experience the preserved Tibetan Buddhist culture, dramatic desert landscapes, and the walled city of Lo Manthang.",
      price: 2199,
      duration: "16 days",
      groupSize: "4-8 people",
      vibe: "Cultural Heritage",
      difficulty: 3, // Moderate
      rating: 4.9,
      reviewCount: 78,
      badges: ["Cultural", "Unique"],
      spotsLeft: 6,
      altitude: "3,840m",
      coordinates: [29.1800, 83.9500],
      highlights: [
        "Walled city of Lo Manthang",
        "Ancient Tibetan Buddhist monasteries",
        "Desert-like trans-Himalayan landscape",
        "Preserved medieval culture",
      ],
    },
    {
      id: 13,
      name: "Dhorpatan Trek",
      slug: "dhorpatan",
      location: "Nepal",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
      description: "Wildlife and hunting reserve adventure",
      fullDescription: "Trek through Nepal's only hunting reserve, home to diverse wildlife including blue sheep and snow leopard. Experience remote valleys, high passes, and authentic mountain culture.",
      price: 1299,
      duration: "12 days",
      groupSize: "6-10 people",
      vibe: "Wildlife Adventure",
      difficulty: 3, // Moderate
      rating: 4.7,
      reviewCount: 51,
      badges: ["Wildlife", "Remote"],
      spotsLeft: 8,
      altitude: "4,500m",
      coordinates: [28.5500, 83.0500],
      highlights: [
        "Nepal's only hunting reserve",
        "Blue sheep and wildlife spotting",
        "Remote Magar villages",
        "High mountain passes",
      ],
    },
    {
      id: 14,
      name: "Shey Phoksundo Trek",
      slug: "shey-phoksundo",
      location: "Nepal",
      image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=400&fit=crop",
      description: "Deepest lake in Nepal and pristine wilderness",
      fullDescription: "Trek to the stunning Shey Phoksundo Lake, Nepal's deepest lake with crystal turquoise waters. Experience the pristine Dolpo-pa culture and remote Himalayan wilderness.",
      price: 1699,
      duration: "14 days",
      groupSize: "6-10 people",
      vibe: "Pristine Wilderness",
      difficulty: 4, // Challenging
      rating: 4.8,
      reviewCount: 62,
      badges: ["Scenic", "Remote"],
      spotsLeft: 7,
      altitude: "3,612m",
      coordinates: [29.2000, 82.9500],
      highlights: [
        "Nepal's deepest and most beautiful lake",
        "Crystal turquoise alpine waters",
        "Shey Gompa ancient monastery",
        "Remote Dolpo-pa culture",
      ],
    },
  ];

  const handleFilterChange = (filters: any) => {
    let results = displayTreks;

    if (filters.search) {
      results = results.filter(
        (trek) =>
          trek.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          trek.location.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.destination && filters.destination !== "all") {
      results = results.filter((trek) =>
        trek.location.toLowerCase().includes(filters.destination.toLowerCase())
      );
    }

    setFilteredTreks(results);
    setHasFiltered(true);
  };

  // Apply advanced filters and sorting
  const processedTreks = useMemo(() => {
    let results = hasFiltered ? filteredTreks : displayTreks;

    // Price filter
    results = results.filter(
      (trek) => trek.price >= priceRange[0] && trek.price <= priceRange[1]
    );

    // Difficulty filter
    if (selectedDifficulty.length > 0) {
      results = results.filter((trek) => selectedDifficulty.includes(trek.difficulty));
    }

    // Duration (Days) filter
    if (selectedDays.length > 0) {
      results = results.filter((trek) => {
        const days = parseInt(trek.duration);
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
      results = results.filter((trek) => {
        if (!trek.tags || !Array.isArray(trek.tags)) return false;
        return selectedTags.some(tag => trek.tags?.includes(tag));
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
  }, [hasFiltered, filteredTreks, displayTreks, priceRange, selectedDifficulty, selectedDays, selectedTags, sortBy]);

  const toggleFavorite = (trekId: string) => {
    const newFavorites = favorites.includes(trekId)
      ? favorites.filter((id) => id !== trekId)
      : [...favorites, trekId];
    setFavorites(newFavorites);
    localStorage.setItem("favoriteTreks", JSON.stringify(newFavorites));
  };

  const toggleComparison = (trekId: string) => {
    if (comparisonList.includes(trekId)) {
      setComparisonList(comparisonList.filter((id) => id !== trekId));
    } else {
      if (comparisonList.length < 3) {
        setComparisonList([...comparisonList, trekId]);
      }
    }
  };

  const trackRecentlyViewed = (trekId: string) => {
    const updated = [trekId, ...recentlyViewed.filter(id => id !== trekId)].slice(0, 6);
    setRecentlyViewed(updated);
    localStorage.setItem("recentlyViewedTreks", JSON.stringify(updated));
  };

  const getDifficultyLabel = (level: number) => {
    const labels = ["Easy", "Moderate", "Challenging", "Difficult", "Extreme"];
    return labels[level - 1] || "Easy";
  };

  const uniqueLocations = [...new Set(displayTreks.map((t) => t.location))];

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-beige flex flex-col">
        <TrekPageHero />
        <div className="flex-grow flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-primary mx-auto mb-4"></div>
            <p className="text-xl text-text-dark/60">Loading treks...</p>
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
        <TrekPageHero />
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

  // No treks state
  if (treks.length === 0) {
    return (
      <div className="min-h-screen bg-beige flex flex-col">
        <TrekPageHero />
        <div className="flex-grow flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-xl text-text-dark/60">No treks available at the moment.</p>
            <p className="text-sm text-text-dark/40 mt-2">Please check back later!</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige flex flex-col">
      <TrekPageHero />

      <div className="flex-grow">
        {/* View Controls & Sort - Sticky on Scroll */}
        <section className={`py-4 px-3 sm:px-6 lg:px-12 max-w-7xl mx-auto transition-all ${viewMode === "map" ? "hidden lg:block" : ""} ${isSticky
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
                    onClick={() => setViewMode("map")}
                    className={`px-4 py-2 rounded-r-lg flex items-center gap-2 transition-colors ${viewMode === "map"
                      ? "bg-green-primary text-white"
                      : "text-text-dark hover:bg-beige bg-card border-l border-border"
                      }`}
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
                      <label className="block text-sm font-bold mb-3">Trek Duration</label>
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

        {/* Treks Display: Grid or Map */}
        <section className={`${viewMode === "map" ? "lg:py-8 lg:px-12 py-0 px-0" : "py-8 px-3 sm:px-6 lg:px-12"} max-w-7xl mx-auto`}>
          {viewMode === "grid" ? (
            // Grid View
            processedTreks.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl text-text-dark/60">No treks found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {processedTreks.map((trek, index) => (
                  <motion.div
                    key={trek.id}
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
                          checked={comparisonList.includes(trek.id)}
                          onChange={() => toggleComparison(trek.id)}
                          className="sr-only peer"
                        />
                        <div className="w-6 h-6 rounded-full border-2 border-white shadow-md bg-white/90 backdrop-blur-sm peer-checked:bg-green-primary peer-checked:border-green-primary transition-all flex items-center justify-center">
                          {comparisonList.includes(trek.id) && (
                            <Check className="h-4 w-4 text-white" />
                          )}
                        </div>
                      </label>
                    </div>

                    {/* Favorite Button */}
                    <button
                      onClick={() => toggleFavorite(trek.id)}
                      className="absolute top-3 right-3 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:scale-110 transition-transform"
                    >
                      <Heart
                        className={`h-5 w-5 ${favorites.includes(trek.id) ? "fill-red-500 text-red-500" : "text-gray-600"
                          }`}
                      />
                    </button>

                    {/* Image */}
                    <div className="relative h-48 sm:h-56 overflow-hidden">
                      <img
                        loading="lazy" src={trek.image}
                        alt={trek.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                      {/* Badges */}
                      <div className="absolute top-3 left-14 flex flex-wrap gap-2">
                        {trek.badges?.map((badge, i) => (
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
                      {trek.spotsLeft && trek.spotsLeft <= 5 && (
                        <div className="absolute bottom-3 left-3">
                          <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-bold shadow-md flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Only {trek.spotsLeft} spots left!
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-center gap-2 text-green-primary text-sm font-semibold mb-2">
                        <MapPin className="h-4 w-4" />
                        {trek.location}
                      </div>

                      <h3 className="text-xl font-black text-text-dark mb-2 line-clamp-2">
                        {trek.name}
                      </h3>

                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-bold text-sm">{trek.rating}</span>
                          <span className="text-xs text-text-dark/60">({trek.reviewCount})</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`h-2 w-2 rounded-full ${i < trek.difficulty ? "bg-green-primary" : "bg-gray-300"
                                }`}
                            />
                          ))}
                          <span className="text-xs text-text-dark/60 ml-1">
                            {getDifficultyLabel(trek.difficulty)}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-text-dark/70 mb-4 line-clamp-2">{trek.description}</p>

                      <div className="flex items-center gap-4 text-xs text-text-dark/60 mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {trek.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {trek.groupSize}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div>
                          <p className="text-xs text-text-dark/60">From</p>
                          <p className="text-2xl font-black text-green-primary">${trek.price}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              trackRecentlyViewed(trek.id);
                              setQuickViewTrek(trek);
                            }}
                            className="px-4 py-2 bg-beige hover:bg-beige-light text-text-dark font-semibold rounded-lg transition-colors text-sm"
                          >
                            Quick View
                          </button>
                          <button
                            onClick={() => {
                              trackRecentlyViewed(trek.id);
                              navigate(`/trek/${trek.slug}`);
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
            // Map View - Desktop: Normal map, Mobile: Full-screen map + bottom sheet
            <div>
              {/* Desktop Map View */}
              <div className="hidden lg:block">
                <Suspense
                  fallback={
                    <div className="h-[600px] rounded-xl overflow-hidden shadow-premium border border-border flex items-center justify-center bg-beige-light">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-primary mx-auto mb-4"></div>
                        <p className="text-text-dark/70">Loading map...</p>
                      </div>
                    </div>
                  }
                >
                  <TrekMap
                    treks={processedTreks.map((trek) => ({
                      id: trek.id,
                      name: trek.name,
                      slug: trek.slug,
                      location: trek.location,
                      image: trek.image,
                      price: trek.price,
                      coordinates: trek.coordinates as [number, number],
                      description: trek.description,
                    }))}
                    onTrekClick={(slug) => navigate(`/trek/${slug}`)}
                  />
                </Suspense>
              </div>

              {/* Mobile Map View - Full Screen + Bottom Sheet */}
              <div className="lg:hidden block fixed inset-0 bg-white z-30">
                {/* Back to Grid Button */}
                <button
                  onClick={() => setViewMode("grid")}
                  className="absolute top-4 left-4 z-50 px-4 py-2 bg-white rounded-lg shadow-lg flex items-center gap-2 font-semibold text-text-dark hover:bg-beige transition-colors"
                >
                  <Grid className="h-4 w-4" />
                  <span>Grid View</span>
                </button>

                <Suspense
                  fallback={
                    <div className="h-full flex items-center justify-center bg-beige-light">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-primary mx-auto mb-4"></div>
                        <p className="text-text-dark/70">Loading map...</p>
                      </div>
                    </div>
                  }
                >
                  <TrekMap
                    treks={processedTreks.map((trek) => ({
                      id: trek.id,
                      name: trek.name,
                      slug: trek.slug,
                      location: trek.location,
                      image: trek.image,
                      price: trek.price,
                      coordinates: trek.coordinates as [number, number],
                      description: trek.description,
                    }))}
                    onTrekClick={(slug) => navigate(`/trek/${slug}`)}
                    onMarkerClick={(trekId) => {
                      setSelectedTrekId(trekId);
                      setBottomSheetOpen(true);
                      // Scroll to trek card in bottom sheet
                      setTimeout(() => {
                        const cardElement = trekCardRefs.current[trekId];
                        if (cardElement && bottomSheetScrollRef.current) {
                          cardElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                          });
                        }
                      }, 300);
                    }}
                    selectedTrekId={selectedTrekId}
                    className="w-full h-full"
                  />
                </Suspense>

                {/* Bottom Sheet with Trek Cards */}
                <MapBottomSheet
                  isOpen={bottomSheetOpen}
                  onOpenChange={setBottomSheetOpen}
                >
                  <div ref={bottomSheetScrollRef} className="p-4 space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-text-dark">
                        {processedTreks.length} Trek{processedTreks.length !== 1 ? 's' : ''} Found
                      </h3>
                      <button
                        onClick={() => setViewMode("grid")}
                        className="text-sm text-green-primary font-semibold"
                      >
                        Exit Map
                      </button>
                    </div>

                    {processedTreks.map((trek) => (
                      <motion.div
                        key={trek.id}
                        ref={(el) => { trekCardRefs.current[trek.id] = el; }}
                        onClick={() => {
                          setSelectedTrekId(trek.id);
                        }}
                        className={`bg-white rounded-xl overflow-hidden shadow-sm transition-all cursor-pointer ${selectedTrekId === trek.id
                          ? 'ring-2 ring-green-primary shadow-md'
                          : 'hover:shadow-md'
                          }`}
                      >
                        <div className="flex gap-3 p-3">
                          {/* Image */}
                          <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                            <img
                              loading="lazy" src={trek.image}
                              alt={trek.name}
                              className="w-full h-full object-cover"
                            />
                            {selectedTrekId === trek.id && (
                              <div className="absolute inset-0 bg-green-primary/20 flex items-center justify-center">
                                <div className="w-3 h-3 bg-green-primary rounded-full animate-pulse" />
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm text-text-dark mb-1 truncate">
                              {trek.name}
                            </h4>
                            <div className="flex items-center gap-1 text-xs text-text-dark/60 mb-2">
                              <MapPin className="h-3 w-3" />
                              <span className="truncate">{trek.location}</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3 text-green-primary" />
                                <span>{trek.duration}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 text-yellow-500" />
                                <span>{trek.rating}</span>
                              </div>
                            </div>
                          </div>

                          {/* Price */}
                          <div className="flex flex-col items-end justify-between">
                            <span className="text-lg font-black text-green-primary">
                              ${trek.price}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/trek/${trek.slug}`);
                              }}
                              className="text-xs bg-green-primary text-white px-3 py-1 rounded-full font-semibold hover:bg-green-primary/90"
                            >
                              View
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </MapBottomSheet>
              </div>
            </div>
          )}
        </section>

        {/* Recently Viewed Treks */}
        {
          recentlyViewed.length > 0 && (
            <section className="py-12 px-3 sm:px-6 lg:px-12 max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl sm:text-3xl font-black text-green-primary">
                  Recently Viewed
                </h2>
                <button
                  onClick={() => {
                    setRecentlyViewed([]);
                    localStorage.removeItem("recentlyViewedTreks");
                  }}
                  className="text-sm text-text-dark/60 hover:text-text-dark transition-colors"
                >
                  Clear History
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {recentlyViewed.map((trekId) => {
                  const trek = treks.find(t => t.id === trekId);
                  if (!trek) return null;

                  return (
                    <motion.div
                      key={trek.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="group cursor-pointer"
                      onClick={() => {
                        trackRecentlyViewed(trek.id);
                        navigate(`/trek/${trek.slug}`);
                      }}
                    >
                      <div className="relative aspect-square rounded-lg overflow-hidden mb-2">
                        <img
                          loading="lazy" src={trek.image}
                          alt={trek.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <h3 className="text-sm font-bold text-text-dark line-clamp-2 mb-1">
                        {trek.name}
                      </h3>
                      <p className="text-xs text-text-dark/60">{trek.location}</p>
                      <p className="text-sm font-black text-green-primary mt-1">
                        ${trek.price}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </section>
          )
        }

        {/* Why Travel With Us */}
        <WhyTravelWithUs />
      </div >

      {/* Mobile CTA */}
      <MobileStickyBottomCTA />

      {/* Footer */}
      <Footer />

      {/* Quick View Modal */}
      <QuickViewModal trek={quickViewTrek} isOpen={!!quickViewTrek
      } onClose={() => setQuickViewTrek(null)} />

      {/* Comparison Modal */}
      <ComparisonModal
        treks={treks.filter((t) => comparisonList.includes(t.id))}
        isOpen={showComparison}
        onClose={() => setShowComparison(false)}
      />
    </div >
  );
}
