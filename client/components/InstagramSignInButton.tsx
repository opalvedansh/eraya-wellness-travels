import { Loader2 } from "lucide-react";

interface InstagramSignInButtonProps {
    onClick: () => void;
    isLoading?: boolean;
    disabled?: boolean;
}

export default function InstagramSignInButton({
    onClick,
    isLoading = false,
    disabled = false,
}: InstagramSignInButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled || isLoading}
            className="w-full bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-text-dark font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-3 border border-border shadow-sm"
        >
            {isLoading ? (
                <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Connecting...
                </>
            ) : (
                <>
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs>
                            <linearGradient id="instagram-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                                <stop offset="0%" style={{ stopColor: "#FD5949", stopOpacity: 1 }} />
                                <stop offset="50%" style={{ stopColor: "#D6249F", stopOpacity: 1 }} />
                                <stop offset="100%" style={{ stopColor: "#285AEB", stopOpacity: 1 }} />
                            </linearGradient>
                        </defs>
                        <path
                            d="M10 1.802c2.67 0 2.987.01 4.041.059 2.71.123 3.975 1.409 4.099 4.099.048 1.054.057 1.37.057 4.04 0 2.672-.01 2.988-.057 4.042-.124 2.687-1.387 3.975-4.1 4.099-1.054.048-1.37.058-4.041.058-2.67 0-2.987-.01-4.04-.058-2.717-.124-3.977-1.416-4.1-4.1-.048-1.054-.058-1.37-.058-4.041 0-2.67.01-2.986.058-4.04.124-2.69 1.387-3.977 4.1-4.1 1.054-.048 1.37-.058 4.04-.058zM10 0C7.284 0 6.944.012 5.877.06 2.246.227.228 2.242.06 5.877.012 6.944 0 7.284 0 10s.012 3.057.06 4.123c.167 3.632 2.182 5.65 5.817 5.817C6.944 19.988 7.284 20 10 20s3.057-.012 4.123-.06c3.629-.167 5.652-2.182 5.816-5.817.05-1.066.061-1.407.061-4.123s-.012-3.056-.06-4.123C19.773 2.245 17.755.228 14.123.06 13.057.012 12.716 0 10 0zm0 4.865a5.135 5.135 0 100 10.27 5.135 5.135 0 000-10.27zm0 8.468a3.333 3.333 0 110-6.666 3.333 3.333 0 010 6.666zm5.338-8.67a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0z"
                            fill="url(#instagram-gradient)"
                        />
                    </svg>
                    Continue with Instagram
                </>
            )}
        </button>
    );
}
