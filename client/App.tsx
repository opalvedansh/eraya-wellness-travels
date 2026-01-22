import "./global.css";
import "./leaflet.css";

import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { HelmetProvider } from "react-helmet-async";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton";
import ProtectedRoute from "@/components/ProtectedRoute";

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-beige">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-primary mx-auto mb-4"></div>
      <p className="text-text-dark/60">Loading...</p>
    </div>
  </div>
);

// Eager load only the home page for instant initial load
import Index from "./pages/Index";

// Lazy load all other pages
const About = lazy(() => import("./pages/About"));
const Tour = lazy(() => import("./pages/Tour"));
const TourMapPage = lazy(() => import("./pages/TourMapPage"));
const Trek = lazy(() => import("./pages/Trek"));
const TrekMapPage = lazy(() => import("./pages/TrekMapPage"));

const TourDetail = lazy(() => import("./pages/TourDetail"));
const TrekDetail = lazy(() => import("./pages/TrekDetail"));
const Booking = lazy(() => import("./pages/Booking"));
const PaymentConfirmation = lazy(() => import("./pages/PaymentConfirmation"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const PaymentCancel = lazy(() => import("./pages/PaymentCancel"));
const SpiritualTravel = lazy(() => import("./pages/SpiritualTravel"));
const SpiritualInsights = lazy(() => import("./pages/SpiritualInsights"));
const SpiritualPostDetail = lazy(() => import("./pages/SpiritualPostDetail"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogDetail = lazy(() => import("./pages/BlogDetail"));
const Contact = lazy(() => import("./pages/Contact"));
const FAQ = lazy(() => import("./pages/FAQ"));
const NotFound = lazy(() => import("./pages/NotFound"));
const MyBooking = lazy(() => import("./pages/MyBooking"));
const Profile = lazy(() => import("./pages/Profile"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail").then(module => ({ default: module.VerifyEmail })));

// Lazy load admin pages
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const ToursManagement = lazy(() => import("./pages/admin/ToursManagement"));
const TourForm = lazy(() => import("./pages/admin/TourForm"));
const TreksManagement = lazy(() => import("./pages/admin/TreksManagement"));
const TrekForm = lazy(() => import("./pages/admin/TrekForm"));
const BookingsManagement = lazy(() => import("./pages/admin/BookingsManagement"));
const AboutSettings = lazy(() => import("./pages/admin/AboutSettings"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const SpiritualPostsManagement = lazy(() => import("./pages/admin/SpiritualPostsManagement"));
const BlogManagement = lazy(() => import("./pages/admin/BlogManagement"));
const TestimonialsManagement = lazy(() => import("./pages/admin/TestimonialsManagement"));
const TransformationsManagement = lazy(() => import("./pages/admin/TransformationsManagement"));

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
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/tour" element={<Tour />} />
                  <Route path="/tour/map" element={<TourMapPage />} />
                  <Route path="/tour/:slug" element={<TourDetail />} />
                  <Route path="/trek" element={<Trek />} />
                  <Route path="/trek/map" element={<TrekMapPage />} />
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
                  <Route
                    path="/admin/blog"
                    element={
                      <ProtectedRoute requireAdmin>
                        <BlogManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/testimonials-management"
                    element={
                      <ProtectedRoute requireAdmin>
                        <TestimonialsManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/transformations-management"
                    element={
                      <ProtectedRoute requireAdmin>
                        <TransformationsManagement />
                      </ProtectedRoute>
                    }
                  />

                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}
