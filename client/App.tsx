import "./global.css";
import "./leaflet.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { HelmetProvider } from "react-helmet-async";
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
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import SpiritualTravel from "./pages/SpiritualTravel";
import SpiritualInsights from "./pages/SpiritualInsights";
import SpiritualPostDetail from "./pages/SpiritualPostDetail";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import NotFound from "./pages/NotFound";
import MyBooking from "./pages/MyBooking";
import Profile from "./pages/Profile";
import { VerifyEmail } from "./pages/VerifyEmail";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton";
import ProtectedRoute from "@/components/ProtectedRoute";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ToursManagement from "./pages/admin/ToursManagement";
import TourForm from "./pages/admin/TourForm";
import TreksManagement from "./pages/admin/TreksManagement";
import TrekForm from "./pages/admin/TrekForm";
import BookingsManagement from "./pages/admin/BookingsManagement";
import AboutSettings from "./pages/admin/AboutSettings";
import AdminSettings from "./pages/admin/AdminSettings";
import SpiritualPostsManagement from "./pages/admin/SpiritualPostsManagement";

const queryClient = new QueryClient();

export default function App() {
  return (
    <HelmetProvider>
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
                <Route path="/payment-success" element={<PaymentSuccess />} />
                <Route path="/payment-cancel" element={<PaymentCancel />} />
                <Route path="/spiritual" element={<SpiritualTravel />} />
                <Route path="/spiritual-insights" element={<SpiritualInsights />} />
                <Route path="/spiritual-insights/:slug" element={<SpiritualPostDetail />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogDetail />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/my-bookings" element={<MyBooking />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/verify-email" element={<VerifyEmail />} />

                {/* Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/tours"
                  element={
                    <ProtectedRoute requireAdmin>
                      <ToursManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/tours/new"
                  element={
                    <ProtectedRoute requireAdmin>
                      <TourForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/tours/edit/:id"
                  element={
                    <ProtectedRoute requireAdmin>
                      <TourForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/treks"
                  element={
                    <ProtectedRoute requireAdmin>
                      <TreksManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/treks/new"
                  element={
                    <ProtectedRoute requireAdmin>
                      <TrekForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/treks/edit/:id"
                  element={
                    <ProtectedRoute requireAdmin>
                      <TrekForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/bookings"
                  element={
                    <ProtectedRoute requireAdmin>
                      <BookingsManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/about"
                  element={
                    <ProtectedRoute requireAdmin>
                      <AboutSettings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/settings"
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminSettings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/spiritual-posts"
                  element={
                    <ProtectedRoute requireAdmin>
                      <SpiritualPostsManagement />
                    </ProtectedRoute>
                  }
                />

                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}
