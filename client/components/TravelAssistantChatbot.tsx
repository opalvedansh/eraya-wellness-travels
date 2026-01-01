import { useState, useEffect, useRef } from "react";
import { Compass, X, Mountain, Map, Navigation, Phone, Send, Mail } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { getWhatsAppLink } from "@/config/siteConfig";

interface Message {
    role: "user" | "assistant";
    content: string;
    timestamp: number;
}

export default function TravelAssistantChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [showAttention, setShowAttention] = useState(false);
    const [hasShownInitialMessage, setHasShownInitialMessage] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showExpertOptions, setShowExpertOptions] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Check if we're on the home page
    const isHomePage = location.pathname === "/";

    // Session-based initial message trigger
    useEffect(() => {
        const chatbotViewed = sessionStorage.getItem("chatbot_viewed");
        if (!chatbotViewed) {
            setHasShownInitialMessage(true);
        }
    }, []);

    // Attention animation after 5 seconds (home page only)
    useEffect(() => {
        if (!isHomePage || isOpen) return;

        const timer = setTimeout(() => {
            setShowAttention(true);
            // Stop attention animation after 3 iterations (3 * 0.6s = 1.8s)
            setTimeout(() => setShowAttention(false), 1800);
        }, 5000);

        return () => clearTimeout(timer);
    }, [isHomePage, isOpen]);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    const handleOpen = () => {
        setIsOpen(true);
        setShowAttention(false);
        // Mark as viewed in session
        sessionStorage.setItem("chatbot_viewed", "true");

        // Add welcome message if first time opening
        if (messages.length === 0) {
            setMessages([{
                role: "assistant",
                content: "Hi! Planning a trip to Nepal? I can help you explore treks, tours, or create a custom journey 😊",
                timestamp: Date.now(),
            }]);
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        setShowExpertOptions(false);
    };

    const sendMessage = async (content: string) => {
        if (!content.trim() || isLoading) return;

        const userMessage: Message = {
            role: "user",
            content: content.trim(),
            timestamp: Date.now(),
        };

        // Add user message to chat
        setMessages((prev) => [...prev, userMessage]);
        setInputText("");
        setError(null);
        setIsLoading(true);
        setShowExpertOptions(false);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: content.trim() }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to get response from AI");
            }

            // Add AI response to chat
            const aiMessage: Message = {
                role: "assistant",
                content: data.reply, // Backend returns "reply" not "message"
                timestamp: Date.now(),
            };
            setMessages((prev) => [...prev, aiMessage]);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");

            // Add error message to chat
            const errorMessage: Message = {
                role: "assistant",
                content: "I'm sorry, I'm having trouble connecting right now. Please try again or contact us directly via WhatsApp or email.",
                timestamp: Date.now(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendClick = () => {
        sendMessage(inputText);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage(inputText);
        }
    };

    const handleQuickReply = (action: string) => {
        switch (action) {
            case "treks":
                sendMessage("Show me popular trekking options in Nepal");
                break;
            case "tours":
                sendMessage("What are the best tour destinations in Nepal?");
                break;
            case "custom":
                sendMessage("Help me plan a custom trip to Nepal");
                break;
            case "expert":
                setShowExpertOptions(true);
                break;
        }
    };

    return (
        <>
            {/* Floating Chatbot Button */}
            <button
                onClick={handleOpen}
                className={`
          fixed bottom-6 right-20 z-35
          flex items-center justify-center
          w-14 h-14 
          bg-gradient-to-br from-blue-accent to-green-primary
          text-white rounded-full
          shadow-premium hover:shadow-premium-lg
          transition-all duration-300
          hover:scale-105
          group
          touch-target-min
          ${showAttention ? "animate-bot-attention" : ""}
        `}
                aria-label="Open Travel Assistant"
            >
                {/* Glow pulse ring */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-accent to-green-primary rounded-full animate-pulse opacity-20 group-hover:opacity-30 transition-opacity"></div>

                <Compass className="h-6 w-6 relative z-10" />
            </button>

            {/* Chat Window */}
            {isOpen && (
                <>
                    {/* Backdrop for mobile */}
                    <div
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
                        onClick={handleClose}
                    />

                    {/* Chat Container - Desktop: Fixed window, Mobile: Bottom sheet */}
                    <div
                        className={`
              fixed z-50
              md:bottom-24 md:right-6 md:w-96 md:h-[600px] md:rounded-2xl
              bottom-0 left-0 right-0 h-[80vh] rounded-t-3xl md:rounded-t-2xl
              backdrop-blur-xl bg-white/90 md:bg-white/80
              shadow-premium-lg
              flex flex-col
              animate-slide-up md:animate-fade-in
            `}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-beige-dark/30">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-accent to-green-primary flex items-center justify-center">
                                        <Compass className="h-5 w-5 text-white" />
                                    </div>
                                    {/* Online pulse indicator */}
                                    <div className="absolute -bottom-0.5 -right-0.5">
                                        <div className="relative">
                                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-text-dark text-sm">
                                        Your Nepal Travel Assistant
                                    </h3>
                                    <p className="text-xs text-text-dark/60">
                                        Treks • Tours • Custom Trips
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-2 hover:bg-beige-dark/30 rounded-full transition-colors touch-target-min"
                                aria-label="Close chat"
                            >
                                <X className="h-5 w-5 text-text-dark/60" />
                            </button>
                        </div>

                        {/* Chat Messages - Scrollable */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex gap-3 animate-fade-in-up ${message.role === "user" ? "flex-row-reverse" : ""
                                        }`}
                                >
                                    {message.role === "assistant" && (
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-accent to-green-primary flex items-center justify-center flex-shrink-0">
                                            <Compass className="h-4 w-4 text-white" />
                                        </div>
                                    )}
                                    <div className="flex-1 max-w-[80%]">
                                        <div
                                            className={`rounded-2xl px-4 py-3 ${message.role === "user"
                                                ? "bg-green-primary text-white rounded-tr-sm ml-auto"
                                                : "bg-beige-dark/30 text-text-dark rounded-tl-sm"
                                                }`}
                                        >
                                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Typing Indicator */}
                            {isLoading && (
                                <div className="flex gap-3 animate-fade-in-up">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-accent to-green-primary flex items-center justify-center flex-shrink-0">
                                        <Compass className="h-4 w-4 text-white" />
                                    </div>
                                    <div className="bg-beige-dark/30 rounded-2xl rounded-tl-sm px-4 py-3">
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 bg-text-dark/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                                            <div className="w-2 h-2 bg-text-dark/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                                            <div className="w-2 h-2 bg-text-dark/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Expert Contact Options (shown when "Talk to Expert" is clicked) */}
                            {showExpertOptions && (
                                <div className="flex gap-3 animate-fade-in-up">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-accent to-green-primary flex items-center justify-center flex-shrink-0">
                                        <Compass className="h-4 w-4 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="bg-beige-dark/30 rounded-2xl rounded-tl-sm px-4 py-3">
                                            <p className="text-sm text-text-dark mb-3">
                                                I'd be happy to connect you with our travel experts! Choose your preferred contact method:
                                            </p>
                                        </div>
                                        <div className="flex gap-2 mt-3">
                                            <a
                                                href={getWhatsAppLink("Hi! I'd like to speak with a Nepal travel expert.")}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 px-4 py-2 bg-green-primary/10 hover:bg-green-primary hover:text-white text-green-primary rounded-full text-xs font-medium transition-colors"
                                            >
                                                <Phone className="h-3 w-3" />
                                                WhatsApp
                                            </a>
                                            <a
                                                href="mailto:info@erayawellnesstravels.com?subject=Nepal Trip Inquiry"
                                                className="flex items-center gap-2 px-4 py-2 bg-blue-accent/10 hover:bg-blue-accent hover:text-white text-blue-accent rounded-full text-xs font-medium transition-colors"
                                            >
                                                <Mail className="h-3 w-3" />
                                                Email Us
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Action Buttons */}
                        {messages.length <= 1 && (
                            <div className="px-4 pb-3 border-t border-beige-dark/30 pt-3">
                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={() => handleQuickReply("treks")}
                                        disabled={isLoading}
                                        className="flex items-center gap-2 bg-beige-dark/50 hover:bg-green-primary hover:text-white rounded-full px-6 py-2.5 text-sm font-medium text-text-dark transition-all duration-200 hover:scale-[1.02] touch-target-min justify-center md:justify-start disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Mountain className="h-4 w-4" />
                                        <span>🏔️ Explore Treks</span>
                                    </button>

                                    <button
                                        onClick={() => handleQuickReply("tours")}
                                        disabled={isLoading}
                                        className="flex items-center gap-2 bg-beige-dark/50 hover:bg-green-primary hover:text-white rounded-full px-6 py-2.5 text-sm font-medium text-text-dark transition-all duration-200 hover:scale-[1.02] touch-target-min justify-center md:justify-start disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Map className="h-4 w-4" />
                                        <span>🗺️ Explore Tours</span>
                                    </button>

                                    <button
                                        onClick={() => handleQuickReply("custom")}
                                        disabled={isLoading}
                                        className="flex items-center gap-2 bg-beige-dark/50 hover:bg-green-primary hover:text-white rounded-full px-6 py-2.5 text-sm font-medium text-text-dark transition-all duration-200 hover:scale-[1.02] touch-target-min justify-center md:justify-start disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Navigation className="h-4 w-4" />
                                        <span>🧭 Custom Trip</span>
                                    </button>

                                    <button
                                        onClick={() => handleQuickReply("expert")}
                                        disabled={isLoading}
                                        className="flex items-center gap-2 bg-beige-dark/50 hover:bg-green-primary hover:text-white rounded-full px-6 py-2.5 text-sm font-medium text-text-dark transition-all duration-200 hover:scale-[1.02] touch-target-min justify-center md:justify-start disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Phone className="h-4 w-4" />
                                        <span>📞 Talk to an Expert</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Sticky Input Bar */}
                        <div className="p-4 border-t border-beige-dark/30 bg-white/95 backdrop-blur-sm">
                            <div className="flex gap-2 items-center">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Ask me about treks, tours, or travel tips…"
                                    disabled={isLoading}
                                    className="flex-1 px-4 py-2.5 bg-beige-dark/30 border border-beige-dark/50 rounded-full text-sm text-text-dark placeholder:text-text-dark/50 focus:outline-none focus:ring-2 focus:ring-green-primary/30 focus:border-green-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                                <button
                                    onClick={handleSendClick}
                                    disabled={!inputText.trim() || isLoading}
                                    className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-accent to-green-primary text-white flex items-center justify-center shadow-premium hover:shadow-premium-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                    aria-label="Send message"
                                >
                                    <Send className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
