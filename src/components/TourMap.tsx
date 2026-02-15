"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

// CARTO Voyager - free, no API key needed
const MAP_STYLE = {
    version: 8 as const,
    sources: {
        'carto': {
            type: 'raster' as const,
            tiles: ['https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png'],
            tileSize: 256,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        }
    },
    layers: [{
        id: 'carto-tiles',
        type: 'raster' as const,
        source: 'carto',
        minzoom: 0,
        maxzoom: 19
    }]
};

interface Tour {
    id: string;
    name: string;
    slug: string;
    location: string;
    image: string;
    price: number;
    coordinates: [number, number];
    description?: string;
}

interface TourMapProps {
    tours: Tour[];
    onTourClick: (slug: string) => void;
    onMarkerClick?: (tourId: string) => void;
    selectedTourId?: string | null;
    className?: string;
}

export default function TourMap({
    tours,
    onTourClick,
    onMarkerClick,
    selectedTourId = null,
    className = "h-[600px] rounded-xl overflow-hidden shadow-premium border border-border"
}: TourMapProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);
    const markers = useRef<Map<string, maplibregl.Marker>>(new Map());
    const popups = useRef<Map<string, maplibregl.Popup>>(new Map());
    const [loaded, setLoaded] = useState(false);

    // Initialize map
    useEffect(() => {
        if (!mapContainer.current || map.current) return;

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: MAP_STYLE,
            center: [84.124, 28.3949],
            zoom: 7,
            pitch: 0,
            bearing: 0
        });

        map.current.on('load', () => {
            setLoaded(true);

            // Fit bounds to all valid tours
            if (tours.length > 0) {
                const validTours = tours.filter(t =>
                    t.coordinates &&
                    t.coordinates[0] !== 27.7 &&
                    !isNaN(t.coordinates[0]) &&
                    !isNaN(t.coordinates[1])
                );

                if (validTours.length > 0) {
                    const bounds = new maplibregl.LngLatBounds();
                    validTours.forEach(tour => {
                        bounds.extend([tour.coordinates[1], tour.coordinates[0]]);
                    });
                    map.current!.fitBounds(bounds, { padding: 50, duration: 1000 });
                }
            }
        });

        // Add navigation control
        map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

        return () => {
            map.current?.remove();
            map.current = null;
        };
    }, []);

    // Add/update markers when tours change
    useEffect(() => {
        if (!map.current || !loaded) return;

        // Clear existing markers
        markers.current.forEach(marker => marker.remove());
        markers.current.clear();
        popups.current.clear();

        // Add new markers
        tours.forEach(tour => {
            const isActive = selectedTourId === tour.id;

            // Create popup
            const popup = new maplibregl.Popup({ offset: 25, closeButton: true, closeOnClick: false })
                .setHTML(`
                    <div class="tour-popup">
                        <img src="${tour.image}" alt="${tour.name}" class="popup-image" />
                        <div class="popup-content">
                            <h3 class="popup-title">${tour.name}</h3>
                            <p class="popup-location">${tour.location}</p>
                            <div class="popup-footer">
                                <span class="popup-price">$${tour.price}</span>
                                <button class="view-tour-btn" data-slug="${tour.slug}">
                                    View Tour
                                    <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                `);

            // Add click handler for the view button
            popup.on('open', () => {
                setTimeout(() => {
                    const btn = document.querySelector(`.view-tour-btn[data-slug="${tour.slug}"]`);
                    if (btn) {
                        btn.addEventListener('click', () => onTourClick(tour.slug));
                    }
                }, 0);
            });

            popups.current.set(tour.id, popup);

            // Use native MapLibre marker with custom color
            const marker = new maplibregl.Marker({
                color: isActive ? '#E8B86D' : '#173B36',
                scale: isActive ? 1.2 : 1
            })
                .setLngLat([tour.coordinates[1], tour.coordinates[0]])
                .setPopup(popup)
                .addTo(map.current!);

            // Add click handler
            marker.getElement().addEventListener('click', () => {
                if (onMarkerClick) {
                    onMarkerClick(tour.id);
                }
            });

            markers.current.set(tour.id, marker);
        });
    }, [tours, loaded, selectedTourId, onMarkerClick, onTourClick]);

    // Fly to selected tour
    useEffect(() => {
        if (!map.current || !loaded || !selectedTourId) return;

        const tour = tours.find(t => t.id === selectedTourId);
        if (tour && tour.coordinates) {
            map.current.flyTo({
                center: [tour.coordinates[1], tour.coordinates[0]],
                zoom: 10,
                duration: 1500,
                essential: true
            });

            // Open popup for selected tour
            popups.current.forEach((popup, id) => {
                if (id === selectedTourId) {
                    const marker = markers.current.get(id);
                    if (marker) marker.togglePopup();
                } else {
                    popup.remove();
                }
            });
        }
    }, [selectedTourId, tours, loaded]);

    return (
        <div className={className}>
            {/* Popup styles */}
            <style>{`
                .maplibregl-popup-content {
                    padding: 0 !important;
                    border-radius: 12px !important;
                    overflow: hidden;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15) !important;
                    min-width: 220px;
                }

                .maplibregl-popup-close-button {
                    font-size: 18px;
                    padding: 4px 8px;
                    color: #666;
                    z-index: 10;
                }

                .tour-popup .popup-image {
                    width: 100%;
                    height: 128px;
                    object-fit: cover;
                }

                .tour-popup .popup-content {
                    padding: 12px;
                }

                .tour-popup .popup-title {
                    font-weight: 700;
                    font-size: 14px;
                    margin-bottom: 4px;
                    color: #1a1a1a;
                }

                .tour-popup .popup-location {
                    font-size: 12px;
                    color: #666;
                    margin-bottom: 8px;
                }

                .tour-popup .popup-footer {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .tour-popup .popup-price {
                    font-weight: 800;
                    color: #173B36;
                }

                .tour-popup .view-tour-btn {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    padding: 6px 12px;
                    background: #173B36;
                    color: white;
                    border-radius: 8px;
                    font-size: 12px;
                    font-weight: 600;
                    border: none;
                    cursor: pointer;
                    transition: background 0.2s;
                }

                .tour-popup .view-tour-btn:hover {
                    background: #0f2a26;
                }

                .tour-popup .btn-icon {
                    width: 12px;
                    height: 12px;
                }
            `}</style>

            <div ref={mapContainer} style={{ height: "100%", width: "100%" }} />

            {!loaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-beige-light">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-primary mx-auto mb-4"></div>
                        <p className="text-text-dark/70">Loading map...</p>
                    </div>
                </div>
            )}
        </div>
    );
}
