import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface ContactMethodCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    email?: string;
    phone?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export default function ContactMethodCard({
    icon: Icon,
    title,
    description,
    email,
    phone,
    action,
}: ContactMethodCardProps) {
    return (
        <div className="bg-white rounded-xl p-6 shadow-premium-sm hover:shadow-premium transition-all duration-300 border border-border flex flex-col h-full">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-primary/10 rounded-lg mb-4">
                <Icon className="h-6 w-6 text-green-primary" />
            </div>

            <h3 className="text-xl font-black text-text-dark mb-2">{title}</h3>
            <p className="text-text-dark/70 mb-4 flex-grow">{description}</p>

            <div className="space-y-2">
                {email && (
                    <a
                        href={`mailto:${email}`}
                        className="block text-sm text-blue-accent hover:text-blue-accent-dark font-semibold transition-colors"
                    >
                        📧 {email}
                    </a>
                )}
                {phone && (
                    <a
                        href={`tel:${phone}`}
                        className="block text-sm text-blue-accent hover:text-blue-accent-dark font-semibold transition-colors"
                    >
                        📞 {phone}
                    </a>
                )}
                {action && (
                    <button
                        onClick={action.onClick}
                        className="mt-3 w-full px-4 py-2 bg-green-primary text-white font-semibold rounded-lg hover:bg-green-primary/90 transition-colors"
                    >
                        {action.label}
                    </button>
                )}
            </div>
        </div>
    );
}
