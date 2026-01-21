import { useRef } from "react";
import { Bold } from "lucide-react";

interface RichTextAreaProps {
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    rows?: number;
    placeholder?: string;
    className?: string;
}

/**
 * A textarea with a toolbar for formatting text.
 * Currently supports Bold formatting using markdown syntax (**text**).
 */
export default function RichTextArea({
    name,
    value,
    onChange,
    rows = 6,
    placeholder,
    className = "",
}: RichTextAreaProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleBold = () => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = value.substring(start, end);

        if (selectedText) {
            // Check if already bold (wrapped in **)
            const beforeSelection = value.substring(Math.max(0, start - 2), start);
            const afterSelection = value.substring(end, Math.min(value.length, end + 2));

            let newValue: string;
            let newCursorPos: number;

            if (beforeSelection === "**" && afterSelection === "**") {
                // Remove bold - remove the ** markers
                newValue =
                    value.substring(0, start - 2) +
                    selectedText +
                    value.substring(end + 2);
                newCursorPos = start - 2 + selectedText.length;
            } else {
                // Add bold - wrap selection in **
                newValue =
                    value.substring(0, start) +
                    "**" +
                    selectedText +
                    "**" +
                    value.substring(end);
                newCursorPos = start + 2 + selectedText.length + 2;
            }

            // Trigger onChange with synthetic event
            const syntheticEvent = {
                target: {
                    name,
                    value: newValue,
                    type: "textarea",
                },
            } as React.ChangeEvent<HTMLTextAreaElement>;

            onChange(syntheticEvent);

            // Restore cursor position after state update
            setTimeout(() => {
                if (textarea) {
                    textarea.focus();
                    textarea.setSelectionRange(newCursorPos, newCursorPos);
                }
            }, 0);
        } else {
            // No selection - insert ** placeholder
            const placeholder = "****";
            const newValue =
                value.substring(0, start) + placeholder + value.substring(end);

            const syntheticEvent = {
                target: {
                    name,
                    value: newValue,
                    type: "textarea",
                },
            } as React.ChangeEvent<HTMLTextAreaElement>;

            onChange(syntheticEvent);

            // Position cursor between the ** markers
            setTimeout(() => {
                if (textarea) {
                    textarea.focus();
                    textarea.setSelectionRange(start + 2, start + 2);
                }
            }, 0);
        }
    };

    return (
        <div className="space-y-1">
            {/* Toolbar */}
            <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-t-lg border border-b-0 border-gray-300">
                <button
                    type="button"
                    onClick={handleBold}
                    className="p-1.5 hover:bg-gray-200 rounded transition-colors group relative"
                    title="Bold (select text first)"
                >
                    <Bold className="w-4 h-4 text-gray-700" />
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        Bold
                    </span>
                </button>
                <span className="text-xs text-gray-500 ml-2">
                    Select text and click Bold, or use **text**
                </span>
            </div>

            {/* Textarea */}
            <textarea
                ref={textareaRef}
                name={name}
                value={value}
                onChange={onChange}
                rows={rows}
                placeholder={placeholder}
                className={`w-full px-4 py-2 border border-gray-300 rounded-b-lg rounded-t-none focus:ring-2 focus:ring-green-primary focus:border-transparent ${className}`}
            />
        </div>
    );
}
