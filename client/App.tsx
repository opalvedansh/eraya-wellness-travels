import "./global.css";
import "./leaflet.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Tour from "./pages/Tour";
import Trek from "./pages/Trek";
import TreksMap from "./pages/TreksMap";
import ToursMap from "./pages/ToursMap";
import TourDetail from "./pages/TourDetail";
import TrekDetail from "./pages/TrekDetail";
import Booking from "./pages/Booking";
import PaymentConfirmation from "./pages/PaymentConfirmation";
import SpiritualTravel from "./pages/SpiritualTravel";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import NotFound from "./pages/NotFound";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <FloatingWhatsAppButton />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/tour" element={<Tour />} />
              <Route path="/tour/:slug" element={<TourDetail />} />
              <Route path="/trek" element={<Trek />} />
              <Route path="/tour/map" element={<ToursMap />} />
              <Route path="/trek/map" element={<TreksMap />} />
              <Route path="/trek/:slug" element={<TrekDetail />} />
              <Route path="/treks/:slug" element={<TrekDetail />} />
              <Route path="/booking/:type/:slug" element={<Booking />} />
              <Route path="/payment-confirmation" element={<PaymentConfirmation />} />
              <Route path="/spiritual" element={<SpiritualTravel />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogDetail />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
