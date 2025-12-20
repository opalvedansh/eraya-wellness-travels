import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import Footer from "@/components/Footer";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton";
import { ArrowLeft, MapPin, Calendar, Clock, DollarSign } from "lucide-react";

export default function Booking() {
  const { type, slug } = useParams();
  const navigate = useNavigate();

  const trekDatabase = [
    {
      id: 1,
      name: "Annapurna Base Camp Trek",
      slug: "annapurna-base-camp",
      location: "Nepal",
      duration: "12 days",
      price: 1299,
    },
    {
      id: 2,
      name: "Everest Base Camp Trek",
      slug: "everest-base-camp",
      location: "Nepal",
      duration: "14 days",
      price: 1699,
    },
    {
      id: 3,
      name: "Valley Trek - Langtang",
      slug: "langtang-valley",
      location: "Nepal",
      duration: "8 days",
      price: 899,
    },
    {
      id: 4,
      name: "Forest Night Hike - Sagano",
      slug: "sagano-night-hike",
      location: "Japan",
      duration: "3 days",
      price: 399,
    },
  ];

  const tourDatabase = [
    {
      id: 1,
      name: "Nepal Mountain Explorer",
      slug: "nepal-mountain-explorer",
      location: "Nepal",
      duration: "10 days",
      price: 1299,
    },
    {
      id: 2,
      name: "Tibet Sacred Journey",
      slug: "tibet-sacred-journey",
      location: "Tibet",
      duration: "12 days",
      price: 1599,
    },
    {
      id: 3,
      name: "Bhutan Wellness Retreat",
      slug: "bhutan-wellness-retreat",
      location: "Bhutan",
      duration: "8 days",
      price: 1899,
    },
    {
      id: 4,
      name: "Rajasthan Heritage Tour",
      slug: "rajasthan-heritage-tour",
      location: "India",
      duration: "7 days",
      price: 899,
    },
    {
      id: 5,
      name: "Kerala Backwater Experience",
      slug: "kerala-backwater-experience",
      location: "India",
      duration: "6 days",
      price: 799,
    },
    {
      id: 6,
      name: "Patagonia Adventure",
      slug: "patagonia-adventure",
      location: "Argentina",
      duration: "14 days",
      price: 2299,
    },
  ];

  const getItem = () => {
    if (type === "trek") {
      return trekDatabase.find((t) => t.slug === slug);
    } else if (type === "tour") {
      return tourDatabase.find((t) => t.slug === slug);
    }
    return null;
  };

  const item = getItem();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    date: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const isFormValid =
    formData.fullName.trim() &&
    formData.email.trim() &&
    formData.date &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      navigate("/payment-confirmation", {
        state: {
          bookingData: formData,
          itemData: item,
          type,
        },
      });
    }
  };

  if (!item) {
    return (
      <div className="min-h-screen bg-beige flex flex-col">
        <FloatingWhatsAppButton />
        <div className="flex-grow flex flex-col items-center justify-center px-4 py-12">
          <h1 className="text-3xl font-black text-green-primary mb-4">
            Invalid Booking Link
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
    <div className="min-h-screen bg-beige flex flex-col pb-12 sm:pb-20">
      <FloatingWhatsAppButton />

      {/* Back Button */}
      <div className="pt-20 sm:pt-24 md:pt-28 px-3 sm:px-6 lg:px-12 max-w-7xl mx-auto w-full mb-8 sm:mb-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-accent hover:text-blue-accent-dark font-semibold transition-premium hover:-translate-x-0.5"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </div>

      {/* Header Section */}
      <section className="px-3 sm:px-6 lg:px-12 max-w-7xl mx-auto w-full mb-12 sm:mb-14">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-text-dark mb-3 sm:mb-5 tracking-tight">
            Book Your Adventure
          </h1>
          <p className="text-base sm:text-lg text-text-dark/75">
            Complete your booking for <span className="font-bold text-green-primary">{item.name}</span>
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="flex-grow px-3 sm:px-6 lg:px-12 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="bg-card rounded-xl shadow-premium-sm border border-border/40 p-8 sm:p-10"
            >
              <h2 className="text-2xl sm:text-3xl font-black text-green-primary mb-8 sm:mb-10 tracking-tight">
                Booking Details
              </h2>

              {/* Full Name */}
              <div className="mb-7 sm:mb-9">
                <label
                  htmlFor="fullName"
                  className="block text-sm font-bold text-text-dark mb-3 tracking-tight"
                >
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="w-full px-5 py-3.5 sm:py-4 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-0 bg-white text-text-dark placeholder-text-dark/50 shadow-premium-sm transition-premium"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-2 font-medium">{errors.fullName}</p>
                )}
              </div>

              {/* Email Address */}
              <div className="mb-7 sm:mb-9">
                <label
                  htmlFor="email"
                  className="block text-sm font-bold text-text-dark mb-3 tracking-tight"
                >
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  className="w-full px-5 py-3.5 sm:py-4 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-0 bg-white text-text-dark placeholder-text-dark/50 shadow-premium-sm transition-premium"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-2 font-medium">{errors.email}</p>
                )}
              </div>

              {/* Phone Number */}
              <div className="mb-7 sm:mb-9">
                <label
                  htmlFor="phone"
                  className="block text-sm font-bold text-text-dark mb-3 tracking-tight"
                >
                  Phone Number <span className="text-text-dark/50 font-normal">(Optional)</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  className="w-full px-5 py-3.5 sm:py-4 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-0 bg-white text-text-dark placeholder-text-dark/50 shadow-premium-sm transition-premium"
                />
              </div>

              {/* Date of Travel */}
              <div className="mb-10 sm:mb-12">
                <label
                  htmlFor="date"
                  className="block text-sm font-bold text-text-dark mb-3 tracking-tight"
                >
                  Date of {type === "trek" ? "Trek" : "Tour"}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3.5 sm:py-4 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-0 bg-white text-text-dark shadow-premium-sm transition-premium"
                />
                {errors.date && (
                  <p className="text-red-500 text-sm mt-2 font-medium">{errors.date}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isFormValid}
                className={`w-full font-bold px-8 py-4 sm:py-5 rounded-lg transition-premium text-base sm:text-lg touch-target-min shadow-premium hover:-translate-y-0.5 ${
                  isFormValid
                    ? "bg-green-primary hover:bg-green-primary/85 text-white hover:shadow-premium-lg"
                    : "bg-muted text-text-dark/50 cursor-not-allowed"
                }`}
              >
                Proceed to Payment
              </button>
            </form>
          </div>

          {/* Summary Section */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-b from-green-primary to-green-primary/85 rounded-2xl shadow-premium-lg p-8 sm:p-9 text-white sticky top-32">
              <h2 className="text-2xl sm:text-3xl font-black mb-8 sm:mb-10 tracking-tight">
                Booking Summary
              </h2>

              {/* Trek/Tour Name */}
              <div className="mb-8 sm:mb-10 pb-8 sm:pb-10 border-b border-white/20">
                <p className="text-xs sm:text-sm opacity-75 mb-2 font-medium uppercase tracking-wider">
                  {type === "trek" ? "Trek" : "Tour"} Name
                </p>
                <p className="text-xl sm:text-2xl font-bold leading-tight">{item.name}</p>
              </div>

              {/* Details Grid */}
              <div className="space-y-6 sm:space-y-7 mb-10 sm:mb-12">
                {/* Location */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white/15 rounded-lg flex-shrink-0">
                    <MapPin className="h-5 w-5 flex-shrink-0 opacity-90" />
                  </div>
                  <div className="flex-grow">
                    <p className="text-xs opacity-70 mb-1 font-medium">Location</p>
                    <p className="font-bold text-base">{item.location}</p>
                  </div>
                </div>

                {/* Duration */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white/15 rounded-lg flex-shrink-0">
                    <Clock className="h-5 w-5 flex-shrink-0 opacity-90" />
                  </div>
                  <div className="flex-grow">
                    <p className="text-xs opacity-70 mb-1 font-medium">Duration</p>
                    <p className="font-bold text-base">{item.duration}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white/15 rounded-lg flex-shrink-0">
                    <DollarSign className="h-5 w-5 flex-shrink-0 opacity-90" />
                  </div>
                  <div className="flex-grow">
                    <p className="text-xs opacity-70 mb-1 font-medium">Price per person</p>
                    <p className="text-3xl font-black tracking-tight">${item.price}</p>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-white/20 pt-8 sm:pt-10">
                <p className="text-xs sm:text-sm opacity-70 mb-2 font-medium uppercase tracking-wider">
                  Total Amount
                </p>
                <p className="text-4xl sm:text-5xl font-black tracking-tight">
                  ${item.price}
                </p>
              </div>

              {/* Info Text */}
              <p className="text-xs opacity-70 mt-8 sm:mt-10 leading-relaxed font-medium">
                Final payment will be calculated based on number of travelers during payment processing.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
