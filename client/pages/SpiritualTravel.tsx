import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import { Leaf, Heart, Zap, Users, ChevronRight } from "lucide-react";

export default function SpiritualTravel() {
  const destinations = [
    {
      name: "Varanasi - Sacred Ganges",
      image:
        "https://images.unsplash.com/photo-1512453241195-e59921d96ce1?w=600&h=400&fit=crop",
      description:
        "Experience the spiritual heart of India along the sacred Ganges River",
      highlights: ["Sunrise rituals", "Temple visits", "Meditation sessions"],
    },
    {
      name: "Bodh Gaya - Buddha's Enlightenment",
      image:
        "https://images.unsplash.com/photo-1547744145-9f80f0e3a5a2?w=600&h=400&fit=crop",
      description:
        "Visit the birthplace of Buddhism and meditate under the Bodhi Tree",
      highlights: ["Mahabodhi Temple", "Buddhist sites", "Spiritual groups"],
    },
    {
      name: "Rishikesh - Yoga Capital",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
      description:
        "The world's yoga capital nestled in the Himalayan foothills",
      highlights: ["Yoga classes", "Ashram stays", "River activities"],
    },
    {
      name: "Dharamshala - Mountain Serenity",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
      description:
        "Peaceful mountain retreat for meditation and self-discovery",
      highlights: ["Monastery visits", "Mountain views", "Silent retreats"],
    },
  ];

  const retreats = [
    {
      title: "7-Day Meditation Retreat",
      duration: "7 days",
      price: 599,
      focus: "Inner Peace",
      icon: Heart,
    },
    {
      title: "14-Day Yoga & Wellness",
      duration: "14 days",
      price: 1199,
      focus: "Body & Mind",
      icon: Leaf,
    },
    {
      title: "21-Day Spiritual Awakening",
      duration: "21 days",
      price: 1799,
      focus: "Transformation",
      icon: Zap,
    },
  ];

  return (
    <div className="min-h-screen bg-beige flex flex-col">
      {/* Hero Banner */}
      <PageHero
        title="Spiritual Travel"
        subtitle="Journey inward while exploring sacred destinations and ancient wisdom traditions"
        backgroundImage="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
      />

      {/* Main Content */}
      <div className="flex-grow">
        {/* Sacred Destinations */}
        <section className="py-8 sm:py-12 lg:py-24 px-3 sm:px-6 lg:px-12 max-w-7xl mx-auto w-full">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-green-primary mb-6 sm:mb-9 lg:mb-12">
            Sacred Destinations
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {destinations.map((destination, index) => (
              <div
                key={index}
                className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-border"
              >
                {/* Image */}
                <div className="h-40 sm:h-48 lg:h-56 overflow-hidden">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 lg:p-8">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-text-dark mb-2">
                    {destination.name}
                  </h3>
                  <p className="text-xs sm:text-sm lg:text-base text-text-dark/70 mb-3 sm:mb-4">
                    {destination.description}
                  </p>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-2">
                    {destination.highlights.map((highlight, i) => (
                      <span
                        key={i}
                        className="bg-green-primary/20 text-green-primary text-xs font-semibold px-3 py-1 rounded-full"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Meditation Retreats */}
        <section className="py-8 sm:py-12 lg:py-24 px-3 sm:px-6 lg:px-12 bg-beige-light">
          <div className="max-w-7xl mx-auto w-full">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-green-primary mb-6 sm:mb-9 lg:mb-12 text-center">
              Meditation Retreats
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {retreats.map((retreat, index) => {
                const Icon = retreat.icon;
                return (
                  <div
                    key={index}
                    className="bg-card p-4 sm:p-6 lg:p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center border border-border"
                  >
                    <Icon className="h-8 sm:h-10 lg:h-12 w-8 sm:w-10 lg:w-12 text-green-primary mx-auto mb-3 sm:mb-4" />
                    <h3 className="text-base sm:text-lg lg:text-xl font-bold text-text-dark mb-2">
                      {retreat.title}
                    </h3>
                    <p className="text-text-dark/70 text-xs sm:text-sm mb-3 sm:mb-4">
                      {retreat.duration}
                    </p>
                    <p className="text-green-primary text-xs sm:text-sm font-semibold mb-4 sm:mb-6">
                      Focus: {retreat.focus}
                    </p>
                    <div className="border-t border-beige-dark pt-4 sm:pt-5 lg:pt-6">
                      <p className="text-xs text-text-dark/50 mb-1">From</p>
                      <p className="text-2xl sm:text-2xl lg:text-3xl font-black text-green-primary mb-4 sm:mb-6">
                        ${retreat.price}
                      </p>
                      <button className="w-full bg-blue-accent hover:bg-blue-accent-dark text-white font-bold py-2 sm:py-2.5 lg:py-3 rounded-lg transition-colors text-sm sm:text-base touch-target-min">
                        Learn More
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Temple Tours */}
        <section className="py-8 sm:py-12 lg:py-24 px-3 sm:px-6 lg:px-12 max-w-7xl mx-auto w-full">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-green-primary mb-6 sm:mb-9 lg:mb-12">
            Temple Tours & Spiritual Guides
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Temple Tours */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-xl sm:text-2xl font-black text-text-dark mb-4 sm:mb-6">
                Guided Temple Tours
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {[
                  "Ancient temple complexes and their spiritual significance",
                  "Rituals, ceremonies, and daily practices",
                  "Interaction with monks and spiritual teachers",
                  "Sacred architecture and spiritual symbolism",
                ].map((item, index) => (
                  <div key={index} className="flex gap-3 sm:gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-accent text-white flex-shrink-0">
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm lg:text-base text-text-dark/70">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Spiritual Guides */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-xl sm:text-2xl font-black text-text-dark mb-4 sm:mb-6">
                Our Spiritual Guides
              </h3>
              <p className="text-xs sm:text-sm lg:text-base text-text-dark/70 mb-4 sm:mb-6">
                Our team of experienced spiritual guides and teachers are
                committed to helping you:
              </p>
              <div className="space-y-3 sm:space-y-4">
                {[
                  "Deepen your meditation and mindfulness practice",
                  "Understand different spiritual traditions",
                  "Connect with local communities and cultures",
                  "Experience authentic spiritual practices",
                ].map((item, index) => (
                  <div key={index} className="flex gap-3 sm:gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-primary/20 text-green-primary flex-shrink-0">
                        <Users className="h-4 w-4" />
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm lg:text-base text-text-dark/70">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-8 sm:py-12 lg:py-24 px-3 sm:px-6 lg:px-12 bg-gradient-to-r from-green-primary to-green-primary/80 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-3 sm:mb-4">
              Begin Your Spiritual Journey
            </h2>
            <p className="text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 text-white/90">
              Discover inner peace and wisdom through our carefully designed
              spiritual travel experiences
            </p>
            <button className="bg-white hover:bg-gray-100 text-green-primary font-bold px-6 sm:px-8 py-2.5 sm:py-4 rounded-lg transition-colors text-sm sm:text-base touch-target-min">
              Explore Spiritual Programs
            </button>
          </div>
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
