import AboutPageHero from "@/components/AboutPageHero";
import Footer from "@/components/Footer";
import VideoPlayer from "@/components/VideoPlayer";
import { Heart, Globe, Users, Compass, Award, Linkedin, Instagram, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Helmet } from "react-helmet-async";
import { API_BASE_URL } from "@/lib/config";

// Timeline Item Component
function TimelineItem({ milestone, index }: { milestone: any; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const isLeft = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className={`flex items-center mb-16 last:mb-0 ${isLeft ? "flex-row" : "flex-row-reverse"
        }`}
    >
      {/* Content */}
      <div className={`w-5/12 ${isLeft ? "text-right pr-8" : "text-left pl-8"}`}>
        <div className="bg-card rounded-xl p-6 shadow-premium-sm border border-border hover:shadow-premium transition-premium">
          <div className="text-sm font-bold text-green-primary mb-2">{milestone.year}</div>
          <h3 className="text-xl font-black text-text-dark mb-3">{milestone.title}</h3>
          <p className="text-sm text-text-dark/70 leading-relaxed mb-4">
            {milestone.description}
          </p>
          {milestone.image && (
            <img
              src={milestone.image}
              alt={milestone.title}
              className="w-full h-32 object-cover rounded-lg"
            />
          )}
        </div>
      </div>

      {/* Timeline Dot */}
      <div className="w-2/12 flex justify-center">
        <div className="w-8 h-8 bg-green-primary rounded-full border-4 border-beige shadow-lg z-10"></div>
      </div>

      {/* Spacer */}
      <div className="w-5/12"></div>
    </motion.div>
  );
}

// Customer Stories Carousel Component
function CustomerStoriesCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [submittedTransformations, setSubmittedTransformations] = useState<any[]>([]);

  // Fetch submitted transformation stories from API
  useEffect(() => {
    // Add timestamp to bust cache (no custom headers needed - server handles cache control)
    const cacheBuster = `?t=${Date.now()}`;
    const apiUrl = `${API_BASE_URL}/api/transformations${cacheBuster}`;

    console.log("Fetching transformation stories from:", apiUrl);
    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log("Transformation stories fetched:", data);
        // Handle both response formats: {success: true, transformationStories: [...]} or direct array
        const stories = data.transformationStories || (Array.isArray(data) ? data : []);
        setSubmittedTransformations(stories);
      })
      .catch((error) => console.error("Error fetching transformations:", error));
  }, []);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  // Map transformation stories to display format
  const stories = submittedTransformations.map((trans) => ({
    name: trans.name,
    trip: `Age: ${trans.age} • ${trans.location}`,
    image: trans.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(trans.name)}&background=2d5016&color=fff&size=400`,
    story: trans.story,
    transformation: trans.storyTitle,
  }));

  if (stories.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
        <p className="text-text-dark/60">No transformation stories shared yet. Be the first to share your journey!</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {stories.map((story, index) => (
            <div
              key={index}
              className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] px-3 sm:px-4"
            >
              <div className="bg-card rounded-xl p-6 sm:p-8 shadow-premium-sm hover:shadow-premium transition-all border border-border h-full">
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={story.image}
                    alt={story.name}
                    className="w-16 h-16 rounded-full object-cover shadow-md"
                  />
                  <div>
                    <h3 className="font-bold text-lg text-text-dark">{story.name}</h3>
                    <p className="text-sm text-green-primary font-semibold">{story.trip}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <span className="inline-block bg-green-primary/10 text-green-primary text-xs font-bold px-3 py-1.5 rounded-full">
                    {story.transformation}
                  </span>
                </div>

                <p className="text-text-dark/70 text-sm leading-relaxed italic">
                  "{story.story}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          onClick={scrollPrev}
          disabled={!canScrollPrev}
          className={`p-3 rounded-full border-2 transition-all ${canScrollPrev
            ? "border-green-primary text-green-primary hover:bg-green-primary hover:text-white"
            : "border-border text-text-dark/30 cursor-not-allowed"
            }`}
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={scrollNext}
          disabled={!canScrollNext}
          className={`p-3 rounded-full border-2 transition-all ${canScrollNext
            ? "border-green-primary text-green-primary hover:bg-green-primary hover:text-white"
            : "border-border text-text-dark/30 cursor-not-allowed"
            }`}
          aria-label="Next testimonial"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

export default function About() {
  // Default hardcoded data (used as fallback)
  const defaultWhyChooseUs = [
    {
      icon: Heart,
      title: "Authentic Experiences",
      description: "Genuine connections with local communities and cultures",
    },
    {
      icon: Compass,
      title: "Expert Guides",
      description: "Knowledgeable guides with deep local expertise",
    },
    {
      icon: Globe,
      title: "Sustainable Travel",
      description: "Committed to environmental and social responsibility",
    },
    {
      icon: Users,
      title: "Group Adventures",
      description: "Connect with like-minded travelers from around the world",
    },
  ];

  const defaultTeamMembers = [
    {
      name: "Reeju",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      bio: "15+ years leading adventure expeditions across the Himalayas. Passionate about responsible tourism and cultural preservation.",
      linkedin: "https://linkedin.com/in/rajesh-kumar",
      instagram: "@rajesh.adventures",
    },
    {
      name: "Priya Sharma",
      role: "Head of Operations",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
      bio: "Expert in sustainable tourism and local community partnerships. Ensures every trip creates positive impact.",
      linkedin: "https://linkedin.com/in/priya-sharma",
      instagram: "@priya.travels",
    },
    {
      name: "Amit Patel",
      role: "Trek & Adventure Lead",
      image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=400&fit=crop",
      bio: "Certified mountaineer with 50+ Everest base camp expeditions. Safety and adventure go hand in hand.",
      linkedin: "https://linkedin.com/in/amit-patel",
      instagram: "@amit.mountains",
    },
    {
      name: "Maya Desai",
      role: "Wellness & Spiritual Coordinator",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
      bio: "Yoga instructor and mindfulness practitioner for 10+ years. Creating transformative wellness experiences.",
      linkedin: "https://linkedin.com/in/maya-desai",
      instagram: "@maya.wellness",
    },
  ];

  const defaultPartners = [
    { name: "Himalayan Tourism Board", logo: "🏔️" },
    { name: "Adventure Safety Alliance", logo: "🛡️" },
    { name: "Sustainable Travel Initiative", logo: "🌱" },
    { name: "Global Wellness Network", logo: "💚" },
    { name: "Heritage Conservation Fund", logo: "🏛️" },
    { name: "Community Development Programs", logo: "🤝" },
  ];

  const defaultMilestones = [
    {
      year: "2023",
      title: "The Beginning",
      description: "Founded with a mission to transform adventure travel through authentic cultural experiences and sustainable practices.",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    },
    {
      year: "2024",
      title: "Expansion",
      description: "Expanded to 15 destinations across Nepal, Tibet, and Bhutan. Launched our first wellness retreat program.",
      image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop",
    },
    {
      year: "2025",
      title: "Sustainability Commitment",
      description: "Became carbon-neutral and established partnerships with 20+ local communities for authentic experiences.",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
    },
    {
      year: "2026",
      title: "2,000 Travelers",
      description: "Celebrated serving our 2,000th traveler and won 'Best Responsible Tourism Operator' award.",
      image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop",
    },
  ];

  const defaultStats = [
    { number: "2,000+", label: "Happy Travelers", icon: "😊" },
    { number: "20+", label: "Destinations", icon: "🗺️" },
    { number: "4.9/5", label: "Average Rating", icon: "⭐" },
    { number: "200+", label: "Local Partners", icon: "🤝" },
  ];

  const defaultHero = {
    title: "About Eraya",
    subtitle: "Discover our mission to create meaningful adventure travel experiences that transform lives",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop"
  };

  const defaultStory = {
    title: "From a Trek to a Movement",
    paragraphs: [
      "It all started in 2023 when our founder, Reeju, was trekking to Annapurna Base Camp. He met a local Sherpa family struggling to preserve their cultural heritage while adapting to mass tourism. That conversation changed everything.",
      "We realized travelers wanted more than selfies at mountaintops—they craved authentic connections. Local communities needed sustainable income, not exploitative tourism. Eraya Wellness Travels was born to bridge that gap.",
      "Today, we've facilitated over 2,000+ journeys that empower local guides, preserve cultural traditions, and transform travelers into advocates for responsible exploration."
    ],
    quote: "Travel isn't about ticking boxes on a bucket list. It's about becoming part of a global family that cares for each other and our planet.",
    quoteAuthor: "Reeju, Founder",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=500&fit=crop"
  };

  const defaultVideo = {
    url: "",
    title: "Watch Our Story",
    description: "See how we're changing travel"
  };

  // State for dynamic content from API
  const [aboutContent, setAboutContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch about page content from API
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/content/about_page`)
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setAboutContent(data);
        }
      })
      .catch((error) => console.error("Error fetching about page content:", error))
      .finally(() => setLoading(false));
  }, []);

  // Use API data if available, otherwise use defaults
  const hero = aboutContent?.hero || defaultHero;
  const story = aboutContent?.story || defaultStory;
  const video = aboutContent?.video || defaultVideo;
  const milestones = aboutContent?.milestones || defaultMilestones;
  const teamMembers = aboutContent?.team || defaultTeamMembers;
  const partners = aboutContent?.partners || defaultPartners;
  const stats = aboutContent?.stats || defaultStats;

  // whyChooseUs is not customizable via admin (kept as static)
  const whyChooseUs = defaultWhyChooseUs;

  return (
    <div className="min-h-screen bg-beige flex flex-col">
      {/* SEO Meta Tags */}
      <Helmet>
        {/* Primary Meta Tags */}
        <title>About Us - Eraya Wellness Travels | Transformative Adventure & Spiritual Travel</title>
        <meta
          name="description"
          content="Discover Eraya Wellness Travels - Nepal's premier adventure travel company. Since 2023, we've transformed 2,000+ lives through authentic cultural experiences, sustainable tourism, and spiritual journeys across the Himalayas."
        />
        <meta
          name="keywords"
          content="Nepal adventure travel, Himalayan trekking, sustainable tourism Nepal, spiritual travel, wellness retreats, cultural experiences, Everest Base Camp, Annapurna trek, responsible tourism, eco-friendly travel"
        />
        <link rel="canonical" href="https://erayawellnesstravels.com/about" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://erayawellnesstravels.com/about" />
        <meta property="og:title" content="About Eraya Wellness Travels - Transforming Lives Through Adventure" />
        <meta
          property="og:description"
          content="Join 2,000+ travelers who discovered authentic Nepal. Expert guides, sustainable practices, and life-changing experiences across 20+ Himalayan destinations."
        />
        <meta
          property="og:image"
          content="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=630&fit=crop"
        />
        <meta property="og:site_name" content="Eraya Wellness Travels" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://erayawellnesstravels.com/about" />
        <meta name="twitter:title" content="About Eraya Wellness Travels - Transforming Lives Through Adventure" />
        <meta
          name="twitter:description"
          content="Join 2,000+ travelers who discovered authentic Nepal. Expert guides, sustainable practices, and life-changing experiences."
        />
        <meta
          name="twitter:image"
          content="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=630&fit=crop"
        />

        {/* Additional Meta Tags */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Eraya Wellness Travels" />
        <meta name="geo.region" content="NP" />
        <meta name="geo.placename" content="Nepal" />

        {/* Structured Data - Organization */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TravelAgency",
            "name": "Eraya Wellness Travels",
            "description": "Premier adventure and wellness travel company specializing in transformative experiences across Nepal, Tibet, and Bhutan",
            "url": "https://erayawellnesstravels.com",
            "logo": "https://erayawellnesstravels.com/logo.png",
            "foundingDate": "2023",
            "founder": {
              "@type": "Person",
              "name": "Reeju"
            },
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "NP",
              "addressRegion": "Nepal"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "2000"
            },
            "areaServed": ["Nepal", "Tibet", "Bhutan"],
            "serviceType": ["Adventure Travel", "Trekking", "Spiritual Tourism", "Wellness Retreats"],
            "priceRange": "$$",
            "sameAs": [
              "https://instagram.com/eraya_wellness_travels"
            ]
          })}
        </script>

        {/* Structured Data - Breadcrumb */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://erayawellnesstravels.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "About Us",
                "item": "https://erayawellnesstravels.com/about"
              }
            ]
          })}
        </script>
      </Helmet>

      {/* Hero Banner */}
      <AboutPageHero hero={hero} />

      {/* Main Content */}
      <div className="flex-grow">
        {/* Journey Timeline Section */}
        <section className="py-12 sm:py-16 lg:py-24 px-3 sm:px-6 lg:px-12 max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-green-primary mb-12 sm:mb-16 text-center">
            Our Journey
          </h2>

          <div className="relative hidden md:block">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-green-primary/20"></div>

            {milestones.map((milestone, index) => (
              <TimelineItem key={index} milestone={milestone} index={index} />
            ))}
          </div>

          {/* Mobile Timeline - Simplified */}
          <div className="block md:hidden space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="bg-card rounded-xl p-6 shadow-premium-sm border border-border">
                <div className="text-sm font-bold text-green-primary mb-2">{milestone.year}</div>
                <h3 className="text-xl font-black text-text-dark mb-3">{milestone.title}</h3>
                <p className="text-sm text-text-dark/70 leading-relaxed mb-4">
                  {milestone.description}
                </p>
                <img
                  src={milestone.image}
                  alt={milestone.title}
                  className="w-full h-32 object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Impact Statistics Section */}
        <section className="py-12 sm:py-16 lg:py-20 px-3 sm:px-6 lg:px-12 bg-gradient-to-r from-green-primary to-green-primary/85">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-12 sm:mb-16 text-center">
              Our Impact in Numbers
            </h2>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
              {stats.map((stat: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-2xl sm:text-3xl mb-2">{stat.icon}</div>
                  <div className="text-white/90 text-sm sm:text-base font-semibold">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-8 sm:py-12 lg:py-24 px-3 sm:px-6 lg:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-green-primary mb-4 sm:mb-6">
                {story.title}
              </h2>
              {story.paragraphs.map((paragraph: string, index: number) => (
                <p key={index} className="text-xs sm:text-sm lg:text-base text-text-dark/70 leading-relaxed mb-3 sm:mb-4">
                  {paragraph}
                </p>
              ))}

              {/* Founder Quote */}
              <div className="pl-4 border-l-4 border-green-primary bg-green-primary/5 p-4 rounded-r-lg">
                <p className="text-sm sm:text-base italic text-text-dark/80 leading-relaxed">
                  "{story.quote}"
                </p>
                <p className="text-xs sm:text-sm text-green-primary font-bold mt-3">— {story.quoteAuthor}</p>
              </div>
            </div>
            <div className="h-56 sm:h-72 lg:h-96 rounded-lg overflow-hidden shadow-premium">
              <img
                src={story.image}
                alt={story.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-8 sm:py-12 lg:py-24 px-3 sm:px-6 lg:px-12 bg-beige-light">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-green-primary mb-6 sm:mb-9 lg:mb-12 text-center">
              Why Choose Eraya
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {whyChooseUs.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -4 }}
                    className="bg-card p-4 sm:p-6 lg:p-8 rounded-lg shadow-premium-sm hover:shadow-premium transition-all border border-border"
                  >
                    <Icon className="h-8 sm:h-10 lg:h-12 w-8 sm:w-10 lg:w-12 text-green-primary mb-3 sm:mb-4" />
                    <h3 className="text-base sm:text-lg lg:text-xl font-bold text-text-dark mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-text-dark/70 leading-relaxed">
                      {item.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Customer Stories Carousel */}
        <section className="py-12 sm:py-16 lg:py-24 px-3 sm:px-6 lg:px-12 max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-green-primary mb-6 sm:mb-10 lg:mb-12 text-center">
            Traveler Transformations
          </h2>
          <p className="text-text-dark/70 text-center text-sm sm:text-base max-w-2xl mx-auto mb-10 sm:mb-12">
            Real stories from real travelers whose lives were changed by their journeys with us
          </p>
          <CustomerStoriesCarousel />
        </section>

        {/* Video/Media Section */}
        <section className="py-12 sm:py-16 lg:py-24 px-3 sm:px-6 lg:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            {/* Video Player */}
            <div className="rounded-2xl overflow-hidden shadow-premium-lg">
              <VideoPlayer
                url={video.url}
                title={video.title}
                description={video.description}
              />
            </div>

            {/* Content */}
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-green-primary mb-6">
                See Our Adventures in Action
              </h2>
              <p className="text-text-dark/70 text-sm sm:text-base leading-relaxed mb-6">
                From the towering peaks of the Himalayas to the lush plains of the Terai,
                witness the transformative journeys of our travelers across Nepal. Each trip is a
                story of discovery, connection, and personal growth.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: "🎥", text: "300+ Video Testimonials" },
                  { icon: "📸", text: "10,000+ Journey Photos" },
                  { icon: "🌟", text: "2,847 5-Star Reviews" },
                  { icon: "🌍", text: "Travelers from 78 Countries" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-xs sm:text-sm font-semibold text-text-dark">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section id="team" className="py-8 sm:py-12 lg:py-24 px-3 sm:px-6 lg:px-12 max-w-7xl mx-auto w-full scroll-mt-20">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-green-primary mb-6 sm:mb-9 lg:mb-12 text-center">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
                className="group bg-card rounded-lg overflow-hidden shadow-premium-sm hover:shadow-premium-lg transition-all border border-border relative"
              >
                {/* Image with Hover Overlay */}
                <div className="h-48 sm:h-56 lg:h-64 overflow-hidden relative">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  {/* Bio Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 sm:p-5">
                    <p className="text-white text-xs sm:text-sm leading-relaxed">{member.bio}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 lg:p-6">
                  <h3 className="text-base sm:text-lg font-bold text-text-dark mb-1">
                    {member.name}
                  </h3>
                  <p className="text-green-primary font-semibold text-xs sm:text-sm mb-3">
                    {member.role}
                  </p>

                  {/* Social Links */}
                  <div className="flex gap-2">
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-blue-accent/10 rounded-full hover:bg-blue-accent/20 transition-colors"
                    >
                      <Linkedin className="h-4 w-4 text-blue-accent" />
                    </a>
                    <a
                      href={`https://instagram.com/${member.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-pink-500/10 rounded-full hover:bg-pink-500/20 transition-colors"
                    >
                      <Instagram className="h-4 w-4 text-pink-500" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Partners Section */}
        <section className="py-8 sm:py-12 lg:py-24 px-3 sm:px-6 lg:px-12 bg-beige-light">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-green-primary mb-6 sm:mb-9 lg:mb-12 text-center">
              Trusted By Leading Organizations
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 lg:gap-8">
              {partners.map((partner, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -4, scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-border flex flex-col items-center justify-center text-center group"
                >
                  <div className="text-3xl sm:text-4xl lg:text-5xl mb-3 group-hover:scale-110 transition-transform">
                    {partner.logo}
                  </div>
                  <p className="text-text-dark font-semibold text-xs sm:text-sm leading-tight">
                    {partner.name}
                  </p>
                </motion.div>
              ))}
            </div>
            <p className="text-center text-text-dark/60 text-xs sm:text-sm mt-6 sm:mt-8">
              Certified and recognized by industry-leading organizations worldwide
            </p>
          </div>
        </section>

        {/* Instagram Feed */}
        <section className="py-12 sm:py-16 lg:py-20 px-3 sm:px-6 lg:px-12 bg-beige">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-green-primary mb-4">
                Follow Our Adventures
              </h2>
              <a
                href="https://instagram.com/eraya_wellness_travels"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-500 font-bold text-lg hover:text-pink-600 transition-colors inline-flex items-center gap-2"
              >
                <Instagram className="h-5 w-5" />
                @eraya_wellness_travels
              </a>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-4">
              {[
                "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop",
                "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=300&fit=crop",
                "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=300&h=300&fit=crop",
                "https://images.unsplash.com/photo-1551632811-561732d1e306?w=300&h=300&fit=crop",
                "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=300&fit=crop",
                "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=300&h=300&fit=crop",
              ].map((img, index) => (
                <a
                  key={index}
                  href="https://instagram.com/eraya_wellness_travels"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="aspect-square overflow-hidden rounded-lg group relative"
                >
                  <img
                    src={img}
                    alt={`Instagram post ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Instagram className="w-8 h-8 text-white" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
