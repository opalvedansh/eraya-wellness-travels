import { useState } from "react";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, Send, CheckCircle2, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { siteConfig, getMailtoLink, getTelLink } from "@/config/siteConfig";
import StarRating from "@/components/StarRating";
import { API_BASE_URL } from "@/lib/config";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
        toast({
          title: "Message sent successfully!",
          description: "We'll get back to you within 24 hours.",
        });
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          "Failed to send message. Please try again or email us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      content: siteConfig.contact.email,
      link: getMailtoLink(),
    },
    {
      icon: Phone,
      title: "Call Us",
      content: siteConfig.contact.phone.formatted,
      link: getTelLink(),
    },
    {
      icon: Instagram,
      title: "Follow Us",
      content: "@eraya_wellness_travels",
      link: "https://www.instagram.com/eraya_wellness_travels/",
      target: "_blank",
    },
  ];

  return (
    <div className="min-h-screen bg-beige flex flex-col">
      <PageHero
        title="Get In Touch"
        subtitle="We're here to help you plan your perfect adventure. Reach out and let's start your journey together."
        backgroundImage="/images/hero(2).jpeg"
      />

      <div className="flex-grow">
        <section className="py-8 sm:py-12 lg:py-24 px-3 sm:px-6 lg:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
            {/* Contact Information */}
            <div className="md:col-span-1">
              <h2 className="text-xl sm:text-2xl font-black text-green-primary mb-6 sm:mb-8">
                Contact Information
              </h2>
              <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <a
                      key={index}
                      href={info.link}
                      target={info.target || "_self"}
                      rel={info.target === "_blank" ? "noopener noreferrer" : undefined}
                      className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-card rounded-lg border border-border hover:shadow-md transition-shadow group touch-target-min"
                    >
                      <div className="flex-shrink-0 p-2 bg-green-primary/10 rounded-lg group-hover:bg-green-primary/20 transition-colors">
                        <Icon className="h-5 sm:h-6 w-5 sm:w-6 text-green-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-text-dark mb-1 text-sm sm:text-base">
                          {info.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-text-dark/70">
                          {info.content}
                        </p>
                      </div>
                    </a>
                  );
                })}
              </div>

              <div className="bg-beige-light p-4 sm:p-6 rounded-lg border border-beige-dark">
                <h3 className="font-bold text-text-dark mb-2 sm:mb-3 text-sm sm:text-base">Office Hours</h3>
                <div className="space-y-1.5 text-xs sm:text-sm text-text-dark/70">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 10:00 AM - 4:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
                <p className="text-xs text-text-dark/60 mt-3 sm:mt-4">
                  * All times are in EST. We respond to emails within 24 hours.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="md:col-span-2">
              <h2 className="text-xl sm:text-2xl font-black text-green-primary mb-6 sm:mb-8">
                Send Us a Message
              </h2>
              {isSubmitted ? (
                <div className="bg-card p-6 sm:p-8 lg:p-12 rounded-lg border border-border text-center">
                  <CheckCircle2 className="h-10 sm:h-12 lg:h-16 w-10 sm:w-12 lg:w-16 text-green-primary mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-text-dark mb-2">
                    Thank You!
                  </h3>
                  <p className="text-xs sm:text-sm lg:text-base text-text-dark/70 mb-4 sm:mb-6">
                    Your message has been sent successfully. We'll get back to
                    you within 24 hours.
                  </p>
                  <Button
                    onClick={() => setIsSubmitted(false)}
                    className="bg-green-primary hover:bg-green-primary/90 text-sm sm:text-base"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="bg-card p-4 sm:p-6 lg:p-8 rounded-lg border border-border space-y-4 sm:space-y-5 lg:space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-xs sm:text-sm font-semibold text-text-dark mb-1.5 sm:mb-2"
                      >
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-beige-dark focus:outline-none focus:ring-2 focus:ring-green-primary text-text-dark text-sm touch-target-min"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-xs sm:text-sm font-semibold text-text-dark mb-1.5 sm:mb-2"
                      >
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-beige-dark focus:outline-none focus:ring-2 focus:ring-green-primary text-text-dark text-sm touch-target-min"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-xs sm:text-sm font-semibold text-text-dark mb-1.5 sm:mb-2"
                      >
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-beige-dark focus:outline-none focus:ring-2 focus:ring-green-primary text-text-dark text-sm touch-target-min"
                        placeholder={siteConfig.contact.phone.formatted}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-xs sm:text-sm font-semibold text-text-dark mb-1.5 sm:mb-2"
                      >
                        Subject *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-beige-dark focus:outline-none focus:ring-2 focus:ring-green-primary text-text-dark text-sm"
                      >
                        <option value="">Select a subject</option>
                        <option value="booking">Booking Inquiry</option>
                        <option value="tour">Tour Information</option>
                        <option value="trek">Trek Information</option>
                        <option value="spiritual">Spiritual Travel</option>
                        <option value="custom">Custom Itinerary</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-xs sm:text-sm font-semibold text-text-dark mb-1.5 sm:mb-2"
                    >
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-beige-dark focus:outline-none focus:ring-2 focus:ring-green-primary text-text-dark resize-none text-sm"
                      placeholder="Tell us about your travel plans, questions, or how we can help..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-green-primary hover:bg-green-primary/90 text-white font-bold py-2.5 sm:py-3 lg:py-4 text-sm sm:text-base touch-target-min"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            className="opacity-25"
                          />
                          <path
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            fill="currentColor"
                            className="opacity-75"
                          />
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="h-5 w-5" />
                        Send Message
                      </span>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* Review Submission Section */}
        <section className="py-12 lg:py-16 px-3 sm:px-6 lg:px-12 max-w-4xl mx-auto bg-gradient-to-br from-green-primary/5 to-blue-accent/5">
          <div className="text-center mb-8">
            <h2 className="text-3xl lg:text-4xl font-black text-green-primary mb-4">
              Share Your Experience
            </h2>
            <p className="text-text-dark/70 max-w-2xl mx-auto">
              Traveled with us? We'd love to hear about your journey! Your review helps others discover the transformative power of wellness travel.
            </p>
          </div>

          <ReviewSubmissionForm />
        </section>

        {/* Transformation Story Section */}
        <section className="py-12 lg:py-16 px-3 sm:px-6 lg:px-12 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl lg:text-4xl font-black text-green-primary mb-4">
              Share Your Transformation Story
            </h2>
            <p className="text-text-dark/70 max-w-2xl mx-auto">
              Has your journey with Eraya transformed your life? Share your story and inspire others to embark on their own path to wellness.
            </p>
          </div>

          <TransformationSubmissionForm />
        </section>
      </div>

      <Footer />
    </div>
  );
}

// Review Submission Form Component
function ReviewSubmissionForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: 0,
    review: "",
    location: "",
    displayOnHomepage: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a star rating",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/contact/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({
          name: "",
          email: "",
          rating: 0,
          review: "",
          location: "",
          displayOnHomepage: true,
        });
        toast({
          title: "Review submitted!",
          description: data.message,
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-premium text-center">
        <CheckCircle2 className="h-16 w-16 text-green-primary mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-text-dark mb-2">Thank You!</h3>
        <p className="text-text-dark/70 mb-6">
          Your review has been submitted and will appear on our website shortly.
        </p>
        <Button
          onClick={() => setIsSubmitted(false)}
          className="bg-green-primary hover:bg-green-primary/90"
        >
          Submit Another Review
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 lg:p-8 rounded-xl shadow-premium space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-text-dark mb-2">
            Your Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-green-primary"
            placeholder="John Doe"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-text-dark mb-2">
            Email Address *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-green-primary"
            placeholder="john@example.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-text-dark mb-2">
            Your Rating *
          </label>
          <StarRating
            rating={formData.rating}
            onRatingChange={(rating) => setFormData({ ...formData, rating })}
            size="lg"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-text-dark mb-2">
            Location *
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required
            className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-green-primary"
            placeholder="New York, USA"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-text-dark mb-2">
          Your Review * (minimum 20 characters)
        </label>
        <textarea
          value={formData.review}
          onChange={(e) => setFormData({ ...formData, review: e.target.value })}
          required
          minLength={20}
          rows={5}
          className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-green-primary resize-none"
          placeholder="Tell us about your experience..."
        />
        <p className="text-xs text-text-dark/60 mt-1">{formData.review.length} / 1000 characters</p>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="displayReview"
          checked={formData.displayOnHomepage}
          onChange={(e) => setFormData({ ...formData, displayOnHomepage: e.target.checked })}
          className="h-4 w-4 text-green-primary focus:ring-green-primary border-border rounded"
        />
        <label htmlFor="displayReview" className="text-sm text-text-dark">
          Display my review on the homepage
        </label>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-green-primary hover:bg-green-primary/90 py-4 text-lg font-bold"
      >
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
}

// Transformation Story Submission Form Component
function TransformationSubmissionForm() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    storyTitle: "",
    story: "",
    location: "",
    sharePublicly: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/contact/transformation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({
          name: "",
          age: "",
          storyTitle: "",
          story: "",
          location: "",
          sharePublicly: true,
        });
        toast({
          title: "Story submitted!",
          description: data.message,
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit story. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-premium text-center">
        <CheckCircle2 className="h-16 w-16 text-green-primary mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-text-dark mb-2">Thank You for Sharing!</h3>
        <p className="text-text-dark/70 mb-6">
          Your transformation story has been submitted and will appear on our About page shortly.
        </p>
        <Button
          onClick={() => setIsSubmitted(false)}
          className="bg-green-primary hover:bg-green-primary/90"
        >
          Share Another Story
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 lg:p-8 rounded-xl shadow-premium space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-text-dark mb-2">
            Your Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-green-primary"
            placeholder="Jane Smith"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-text-dark mb-2">
            Age *
          </label>
          <input
            type="number"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            required
            min="1"
            max="120"
            className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-green-primary"
            placeholder="35"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-text-dark mb-2">
            Story Title *
          </label>
          <input
            type="text"
            value={formData.storyTitle}
            onChange={(e) => setFormData({ ...formData, storyTitle: e.target.value })}
            required
            maxLength={100}
            className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-green-primary"
            placeholder="Finding Peace in the Himalayas"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-text-dark mb-2">
            Location *
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required
            className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-green-primary"
            placeholder="Los Angeles, CA"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-text-dark mb-2">
          Your Transformation Story * (minimum 50 characters)
        </label>
        <textarea
          value={formData.story}
          onChange={(e) => setFormData({ ...formData, story: e.target.value })}
          required
          minLength={50}
          rows={8}
          className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-green-primary resize-none"
          placeholder="Share your transformation journey... How did your wellness travel experience change your life?"
        />
        <p className="text-xs text-text-dark/60 mt-1">{formData.story.length} / 3000 characters</p>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="shareStory"
          checked={formData.sharePublicly}
          onChange={(e) => setFormData({ ...formData, sharePublicly: e.target.checked })}
          className="h-4 w-4 text-green-primary focus:ring-green-primary border-border rounded"
        />
        <label htmlFor="shareStory" className="text-sm text-text-dark">
          Share my story publicly on the About page
        </label>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-green-primary hover:bg-green-primary/90 py-4 text-lg font-bold"
      >
        {isSubmitting ? "Submitting..." : "Share Your Story"}
      </Button>
    </form>
  );
}

