import { Loader2 } from "lucide-react";

interface FacebookSignInButtonProps {
    onClick: () => void;
    isLoading?: boolean;
    disabled?: boolean;
}

export default function FacebookSignInButton({
    onClick,
    isLoading = false,
    disabled = false,
}: FacebookSignInButtonProps) {
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
                        <path
                            d="M20 10C20 4.477 15.523 0 10 0S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
                            fill="#1877F2"
                        />
                    </svg>
                    Continue with Facebook
                </>
            )}
        </button>
    );
}
