import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import TrustIndicators from "@/components/TrustIndicators";
import ExploreDestinationsSection from "@/components/ExploreDestinationsSection";
import Testimonials from "@/components/Testimonials";
import WhyTravelWithUs from "@/components/WhyTravelWithUs";
import MobileStickyBottomCTA from "@/components/MobileStickyBottomCTA";

export default function Index() {
  return (
    <div className="min-h-screen flex flex-col bg-beige pb-24 md:pb-0">
      <HeroSection />
      <TrustIndicators />
      <ExploreDestinationsSection />
      <WhyTravelWithUs />
      <Testimonials />
      <MobileStickyBottomCTA />
      <Footer />
    </div>
  );
}
