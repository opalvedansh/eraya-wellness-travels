import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import type { Icon, Map as LeafletMapType } from "leaflet";

// Separate component for Map logic to ensure context exists
function MapController({
    selectedTourId,
    tours
}: {
    selectedTourId: string | null;
    tours: any[];
}) {
    const map = useMap();

    useEffect(() => {
        // Needs dynamic import to access L inside effect
        import("leaflet").then((L) => {
            if (selectedTourId !== null) {
                const tour = tours.find(t => t.id === selectedTourId);
                if (tour && tour.coordinates) {
                    map.flyTo(tour.coordinates, 10, {
                        duration: 1.5,
                        easeLinearity: 0.25
                    });
                }
            } else if (tours.length > 0) {
                const validTours = tours.filter(t =>
                    t.coordinates &&
                    t.coordinates[0] !== 27.7 &&
                    !isNaN(t.coordinates[0]) &&
                    !isNaN(t.coordinates[1])
                );

                if (validTours.length > 0) {
                    const bounds = L.latLngBounds(validTours.map(t => t.coordinates));
                    map.fitBounds(bounds, { padding: [50, 50] });
                } else if (tours.length > 0) {
                    const bounds = L.latLngBounds(tours.map(t => t.coordinates));
                    map.fitBounds(bounds, { padding: [50, 50] });
                }
            }
        });
    }, [selectedTourId, tours, map]);

    return null;
}

// Icon setup component
function MapIconSetup() {
    useEffect(() => {
        // Fix Leaflet icons
        import("leaflet").then((L) => {
            delete (L.Icon.Default.prototype as any)._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconUrl: "/assets/leaflet/marker-icon.png",
                iconRetinaUrl: "/assets/leaflet/marker-icon-2x.png",
                shadowUrl: "/assets/leaflet/marker-shadow.png",
            });
        });
    }, []);
    return null;
}

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
    // Initialize icons safely on client-side only (Custom DivIcons)
    const createCustomIcon = (price: number, isActive: boolean) => {
        // We can't import L directly here safely due to SSR, but we can assume L is available or we wouldn't be rendering
        // However, standard L.divIcon doesn't need the 'leaflet' package at initialization time if passed as object to Marker? 
        // Actually, we need L.divIcon instance.
        // Let's use the L instance we get from useMap or from window if available, OR we wait for effect.
        // Since we are inside MapContainer, better to use the effect approach for the first render?
        // Actually standard approach: we can just use the import from useEffect.
        return new (window as any).L.DivIcon({
            className: `custom-marker-pill ${isActive ? 'active' : ''}`,
            html: `<span>$${price}</span>`,
            iconSize: [0, 0], // CSS handles size
            iconAnchor: [0, 0] // CSS handles anchor
        });
    };

    const [LeafletMap, setLeafletMap] = useState<any>(null);

    useEffect(() => {
        import("leaflet").then((L) => {
            setLeafletMap(L);
            (window as any).L = L; // Quick hack to access L in render if needed, or just store in state
        });
    }, []);

    if (!LeafletMap) {
        return (
            <div className={`${className} flex items-center justify-center bg-beige-light`}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-primary mx-auto mb-4"></div>
                    <p className="text-text-dark/70">Loading map...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={className}>
            <style>{`
                .custom-marker-pill {
                    background: transparent !important;
                    border: none !important;
                }
                
                .simple-marker {
                    position: relative;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .marker-circle {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: #173B36;
                    border: 3px solid white;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    cursor: pointer;
                }
                
                .marker-circle:hover {
                    transform: scale(1.15);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);
                }
                
                .marker-circle.active {
                    background: #E8B86D;
                    border-color: #173B36;
                    transform: scale(1.25);
                    box-shadow: 0 4px 16px rgba(232, 184, 109, 0.6);
                }
                
                .marker-pulse {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: rgba(232, 184, 109, 0.3);
                    animation: simple-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                
                @keyframes simple-pulse {
                    0% {
                        transform: translate(-50%, -50%) scale(1);
                        opacity: 1;
                    }
                    100% {
                        transform: translate(-50%, -50%) scale(2.5);
                        opacity: 0;
                    }
                }
            `}</style>
            <MapContainer
                center={[28.3949, 84.1240]}
                zoom={7}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />
                <MapController selectedTourId={selectedTourId} tours={tours} />
                {tours.map((tour) => {
                    const isActive = selectedTourId === tour.id;
                    return (
                        <Marker
                            key={tour.id}
                            position={tour.coordinates}
                            icon={new LeafletMap.DivIcon({
                                className: 'custom-marker-pill',
                                html: `
                                    <div class="simple-marker">
                                        ${isActive ? '<div class="marker-pulse"></div>' : ''}
                                        <div class="marker-circle ${isActive ? 'active' : ''}"></div>
                                    </div>
                                `,
                                iconSize: [32, 32],
                                iconAnchor: [16, 16],
                                popupAnchor: [0, -16]
                            })}
                            eventHandlers={{
                                click: () => {
                                    if (onMarkerClick) {
                                        onMarkerClick(tour.id);
                                    }
                                }
                            }}
                        >
                            <Popup>
                                <div className="p-2 min-w-[200px]">
                                    <img
                                        src={tour.image}
                                        alt={tour.name}
                                        className="w-full h-32 object-cover rounded-lg mb-2"
                                    />
                                    <h3 className="font-bold text-sm mb-1">{tour.name}</h3>
                                    <p className="text-xs text-gray-600 mb-2">{tour.location}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="font-black text-green-primary">${tour.price}</span>
                                        <button
                                            onClick={() => onTourClick(tour.slug)}
                                            className="px-3 py-1 bg-green-primary text-white rounded text-xs font-semibold hover:bg-green-primary/90"
                                        >
                                            View Tour
                                        </button>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
}
