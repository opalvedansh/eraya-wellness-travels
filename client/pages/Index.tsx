import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import TrustIndicators from "@/components/TrustIndicators";
import ActivitiesSection from "@/components/ActivitiesSection";
import ExploreDestinationsSection from "@/components/ExploreDestinationsSection";
import Testimonials from "@/components/Testimonials";
import WhyTravelWithUs from "@/components/WhyTravelWithUs";
import MobileStickyBottomCTA from "@/components/MobileStickyBottomCTA";
import TravelAssistantChatbot from "@/components/TravelAssistantChatbot";

export default function Index() {
  return (
    <div className="min-h-screen flex flex-col bg-beige pb-24 md:pb-0">
      <HeroSection />
      <TrustIndicators />
      <ActivitiesSection />
      <ExploreDestinationsSection />
      <WhyTravelWithUs />
      <Testimonials />
      <MobileStickyBottomCTA />
      <TravelAssistantChatbot />
      <Footer />
    </div>
  );
}
