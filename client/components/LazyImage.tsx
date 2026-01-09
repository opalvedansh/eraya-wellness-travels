import { useState, useEffect, useRef } from "react";

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    placeholderSrc?: string;
}

export default function LazyImage({
    src,
    alt,
    className = "",
    placeholderSrc,
    ...props
}: LazyImageProps) {
    const [imageSrc, setImageSrc] = useState(placeholderSrc || "");
    const [imageLoaded, setImageLoaded] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        // Use Intersection Observer for lazy loading
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setImageSrc(src);
                        observer.disconnect();
                    }
                });
            },
            {
                rootMargin: "50px", // Start loading 50px before image enters viewport
            }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [src]);

    return (
        <img
            ref={imgRef}
            src={imageSrc}
            alt={alt}
            className={`${className} ${!imageLoaded && imageSrc ? 'animate-pulse bg-gray-200' : ''}`}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
            {...props}
        />
    );
}
