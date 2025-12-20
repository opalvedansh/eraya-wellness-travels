import { Phone, MessageCircle } from "lucide-react";
import { useState } from "react";
import { siteConfig, getWhatsAppLink, getTelLink } from "@/config/siteConfig";

interface MobileStickyBottomCTAProps {
  primaryText?: string;
  secondaryText?: string;
  hideOnDesktop?: boolean;
}

export default function MobileStickyBottomCTA({
  primaryText = "Customize Trip",
  secondaryText = "Chat on WhatsApp",
  hideOnDesktop = true,
}: MobileStickyBottomCTAProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const handleWhatsApp = () => {
    const message =
      "Hello! I'm interested in planning a trip to Nepal. Can you help?";
    const whatsappUrl = getWhatsAppLink(message);
    window.open(whatsappUrl, "_blank");
  };

  const handleCall = () => {
    window.location.href = getTelLink();
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-lg z-30 p-2 sm:p-3 ${
        hideOnDesktop ? "md:hidden" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto flex gap-2 sm:gap-3">
        <button
          onClick={() => (window.location.hash = "#customize")}
          className="flex-1 bg-green-primary hover:bg-green-primary/90 text-white font-bold py-2.5 sm:py-3 px-2 sm:px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm touch-target-min"
        >
          Plan This Trip
        </button>
        <button
          onClick={handleWhatsApp}
          className="flex-1 bg-blue-accent hover:bg-blue-accent-dark text-white font-bold py-2.5 sm:py-3 px-2 sm:px-4 rounded-lg transition-colors flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm touch-target-min"
        >
          <MessageCircle className="h-4 w-4 flex-shrink-0" />
          <span className="hidden sm:inline">WhatsApp</span>
          <span className="sm:hidden">Chat</span>
        </button>
      </div>
    </div>
  );
}
