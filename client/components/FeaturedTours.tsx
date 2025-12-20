import { Link } from "react-router-dom";

export default function FeaturedTours() {
  const activities = [
    {
      id: 1,
      label: "CAFE REVIEWS",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=500&fit=crop",
      span: "col-span-1 md:col-span-2 lg:col-span-2",
      aspectRatio: "aspect-video",
    },
    {
      id: 2,
      label: "TRAVEL STORIES",
      image:
        "https://images.unsplash.com/photo-1548013146-72d440642117?w=800&h=500&fit=crop",
      span: "col-span-1 md:col-span-2 lg:col-span-2",
      aspectRatio: "aspect-video",
    },
    {
      id: 3,
      label: "THE GREEN LIST",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=500&fit=crop",
      span: "col-span-1 md:col-span-1 lg:col-span-1",
      aspectRatio: "aspect-square",
    },
    {
      id: 4,
      label: "INTERIOR MOTIFS",
      image:
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=500&fit=crop",
      span: "col-span-1 md:col-span-1 lg:col-span-1",
      aspectRatio: "aspect-square",
    },
    {
      id: 5,
      label: "SLICE OF LIFE POSTS",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=500&fit=crop",
      span: "col-span-1 md:col-span-1 lg:col-span-1",
      aspectRatio: "aspect-square",
    },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-24 lg:py-32 px-3 sm:px-4 md:px-6 lg:px-12 bg-beige">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-12 md:mb-16 lg:mb-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-green-primary mb-2 sm:mb-3 md:mb-4 lg:mb-4 tracking-tight">
            Activities in Nepal
          </h2>
          <p className="text-xs sm:text-xs md:text-sm lg:text-sm tracking-widest text-text-dark/60 font-medium letter-spacing-wider">
            CULTURE • FOOD • MOUNTAINS
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3 md:gap-4 lg:gap-6">
          {activities.map((activity) => {
            const isMobileSpan = activity.id <= 2;
            const mobileAspect = isMobileSpan ? 'aspect-video' : 'aspect-square';
            
            return (
              <div
                key={activity.id}
                className={`${isMobileSpan ? 'col-span-1' : 'col-span-1'} md:${activity.span} group relative overflow-hidden rounded-lg cursor-pointer shadow-premium-sm transition-premium hover:shadow-premium-lg hover:-translate-y-1`}
              >
                <Link
                  to="/tour"
                  className="block h-full"
                >
                  <div
                    className={`${mobileAspect} md:${activity.aspectRatio} relative overflow-hidden bg-gray-200 h-full`}
                  >
                    <img
                      src={activity.image}
                      alt={activity.label}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                    />

                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300" />

                    <div className="absolute inset-0 flex items-center justify-center p-2">
                      <div className="bg-white/90 backdrop-blur-sm px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-3 rounded-lg shadow-premium-sm">
                        <p className="text-xs sm:text-sm md:text-sm lg:text-sm font-semibold tracking-wider text-text-dark">
                          {activity.label}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
