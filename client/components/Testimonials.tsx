import { Star, Quote } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { API_BASE_URL } from "@/lib/config";

export default function Testimonials() {
  const [submittedReviews, setSubmittedReviews] = useState<any[]>([]);

  // Fetch approved testimonials from API
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/testimonials`)
      .then((res) => res.json())
      .then((data) => {
        // API returns array of testimonials directly
        setSubmittedReviews(Array.isArray(data) ? data : []);
      })
      .catch((error) => console.error("Error fetching testimonials:", error));
  }, []);

  // Map testimonials to display format
  const testimonials = submittedReviews.map((testimonial) => ({
    id: testimonial.id,
    name: testimonial.name,
    location: testimonial.location || "Traveler",
    rating: testimonial.rating,
    text: testimonial.review,
    image: testimonial.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=2d5016&color=fff&size=150`,
    tour: testimonial.experience || "Eraya Wellness Experience",
  }));

  return (
    <section className="py-16 sm:py-20 md:py-28 lg:py-32 px-3 sm:px-4 md:px-6 lg:px-12 bg-beige-light">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-14 md:mb-18 lg:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black text-green-primary mb-3 sm:mb-4 md:mb-5 lg:mb-5 tracking-tight">
            What Our Travelers Say
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-text-dark/75 max-w-3xl mx-auto leading-relaxed">
            Don't just take our word for it - hear from adventurers who've
            experienced our journeys
          </p>
          <div className="flex items-center justify-center gap-1 sm:gap-2 md:gap-2 lg:gap-2 mt-3 sm:mt-4 md:mt-4 lg:mt-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-4 sm:h-5 md:h-5 lg:h-5 w-4 sm:w-5 md:w-5 lg:w-5 fill-green-primary text-green-primary"
                />
              ))}
            </div>
            <span className="text-text-dark font-bold text-sm sm:text-base md:text-base lg:text-base ml-1 sm:ml-2 md:ml-2 lg:ml-2">4.9/5</span>
            <span className="text-text-dark/60 text-xs sm:text-sm md:text-sm lg:text-sm ml-1 sm:ml-2 md:ml-2 lg:ml-2">
              (2,847 reviews)
            </span>
          </div>
        </motion.div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-1.5 sm:-ml-2 md:-ml-3 lg:-ml-4">
            {testimonials.map((testimonial, index) => (
              <CarouselItem
                key={testimonial.id}
                className="pl-2 sm:pl-2.5 md:pl-3 lg:pl-4 basis-full sm:basis-1/1 md:basis-1/2 lg:basis-1/3"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="bg-card p-4 sm:p-6 md:p-7 lg:p-7 rounded-xl shadow-premium hover:shadow-premium-lg transition-all duration-300 border border-border/50 h-full flex flex-col cursor-pointer group"
                >
                  <Quote className="h-6 sm:h-7 md:h-8 lg:h-8 w-6 sm:w-7 md:w-8 lg:w-8 text-green-primary/25 mb-2 sm:mb-4 md:mb-4 lg:mb-4" />
                  <div className="flex mb-2 sm:mb-4 md:mb-4 lg:mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 sm:h-4 md:h-5 lg:h-5 w-4 sm:w-4 md:w-5 lg:w-5 fill-green-primary text-green-primary"
                      />
                    ))}
                  </div>
                  <p className="text-text-dark/85 text-sm sm:text-base md:text-base lg:text-base leading-relaxed mb-4 sm:mb-7 md:mb-8 lg:mb-8 flex-grow font-medium">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center gap-3 sm:gap-3 md:gap-3 lg:gap-3 pt-3 sm:pt-5 md:pt-6 lg:pt-6 border-t border-beige-dark/30">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="h-11 sm:h-12 md:h-13 lg:h-13 w-11 sm:w-12 md:w-13 lg:w-13 rounded-full object-cover flex-shrink-0 shadow-premium-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-text-dark text-sm sm:text-base md:text-base lg:text-base truncate group-hover:text-green-primary transition-colors">
                        {testimonial.name}
                      </p>
                      <p className="text-text-dark/60 text-xs sm:text-sm truncate">
                        {testimonial.location}
                      </p>
                      <p className="text-green-primary text-xs sm:text-xs font-semibold mt-1">
                        {testimonial.tour}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-10 lg:-left-12" />
          <CarouselNext className="hidden md:flex -right-10 lg:-right-12" />
        </Carousel>
      </div>
    </section>
  );
}
