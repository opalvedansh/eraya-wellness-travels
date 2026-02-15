"use client";

import { MessageCircle } from "lucide-react";

export default function FloatingWhatsAppButton() {
    return (
        <a
            href="https://wa.me/9779765548080"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#128C7E] text-white p-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 touch-target-min"
            aria-label="Chat on WhatsApp"
        >
            <MessageCircle className="w-6 h-6" />
        </a>
    );
}
