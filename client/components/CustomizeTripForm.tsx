import { useState } from "react";
import { Loader2 } from "lucide-react";
import { API_BASE_URL } from "@/lib/config";

interface CustomizeTripFormData {
  name: string;
  email: string;
  phone: string;
  startDate: string;
  endDate: string;
  groupSize: string;
  budget: string;
  interests: string[];
  additionalNotes: string;
}

interface CustomizeTripFormProps {
  tripName?: string;
  onSubmit?: (data: CustomizeTripFormData) => void;
}

export default function CustomizeTripForm({
  tripName,
  onSubmit,
}: CustomizeTripFormProps) {
  const [formData, setFormData] = useState<CustomizeTripFormData>({
    name: "",
    email: "",
    phone: "",
    startDate: "",
    endDate: "",
    groupSize: "",
    budget: "",
    interests: [],
    additionalNotes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const interestOptions = [
    "Trekking",
    "Meditation & Yoga",
    "Cultural Sites",
    "Wildlife & Nature",
    "Photography",
    "Food & Culinary",
    "Adventure Sports",
    "Wellness & Spa",
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleInterestChange = (interest: string) => {
    setFormData({
      ...formData,
      interests: formData.interests.includes(interest)
        ? formData.interests.filter((i) => i !== interest)
        : [...formData.interests, interest],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (onSubmit) {
        onSubmit(formData);
      } else {
        const response = await fetch(`${API_BASE_URL}/api/customize-trip`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            tripName,
          }),
        });

        if (!response.ok) throw new Error("Failed to submit");
      }

      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          startDate: "",
          endDate: "",
          groupSize: "",
          budget: "",
          interests: [],
          additionalNotes: "",
        });
      }, 3000);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-card rounded-lg border border-border p-8 text-center">
        <div className="w-12 h-12 bg-green-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="w-6 h-6 border-2 border-green-primary border-r-transparent rounded-full animate-spin"></div>
        </div>
        <h3 className="text-xl font-bold text-text-dark mb-2">Thank You!</h3>
        <p className="text-text-dark/70">
          We've received your customization request. Our trip expert will
          contact you shortly to finalize your itinerary.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border p-4 sm:p-8 shadow-md">
      <h2 className="text-xl sm:text-2xl font-black text-green-primary mb-4 sm:mb-6">
        Customize Your Trip
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Personal Information */}
        <div>
          <h3 className="font-bold text-text-dark mb-3 sm:mb-4 text-sm sm:text-base">Your Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-border bg-background text-text-dark placeholder-text-dark/50 focus:outline-none focus:ring-2 focus:ring-green-primary text-sm touch-target-min"
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-border bg-background text-text-dark placeholder-text-dark/50 focus:outline-none focus:ring-2 focus:ring-green-primary text-sm touch-target-min"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-border bg-background text-text-dark placeholder-text-dark/50 focus:outline-none focus:ring-2 focus:ring-green-primary text-sm touch-target-min"
            />
          </div>
        </div>

        {/* Trip Details */}
        <div>
          <h3 className="font-bold text-text-dark mb-3 sm:mb-4 text-sm sm:text-base">Trip Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-text-dark mb-1.5 sm:mb-2">
                Preferred Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-border bg-background text-text-dark focus:outline-none focus:ring-2 focus:ring-green-primary text-sm touch-target-min"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-text-dark mb-1.5 sm:mb-2">
                Preferred End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-border bg-background text-text-dark focus:outline-none focus:ring-2 focus:ring-green-primary text-sm touch-target-min"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-text-dark mb-1.5 sm:mb-2">
                Group Size
              </label>
              <select
                name="groupSize"
                value={formData.groupSize}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-border bg-background text-text-dark focus:outline-none focus:ring-2 focus:ring-green-primary text-sm"
              >
                <option value="">Select group size</option>
                <option value="1">Solo</option>
                <option value="2">2 People</option>
                <option value="3-5">3-5 People</option>
                <option value="6-10">6-10 People</option>
                <option value="10+">10+ People</option>
              </select>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-text-dark mb-1.5 sm:mb-2">
                Budget Range
              </label>
              <select
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-border bg-background text-text-dark focus:outline-none focus:ring-2 focus:ring-green-primary text-sm"
              >
                <option value="">Select budget range</option>
                <option value="under-1000">Under $1,000</option>
                <option value="1000-2000">$1,000 - $2,000</option>
                <option value="2000-3000">$2,000 - $3,000</option>
                <option value="3000+">$3,000+</option>
              </select>
            </div>
          </div>
        </div>

        {/* Interests */}
        <div>
          <h3 className="font-bold text-text-dark mb-3 sm:mb-4 text-sm sm:text-base">Your Interests</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
            {interestOptions.map((interest) => (
              <label
                key={interest}
                className="flex items-center gap-2 cursor-pointer p-2 hover:bg-beige-light rounded-lg transition-colors"
              >
                <input
                  type="checkbox"
                  checked={formData.interests.includes(interest)}
                  onChange={() => handleInterestChange(interest)}
                  className="w-4 h-4 rounded border-border text-green-primary focus:ring-green-primary"
                />
                <span className="text-xs sm:text-sm text-text-dark/70">{interest}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Additional Notes */}
        <div>
          <label className="block text-xs sm:text-sm font-bold text-text-dark mb-1.5 sm:mb-2">
            Additional Notes
          </label>
          <textarea
            name="additionalNotes"
            placeholder="Tell us about any special requirements, dietary restrictions, or specific experiences you're looking for..."
            value={formData.additionalNotes}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-border bg-background text-text-dark placeholder-text-dark/50 focus:outline-none focus:ring-2 focus:ring-green-primary resize-none text-sm"
          />
        </div>

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-green-primary hover:bg-green-primary/90 disabled:opacity-75 text-white font-bold py-3 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base touch-target-min"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <span className="hidden sm:inline">Get Your Custom Itinerary</span>
                <span className="sm:hidden">Customize</span>
              </>
            )}
          </button>
          <button
            type="button"
            className="flex-1 bg-blue-accent hover:bg-blue-accent-dark text-white font-bold py-3 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors text-sm sm:text-base touch-target-min"
          >
            WhatsApp
          </button>
        </div>
      </form>
    </div>
  );
}
