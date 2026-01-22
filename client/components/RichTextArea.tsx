import { useRef, useState } from "react";
import { Bold, Italic, Heading1, Heading2, Heading3, Link as LinkIcon, Image, AlignLeft, AlignCenter, AlignRight, AlignJustify } from "lucide-react";

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
 * Supports markdown syntax: **bold**, *italic*, # headings, [link](url), ![alt](imageUrl)
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
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [linkUrl, setLinkUrl] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [imageAlt, setImageAlt] = useState("");

    const triggerChange = (newValue: string, cursorPos?: number) => {
        const syntheticEvent = {
            target: { name, value: newValue, type: "textarea" },
        } as React.ChangeEvent<HTMLTextAreaElement>;
        onChange(syntheticEvent);

        if (cursorPos !== undefined) {
            setTimeout(() => {
                if (textareaRef.current) {
                    textareaRef.current.focus();
                    textareaRef.current.setSelectionRange(cursorPos, cursorPos);
                }
            }, 0);
        }
    };

    const wrapSelection = (prefix: string, suffix: string, placeholderText = "") => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = value.substring(start, end) || placeholderText;

        const newValue = value.substring(0, start) + prefix + selectedText + suffix + value.substring(end);
        const cursorPos = start + prefix.length + selectedText.length + suffix.length;
        triggerChange(newValue, cursorPos);
    };

    const insertAtCursor = (text: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const newValue = value.substring(0, start) + text + value.substring(start);
        triggerChange(newValue, start + text.length);
    };

    const handleBold = () => wrapSelection("**", "**", "bold text");
    const handleItalic = () => wrapSelection("*", "*", "italic text");
    const handleH1 = () => insertAtCursor("\n# Heading 1\n");
    const handleH2 = () => insertAtCursor("\n## Heading 2\n");
    const handleH3 = () => insertAtCursor("\n### Heading 3\n");

    const handleLink = () => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        const selectedText = value.substring(textarea.selectionStart, textarea.selectionEnd);
        if (selectedText) {
            setShowLinkModal(true);
        } else {
            wrapSelection("[", "](https://)", "link text");
        }
    };

    const insertLink = () => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = value.substring(start, end);
        const newValue = value.substring(0, start) + `[${selectedText}](${linkUrl})` + value.substring(end);
        triggerChange(newValue);
        setShowLinkModal(false);
        setLinkUrl("");
    };

    const handleImage = () => setShowImageModal(true);

    const insertImage = () => {
        insertAtCursor(`![${imageAlt || "image"}](${imageUrl})`);
        setShowImageModal(false);
        setImageUrl("");
        setImageAlt("");
    };

    const handleAlign = (align: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = value.substring(start, end);
        if (selectedText) {
            const newValue = value.substring(0, start) + `<div style="text-align: ${align}">${selectedText}</div>` + value.substring(end);
            triggerChange(newValue);
        }
    };

    const ToolbarButton = ({ onClick, icon: Icon, title }: { onClick: () => void; icon: any; title: string }) => (
        <button
            type="button"
            onClick={onClick}
            className="p-1.5 hover:bg-gray-200 rounded transition-colors group relative"
            title={title}
        >
            <Icon className="w-4 h-4 text-gray-700" />
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                {title}
            </span>
        </button>
    );

    return (
        <div className="space-y-1">
            {/* Toolbar */}
            <div className="flex items-center gap-1 p-2 bg-gray-100 rounded-t-lg border border-b-0 border-gray-300 flex-wrap">
                <ToolbarButton onClick={handleBold} icon={Bold} title="Bold (**text**)" />
                <ToolbarButton onClick={handleItalic} icon={Italic} title="Italic (*text*)" />
                <div className="w-px h-5 bg-gray-300 mx-1" />
                <ToolbarButton onClick={handleH1} icon={Heading1} title="Heading 1 (#)" />
                <ToolbarButton onClick={handleH2} icon={Heading2} title="Heading 2 (##)" />
                <ToolbarButton onClick={handleH3} icon={Heading3} title="Heading 3 (###)" />
                <div className="w-px h-5 bg-gray-300 mx-1" />
                <ToolbarButton onClick={handleLink} icon={LinkIcon} title="Insert Link" />
                <ToolbarButton onClick={handleImage} icon={Image} title="Insert Image" />
                <div className="w-px h-5 bg-gray-300 mx-1" />
                <ToolbarButton onClick={() => handleAlign("left")} icon={AlignLeft} title="Align Left" />
                <ToolbarButton onClick={() => handleAlign("center")} icon={AlignCenter} title="Align Center" />
                <ToolbarButton onClick={() => handleAlign("right")} icon={AlignRight} title="Align Right" />
                <ToolbarButton onClick={() => handleAlign("justify")} icon={AlignJustify} title="Justify" />
            </div>

            {/* Link Modal */}
            {showLinkModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-lg shadow-xl w-80">
                        <h3 className="font-bold mb-3">Insert Link</h3>
                        <input
                            type="url"
                            placeholder="https://example.com"
                            value={linkUrl}
                            onChange={(e) => setLinkUrl(e.target.value)}
                            className="w-full border p-2 rounded mb-3"
                        />
                        <div className="flex gap-2 justify-end">
                            <button type="button" onClick={() => setShowLinkModal(false)} className="px-3 py-1 text-gray-600">Cancel</button>
                            <button type="button" onClick={insertLink} className="px-3 py-1 bg-green-600 text-white rounded">Insert</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Image Modal */}
            {showImageModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-lg shadow-xl w-80">
                        <h3 className="font-bold mb-3">Insert Image</h3>
                        <input
                            type="url"
                            placeholder="Image URL"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            className="w-full border p-2 rounded mb-2"
                        />
                        <input
                            type="text"
                            placeholder="Alt text (optional)"
                            value={imageAlt}
                            onChange={(e) => setImageAlt(e.target.value)}
                            className="w-full border p-2 rounded mb-3"
                        />
                        <div className="flex gap-2 justify-end">
                            <button type="button" onClick={() => setShowImageModal(false)} className="px-3 py-1 text-gray-600">Cancel</button>
                            <button type="button" onClick={insertImage} className="px-3 py-1 bg-green-600 text-white rounded">Insert</button>
                        </div>
                    </div>
                </div>
            )}

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

            {/* Help text */}
            <p className="text-xs text-gray-500">
                Markdown supported: **bold**, *italic*, # headings, [link](url), ![image](url)
            </p>
        </div>
    );
}
