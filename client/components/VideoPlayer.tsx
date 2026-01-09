import { useState } from "react";

interface VideoPlayerProps {
    url: string;
    title?: string;
    description?: string;
}

// Helper to detect video type and extract embed URL
function getVideoEmbedInfo(url: string) {
    if (!url) return null;

    // YouTube
    const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch) {
        return {
            type: 'youtube',
            embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}`
        };
    }

    // Vimeo
    const vimeoRegex = /vimeo\.com\/(\d+)/;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch) {
        return {
            type: 'vimeo',
            embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`
        };
    }

    // Direct video file
    if (url.match(/\.(mp4|webm|mov|ogg)$/i)) {
        return {
            type: 'direct',
            embedUrl: url
        };
    }

    return null;
}

export default function VideoPlayer({ url, title, description }: VideoPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const videoInfo = getVideoEmbedInfo(url);

    if (!videoInfo || !url) {
        // Fallback to placeholder
        return (
            <div className="relative aspect-video bg-gray-200">
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-primary to-green-primary/80">
                    <div className="text-center text-white">
                        <div className="w-16 sm:w-20 h-16 sm:h-20 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                            <svg className="w-8 sm:w-10 h-8 sm:h-10" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                        <p className="text-lg sm:text-xl font-bold">{title || "Watch Our Story"}</p>
                        <p className="text-sm text-white/80 mt-2">{description || "See how we're changing travel"}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (videoInfo.type === 'youtube' || videoInfo.type === 'vimeo') {
        return (
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                {!isPlaying && (
                    <div
                        className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-primary/90 to-green-primary/70 cursor-pointer z-10"
                        onClick={() => setIsPlaying(true)}
                    >
                        <div className="text-center text-white">
                            <div className="w-16 sm:w-20 h-16 sm:h-20 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                                <svg className="w-8 sm:w-10 h-8 sm:h-10" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </div>
                            <p className="text-lg sm:text-xl font-bold">{title || "Watch Our Story"}</p>
                            <p className="text-sm text-white/80 mt-2">{description || "See how we're changing travel"}</p>
                        </div>
                    </div>
                )}
                <iframe
                    src={isPlaying ? videoInfo.embedUrl : ''}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>
        );
    }

    // Direct video
    return (
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            <video
                controls
                className="w-full h-full"
            >
                <source src={videoInfo.embedUrl} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
}
