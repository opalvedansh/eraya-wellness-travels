import { useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { authenticatedFetch } from '@/lib/api';

interface ImageUploadProps {
    label: string;
    onUploadComplete: (url: string) => void;
    type: 'trek' | 'tour' | 'about';
    subType?: 'team' | 'partners' | 'general'; // For type='about'
    currentImage?: string;
    multiple?: boolean;
    helpText?: string;
}

export default function ImageUpload({
    label,
    onUploadComplete,
    type,
    subType,
    currentImage,
    multiple = false,
    helpText
}: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [dragOver, setDragOver] = useState(false);

    const handleFileUpload = async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        const file = files[0]; // For now, handle single file only

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please upload an image file (JPG, PNG, WebP)');
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('File size must be less than 5MB');
            return;
        }

        setUploading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('type', type);
            if (subType) {
                formData.append('subType', subType);
            }

            const response = await authenticatedFetch('/api/admin/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Upload failed');
            }

            const data = await response.json();
            onUploadComplete(data.url);
        } catch (err) {
            console.error('Upload error:', err);
            setError(err instanceof Error ? err.message : 'Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        handleFileUpload(e.dataTransfer.files);
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
                {label}
                {helpText && <span className="text-xs text-gray-500 ml-2">{helpText}</span>}
            </label>

            {/* Upload Area */}
            <div
                className={`relative border-2 border-dashed rounded-lg p-4 transition-colors ${dragOver
                    ? 'border-green-primary bg-green-primary/5'
                    : 'border-gray-300 hover:border-gray-400'
                    } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    accept="image/*"
                    multiple={multiple}
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={uploading}
                />

                <div className="text-center">
                    {uploading ? (
                        <>
                            <Loader2 className="mx-auto h-8 w-8 text-green-primary animate-spin mb-2" />
                            <p className="text-sm text-gray-600">Uploading...</p>
                        </>
                    ) : (
                        <>
                            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600">
                                <span className="font-semibold text-green-primary">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                JPG, PNG or WebP (max 5MB)
                            </p>
                        </>
                    )}
                </div>
            </div>

            {/* Current Image Preview */}
            {currentImage && !uploading && (
                <div className="relative inline-block">
                    <img
                        src={currentImage}
                        alt="Preview"
                        className="w-24 h-24 object-cover rounded-lg border border-gray-300"
                    />
                    <div className="absolute -top-2 -right-2 bg-green-600 text-white rounded-full px-2 py-0.5 text-xs">
                        Current
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <X className="h-4 w-4 text-red-600 mt-0.5" />
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}
        </div>
    );
}
