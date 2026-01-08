import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import { useAuth } from "@/context/AuthContext";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton";
import { RouteMap } from "@/components/RouteMap";
import {
  MapPin,
  Calendar,
  Users,
  ArrowLeft,
  Star,
  Check,
  X,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Navigation,
} from "lucide-react";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { additionalAnnapurnaReviews, additionalEverestReviews, trekRouteCoordinates } from "@/data/trekReviews";


// Sticky Booking Widget Component
function StickyBookingWidget({ trek, onBookClick }: { trek: any; onBookClick: () => void }) {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 600) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      animate={{ y: isSticky ? [0, -2, 0] : 0 }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      className={`transition-all duration-300 ${isSticky
        ? "fixed top-20 right-6 w-80 z-30"
        : "relative w-full"
        }`}
    >
      <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-premium-lg border-2 border-green-primary/20 p-6 space-y-4 hover:shadow-premium-hover transition-all duration-300">
        <div className="text-center">
          <p className="text-sm text-text-dark/60">From</p>
          <p className="text-4xl font-black text-green-primary">${trek.price}</p>
          <p className="text-sm text-text-dark/60">per person</p>
        </div>

        <div className="space-y-3 border-t border-b border-border py-4">
          <div className="flex justify-between text-sm">
            <span className="text-text-dark/60">
              <Calendar className="h-4 w-4 inline mr-2" />
              Duration
            </span>
            <span className="font-semibold">{trek.duration}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-dark/60">
              <Users className="h-4 w-4 inline mr-2" />
              Group Size
            </span>
            <span className="font-semibold">{trek.groupSize}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-dark/60">
              <Star className="h-4 w-4 inline mr-2 fill-yellow-400 text-yellow-400" />
              Rating
            </span>
            <span className="font-semibold">{trek.rating}/5 ({trek.reviewCount})</span>
          </div>
        </div>

        <motion.button
          onClick={onBookClick}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="relative w-full bg-gradient-to-r from-green-primary to-green-primary/90 text-white py-4 rounded-lg font-bold text-lg shadow-lg overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          <span className="relative z-10">Book This Trek</span>
        </motion.button>

        <button className="w-full border-2 border-green-primary text-green-primary py-3 rounded-lg font-semibold hover:bg-green-primary/5 transition-colors">
          Request Custom Quote
        </button>

        <div className="text-center text-xs text-text-dark/60">
          <p>🔒 Secure booking • No payment required today</p>
          <p className="mt-1">📞 Questions? Call us at +1-555-0123</p>
        </div>
      </div>
    </motion.div>
  );
}

// Photo Gallery Component - Enhanced with Spectacular Animations
function PhotoGallery({ images }: { images: string[] }) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="space-y-4">
      {/* Main Image with Gradient Overlay */}
      <motion.div
        key={selectedImage}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative aspect-video rounded-xl overflow-hidden shadow-premium-lg group"
      >
        <img
          src={images[selectedImage]}
          alt="Trek photo"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Gradient Overlay for Depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-green-primary/40 via-transparent to-transparent opacity-60" />
      </motion.div>

      {/* Thumbnails with Enhanced Hover States */}
      <div className="grid grid-cols-6 gap-2">
        {images.map((img, index) => (
          <motion.button
            key={index}
            onClick={() => setSelectedImage(index)}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={`aspect-video rounded-lg overflow-hidden relative ${selectedImage === index
              ? "ring-4 ring-green-primary shadow-lg shadow-green-primary/30"
              : "opacity-60 hover:opacity-100 hover:shadow-md"
              } transition-all duration-300`}
          >
            <img
              src={img}
              alt={`Thumbnail ${index + 1}`}
              className={`w-full h-full object-cover transition-all duration-300 ${selectedImage === index ? '' : 'hover:brightness-110'
                }`}
            />
            {/* Pulsing Effect on Selected */}
            {selectedImage === index && (
              <div className="absolute inset-0 ring-4 ring-green-primary/50 rounded-lg animate-pulse" />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}


// Reviews Component
function ReviewsSection({ reviews }: { reviews: any[] }) {
  return (
    <div className="space-y-6">
      {reviews.map((review, index) => (
        <div key={index} className="bg-card rounded-xl p-6 shadow-premium-sm border border-border">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <img
                src={review.avatar}
                alt={review.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h4 className="font-bold text-text-dark">{review.name}</h4>
                <p className="text-sm text-text-dark/60">{review.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < review.rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                    }`}
                />
              ))}
            </div>
          </div>
          <p className="text-text-dark/70 leading-relaxed">{review.text}</p>
          {review.verified && (
            <div className="mt-3 inline-flex items-center gap-1 px-3 py-1 bg-green-primary/10 text-green-primary rounded-full text-xs font-semibold">
              <Check className="h-3 w-3" />
              Verified Traveler
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Similar Treks Carousel
function SimilarTreksCarousel({ treks, currentTrekId }: any) {
  const [emblaRef] = useEmblaCarousel({ loop: false, align: "start" });
  const navigate = useNavigate();

  const similarTreks = treks.filter((t: any) => t.id !== currentTrekId).slice(0, 4);

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex gap-6">
        {similarTreks.map((trek: any) => (
          <div
            key={trek.id}
            className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0"
          >
            <div
              onClick={() => navigate(`/trek/${trek.slug}`)}
              className="bg-card rounded-xl overflow-hidden shadow-premium-sm hover:shadow-premium transition-all cursor-pointer border border-border"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={trek.image}
                  alt={trek.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 text-green-primary text-sm font-semibold mb-2">
                  <MapPin className="h-4 w-4" />
                  {trek.location}
                </div>
                <h3 className="font-bold text-text-dark mb-2 line-clamp-2">{trek.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-green-primary">${trek.price}</span>
                  <span className="text-sm text-text-dark/60">{trek.duration}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TrekDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const trekDatabase = [
    {
      id: 1,
      name: "Annapurna Base Camp Trek",
      slug: "annapurna-base-camp",
      location: "Annapurna Region, Nepal",
      image: "/annapurna-1.jpg",
      gallery: [
        "/annapurna-1.jpg",
        "/annapurna-2.jpg",
        "/annapurna-3.jpg",
        "/annapurna-4.jpg",
        "/annapurna-5.jpg",
      ],
      description: "Trekking to Annapurna Base Camp is more than just a hike — it's a deeply personal experience. From warm Gurung villages to silent alpine valleys, every step feels sacred. Surrounded by towering Himalayan peaks and peaceful forests, this trek leaves you with memories that stay long after you return home.",
      price: 1299,
      duration: "7-12 days",
      groupSize: "8-12 people",
      difficulty: 3,
      rating: 4.9,
      reviewCount: 234,
      included: [
        { item: "Accommodation", detail: "Tea houses & mountain lodges", included: true },
        { item: "Meals", detail: "Breakfast & Dinner (Dal Bhat recommended)", included: true },
        { item: "Licensed Guide", detail: "Expert local guide with altitude training", included: true },
        { item: "Permits & Fees", detail: "TIMS card & ACAP permit", included: true },
        { item: "Transportation", detail: "Kathmandu-Pokhara-Nayapul transfers", included: true },
        { item: "International Flights", detail: "Book separately", included: false },
        { item: "Travel Insurance", detail: "Mandatory - must cover up to 5,000m", included: false },
        { item: "Personal Expenses", detail: "Snacks, drinks, WiFi, tips", included: false },
      ],
      faqs: [
        {
          q: "What fitness level is required?",
          a: "Moderate fitness is needed. You don't need to be an athlete — just consistent. We recommend 3-4 weeks of training: cardio (30 min/day), stair climbing, leg strength exercises (squats, lunges), and stretching. If you can walk 3-4 hours with breaks, you'll be fine. Remember: go slow, breathe, and enjoy the trail. ABC is not a race.",
        },
        {
          q: "What should I pack?",
          a: "Layered clothing is essential! Use a layering system: base layer, fleece, down jacket, and waterproof shell. Must-haves: quality hiking boots, sunglasses, sunscreen, lip balm, hat, and gloves. Keep your pack light — every extra gram feels heavier with altitude. We'll send a detailed packing list upon booking.",
        },
        {
          q: "What about altitude sickness?",
          a: "Even though ABC is lower than Everest treks, altitude sickness is real. Common symptoms include headache, dizziness, nausea, loss of appetite, and sleep issues. Prevention: drink 3-4 liters of water daily, ascend slowly (we include acclimatization days), eat warm meals (Dal Bhat is best for energy), and listen to your body. Our guides are trained in altitude sickness recognition and carry first aid kits.",
        },
        {
          q: "What gadgets and electronics should I bring?",
          a: "Less is more at altitude. Must-carry: Power bank (15,000-20,000 mAh) as charging gets expensive and unreliable above Deurali, camera/GoPro/smartphone for magical morning light, extra batteries (cold drains them fast — keep inside your jacket!), headlamp for early starts, and universal adapter (charging points are limited and shared). Download offline maps, music, podcasts, movies, and emergency apps before the trek.",
        },
        {
          q: "Will I have WiFi and mobile connectivity?",
          a: "Connectivity exists but it's unpredictable. NTC & Ncell work well till Ghandruk & Chhomrong. From Bamboo → Deurali → ABC, signal drops dramatically. Tea-house WiFi is slow, paid, and shared among many trekkers. Download everything you need before starting: offline Google Maps, entertainment, important documents, and SOS apps. Once you accept being offline, the mountains feel more alive.",
        },
        {
          q: "Is travel insurance mandatory?",
          a: "Yes! Travel insurance is not optional — it's peace of mind. Your insurance must cover: high-altitude trekking (up to 5,000m), emergency helicopter evacuation, medical expenses, trip delays, and baggage loss. This is critical for your safety.",
        },
        {
          q: "How do I get to the trek starting point?",
          a: "From Kathmandu → Pokhara: take a 25-minute flight (best option) or 6-8 hour tourist bus, or hire a private vehicle for groups. From Pokhara → Trek Start (Nayapul/Siwai): local or private jeep. Many trekkers start from Siwai to shorten the route. The trek ends at Siwai or Nayapul, then jeep back to Pokhara. Hot showers and lakeside cafes feel luxurious after the trek!",
        },
        {
          q: "What about Nepal visa?",
          a: "Visa on Arrival is available at Kathmandu airport for most nationalities. Options: 15, 30, or 90 days. Your passport must be valid for at least 6 months from your entry date.",
        },
      ],
      reviews: [
        {
          name: "Sarah Mitchell",
          avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
          rating: 5,
          date: "November 2024",
          text: "This trip exceeded all my expectations! The guides were knowledgeable, the accommodations were comfortable, and the views were absolutely breathtaking. Visiting the temples in Kathmandu and trekking in the Annapurna region were highlights. Can't recommend Eraya enough!",
          verified: true,
        },
        {
          name: "James Chen",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
          rating: 5,
          date: "October 2024",
          text: "An incredible cultural and adventure experience. The local guides shared so much knowledge about Nepalese culture and Buddhism. The food was amazing, and I felt completely safe throughout. Life-changing trip!",
          verified: true,
        },
        {
          name: "Emma Rodriguez",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
          rating: 4,
          date: "September 2024",
          text: "Wonderful trek overall. The only reason I didn't give 5 stars is that one of the accommodations was a bit basic, but the experience more than made up for it. The team was responsive to our needs and the itinerary was well-paced.",
          verified: true,
        },
        ...additionalAnnapurnaReviews,
      ],
      route: trekRouteCoordinates.annapurna,
      itinerary: [
        {
          day: "Day 1",
          title: "Arrival in Kathmandu",
          description: "Welcome to Nepal! Arrive in Kathmandu, transfer to your hotel. Rest and prepare for your adventure. Evening orientation with your guide.",
        },
        {
          day: "Day 2",
          title: "Kathmandu to Pokhara",
          description: "Scenic drive or short flight to Pokhara (820m). Explore the lakeside city and enjoy views of the Annapurna range. Prepare gear and get final briefing.",
        },
        {
          day: "Day 3",
          title: "Pokhara to Ghandruk (1,940m)",
          description: "Drive to Nayapul/Siwai and begin trekking through terraced fields and traditional villages. Arrive at the beautiful Gurung village of Ghandruk with stunning mountain views.",
        },
        {
          day: "Day 4",
          title: "Ghandruk to Chhomrong (2,170m)",
          description: "Trek through rhododendron forests with spectacular views of Annapurna South and Machhapuchhre (Fishtail). Arrive at Chhomrong, the last major settlement before the sanctuary.",
        },
        {
          day: "Day 5",
          title: "Chhomrong to Bamboo (2,310m)",
          description: "Descend to Chhomrong Khola and climb up through bamboo forests. The trail enters the Annapurna Sanctuary as vegetation becomes denser.",
        },
        {
          day: "Day 6",
          title: "Bamboo to Deurali (3,230m)",
          description: "Trek through the scenic Modi Khola valley. Pass through Dovan and Himalaya Hotel. As you gain altitude, notice the changing landscape and cooler temperatures.",
        },
        {
          day: "Day 7",
          title: "Deurali to Annapurna Base Camp (4,130m)",
          description: "Early morning trek to Machhapuchhre Base Camp (3,700m) for breakfast. Then continue to Annapurna Base Camp surrounded by towering peaks. Witness magical sunset views. Acclimatize and rest.",
        },
        {
          day: "Day 8",
          title: "ABC to Bamboo",
          description: "Wake up early for stunning sunrise over the Annapurna massif. After breakfast, begin descent to Bamboo. Enjoy easier breathing as you descend to lower altitude.",
        },
        {
          day: "Day 9",
          title: "Bamboo to Jhinu Danda",
          description: "Continue descent to Jhinu Danda. Optional: relax in natural hot springs — a perfect reward after days of trekking!",
        },
        {
          day: "Day 10",
          title: "Jhinu Danda to Nayapul, Return to Pokhara",
          description: "Final day of trekking down to Nayapul. Drive back to Pokhara. Celebrate your achievement with a lakeside dinner!",
        },
        {
          day: "Day 11",
          title: "Pokhara to Kathmandu",
          description: "Return to Kathmandu by flight or drive. Free time for shopping and sightseeing in Thamel.",
        },
        {
          day: "Day 12",
          title: "Departure",
          description: "Final breakfast with mountain memories. Transfer to airport for your departure flight. Depart with cherished experiences from the heart of the Himalayas.",
        },
      ],
    },
    {
      id: 2,
      name: "Everest Base Camp Trek",
      slug: "everest-base-camp",
      location: "Everest Region, Nepal",
      image: "/everest-1.webp",
      gallery: [
        "/everest-1.webp",
        "/everest-2.jpg",
        "/everest-3.jpg",
        "/everest-4.jpeg",
        "/everest-5.jpeg",
      ],
      description: "\"Today didn't feel like a trek. It felt like the mountains were teaching me something.\" Days begin early, in silence and cold. As the sun rises, the peaks glow softly, and every step feels meaningful. Prayer flags whisper in the wind, glaciers surround you, and moments arrive where words simply disappear. Evenings are spent near warm stoves, sipping tea, watching the mountains stand still under starlit skies. This trek changes you — quietly. Best Season: Autumn (Sep-Nov) for clear skies and stable weather, Spring (Mar-May) for warmer days and blooming rhododendrons.",
      price: 1499,
      duration: "12 days",
      groupSize: "8-12 people",
      difficulty: 4,
      rating: 4.9,
      reviewCount: 312,
      included: [
        { item: "Tea House Accommodation", detail: "Local Sherpa family-run lodges", included: true },
        { item: "Meals", detail: "Breakfast & Dinner (Dal Bhat recommended)", included: true },
        { item: "Expert Sherpa Guide", detail: "Experienced & altitude-trained", included: true },
        { item: "Permits", detail: "Sagarmatha National Park & Khumbu permits, TIMS", included: true },
        { item: "Lukla Flights", detail: "Kathmandu-Lukla return flights", included: true },
        { item: "International Flights", detail: "Book separately", included: false },
        { item: "Travel Insurance", detail: "Mandatory - must cover helicopter evacuation", included: false },
        { item: "Personal Expenses", detail: "WiFi, charging, snacks, drinks, tips", included: false },
      ],
      faqs: [
        {
          q: "Is EBC suitable for beginners?",
          a: "Yes, with good fitness and proper acclimatization. You don't need mountaineering experience, but excellent cardiovascular fitness is essential. Train for 6-8 weeks before: daily cardio, stair climbing with a weighted backpack, leg strength exercises. If you can hike 6-7 hours comfortably, you're ready. The key is slow, steady, and staying positive."
        },
        {
          q: "Will I see Everest from Base Camp?",
          a: "Not directly from Base Camp! The best panoramic view of Everest is from Kalapatthar (5,545m), a steep early-morning climb that's absolutely worth it. You'll see Everest, Lhotse, Nuptse, and the Khumbu Glacier from the summit — one of the most spectacular views on Earth."
        },
        {
          q: "How cold does it get?",
          a: "Temperatures vary dramatically. At Namche (3,440m): 10-15°C during day, near 0°C at night. At Gorakshep/Kalapatthar (5,160-5,545m): -10 to -20°C, especially at sunrise. Layering is critical: thermal base layers, fleece mid-layer, down jacket, and windproof shell. Bring quality gloves, warm socks, and a good sleeping bag rated for -15°C."
        },
        {
          q: "What about altitude sickness (AMS)?",
          a: "Altitude sickness is the biggest challenge on EBC. Common symptoms: headache, nausea, loss of appetite, dizziness, difficulty sleeping. High-risk zones: Namche (3,440m), Tengboche (3,867m), Dingboche (4,410m), Lobuche (4,940m), Gorakshep (5,164m). Prevention: walk slowly (\"Bistari Bistari\" in Nepali), drink 3-4L water daily, no alcohol or smoking, proper acclimatization days, Diamox (doctor-recommended). Severe symptoms = descend immediately. Helicopter evacuation available if required."
        },
        {
          q: "What food is available during the trek?",
          a: "Breakfast: Tibetan bread, chapati, oats, porridge, muesli, eggs (boiled, omelet), pancakes with honey/jam, tea, coffee, ginger lemon honey. Lunch & Dinner: Dal Bhat (best & refillable!), fried rice, noodles, thukpa, Sherpa stew, soups (garlic soup recommended for altitude), momos, pasta, potatoes. Safe eating tips: avoid meat above Namche, drink boiled or purified water only, carry snacks & energy bars."
        },
        {
          q: "What are the accommodations like?",
          a: "Tea houses run by local Sherpa families. What to expect: twin-bed rooms, shared toilets, warm dining hall with stove, no heating in rooms, paid WiFi & charging at higher altitudes. Comfort levels: Lukla-Namche (best facilities), Dingboche-Lobuche (colder, simpler), Gorakshep (very basic & cold). Bring a quality sleeping bag!"
        },
        {
          q: "What gadgets and electronics should I bring?",
          a: "Power bank (20,000+ mAh) is essential as charging is expensive and unreliable above Dingboche. Camera/smartphone for sunrise at Kalapatthar, extra batteries (cold drains them — keep inside jacket!), headlamp for early starts, universal adapter (charging points limited and shared). Download offline maps, music, podcasts, movies, and emergency apps before the trek."
        },
        {
          q: "Will I have WiFi and mobile connectivity?",
          a: "Connectivity exists but unreliable. NTC & Ncell work reasonably well till Namche. From Tengboche onwards, signal drops significantly. Tea-house WiFi is slow, paid ($3-5/day), and shared. Download everything you need beforehand: offline Google Maps, entertainment, important documents, SOS apps. Embrace being offline — the mountains feel more alive that way."
        },
        {
          q: "Is solo trekking safe?",
          a: "Generally yes — the EBC trail is well-traveled. However, hiring a guide is highly recommended for safety, navigation, cultural insights, and altitude sickness management. Guides know the terrain, can communicate with locals, and provide emergency support. Solo trekkers should have prior high-altitude experience."
        },
        {
          q: "What permits are required?",
          a: "You need: Sagarmatha National Park Permit, Khumbu Pasang Lhamu Rural Municipality Permit, and TIMS Card (optional but recommended). We arrange all permits for you."
        },
        {
          q: "What about Nepal visa?",
          a: "Visa on Arrival is available at Kathmandu airport for most nationalities. Options: 15, 30, or 90 days. Your passport must be valid for at least 6 months from entry date."
        },
      ],
      reviews: [
        {
          name: "Michael Roberts",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
          rating: 5,
          date: "December 2024",
          text: "Standing at Everest Base Camp was a dream come true! The trek was challenging but incredibly rewarding. Our Sherpa guide was phenomenal — his knowledge and support made all the difference. The sunrise from Kalapatthar is something I'll never forget.",
          verified: true,
        },
        {
          name: "Sophie Williams",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
          rating: 5,
          date: "November 2024",
          text: "Best adventure of my life! The Khumbu region is spectacular. Each day brought new views, warm Sherpa hospitality, and a deeper appreciation for the mountains. Proper acclimatization days made the difference. Highly recommend this experience!",
          verified: true,
        },
        {
          name: "David Thompson",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
          rating: 5,
          date: "October 2024",
          text: "An epic journey to the roof of the world! The trek tested my limits, but the support from our guide and the camaraderie with fellow trekkers made it unforgettable. Namche Bazaar, Tengboche Monastery, and Kalapatthar — every moment was magical.",
          verified: true,
        },
        ...additionalEverestReviews,
      ],
      route: trekRouteCoordinates.everest,
      itinerary: [
        {
          day: "Day 1",
          title: "Fly to Lukla – Trek to Phakding (2,610m)",
          description: "Scenic 25-minute flight to Lukla (2,860m), one of the world's most thrilling airports. Begin trekking through pine forests and Sherpa villages along the Dudh Koshi River to Phakding. Gentle first day to ease into the trek."
        },
        {
          day: "Day 2",
          title: "Phakding → Namche Bazaar (3,440m)",
          description: "Cross suspension bridges decorated with prayer flags. Pass through Monjo and enter Sagarmatha National Park. Steep climb to Namche Bazaar, the Sherpa capital. First views of Everest, Lhotse, and Thamserku. Celebrate arrival at this vibrant mountain town!"
        },
        {
          day: "Day 3",
          title: "Acclimatization Day in Namche",
          description: "Essential acclimatization day. Hike to Everest View Hotel (3,880m) for stunning panoramic views, or visit Khumjung village and Hillary School. Explore Namche's markets, bakeries, and cafes. Return to Namche for overnight rest."
        },
        {
          day: "Day 4",
          title: "Namche → Tengboche (3,867m)",
          description: "Trek through rhododendron and juniper forests with spectacular mountain views. Visit Tengboche Monastery, the spiritual heart of the Khumbu region. Attend evening prayer ceremony (if timing permits). Sleep surrounded by Everest, Ama Dablam, and Lhotse."
        },
        {
          day: "Day 5",
          title: "Tengboche → Dingboche (4,410m)",
          description: "Descend to Debuche, cross the Imja River, and trek through Pangboche village. Ascend to Dingboche, gateway to the high Himalayas. Notice the landscape becoming more barren and dramatic. Afternoon rest to adjust to altitude."
        },
        {
          day: "Day 6",
          title: "Acclimatization Day in Dingboche",
          description: "Another crucial acclimatization day. Hike to Nagarjun Hill (5,100m) for incredible 360° views of Makalu, Lhotse, and Ama Dablam. Rest, hydrate, and prepare for higher altitudes ahead."
        },
        {
          day: "Day 7",
          title: "Dingboche → Lobuche (4,940m)",
          description: "Trek past memorials to fallen climbers at Thukla Pass — a humbling reminder of Everest's power. Continue to Lobuche with views of the Khumbu Glacier. Increasingly cold and windswept terrain. Rest well for the big day ahead."
        },
        {
          day: "Day 8",
          title: "Lobuche → Gorakshep → Everest Base Camp (5,364m) → Gorakshep",
          description: "Early start to Gorakshep, the last settlement. Drop bags and trek to Everest Base Camp (5,364m) — stand below the world's highest mountain! Witness the Khumbu Icefall and expedition camps. Return to Gorakshep for overnight. Celebrate your incredible achievement!"
        },
        {
          day: "Day 9",
          title: "Kalapatthar Sunrise (5,545m) → Pheriche (4,371m)",
          description: "Pre-dawn hike to Kalapatthar summit for the most spectacular sunrise view of Everest, Nuptse, and the Himalayan range — the ultimate reward! Descend to Gorakshep for breakfast, then trek down to Pheriche. Easier breathing at lower altitude."
        },
        {
          day: "Day 10",
          title: "Pheriche → Namche Bazaar",
          description: "Long descent through Pangboche and Tengboche. Retrace steps back to Namche Bazaar. Enjoy the thicker air, warm showers, and celebratory dinner in Namche's cozy lodges."
        },
        {
          day: "Day 11",
          title: "Namche → Lukla",
          description: "Final day of trekking! Descend through familiar trails, crossing suspension bridges and passing through Sherpa villages. Arrive in Lukla and celebrate completion of the trek with your team. Rest and prepare for flight back."
        },
        {
          day: "Day 12",
          title: "Fly back to Kathmandu",
          description: "Morning flight from Lukla to Kathmandu. Final mountain views as you descend. Enjoy hot showers, comfortable beds, and a celebratory meal in Kathmandu. Depart with memories that will last a lifetime."
        },
      ],
    },
    {
      id: 3,
      name: "Gokyo Lakes & Renjo La Pass Trek",
      slug: "gokyo-lakes-renjo-la",
      location: "Everest / Khumbu Region, Nepal",
      image: "/gokyo-1.jpg",
      gallery: [
        "/gokyo-1.jpg",
        "/gokyo-2.jpg",
        "/gokyo-3.jpg",
        "/gokyo-4.jpg",
        "/gokyo-5.jpg",
      ],
      description: "A Quieter, Wilder Alternative to Everest Base Camp. The Gokyo Lakes & Renjo La Pass Trek is one of the most scenic and less-crowded treks in the Everest region. This journey takes you past turquoise glacial lakes, massive glaciers, and over a dramatic high pass — offering jaw-dropping views of Everest, Cho Oyu, Lhotse, Makalu, and many more Himalayan giants. If you want Everest-level views without Everest-level crowds, this trek is pure gold.",
      price: 1549,
      duration: "12 days",
      groupSize: "6-10 people",
      difficulty: 4,
      rating: 4.9,
      reviewCount: 187,
      included: [
        { item: "Tea House Accommodation", detail: "Comfortable mountain lodges", included: true },
        { item: "Meals", detail: "Breakfast & Dinner throughout trek", included: true },
        { item: "Experienced Guide", detail: "Licensed Sherpa guide", included: true },
        { item: "Permits & Fees", detail: "Sagarmatha National Park & TIMS", included: true },
        { item: "Lukla Flights", detail: "Kathmandu-Lukla return", included: true },
        { item: "International Flights", detail: "Book separately", included: false },
        { item: "Travel Insurance", detail: "Mandatory", included: false },
        { item: "Personal Expenses", detail: "WiFi, snacks, tips", included: false },
      ],
      faqs: [
        {
          q: "How is this different from Everest Base Camp trek?",
          a: "Gokyo Lakes & Renjo La offers fewer trekkers, more dramatic landscapes with turquoise glacial lakes, challenging high passes (Renjo La at 5,360m), and arguably better panoramic Himalayan views from Gokyo Ri. It's for adventurers who want solitude, challenge, and unmatched scenery."
        },
        {
          q: "What makes Gokyo Ri special?",
          a: "Gokyo Ri (5,360m) is one of the best viewpoints in Nepal. From the summit, you can see Everest, Lhotse, Makalu, and Cho Oyu (four of the world's six highest peaks) all together in one panoramic view — something you can't get from Everest Base Camp."
        },
        {
          q: "How difficult is the Renjo La Pass?",
          a: "Renjo La Pass (5,360m) is challenging and requires good fitness and acclimatization. The ascent is steep with scree and boulder sections. Weather can change rapidly. However, the views from both sides of the pass are breathtaking and absolutely worth the effort."
        },
        {
          q: "What is the Ngozumpa Glacier?",
          a: "The Ngozumpa Glacier is Nepal's largest glacier, stretching 36km through the Gokyo Valley. You'll walk alongside it for several hours, witnessing its massive scale and the turquoise Gokyo Lakes formed by glacial melt. It's a spectacular sight of raw Himalayan geology."
        },
        {
          q: "How many Gokyo Lakes will I see?",
          a: "There are officially six Gokyo Lakes, though traditionally five are visited. The Third Lake (Dudh Pokhari) is where the main settlement is. Many trekkers hike to the Fifth Lake for even more spectacular views. The turquoise color comes from glacial rock flour."
        },
        {
          q: "Is this trek suitable for beginners?",
          a: "This is a challenging trek recommended for experienced trekkers with good fitness. The Renjo La Pass crossing and high altitudes require excellent acclimatization and stamina. Prior high-altitude trekking experience is highly beneficial."
        },
        {
          q: "What about altitude sickness?",
          a: "Altitude sickness risk is significant due to high elevations (up to 5,360m). Proper acclimatization days at Namche and Gokyo are crucial. Symptoms include headache, nausea, dizziness. Walk slowly, stay hydrated (3-4L/day), avoid alcohol, and descend if symptoms worsen. Diamox can help with doctor consultation."
        },
        {
          q: "What's the best time to do this trek?",
          a: "Best seasons are Autumn (September-November) for clear skies, stable weather, and best mountain visibility, and Spring (March-May) for warmer days and blooming rhododendrons. Avoid monsoon (June-August) due to rain and poor views, and winter (December-February) due to extreme cold and heavy snow."
        },
        {
          q: "Will I visit Thame Monastery?",
          a: "Yes! After crossing Renjo La Pass, the trek descends through the Bhote Koshi Valley to Thame village, home to the historic Thame Monastery — an important Sherpa spiritual center with beautiful architecture and stunning mountain views."
        },
        {
          q: "How crowded is this trek compared to EBC?",
          a: "Significantly less crowded! While EBC sees thousands of trekkers during peak season, the Gokyo route attracts far fewer people, especially after leaving Namche. You'll experience more solitude, pristine landscapes, and a wilder, more authentic Himalayan adventure."
        },
      ],
      reviews: [
        {
          name: "Alexandra Martinez",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
          rating: 5,
          date: "November 2024",
          text: "The Gokyo Lakes were absolutely mesmerizing! The turquoise color against snow-capped peaks is otherworldly. Crossing Renjo La was challenging but the views made every step worth it. Far less crowded than EBC route — felt like a true adventure!",
          verified: true,
        },
        {
          name: "James Peterson",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
          rating: 5,
          date: "October 2024",
          text: "Stunning trek! Gokyo Ri sunrise was the highlight — seeing four 8000m peaks together was incredible. The Ngozumpa Glacier walk and Fifth Lake visit were spectacular. Our guide was excellent and kept us safe throughout.",
          verified: true,
        },
        {
          name: "Emma Richardson",
          avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
          rating: 5,
          date: "September 2024",
          text: "Best trek I've ever done! The combination of glacial lakes, high passes, and mountain views is unbeatable. Quieter trails, authentic Sherpa culture, and world-class scenery. Thame Monastery was a beautiful cultural highlight.",
          verified: true,
        },
      ],
      route: trekRouteCoordinates.gokyo,
      itinerary: [
        {
          day: "Day 1",
          title: "Fly Kathmandu → Lukla | Trek to Phakding (2,610m)",
          description: "Scenic 25-minute flight to Lukla. Short scenic trek through Dudh Koshi Valley with suspension bridges and mountain views to Phakding."
        },
        {
          day: "Day 2",
          title: "Phakding → Namche Bazaar (3,445m)",
          description: "Cross multiple suspension bridges and enter Sagarmatha National Park before reaching the Sherpa capital with spectacular mountain views."
        },
        {
          day: "Day 3",
          title: "Acclimatization Day at Namche",
          description: "Essential acclimatization day. Hike to Everest View Hotel, visit Khumjung & Khunde villages, and enjoy panoramic Himalayan views. Explore Namche's markets and cafes."
        },
        {
          day: "Day 4",
          title: "Namche → Dole (4,150m)",
          description: "Trail separates from EBC route, entering quieter high-altitude terrain. Trek through rhododendron forests with increasing mountain views. Notice fewer trekkers as you head toward Gokyo Valley."
        },
        {
          day: "Day 5",
          title: "Dole → Machhermo (4,470m)",
          description: "Gradual ascent with incredible views of Cho Oyu (8,188m), Kantega, and Thamserku. Pass through sparse alpine landscape. Stay in traditional tea house."
        },
        {
          day: "Day 6",
          title: "Machhermo → Gokyo (4,750m)",
          description: "Walk alongside Nepal's largest Ngozumpa Glacier and reach the stunning Gokyo Lakes with their distinctive turquoise color. Afternoon hike to Fifth Lake for spectacular glacier and mountain views."
        },
        {
          day: "Day 7",
          title: "Sunrise Hike to Gokyo Ri (5,360m)",
          description: "Pre-dawn ascent to Gokyo Ri summit — one of the best viewpoints in Nepal. See Everest, Lhotse, Makalu, and Cho Oyu (four 8000ers) together in panoramic splendor. Return to Gokyo for rest."
        },
        {
          day: "Day 8",
          title: "Cross Renjo La Pass (5,360m) → Lungden (4,350m)",
          description: "Challenging but immensely rewarding pass crossing. Steep ascent over scree and boulders to Renjo La with breathtaking views on both sides. Descend to Lungden village in Bhote Koshi Valley."
        },
        {
          day: "Day 9",
          title: "Lungden → Thame (3,850m)",
          description: "Descend through Bhote Koshi Valley and visit historic Thame Monastery, an important Sherpa spiritual center with beautiful architecture and mountain backdrop. Experience authentic Sherpa culture."
        },
        {
          day: "Day 10",
          title: "Thame → Namche Bazaar",
          description: "Relaxed downhill walk back to Namche Bazaar. Enjoy the thicker air and celebrate your achievement with a warm meal at a cozy lodge."
        },
        {
          day: "Day 11",
          title: "Namche → Lukla",
          description: "Final trekking day through familiar forests and villages. Arrive in Lukla and celebrate completion of this spectacular trek with your team."
        },
        {
          day: "Day 12",
          title: "Fly Lukla → Kathmandu",
          description: "Morning flight back to Kathmandu with final views of the Himalayas. Enjoy hot showers, comfortable beds, and a celebratory meal. Depart with unforgettable memories of turquoise lakes and mountain majesty."
        },
      ],
    },
    {
      id: 4,
      name: "Royal Cities Discovery Tour",
      slug: "tibet-sacred-journey",
      location: "Tibet",
      image: "https://images.unsplash.com/photo-1548013146-72d440642117?w=1200&h=600&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1548013146-72d440642117?w=1200&h=600&fit=crop",
        "https://images.unsplash.com/photo-1585870332573-8fd36f6e5c8b?w=1200&h=600&fit=crop",
        "https://images.unsplash.com/photo-1590077389303-944e94638156?w=1200&h=600&fit=crop",
        "https://images.unsplash.com/photo-1606041011872-596597976b25?w=1200&h=600&fit=crop",
        "https://images.unsplash.com/photo-1601366313806-bf6c931e9e21?w=1200&h=600&fit=crop",
        "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=1200&h=600&fit=crop",
      ],
      description: "Discover ancient monasteries, sacred pilgrimage sites, and the spiritual practices of Tibet.",
      price: 1599,
      duration: "12 days",
      groupSize: "6-10 people",
      difficulty: 2,
      rating: 4.8,
      reviewCount: 187,
      included: [
        { item: "Accommodation", detail: "Traditional guesthouses", included: true },
        { item: "Meals", detail: "All meals included", included: true },
        { item: "Transportation", detail: "Private vehicle", included: true },
        { item: "Tibetan Guide", detail: "Licensed local guide", included: true },
        { item: "Permits", detail: "Tibet travel permits", included: true },
        { item: "Flights", detail: "International flights", included: false },
        { item: "Insurance", detail: "Required", included: false },
        { item: "Personal Items", detail: "Souvenirs, etc.", included: false },
      ],
      faqs: [
        { q: "Do I need a Tibet visa?", a: "Yes, you'll need both a Chinese visa and a Tibet Travel Permit. We'll assist with all paperwork." },
        { q: "What's the altitude like?", a: "Lhasa is at 3,650m. We include proper acclimatization days in the itinerary." },
        { q: "Can I visit monasteries?", a: "Yes! Monastery visits are the highlight of this journey. We arrange access to both famous and remote sites." },
        { q: "What's the weather like?", a: "Tibet has extreme temperature variations. Days can be warm but nights are cold. Layered clothing is essential." },
      ],
      reviews: [
        {
          name: "Michael Brown",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
          rating: 5,
          date: "December 2024",
          text: "A profoundly spiritual journey. Visiting Potala Palace and meeting monks at remote monasteries was unforgettable. Our guide was incredibly knowledgeable about Tibetan Buddhism.",
          verified: true,
        },
        {
          name: "Lisa Wang",
          avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop",
          rating: 5,
          date: "November 2024",
          text: "This trip changed my perspective on life. The meditation practices I learned continue to benefit me daily. Highly recommend for anyone seeking spiritual growth.",
          verified: true,
        },
      ],
      itinerary: [
        { day: "Day 1-2", title: "Arrival in Lhasa", description: "Arrive and acclimatize to high altitude. Rest and prepare for spiritual journey." },
        { day: "Day 3-5", title: "Lhasa Sacred Sites", description: "Visit Potala Palace, Jokhang Temple, and Barkhor Street circuit." },
        { day: "Day 6-8", title: "Monastery Visits", description: "Journey to Sera and Drepung monasteries. Witness monk debates." },
        { day: "Day 9-11", title: "Sacred Pilgrimage Sites", description: "Visit Lake Yamdrok and Kanchenjunga views." },
        { day: "Day 12", title: "Departure", description: "Return to Lhasa and depart with deeper spiritual understanding." },
      ],
    },
    {
      id: 3,
      name: "Mystic Valley Cultural Tour",
      slug: "bhutan-wellness-retreat",
      location: "Bhutan",
      image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1200&h=600&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1200&h=600&fit=crop",
        "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&h=600&fit=crop",
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop",
        "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=1200&h=600&fit=crop",
        "https://images.unsplash.com/photo-1573052905904-34ad8c27f0cc?w=1200&h=600&fit=crop",
        "https://images.unsplash.com/photo-1599946347371-68eb71b16afc?w=1200&h=600&fit=crop",
      ],
      description: "Immerse in Bhutanese culture and wellness practices in the Land of Happiness.",
      price: 1899,
      duration: "8 days",
      groupSize: "4-8 people",
      difficulty: 1,
      rating: 4.9,
      reviewCount: 156,
      included: [
        { item: "Luxury Accommodation", detail: "Wellness resort", included: true },
        { item: "All Meals", detail: "Organic farm-to-table", included: true },
        { item: "Spa Treatments", detail: "Hot stone baths & massage", included: true },
        { item: "Yoga & Meditation", detail: "Daily sessions", included: true },
        { item: "Cultural Treks", detail: "Dzongs and temples", included: true },
        { item: "Flights", detail: "Book separately", included: false },
        { item: "Insurance", detail: "Recommended", included: false },
        { item: "Gratuities", detail: "Optional", included: false },
      ],
      faqs: [
        { q: "What's included in wellness treatments?", a: "Daily yoga, meditation, traditional hot stone baths, herbal massages, and wellness consultations with local practitioners." },
        { q: "Is this suitable for beginners?", a: "Absolutely! All yoga and meditation sessions are adapted to your level. No prior experience needed." },
        { q: "What's the daily schedule like?", a: "Mornings start with yoga/meditation, followed by cultural activities, spa treatments in afternoon, and evening relaxation." },
        { q: "What should I bring?", a: "Comfortable yoga clothes, hiking shoes for optional walks, and an open mind. We provide yoga mats and meditation cushions." },
      ],
      reviews: [
        {
          name: "Jennifer Taylor",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
          rating: 5,
          date: "October 2024",
          text: "Pure bliss! The hot stone baths were incredible, the organic food was delicious, and I left feeling completely rejuvenated. The Bhutanese concept of Gross National Happiness really resonates.",
          verified: true,
        },
        {
          name: "David Kim",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
          rating: 5,
          date: "September 2024",
          text: "Best wellness retreat I've ever experienced. The combination of traditional healing practices and stunning natural beauty is unmatched.",
          verified: true,
        },
      ],
      itinerary: [
        { day: "Day 1-2", title: "Arrival in Thimphu", description: "Welcome to Bhutan! Settle into wellness retreat. Evening meditation and orientation." },
        { day: "Day 3-4", title: "Cultural & Spiritual", description: "Visit Punakha Dzong, participate in traditional rituals and blessings." },
        { day: "Day 5", title: "Traditional Spa", description: "Traditional hot stone baths, herbal treatments, and rejuvenating massages." },
        { day: "Day 6-7", title: "Yoga & Nature", description: "Daily yoga and meditation in mountain settings. Nature walks and wellness workshops." },
        { day: "Day 8", title: "Departure", description: "Final ceremony and departure with renewed energy and peace." },
      ],
    },
    {
      id: 4,
      name: "Rajasthan Heritage Trek",
      slug: "rajasthan-heritage-trek",
      location: "India",
      image: "https://images.unsplash.com/photo-1516214104703-3e691de8e4ad?w=1200&h=600&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1516214104703-3e691de8e4ad?w=1200&h=600&fit=crop",
        "https://images.unsplash.com/photo-1524230572899-a752b3835840?w=1200&h=600&fit=crop",
        "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&h=600&fit=crop",
        "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=1200&h=600&fit=crop",
        "https://images.unsplash.com/photo-1587135941948-670b381f08ce?w=1200&h=600&fit=crop",
        "https://images.unsplash.com/photo-1477332552946-cfb384aeaf1c?w=1200&h=600&fit=crop",
      ],
      description: "Explore palaces, temples, and vibrant desert culture in royal Rajasthan.",
      price: 899,
      duration: "7 days",
      groupSize: "10-15 people",
      difficulty: 1,
      rating: 4.7,
      reviewCount: 312,
      included: [
        { item: "Heritage Hotels", detail: "Former palaces & havelis", included: true },
        { item: "All Meals", detail: "Breakfast & Dinner", included: true },
        { item: "Private Transport", detail: "AC coach", included: true },
        { item: "Local Guide", detail: "Historical expert", included: true },
        { item: "Entry Fees", detail: "All monuments", included: true },
        { item: "Flights", detail: "Domestic & international", included: false },
        { item: "Lunch", detail: "On your own", included: false },
        { item: "Tips", detail: "Optional", included: false },
      ],
      faqs: [
        { q: "What's the best time to visit?", a: "October to March offers pleasant weather. Avoid summer (April-June) as it gets extremely hot." },
        { q: "Are heritage hotels comfortable?", a: "Yes! While historic, they have modern amenities. You'll sleep in former maharaja palaces with AC and WiFi." },
        { q: "Is it suitable for seniors?", a: "Absolutely. The pace is relaxed with minimal walking. We accommodate all fitness levels." },
        { q: "What about vegetarian food?", a: "Rajasthan has excellent vegetarian cuisine. We can accommodate all dietary needs." },
      ],
      reviews: [
        {
          name: "Patricia Williams",
          avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop",
          rating: 5,
          date: "December 2024",
          text: "The forts and palaces are stunning! Our heritage hotel stays were magical. The camel safari in Jaisalmer and folk dance performances were highlights.",
          verified: true,
        },
        {
          name: "Robert Johnson",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
          rating: 4,
          date: "November 2024",
          text: "Great value for money. The historical sites are incredible and our guide was very knowledgeable. Only wish we had one more day in Udaipur!",
          verified: true,
        },
      ],
      itinerary: [
        { day: "Day 1", title: "Arrival in Jaipur", description: "Arrive in Pink City. Visit City Palace and Jantar Mantar observatory." },
        { day: "Day 2", title: "Jaipur Exploration", description: "Explore Hawa Mahal and Amber Fort. Evening at local bazaars." },
        { day: "Day 3-4", title: "Jodhpur - Blue City", description: "Travel to Jodhpur. Visit Mehrangarh Fort and explore blue-painted old city." },
        { day: "Day 5", title: "Desert Safari", description: "Experience desert safari and visit traditional villages. Folk performances and authentic cuisine." },
        { day: "Day 6-7", title: "Udaipur - Venice of East", description: "Visit romantic Udaipur. Explore City Palace and boat rides on Lake Pichola." },
      ],
    },
    {
      id: 5,
      name: "Hidden Lakes & Highlands Journey",
      slug: "kerala-backwater-experience",
      location: "India",
      image: "https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=1200&h=600&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=1200&h=600&fit=crop",
        "https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?w=1200&h=600&fit=crop",
        "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=1200&h=600&fit=crop",
        "https://images.unsplash.com/photo-1631109798023-e37b80b6d8c2?w=1200&h=600&fit=crop",
        "https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?w=1200&h=600&fit=crop",
        "https://images.unsplash.com/photo-1589308078059-be1415eab42a?w=1200&h=600&fit=crop",
      ],
      description: "Serene backwaters, spice plantations, and beach retreats in God's Own Country.",
      price: 799,
      duration: "6 days",
      groupSize: "8-12 people",
      difficulty: 1,
      rating: 4.8,
      reviewCount: 198,
      included: [
        { item: "Beach Resorts", detail: "Beachfront properties", included: true },
        { item: "Houseboat Stay", detail: "1 night on backwaters", included: true },
        { item: "All Meals", detail: "Traditional Kerala cuisine", included: true },
        { item: "Transportation", detail: "AC coach & boat", included: true },
        { item: "Ayurvedic Massage", detail: "1 session included", included: true },
        { item: "Flights", detail: "To/from Kerala", included: false },
        { item: "Watersports", detail: "Optional activities", included: false },
        { item: "Alcohol", detail: "Not included", included: false },
      ],
      faqs: [
        { q: "What's included in houseboat stay?", a: "Private houseboat with bedroom, bathroom, dining area, and sundeck. All meals prepared onboard." },
        { q: "Is swimming safe?", a: "Yes, designated beach areas are safe. We provide guidelines for ocean safety." },
        { q: "What spices will we see?", a: "Cardamom, pepper, vanilla, cinnamon, nutmeg, and cloves grow in Kerala's spice gardens." },
        { q: "Can we do Ayurvedic treatments?", a: "Yes! One massage is included, additional treatments available at extra cost." },
      ],
      reviews: [
        {
          name: "Amanda Foster",
          avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
          rating: 5,
          date: "January 2025",
          text: "The houseboat cruise was magical! Watching sunset over the backwaters while enjoying fresh fish curry - unforgettable. The beach resort was also beautiful.",
          verified: true,
        },
        {
          name: "Thomas Anderson",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
          rating: 5,
          date: "December 2024",
          text: "Perfect for relaxation. The Ayurvedic massage was incredible, and the spice plantation trek was fascinating. Great food throughout!",
          verified: true,
        },
      ],
      itinerary: [
        { day: "Day 1-2", title: "Backwater Cruise", description: "Arrive in Kerala, board traditional houseboat. Cruise through scenic backwaters." },
        { day: "Day 3", title: "Spice Garden Trek", description: "Visit spice plantation, learn about cardamom, pepper, vanilla cultivation." },
        { day: "Day 4", title: "Beach & Water Sports", description: "Relax on pristine beaches. Optional watersports like jet skiing and parasailing." },
        { day: "Day 5", title: "Local Culture & Cuisine", description: "Visit villages, traditional cooking class. Savor authentic Kerala dishes." },
        { day: "Day 6", title: "Departure", description: "Depart with memories of Kerala's beauty and hospitality." },
      ],
    },
    {
      id: 6,
      name: "Timeless Temples Tour",
      slug: "patagonia-adventure",
      location: "Argentina",
      image: "https://images.unsplash.com/photo-1531065208531-4036c0dba3f5?w=1200&h=600&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1531065208531-4036c0dba3f5?w=1200&h=600&fit=crop",
        "https://images.unsplash.com/photo-1519915212116-7cfef71f1d3e?w=1200&h=600&fit=crop",
        "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&h=600&fit=crop",
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop",
        "https://images.unsplash.com/photo-1543059080-0bd28836c068?w=1200&h=600&fit=crop",
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&h=600&fit=crop",
      ],
      description: "Epic adventure through dramatic landscapes, glaciers, and mountain trekking.",
      price: 2299,
      duration: "14 days",
      groupSize: "6-10 people",
      difficulty: 4,
      rating: 4.9,
      reviewCount: 142,
      included: [
        { item: "Mountain Lodges", detail: "Comfortable refugios", included: true },
        { item: "All Meals", detail: "Breakfast, lunch, dinner", included: true },
        { item: "Trekking Gear", detail: "Poles, crampons if needed", included: true },
        { item: "Expert Guide", detail: "Certified mountain guide", included: true },
        { item: "Park Fees", detail: "All national parks", included: true },
        { item: "International Flights", detail: "Book separately", included: false },
        { item: "Insurance", detail: "Mandatory", included: false },
        { item: "Personal Gear", detail: "Sleeping bag, boots", included: false },
      ],
      faqs: [
        { q: "How difficult is this trek?", a: "Challenging. You'll hike 6-8 hours daily on uneven terrain. Good fitness and previous hiking experience recommended." },
        { q: "What's the weather like?", a: "Patagonia weather is unpredictable. Be prepared for sun, rain, wind, and cold - sometimes all in one day!" },
        { q: "Do I need special equipment?", a: "Quality hiking boots, warm layers, waterproof jacket essential. We provide technical gear like crampons if needed." },
        { q: "Will I see wildlife?", a: "Likely! Guanacos, condors, foxes, and possibly pumas. We also visit penguin colonies." },
      ],
      reviews: [
        {
          name: "Christopher Lee",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
          rating: 5,
          date: "November 2024",
          text: "The most incredible adventure of my life! Walking on Perito Moreno Glacier and trekking to Mount Fitz Roy were bucket list experiences. Our guide was exceptional.",
          verified: true,
        },
        {
          name: "Maria Garcia",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
          rating: 5,
          date: "October 2024",
          text: "Patagonia exceeded every expectation. The landscapes are otherworldly. Challenging but so rewarding. Best trip ever!",
          verified: true,
        },
      ],
      itinerary: [
        { day: "Day 1-2", title: "Buenos Aires", description: "Arrive in Buenos Aires. City trek and tango performances." },
        { day: "Day 3-5", title: "Perito Moreno Glacier", description: "Travel to El Calafate. Witness magnificent glacier, hike on ice." },
        { day: "Day 6-8", title: "Fitz Roy Trekking", description: "Trek to Mount Fitz Roy in El Chaltén. Stunning mountain views and wilderness." },
        { day: "Day 9-12", title: "Torres del Paine", description: "Explore Torres del Paine with dramatic peaks and turquoise lakes. Complete trekking circuit." },
        { day: "Day 13-14", title: "Return & Departure", description: "Return to Buenos Aires for final exploration before departure." },
      ],
    },
  ];

  // Fetch trek from API instead of hardcoded data
  const [trek, setTrek] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrek = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
        const response = await fetch(`${API_BASE_URL}/api/treks/${slug}`);

        if (!response.ok) {
          throw new Error("Trek not found");
        }

        const data = await response.json();

        // Transform data to match UI expectations
        const transformedTrek = {
          ...data,
          image: data.coverImage || data.images?.[0] || "/default-trek.jpg",
          gallery: data.images && data.images.length > 0 ? data.images : [data.coverImage || "/default-trek.jpg"],
          groupSize: `${data.maxGroupSize || 12} people`,
          reviewCount: 0, // Will be populated from separate reviews API
          included: [], // Will need to parse from includes/excludes if stored as JSON
          faqs: data.faq || [],
          itinerary: data.itinerary || [],
          reviews: [], // Will be populated from separate reviews API
        };

        setTrek(transformedTrek);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching trek:", err);
        setError(err instanceof Error ? err.message : "Failed to load trek");
        setLoading(false);
      }
    };

    fetchTrek();
  }, [slug]);

  const handleBookNow = () => {
    if (user) {
      navigate(`/booking/trek/${slug}`);
    } else {
      sessionStorage.setItem('intendedBooking', `/booking/trek/${slug}`);
      setAuthModalOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-beige flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trek details...</p>
        </div>
      </div>
    );
  }

  if (error || !trek) {
    return (
      <div className="min-h-screen bg-beige flex flex-col">
        <FloatingWhatsAppButton />
        <div className="flex-grow flex flex-col items-center justify-center px-4 py-12">
          <h1 className="text-3xl font-black text-green-primary mb-4">Trek Not Found</h1>
          <p className="text-text-dark/70 mb-8">The trek you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate("/trek")}
            className="bg-blue-accent hover:bg-blue-accent-dark text-white font-bold px-6 py-2.5 rounded-lg transition-colors"
          >
            Back to Treks
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige flex flex-col">
      <FloatingWhatsAppButton />

      {/* Back Button */}
      <div className="pt-20 sm:pt-24 md:pt-28 px-3 sm:px-6 lg:px-12 max-w-7xl mx-auto w-full mb-8 sm:mb-10">
        <button
          onClick={() => navigate("/trek")}
          className="flex items-center gap-2 text-blue-accent hover:text-blue-accent-dark font-semibold mb-0 transition-premium hover:-translate-x-0.5"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Treks
        </button>
      </div>

      {/* Photo Gallery Section */}
      <section className="px-3 sm:px-6 lg:px-12 max-w-7xl mx-auto w-full mb-10 sm:mb-14 lg:mb-20">
        <PhotoGallery images={trek.gallery || [trek.image]} />

        {/* Title and Rating */}
        <div className="mt-8 sm:mt-10 lg:mt-14">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-6">
            <div className="flex-grow">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-text-dark mb-4 tracking-tight">
                {trek.name}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2 text-green-primary font-bold text-lg">
                  <MapPin className="h-5 w-5" />
                  {trek.location}
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold">{trek.rating}/5</span>
                  <span className="text-text-dark/60">({trek.reviewCount} reviews)</span>
                </div>
              </div>
            </div>
            <div className="text-left sm:text-right shrink-0">
              <p className="text-sm text-text-dark/60 mb-1">Starting from</p>
              <p className="text-4xl sm:text-5xl font-black text-green-primary">${trek.price}</p>
              <p className="text-sm text-text-dark/60 mt-1">per person</p>
            </div>
          </div>
          <p className="text-base sm:text-lg text-text-dark/75 leading-relaxed max-w-4xl">
            {trek.description}
          </p>
        </div>
      </section>

      {/* Main Content Grid: Content + Sticky Booking Widget */}
      <div className="px-3 sm:px-6 lg:px-12 max-w-7xl mx-auto w-full mb-14 sm:mb-18">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-14">
            {/* Trek Details Grid - Enhanced with Glassmorphism */}
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
                <motion.div
                  whileHover={{ scale: 1.02, y: -4 }}
                  className="relative bg-white/60 backdrop-blur-md rounded-xl p-6 shadow-premium border-2 border-transparent hover:border-green-primary/30 transition-all duration-300 group overflow-hidden"
                >
                  {/* Animated Gradient Border */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-primary/20 via-blue-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
                  <div className="relative z-10">
                    <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                      <Calendar className="h-6 w-6 text-green-primary mb-3" />
                    </motion.div>
                    <p className="text-xs font-bold text-text-dark/70 uppercase mb-1 tracking-wider">Duration</p>
                    <p className="text-xl font-black text-text-dark">{trek.duration}</p>
                  </div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02, y: -4 }}
                  className="relative bg-white/60 backdrop-blur-md rounded-xl p-6 shadow-premium border-2 border-transparent hover:border-green-primary/30 transition-all duration-300 group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-primary/20 via-blue-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
                  <div className="relative z-10">
                    <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                      <Users className="h-6 w-6 text-green-primary mb-3" />
                    </motion.div>
                    <p className="text-xs font-bold text-text-dark/70 uppercase mb-1 tracking-wider">Group Size</p>
                    <p className="text-xl font-black text-text-dark">{trek.groupSize}</p>
                  </div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02, y: -4 }}
                  className="relative bg-white/60 backdrop-blur-md rounded-xl p-6 shadow-premium border-2 border-transparent hover:border-green-primary/30 transition-all duration-300 group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-primary/20 via-blue-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
                  <div className="relative z-10">
                    <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                      <MapPin className="h-6 w-6 text-green-primary mb-3" />
                    </motion.div>
                    <p className="text-xs font-bold text-text-dark/70 uppercase mb-1 tracking-wider">Location</p>
                    <p className="text-xl font-black text-text-dark">{trek.location}</p>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* What's Included Section */}
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-green-primary to-green-primary/70 bg-clip-text text-transparent mb-10 tracking-tight relative"
              >
                What's Included
                <div className="absolute -bottom-3 left-0 w-24 h-1 bg-gradient-to-r from-green-primary to-blue-accent rounded-full" />
              </motion.h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trek.included?.map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-4 p-4 rounded-xl border-2 ${item.included
                      ? "border-green-primary/20 bg-green-primary/5"
                      : "border-border bg-card"
                      }`}
                  >
                    <div
                      className={`p-2 rounded-full ${item.included ? "bg-green-primary text-white" : "bg-gray-200 text-gray-500"
                        }`}
                    >
                      {item.included ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <X className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-grow">
                      <p className="font-bold text-text-dark">{item.item}</p>
                      <p className="text-sm text-text-dark/60">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Route Map Section - TEMPORARILY DISABLED FOR DEBUGGING */}
            {/* {trek.route && (
              <div>
                <h2 className="text-3xl sm:text-4xl font-black text-green-primary mb-8 tracking-tight">
                  <Navigation className="h-8 w-8 inline mr-3" />
                  Trek Route
                </h2>
                <RouteMap route={trek.route} />
                <p className="text-sm text-text-dark/60 mt-4">
                  Interactive map showing the trek route with key destinations and waypoints.
                </p>
              </div>
            )} */}

            {/* Itinerary Section - Enhanced Vertical Timeline */}
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-green-primary to-green-primary/70 bg-clip-text text-transparent mb-12 tracking-tight relative"
              >
                Itinerary
                <div className="absolute -bottom-3 left-0 w-24 h-1 bg-gradient-to-r from-green-primary to-blue-accent rounded-full" />
              </motion.h2>
              {/* Timeline Container */}
              <div className="relative">
                {/* Vertical Timeline Line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-primary via-blue-accent to-green-primary hidden sm:block" />

                <div className="space-y-8">
                  {trek.itinerary?.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.08 }}
                      viewport={{ once: true }}
                      className="relative group"
                    >
                      {/* Timeline Dot */}
                      <div className="absolute left-6 top-6 w-4 h-4 rounded-full bg-green-primary border-4 border-white shadow-lg transform -translate-x-1/2 z-10 hidden sm:block group-hover:scale-125 transition-transform" />

                      {/* Card */}
                      <div className="sm:ml-20 bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-premium hover:shadow-premium-lg border-l-4 border-transparent hover:border-green-primary transition-all duration-300 group-hover:translate-x-2">
                        <div className="flex flex-col gap-4">
                          {/* Day Badge - Circular with Gradient */}
                          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-accent to-blue-accent-dark text-white font-black text-sm shadow-lg group-hover:scale-110 transition-all duration-300">
                            {item.day.replace('Day ', '')}
                          </div>
                          <div>
                            <h3 className="text-xl sm:text-2xl font-black text-text-dark mb-3 group-hover:text-green-primary transition-colors">{item.title}</h3>
                            <p className="text-base text-text-dark/75 leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* FAQ Section - Modern Accordion */}
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-green-primary to-green-primary/70 bg-clip-text text-transparent mb-10 tracking-tight relative"
              >
                Frequently Asked Questions
                <div className="absolute -bottom-3 left-0 w-24 h-1 bg-gradient-to-r from-green-primary to-blue-accent rounded-full" />
              </motion.h2>
              <div className="space-y-4">
                {trek.faqs?.map((faq, index) => (
                  <motion.details
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-premium-sm border-l-4 border-transparent hover:border-green-primary/50 open:border-green-primary open:shadow-premium transition-all duration-300 group hover:bg-white"
                  >
                    <summary className="font-bold text-lg cursor-pointer list-none flex items-center justify-between group-hover:text-green-primary transition-colors">
                      {faq.q}
                      <motion.span
                        className="text-green-primary group-open:rotate-180 transition-transform duration-300"
                        whileHover={{ scale: 1.2 }}
                      >
                        ▼
                      </motion.span>
                    </summary>
                    <motion.p
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      className="mt-4 text-text-dark/75 leading-relaxed">
                      {faq.a}
                    </motion.p>
                  </motion.details>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Booking Widget Sidebar */}
          <div className="hidden lg:block">
            <StickyBookingWidget trek={trek} onBookClick={handleBookNow} />
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="px-3 sm:px-6 lg:px-12 max-w-7xl mx-auto w-full mb-14 sm:mb-18">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-green-primary to-green-primary/70 bg-clip-text text-transparent mb-10 tracking-tight relative"
        >
          Traveler Reviews
          <div className="absolute -bottom-3 left-0 w-24 h-1 bg-gradient-to-r from-green-primary to-blue-accent rounded-full" />
        </motion.h2>
        <ReviewsSection reviews={trek.reviews || []} />
      </section>

      {/* Similar Treks Carousel */}
      <section className="px-3 sm:px-6 lg:px-12 max-w-7xl mx-auto w-full mb-14 sm:mb-18 bg-beige-light py-12 -mx-3 sm:-mx-6 lg:-mx-12">
        <div className="px-3 sm:px-6 lg:px-12">
          <h2 className="text-3xl sm:text-4xl font-black text-green-primary mb-8 tracking-tight">
            You Might Also Like
          </h2>
          <SimilarTreksCarousel treks={trekDatabase} currentTrekId={trek.id} />
        </div>
      </section>

      {/* Booking CTA */}
      <section className="px-3 sm:px-6 lg:px-12 max-w-7xl mx-auto w-full mb-14 sm:mb-18">
        <div className="bg-gradient-to-r from-green-primary to-green-primary/85 rounded-2xl p-8 sm:p-12 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-3xl font-black mb-2">Ready for Your Adventure?</h3>
              <p className="text-white/90">Book now and start your journey of a lifetime</p>
            </div>
            <button
              onClick={handleBookNow}
              className="bg-white text-green-primary px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors text-lg shadow-lg"
            >
              Book This Trek - ${trek.price}
            </button>
          </div>
        </div>
      </section>

      <Footer />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div >
  );
}
