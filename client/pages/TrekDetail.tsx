import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Footer from "@/components/Footer";
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
function StickyBookingWidget({ trek }: { trek: any }) {
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
    <div
      className={`transition-all duration-300 ${isSticky
        ? "fixed top-20 right-6 w-80 z-30"
        : "relative w-full"
        }`}
    >
      <div className="bg-card rounded-xl shadow-premium-lg border border-border p-6 space-y-4">
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

        <button className="w-full bg-green-primary text-white py-4 rounded-lg font-bold text-lg hover:bg-green-primary/90 transition-colors shadow-lg">
          Book This Trek
        </button>

        <button className="w-full border-2 border-green-primary text-green-primary py-3 rounded-lg font-semibold hover:bg-green-primary/5 transition-colors">
          Request Custom Quote
        </button>

        <div className="text-center text-xs text-text-dark/60">
          <p>🔒 Secure booking • No payment required today</p>
          <p className="mt-1">📞 Questions? Call us at +1-555-0123</p>
        </div>
      </div>
    </div>
  );
}

// Photo Gallery Component
function PhotoGallery({ images }: { images: string[] }) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-video rounded-xl overflow-hidden shadow-premium-lg">
        <img
          src={images[selectedImage]}
          alt="Trek photo"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-6 gap-2">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`aspect-video rounded-lg overflow-hidden ${selectedImage === index
              ? "ring-4 ring-green-primary"
              : "opacity-60 hover:opacity-100"
              } transition-all`}
          >
            <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
          </button>
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

  const trekDatabase = [
    {
      id: 1,
      name: "Annapurna Base Camp Trek",
      slug: "annapurna-base-camp",
      location: "Nepal",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop",
        "https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&h=600&fit=crop",
        "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&h=600&fit=crop",
        "https://images.unsplash.com/photo-1589182373726-e4f658ab50b0?w=1200&h=600&fit=crop",
        "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=1200&h=600&fit=crop",
        "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1200&h=600&fit=crop",
      ],
      description: "Experience the majestic Himalayan peaks and cultural heritage of Nepal.",
      price: 1299,
      duration: "10 days",
      groupSize: "8-12 people",
      difficulty: 3,
      rating: 4.9,
      reviewCount: 234,
      included: [
        { item: "Accommodation", detail: "4-star hotels & lodges", included: true },
        { item: "Meals", detail: "Breakfast & Dinner daily", included: true },
        { item: "Transportation", detail: "All transfers & flights", included: true },
        { item: "Licensed Guide", detail: "English-speaking expert", included: true },
        { item: "Permits & Fees", detail: "All necessary permits", included: true },
        { item: "International Flights", detail: "Book separately", included: false },
        { item: "Travel Insurance", detail: "Highly recommended", included: false },
        { item: "Personal Expenses", detail: "Souvenirs, tips, etc.", included: false },
      ],
      faqs: [
        {
          q: "What fitness level is required?",
          a: "This trek requires moderate fitness. We'll do some hiking at altitude, but nothing too strenuous. If you can walk 3-4 hours with breaks, you'll be fine.",
        },
        {
          q: "What should I pack?",
          a: "Layered clothing is essential! Bring warm layers for mornings/evenings, comfortable hiking boots, sunscreen, hat, and sunglasses. We'll send a detailed packing list upon booking.",
        },
        {
          q: "Is travel insurance mandatory?",
          a: "Yes, comprehensive travel insurance covering medical evacuation is mandatory for this trip. We can recommend providers.",
        },
        {
          q: "What about altitude sickness?",
          a: "We include acclimatization days in the itinerary. Stay hydrated, avoid alcohol in the first few days, and ascend gradually. Our guides are trained in altitude sickness recognition.",
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
          day: "Day 1-2",
          title: "Arrival in Kathmandu",
          description: "Welcome to Nepal! Arrive in Kathmandu and check into your hotel. Explore the bustling city, visit local markets, and acclimatize to the altitude.",
        },
        {
          day: "Day 3-4",
          title: "Kathmandu Cultural Trek",
          description: "Visit UNESCO World Heritage sites including Pashupatinath Temple, Boudhanath Stupa, and Swayambhunath. Learn about Buddhist and Hindu traditions from experienced guides.",
        },
        {
          day: "Day 5-7",
          title: "Pokhara Exploration",
          description: "Fly to Pokhara and explore its serene lakes. Enjoy boating on Phewa Lake, visit local villages, and experience the stunning backdrop of the Annapurna range.",
        },
        {
          day: "Day 8-9",
          title: "Mountain Scenery & Local Life",
          description: "Experience short hikes around Pokhara. Visit local farms, taste fresh Nepalese cuisine, and interact with local communities.",
        },
        {
          day: "Day 10",
          title: "Departure",
          description: "Enjoy a final breakfast with mountain views before heading to the airport. Depart with cherished memories.",
        },
      ],
    },
    {
      id: 2,
      name: "Tibet Sacred Journey",
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
      name: "Bhutan Wellness Retreat",
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
      name: "Kerala Backwater Experience",
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
      name: "Patagonia Adventure",
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

  const trek = trekDatabase.find((t) => t.slug === slug);

  if (!trek) {
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
            {/* Trek Details Grid */}
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
                <div className="bg-card rounded-xl p-6 shadow-premium-sm border border-border">
                  <Calendar className="h-6 w-6 text-green-primary mb-3" />
                  <p className="text-xs font-bold text-text-dark/70 uppercase mb-1">Duration</p>
                  <p className="text-xl font-black text-text-dark">{trek.duration}</p>
                </div>
                <div className="bg-card rounded-xl p-6 shadow-premium-sm border border-border">
                  <Users className="h-6 w-6 text-green-primary mb-3" />
                  <p className="text-xs font-bold text-text-dark/70 uppercase mb-1">Group Size</p>
                  <p className="text-xl font-black text-text-dark">{trek.groupSize}</p>
                </div>
                <div className="bg-card rounded-xl p-6 shadow-premium-sm border border-border">
                  <MapPin className="h-6 w-6 text-green-primary mb-3" />
                  <p className="text-xs font-bold text-text-dark/70 uppercase mb-1">Location</p>
                  <p className="text-xl font-black text-text-dark">{trek.location}</p>
                </div>
              </div>
            </div>

            {/* What's Included Section */}
            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-green-primary mb-8 tracking-tight">
                What's Included
              </h2>
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

            {/* Itinerary Section */}
            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-green-primary mb-8 tracking-tight">
                Itinerary
              </h2>
              <div className="space-y-5">
                {trek.itinerary?.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-card rounded-xl p-6 sm:p-7 shadow-premium-sm hover:shadow-premium transition-all border border-border"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      <span className="inline-block bg-blue-accent text-white font-bold px-4 py-2 rounded-lg text-sm whitespace-nowrap">
                        {item.day}
                      </span>
                      <div className="flex-grow">
                        <h3 className="text-lg sm:text-xl font-bold text-text-dark mb-2">{item.title}</h3>
                        <p className="text-sm sm:text-base text-text-dark/75 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* FAQ Section */}
            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-green-primary mb-8 tracking-tight">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {trek.faqs?.map((faq, index) => (
                  <details
                    key={index}
                    className="bg-card rounded-xl p-6 shadow-premium-sm border border-border group"
                  >
                    <summary className="font-bold text-lg cursor-pointer list-none flex items-center justify-between">
                      {faq.q}
                      <span className="text-green-primary group-open:rotate-180 transition-transform">
                        ▼
                      </span>
                    </summary>
                    <p className="mt-4 text-text-dark/70 leading-relaxed">{faq.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Booking Widget Sidebar */}
          <div className="hidden lg:block">
            <StickyBookingWidget trek={trek} />
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="px-3 sm:px-6 lg:px-12 max-w-7xl mx-auto w-full mb-14 sm:mb-18">
        <h2 className="text-3xl sm:text-4xl font-black text-green-primary mb-8 tracking-tight">
          Traveler Reviews
        </h2>
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
              onClick={() => navigate(`/booking/trek/${trek.slug}`)}
              className="bg-white text-green-primary px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors text-lg shadow-lg"
            >
              Book This Trek - ${trek.price}
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div >
  );
}
