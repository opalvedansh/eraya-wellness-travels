import { MessageCircle } from "lucide-react";
import { getWhatsAppLink } from "@/config/siteConfig";

export default function FloatingWhatsAppButton() {
  const message =
    "Hello! I'm interested in planning a trip to Nepal. Can you help?";
  const whatsappUrl = getWhatsAppLink(message);

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 sm:bottom-24 md:bottom-6 lg:bottom-6 right-2 sm:right-3 md:right-6 lg:right-6 z-40 group touch-target-min"
      title="Chat with a Nepal Trip Expert 🇳🇵"
    >
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 bg-green-primary rounded-full animate-pulse opacity-20 group-hover:opacity-30 transition-opacity"></div>
        <button className="relative bg-green-primary hover:bg-green-primary/90 text-white p-2.5 sm:p-3 md:p-3 lg:p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center">
          <MessageCircle className="h-5 w-5 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-6 lg:w-6" />
        </button>
      </div>
      <div className="absolute bottom-full right-0 mb-2 sm:mb-2 md:mb-3 lg:mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="bg-text-dark text-white text-xs font-semibold px-2.5 sm:px-3 md:px-3 lg:px-3 py-1.5 sm:py-2 md:py-2 lg:py-2 rounded-lg whitespace-nowrap shadow-lg">
          Chat with a Nepal Trip Expert 🇳🇵
          <div className="absolute bottom-0 right-3 translate-y-full">
            <div className="border-4 border-transparent border-t-text-dark"></div>
          </div>
        </div>
      </div>
    </a>
  );
}
