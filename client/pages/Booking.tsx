import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  User,
  Mail,
  Phone as PhoneIcon,
  Shield,
  CheckCircle,
  Lock,
  Headphones,
  Check,
  Loader2,
  Users
} from "lucide-react";

// Helper Components
function ProgressStep({ number, label, active = false, completed = false }: { number: number; label: string; active?: boolean; completed?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`
        w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300
        ${active ? 'bg-green-primary text-white shadow-lg scale-110' : ''}
        ${completed ? 'bg-green-primary text-white' : ''}
        ${!active && !completed ? 'bg-border text-text-dark/50' : ''}
      `}>
        {completed ? <Check className="h-5 w-5" /> : number}
      </div>
      <span className={`text-xs sm:text-sm font-semibold whitespace-nowrap ${active ? 'text-green-primary' : 'text-text-dark/60'}`}>
        {label}
      </span>
    </div>
  );
}

function TrustBadge({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl p-5 shadow-sm border border-border/50 transition-all duration-300 hover:shadow-md"
    >
      <div className="flex items-start gap-4">
        <div className="p-2.5 bg-green-primary/10 rounded-lg flex-shrink-0">
          <Icon className="h-5 w-5 text-green-primary" />
        </div>
        <div>
          <h3 className="font-bold text-text-dark text-sm mb-1">{title}</h3>
          <p className="text-xs text-text-dark/60 leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}

function DetailRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="p-2 bg-white/15 rounded-lg flex-shrink-0">
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <p className="text-xs opacity-70 mb-0.5">{label}</p>
        <p className="font-semibold text-sm">{value}</p>
      </div>
    </div>
  );
}

export default function Booking() {
  const { type, slug } = useParams();
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  // Protect route - redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      // Store intended booking URL
      sessionStorage.setItem('intendedBooking', window.location.pathname);
      // Redirect to homepage
      navigate('/', { replace: true });
    }
  }, [user, isLoading, navigate]);

  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch trek or tour data from API based on type and slug
  useEffect(() => {
    const fetchItem = async () => {
      if (!type || !slug) {
        setError("Invalid booking parameters");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const endpoint = type === "trek" ? `/api/treks` : `/api/tours`;
        const response = await fetch(endpoint);

        if (!response.ok) {
          throw new Error(`Failed to fetch ${type} data`);
        }

        const items = await response.json();
        const foundItem = items.find((i: any) => i.slug === slug);

        if (foundItem) {
          setItem(foundItem);
        } else {
          setError(`${type === "trek" ? "Trek" : "Tour"} not found`);
        }
      } catch (err) {
        console.error("Error fetching item:", err);
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [type, slug]);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    date: "",
    guests: 1,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEmailValid = formData.email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  const isFormValid =
    formData.fullName.trim() &&
    isEmailValid &&
    formData.date;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const newValue = name === "guests" ? parseInt(value) || 1 : value;
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.date) {
      newErrors.date = "Date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!user || !item) return;

    setIsSubmitting(true);
    try {
      // Get Supabase session token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Not authenticated");
      }

      console.log('[Booking] Creating booking...');

      // Create booking in database
      const bookingResponse = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          type,
          itemName: item.name,
          itemSlug: item.slug,
          location: item.location,
          duration: item.duration,
          price: item.price,
          travelDate: formData.date,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          guests: formData.guests,
          amount: item.price * formData.guests,
        }),
      });

      if (!bookingResponse.ok) {
        const errorData = await bookingResponse.json().catch(() => ({ error: 'Failed to create booking' }));
        console.error('[Booking] Booking creation failed:', {
          status: bookingResponse.status,
          statusText: bookingResponse.statusText,
          error: errorData
        });
        throw new Error(errorData.error || errorData.details || "Failed to create booking");
      }

      const booking = await bookingResponse.json();
      console.log('[Booking] Booking created successfully:', booking.id);

      // Create Stripe checkout session
      console.log('[Booking] Creating Stripe checkout session...');
      const sessionResponse = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          bookingId: booking.id,
          guests: formData.guests,
        }),
      });

      if (!sessionResponse.ok) {
        const errorData = await sessionResponse.json().catch(() => ({ error: 'Failed to create payment session' }));
        console.error('[Booking] Checkout session creation failed:', {
          status: sessionResponse.status,
          statusText: sessionResponse.statusText,
          error: errorData
        });
        throw new Error(errorData.error || errorData.message || "Failed to create payment session");
      }

      const { sessionUrl } = await sessionResponse.json();
      console.log('[Booking] Checkout session created, redirecting to Stripe...');

      // Redirect to Stripe Checkout
      window.location.href = sessionUrl;
    } catch (error) {
      console.error("[Booking] Booking error:", error);
      setIsSubmitting(false);
      setErrors({ submit: error instanceof Error ? error.message : "An error occurred" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-beige flex flex-col">
        <FloatingWhatsAppButton />
        <div className="flex-grow flex flex-col items-center justify-center px-4 py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-primary mb-4"></div>
          <p className="text-text-dark/70">Loading booking details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!item || error) {
    return (
      <div className="min-h-screen bg-beige flex flex-col">
        <FloatingWhatsAppButton />
        <div className="flex-grow flex flex-col items-center justify-center px-4 py-12">
          <h1 className="text-3xl font-black text-green-primary mb-4">
            {error || "Invalid Booking Link"}
          </h1>
          <p className="text-text-dark/70 mb-8">
            The trek or tour you're trying to book doesn't exist.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-accent hover:bg-blue-accent-dark text-white font-bold px-6 py-2.5 rounded-lg transition-colors"
          >
            Back to Home
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-beige via-beige-light to-beige flex flex-col">
      <FloatingWhatsAppButton />

      {/* Loading Overlay */}
      {isSubmitting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm mx-4"
          >
            <Loader2 className="h-12 w-12 animate-spin text-green-primary mx-auto mb-4" />
            <p className="text-text-dark font-bold text-lg text-center mb-2">Preparing your booking...</p>
            <p className="text-text-dark/60 text-sm text-center">Please wait while we process your details</p>
          </motion.div>
        </motion.div>
      )}

      {/* Enhanced Header Section */}
      <div className="relative bg-gradient-to-br from-green-primary/5 via-beige to-beige-light pt-20 sm:pt-24 md:pt-28 pb-12 sm:pb-16">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-accent/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-12">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-accent hover:text-blue-accent-dark font-semibold transition-all hover:-translate-x-1 mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-8">
            <Link to="/" className="text-text-dark/60 hover:text-green-primary transition-colors">Home</Link>
            <span className="text-text-dark/40">→</span>
            <Link to={`/${type}`} className="text-text-dark/60 hover:text-green-primary transition-colors capitalize">{type}s</Link>
            <span className="text-text-dark/40">→</span>
            <span className="text-green-primary font-semibold">Booking</span>
          </div>

          {/* Title */}
          <div className="text-center mb-10">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl md:text-6xl font-black text-text-dark mb-4 tracking-tight"
            >
              Book Your Adventure
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-base sm:text-lg text-text-dark/70 mb-8"
            >
              Complete your booking for <span className="font-bold text-green-primary">{item.name}</span>
            </motion.p>
          </div>

          {/* Progress Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <div className="flex items-center justify-between">
              <ProgressStep active number={1} label="Details" />
              <div className="flex-1 h-0.5 bg-border mx-2 sm:mx-4" />
              <ProgressStep number={2} label="Payment" />
              <div className="flex-1 h-0.5 bg-border mx-2 sm:mx-4" />
              <ProgressStep number={3} label="Confirmation" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Trust Signals */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-12 -mt-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6"
        >
          <TrustBadge
            icon={Shield}
            title="Secure Booking"
            description="Your information is encrypted and protected"
          />
          <TrustBadge
            icon={CheckCircle}
            title="Instant Confirmation"
            description="Receive booking details immediately"
          />
          <TrustBadge
            icon={Headphones}
            title="24/7 Support"
            description="We're here to help anytime"
          />
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="flex-grow px-3 sm:px-6 lg:px-12 max-w-7xl mx-auto w-full mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <motion.form
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl shadow-lg border border-border/40 p-6 sm:p-8 lg:p-10"
            >
              <h2 className="text-2xl sm:text-3xl font-black text-green-primary mb-8 tracking-tight">
                Booking Details
              </h2>

              {/* Full Name */}
              <div className="mb-6">
                <label
                  htmlFor="fullName"
                  className="block text-sm font-bold text-text-dark mb-2"
                >
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-dark/40" />
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className={`w-full pl-12 pr-5 py-3.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-transparent bg-white text-text-dark placeholder-text-dark/40 shadow-sm transition-all duration-200 ${errors.fullName ? 'border-red-500' : 'border-border'
                      }`}
                  />
                  {formData.fullName.trim() && !errors.fullName && (
                    <Check className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-green-primary" />
                  )}
                </div>
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <span>⚠️</span> {errors.fullName}
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="block text-sm font-bold text-text-dark mb-2"
                >
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-dark/40" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    className={`w-full pl-12 pr-5 py-3.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-transparent bg-white text-text-dark placeholder-text-dark/40 shadow-sm transition-all duration-200 ${errors.email ? 'border-red-500' : 'border-border'
                      }`}
                  />
                  {isEmailValid && !errors.email && (
                    <Check className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-green-primary" />
                  )}
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <span>⚠️</span> {errors.email}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div className="mb-6">
                <label
                  htmlFor="phone"
                  className="block text-sm font-bold text-text-dark mb-2"
                >
                  Phone Number <span className="text-text-dark/50 font-normal text-xs">(Optional)</span>
                </label>
                <div className="relative">
                  <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-dark/40" />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full pl-12 pr-5 py-3.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-transparent bg-white text-text-dark placeholder-text-dark/40 shadow-sm transition-all duration-200"
                  />
                </div>
              </div>

              {/* Date of Travel */}
              <div className="mb-6">
                <label
                  htmlFor="date"
                  className="block text-sm font-bold text-text-dark mb-2"
                >
                  Date of {type === "trek" ? "Trek" : "Tour"}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-dark/40 pointer-events-none" />
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    min={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                    className={`w-full pl-12 pr-5 py-3.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-transparent bg-white text-text-dark shadow-sm transition-all duration-200 ${errors.date ? 'border-red-500' : 'border-border'
                      }`}
                  />
                  {formData.date && !errors.date && (
                    <Check className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-green-primary" />
                  )}
                </div>
                {errors.date && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <span>⚠️</span> {errors.date}
                  </p>
                )}
                <p className="text-xs text-text-dark/60 mt-2">
                  Minimum 7 days from today
                </p>
              </div>

              {/* Number of Guests */}
              <div className="mb-8">
                <label
                  htmlFor="guests"
                  className="block text-sm font-bold text-text-dark mb-2"
                >
                  Number of Participants <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-dark/40" />
                  <input
                    type="number"
                    id="guests"
                    name="guests"
                    value={formData.guests}
                    onChange={handleInputChange}
                    min="1"
                    max="20"
                    className="w-full pl-12 pr-5 py-3.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-transparent bg-white text-text-dark shadow-sm transition-all duration-200"
                  />
                </div>
                <div className="mt-3 p-4 bg-green-primary/5 border border-green-primary/20 rounded-lg">
                  <p className="text-sm text-text-dark/70">
                    <span className="font-bold text-green-primary">Total Amount: ${(item.price * formData.guests).toFixed(2)} USD</span>
                  </p>
                  <p className="text-xs text-text-dark/60 mt-1">
                    ${item.price} per person × {formData.guests} {formData.guests === 1 ? "guest" : "guests"}
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={isFormValid ? { scale: 1.02, y: -2 } : {}}
                whileTap={isFormValid ? { scale: 0.98 } : {}}
                type="submit"
                disabled={!isFormValid}
                className={`
                  relative w-full group overflow-hidden
                  font-black px-8 py-5 rounded-xl
                  text-lg tracking-tight
                  transition-all duration-300
                  ${isFormValid
                    ? 'bg-green-primary hover:bg-green-primary/90 text-white shadow-lg hover:shadow-xl cursor-pointer'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                {isFormValid && (
                  <motion.div
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  />
                )}

                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Lock className="h-5 w-5" />
                  Continue to Secure Payment
                </span>
              </motion.button>

              {!isFormValid && (
                <p className="text-xs text-text-dark/60 text-center mt-3">
                  Please fill in all required fields to continue
                </p>
              )}

              {/* Error Message Display */}
              {errors.submit && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg"
                >
                  <p className="text-red-600 text-sm font-semibold flex items-center gap-2">
                    <span className="text-lg">⚠️</span>
                    {errors.submit}
                  </p>
                  <p className="text-red-500 text-xs mt-2">
                    Please try again or contact support if the issue persists.
                  </p>
                </motion.div>
              )}
            </motion.form>
          </div>

          {/* Summary Section */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="sticky top-24"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-primary via-green-primary/90 to-green-primary/80" />
                <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />

                {/* Content */}
                <div className="relative p-6 sm:p-8 text-white">
                  <div className="flex items-center gap-3 mb-6">
                    <Shield className="h-6 w-6" />
                    <h2 className="text-xl font-black">Booking Summary</h2>
                  </div>

                  {/* Adventure card */}
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 mb-6 border border-white/10">
                    <p className="text-xs opacity-70 uppercase tracking-wider mb-2">Your Adventure</p>
                    <h3 className="text-lg font-bold leading-snug">{item.name}</h3>
                  </div>

                  {/* Details with better spacing */}
                  <div className="space-y-4 mb-8">
                    <DetailRow icon={MapPin} label="Location" value={item.location} />
                    <DetailRow icon={Clock} label="Duration" value={item.duration} />
                  </div>

                  {/* Total with emphasis */}
                  <div className="border-t border-white/20 pt-6">
                    <div className="flex justify-between items-baseline mb-2">
                      <span className="text-sm opacity-80">Total Amount</span>
                      <span className="text-4xl font-black">${item.price}</span>
                    </div>
                    <p className="text-xs opacity-60">Per person</p>
                  </div>

                  {/* Info Text */}
                  <p className="text-xs opacity-70 mt-6 leading-relaxed">
                    Final payment will be calculated based on number of travelers during payment processing.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
