import { useNavigate, useLocation } from "react-router-dom";
import Footer from "@/components/Footer";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton";
import { CheckCircle, MapPin, Clock, DollarSign, Mail, Phone } from "lucide-react";

export default function PaymentConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as any;
  const bookingData = state?.bookingData || null;
  const itemData = state?.itemData || null;
  const type = state?.type || null;

  const confirmationNumber = `BK${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  const bookingDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (!bookingData || !itemData) {
    return (
      <div className="min-h-screen bg-beige flex flex-col">
        <FloatingWhatsAppButton />
        <div className="flex-grow flex flex-col items-center justify-center px-4 py-12">
          <h1 className="text-3xl font-black text-green-primary mb-4">
            Invalid Access
          </h1>
          <p className="text-text-dark/70 mb-8">
            Please complete the booking form to proceed.
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

      {/* Success Section */}
      <section className="pt-20 sm:pt-24 md:pt-32 px-3 sm:px-6 lg:px-12 max-w-4xl mx-auto w-full mb-8 sm:mb-12 lg:mb-16">
        <div className="text-center">
          <div className="flex justify-center mb-6 sm:mb-8">
            <CheckCircle className="h-16 w-16 sm:h-20 sm:w-20 text-green-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-text-dark mb-3 sm:mb-4">
            Booking Submitted Successfully!
          </h1>
          <p className="text-base sm:text-lg text-text-dark/70 mb-2">
            Your booking has been received and is pending payment processing.
          </p>
          <p className="text-sm sm:text-base text-text-dark/60">
            Confirmation details have been sent to your email.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="flex-grow px-3 sm:px-6 lg:px-12 max-w-4xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Booking Details */}
          <div className="bg-card rounded-lg border border-border p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-black text-green-primary mb-6 sm:mb-8">
              Booking Details
            </h2>

            {/* Confirmation Number */}
            <div className="mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-border">
              <p className="text-xs sm:text-sm text-text-dark/50 mb-1">
                Confirmation Number
              </p>
              <p className="text-lg sm:text-xl font-bold text-blue-accent font-mono">
                {confirmationNumber}
              </p>
            </div>

            {/* Booking Date */}
            <div className="mb-6 sm:mb-8">
              <p className="text-xs sm:text-sm text-text-dark/50 mb-1">
                Booking Date
              </p>
              <p className="text-base sm:text-lg font-semibold text-text-dark">
                {bookingDate}
              </p>
            </div>

            {/* Travel Date */}
            <div className="mb-6 sm:mb-8">
              <p className="text-xs sm:text-sm text-text-dark/50 mb-1">
                {type === "trek" ? "Trek" : "Tour"} Date
              </p>
              <p className="text-base sm:text-lg font-semibold text-text-dark">
                {new Date(bookingData.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            {/* Traveler Information */}
            <div className="bg-beige rounded-lg p-4 sm:p-6 space-y-4 sm:space-y-6">
              <h3 className="font-bold text-text-dark text-base sm:text-lg">
                Traveler Information
              </h3>

              {/* Name */}
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-blue-accent/20 flex items-center justify-center">
                    <span className="text-blue-accent font-bold text-sm">
                      {bookingData.fullName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="flex-grow">
                  <p className="text-xs sm:text-sm text-text-dark/50 mb-0.5">
                    Full Name
                  </p>
                  <p className="font-semibold text-text-dark">
                    {bookingData.fullName}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-green-primary flex-shrink-0 mt-0.5" />
                <div className="flex-grow">
                  <p className="text-xs sm:text-sm text-text-dark/50 mb-0.5">
                    Email Address
                  </p>
                  <p className="font-semibold text-text-dark break-all">
                    {bookingData.email}
                  </p>
                </div>
              </div>

              {/* Phone */}
              {bookingData.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-green-primary flex-shrink-0 mt-0.5" />
                  <div className="flex-grow">
                    <p className="text-xs sm:text-sm text-text-dark/50 mb-0.5">
                      Phone Number
                    </p>
                    <p className="font-semibold text-text-dark">
                      {bookingData.phone}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Booking Summary */}
          <div>
            <div className="bg-gradient-to-b from-green-primary to-green-primary/80 rounded-lg p-6 sm:p-8 text-white mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-black mb-6 sm:mb-8">
                {type === "trek" ? "Trek" : "Tour"} Summary
              </h2>

              {/* Trek/Tour Name */}
              <div className="mb-6 sm:mb-8">
                <p className="text-xs sm:text-sm opacity-90 mb-2">
                  {type === "trek" ? "Trek" : "Tour"} Name
                </p>
                <p className="text-lg sm:text-xl font-bold">{itemData.name}</p>
              </div>

              {/* Details */}
              <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-10">
                {/* Location */}
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5 opacity-90" />
                  <div>
                    <p className="text-xs opacity-75 mb-0.5">Location</p>
                    <p className="font-semibold">{itemData.location}</p>
                  </div>
                </div>

                {/* Duration */}
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 flex-shrink-0 mt-0.5 opacity-90" />
                  <div>
                    <p className="text-xs opacity-75 mb-0.5">Duration</p>
                    <p className="font-semibold">{itemData.duration}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 flex-shrink-0 mt-0.5 opacity-90" />
                  <div>
                    <p className="text-xs opacity-75 mb-0.5">Price per person</p>
                    <p className="text-2xl font-black">${itemData.price}</p>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-white/20 pt-6 sm:pt-8">
                <p className="text-xs sm:text-sm opacity-75 mb-2">
                  Total Amount
                </p>
                <p className="text-3xl sm:text-4xl font-black">
                  ${itemData.price}
                </p>
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-blue-accent/10 border border-blue-accent/20 rounded-lg p-4 sm:p-6">
              <p className="text-sm sm:text-base text-text-dark leading-relaxed">
                <span className="font-bold block mb-2">What happens next?</span>
                You will be redirected to our secure payment gateway to complete
                your payment. Once payment is confirmed, you'll receive a
                confirmation email with detailed itinerary and guidelines.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="mt-12 sm:mt-16 lg:mt-20 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
          <button
            onClick={() => navigate("/")}
            className="px-6 sm:px-8 py-3 sm:py-4 border border-blue-accent text-blue-accent font-bold rounded-lg hover:bg-blue-accent/10 transition-colors text-base sm:text-lg touch-target-min"
          >
            Back to Home
          </button>
          <button
            onClick={() => navigate("/tour")}
            className="px-6 sm:px-8 py-3 sm:py-4 bg-blue-accent hover:bg-blue-accent-dark text-white font-bold rounded-lg transition-colors text-base sm:text-lg touch-target-min"
          >
            Explore More {type === "trek" ? "Treks" : "Tours"}
          </button>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
