import HeroSection from "@/components/HeroSection";
import TrustIndicators from "@/components/TrustIndicators";
import ActivitiesSection from "@/components/ActivitiesSection";
import ExploreDestinationsSection from "@/components/ExploreDestinationsSection";
import WhyTravelWithUs from "@/components/WhyTravelWithUs";
import Testimonials from "@/components/Testimonials";
import MobileStickyBottomCTA from "@/components/MobileStickyBottomCTA";
import TravelAssistantChatbot from "@/components/TravelAssistantChatbot";
import Footer from "@/components/Footer";

export default function Home() {
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
