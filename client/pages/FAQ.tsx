import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  const faqCategories = [
    {
      category: "Booking & Reservations",
      questions: [
        {
          q: "How do I book a tour or trek?",
          a: "You can book directly through our website by clicking on any tour or trek package and filling out the booking form. Alternatively, you can contact us via email or phone, and our team will assist you with the booking process.",
        },
        {
          q: "What payment methods do you accept?",
          a: "We accept all major credit cards (Visa, Mastercard, American Express), bank transfers, and PayPal. A deposit is required to secure your booking, with the balance due 30 days before departure.",
        },
        {
          q: "Can I cancel or modify my booking?",
          a: "Yes, you can cancel or modify your booking. Cancellations made 60+ days before departure receive a full refund minus a 5% processing fee. Cancellations 30-60 days before receive a 50% refund. Please refer to our Terms & Conditions for full details.",
        },
        {
          q: "Do you offer group discounts?",
          a: "Yes! Groups of 6 or more receive a 10% discount, and groups of 10+ receive a 15% discount. Contact us for custom group pricing and private tour options.",
        },
      ],
    },
    {
      category: "Travel & Preparation",
      questions: [
        {
          q: "What should I pack for a trek?",
          a: "We provide a detailed packing list upon booking confirmation. Generally, you'll need: layered clothing, waterproof jacket, trekking boots, sleeping bag (can be rented), headlamp, water bottles, and personal items. High-altitude treks require additional gear which we can help you source.",
        },
        {
          q: "Do I need travel insurance?",
          a: "Yes, comprehensive travel insurance is mandatory for all our trips. It should cover medical emergencies, evacuation, trip cancellation, and personal belongings. We can recommend reputable insurance providers.",
        },
        {
          q: "What fitness level is required?",
          a: "Fitness requirements vary by trip. Easy treks require basic fitness, moderate treks need regular exercise, and challenging treks require excellent physical condition. We provide detailed fitness guidelines for each trip and can help you prepare with a training plan.",
        },
        {
          q: "Do you provide airport transfers?",
          a: "Yes, airport transfers are included in most packages. We'll meet you at the airport and handle all transportation during your trip. Please provide your flight details at least 7 days before arrival.",
        },
      ],
    },
    {
      category: "During Your Trip",
      questions: [
        {
          q: "What's included in the tour price?",
          a: "Typically included: accommodation, meals (as specified), professional guides, permits and fees, transportation, airport transfers, and basic equipment. Not included: flights, travel insurance, personal expenses, tips, and optional activities. Full details are provided for each trip.",
        },
        {
          q: "What's the group size?",
          a: "Group sizes vary by trip type. Most tours accommodate 8-12 people, while treks typically have 6-10 participants. We also offer private tours for individuals, couples, or custom groups.",
        },
        {
          q: "What if I have dietary restrictions?",
          a: "We accommodate all dietary requirements including vegetarian, vegan, gluten-free, and allergies. Please inform us at the time of booking, and we'll ensure your needs are met throughout the trip.",
        },
        {
          q: "Is there Wi-Fi and phone service?",
          a: "Wi-Fi is available in most hotels and lodges, though it may be limited in remote areas. Phone service varies by location. We recommend downloading offline maps and informing family of potential communication gaps during treks.",
        },
      ],
    },
    {
      category: "Safety & Support",
      questions: [
        {
          q: "How do you ensure safety during treks?",
          a: "Safety is our top priority. All guides are certified, trained in first aid, and carry emergency communication devices. We monitor weather conditions, have evacuation plans, and maintain small group sizes. Medical kits and oxygen are always available on high-altitude treks.",
        },
        {
          q: "What happens in case of an emergency?",
          a: "All our guides are trained in emergency response and first aid. We have 24/7 emergency support, evacuation procedures, and partnerships with local medical facilities. Your travel insurance should cover emergency medical expenses and evacuation.",
        },
        {
          q: "Are your guides certified?",
          a: "Yes, all our guides are licensed by the relevant tourism boards, certified in first aid and mountain rescue, and have extensive local knowledge. Many have years of experience and speak multiple languages.",
        },
        {
          q: "What's your sustainability policy?",
          a: "We're committed to responsible tourism. We follow Leave No Trace principles, support local communities, use eco-friendly accommodations when possible, and offset carbon emissions. A portion of each booking goes to local conservation and community projects.",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-beige flex flex-col">
      <PageHero
        title="Frequently Asked Questions"
        subtitle="Find answers to common questions about our tours, treks, and travel services"
        backgroundImage="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
      />

      <div className="flex-grow">
        <section className="py-16 lg:py-24 px-6 lg:px-12 max-w-4xl mx-auto">
          {faqCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-12">
              <h2 className="text-2xl lg:text-3xl font-black text-green-primary mb-6">
                {category.category}
              </h2>
              <Accordion type="single" collapsible className="w-full space-y-4">
                {category.questions.map((item, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${categoryIndex}-${index}`}
                    className="bg-card rounded-lg border border-border px-6"
                  >
                    <AccordionTrigger className="text-left font-bold text-text-dark hover:no-underline">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-text-dark/70 leading-relaxed pt-2 pb-4">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}

          {/* Still Have Questions Section */}
          <div className="mt-16 bg-gradient-to-r from-green-primary to-green-primary/80 text-white rounded-lg p-12 text-center">
            <h3 className="text-3xl font-black mb-4">Still Have Questions?</h3>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Our travel experts are here to help. Reach out and we'll get back
              to you within 24 hours.
            </p>
            <a
              href="/contact"
              className="inline-block bg-blue-accent hover:bg-blue-accent-dark text-white font-bold px-8 py-4 rounded-lg transition-colors"
            >
              Contact Us
            </a>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
