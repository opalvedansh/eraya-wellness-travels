import { useRef, useState } from "react";
import { Bold, Italic, Heading1, Heading2, Heading3, Link as LinkIcon, Image, AlignLeft, AlignCenter, AlignRight, AlignJustify, List, ListOrdered, Quote, Upload, Loader2 } from "lucide-react";
import { authenticatedFetch } from "@/lib/api";

interface RichTextAreaProps {
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    rows?: number;
    placeholder?: string;
    className?: string;
    uploadType?: 'trek' | 'tour' | 'about' | 'general';
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
    uploadType = 'general',
}: RichTextAreaProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [imageTab, setImageTab] = useState<'url' | 'upload'>('url');
    const [linkUrl, setLinkUrl] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [imageAlt, setImageAlt] = useState("");
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

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

    const insertList = (prefix: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = value.substring(start, end);

        // If multiple lines selected, prefix each line
        if (selectedText.includes('\n')) {
            const newText = selectedText.split('\n').map(line => `${prefix} ${line}`).join('\n');
            const newValue = value.substring(0, start) + newText + value.substring(end);
            triggerChange(newValue, start + newText.length);
        } else {
            // Single line or empty selection
            const newValue = value.substring(0, start) + `\n${prefix} ` + selectedText + value.substring(end);
            triggerChange(newValue, start + prefix.length + 2 + selectedText.length);
        }
    };


    const handleBold = () => wrapSelection("**", "**", "bold text");
    const handleItalic = () => wrapSelection("*", "*", "italic text");
    const handleH1 = () => insertAtCursor("\n# Heading 1\n");
    const handleH2 = () => insertAtCursor("\n## Heading 2\n");
    const handleH3 = () => insertAtCursor("\n### Heading 3\n");
    const handleUnorderedList = () => insertList("-");
    const handleOrderedList = () => insertList("1.");
    const handleBlockquote = () => insertList(">");


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

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setUploadError('Please upload an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setUploadError('File size must be less than 5MB');
            return;
        }

        setUploading(true);
        setUploadError(null);

        try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('type', uploadType);

            const response = await authenticatedFetch('/api/admin/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Upload failed');
            }

            const data = await response.json();
            setImageUrl(data.url);
        } catch (err) {
            console.error('Upload error:', err);
            setUploadError(err instanceof Error ? err.message : 'Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    // Reset state when modal closes
    const closeImageModal = () => {
        setShowImageModal(false);
        setImageUrl("");
        setImageAlt("");
        setUploadError(null);
        setImageTab('url');
    };

    const insertImage = () => {
        insertAtCursor(`\n![${imageAlt || "image"}](${imageUrl})`); // Should probably ensure image is on its own line if it's large, but inline is standard md
        // Changed to inline to be safe, user can add newlines. Actually the render often prefers block if it's just an image.
        // Let's stick to simple inline markdown.

        closeImageModal();
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
        } else {
            const newValue = value.substring(0, start) + `<div style="text-align: ${align}">\ncontent\n</div>` + value.substring(start);
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
                <ToolbarButton onClick={handleUnorderedList} icon={List} title="Bullet List (-)" />
                <ToolbarButton onClick={handleOrderedList} icon={ListOrdered} title="Numbered List (1.)" />
                <ToolbarButton onClick={handleBlockquote} icon={Quote} title="Blockquote (>)" />
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

            {/* Image Modal - Enhanced with Upload */}
            {showImageModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-lg shadow-xl w-96">
                        <h3 className="font-bold mb-3">Insert Image</h3>

                        {/* Tabs */}
                        <div className="flex mb-4 border-b">
                            <button
                                className={`flex-1 pb-2 text-sm font-medium ${imageTab === 'url' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
                                onClick={() => setImageTab('url')}
                            >
                                By URL
                            </button>
                            <button
                                className={`flex-1 pb-2 text-sm font-medium ${imageTab === 'upload' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
                                onClick={() => setImageTab('upload')}
                            >
                                Upload
                            </button>
                        </div>

                        {imageTab === 'url' ? (
                            <input
                                type="url"
                                placeholder="Image URL"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                className="w-full border p-2 rounded mb-2 text-sm"
                            />
                        ) : (
                            <div className="mb-2">
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        {uploading ? (
                                            <Loader2 className="w-8 h-8 mb-2 text-gray-500 animate-spin" />
                                        ) : (
                                            <Upload className="w-8 h-8 mb-2 text-gray-500" />
                                        )}
                                        <p className="text-xs text-gray-500">
                                            {uploading ? "Uploading..." : "Click to upload image (max 5MB)"}
                                        </p>
                                    </div>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                        disabled={uploading}
                                    />
                                </label>
                                {imageUrl && (
                                    <p className="text-xs text-green-600 mt-1 truncate">
                                        Uploaded: {imageUrl.split('/').pop()}
                                    </p>
                                )}
                                {uploadError && (
                                    <p className="text-xs text-red-600 mt-1">{uploadError}</p>
                                )}
                            </div>
                        )}

                        <input
                            type="text"
                            placeholder="Alt text (optional)"
                            value={imageAlt}
                            onChange={(e) => setImageAlt(e.target.value)}
                            className="w-full border p-2 rounded mb-3 text-sm"
                        />
                        <div className="flex gap-2 justify-end">
                            <button type="button" onClick={closeImageModal} className="px-3 py-1 text-gray-600 text-sm">Cancel</button>
                            <button
                                type="button"
                                onClick={insertImage}
                                className="px-3 py-1 bg-green-600 text-white rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!imageUrl || uploading}
                            >
                                Insert
                            </button>
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
                className={`w-full px-4 py-2 border border-gray-300 rounded-b-lg rounded-t-none focus:ring-2 focus:ring-green-primary focus:border-transparent font-mono text-sm ${className}`}
            />

            {/* Help text */}
            <p className="text-xs text-gray-500">
                Markdown supported: **bold**, *italic*, # headings, - lists, &gt; quotes, [link](url), ![image](url)
            </p>
        </div>
    );
}
