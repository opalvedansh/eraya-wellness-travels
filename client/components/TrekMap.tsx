import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import type { Icon } from "leaflet";
import { ChevronRight } from "lucide-react";

// Separate component for Map logic
function MapController({
    selectedTrekId,
    treks
}: {
    selectedTrekId: string | null;
    treks: any[];
}) {
    const map = useMap();

    useEffect(() => {
        import("leaflet").then((L) => {
            if (selectedTrekId !== null) {
                const trek = treks.find(t => t.id === selectedTrekId);
                if (trek && trek.coordinates) {
                    map.flyTo(trek.coordinates, 10, {
                        duration: 1.5,
                        easeLinearity: 0.25
                    });
                }
            } else if (treks.length > 0) {
                const validTreks = treks.filter(t =>
                    t.coordinates &&
                    t.coordinates[0] !== 28.3949 &&
                    !isNaN(t.coordinates[0]) &&
                    !isNaN(t.coordinates[1])
                );

                if (validTreks.length > 0) {
                    const bounds = L.latLngBounds(validTreks.map(t => t.coordinates));
                    map.fitBounds(bounds, { padding: [50, 50] });
                } else if (treks.length > 0) {
                    const bounds = L.latLngBounds(treks.map(t => t.coordinates));
                    map.fitBounds(bounds, { padding: [50, 50] });
                }
            }
        });
    }, [selectedTrekId, treks, map]);

    return null;
}

// Icon setup component
function MapIconSetup() {
    useEffect(() => {
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

interface Trek {
    id: string;
    name: string;
    slug: string;
    location: string;
    image: string;
    price: number;
    coordinates: [number, number];
    description?: string;
}

interface TrekMapProps {
    treks: Trek[];
    onTrekClick: (slug: string) => void;
    onMarkerClick?: (trekId: string) => void;
    selectedTrekId?: string | null;
    className?: string;
}

export default function TrekMap({
    treks,
    onTrekClick,
    onMarkerClick,
    selectedTrekId = null,
    className = "h-[600px] rounded-xl overflow-hidden shadow-premium border border-border"
}: TrekMapProps) {
    // Initialize icons safely on client-side only (Custom DivIcons)
    const [LeafletMap, setLeafletMap] = useState<any>(null);

    useEffect(() => {
        import("leaflet").then((L) => {
            setLeafletMap(L);
            (window as any).L = L; // Quick hack to access L in render if needed
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
                
                .marker-wrapper {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                .marker-pin-svg {
                    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.25));
                    transition: all 0.3s ease;
                }
                
                .marker-wrapper:hover .marker-pin-svg {
                    transform: translateY(-4px) scale(1.1);
                    filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.35));
                }
                
                .marker-wrapper.active .marker-pin-svg {
                    transform: translateY(-4px) scale(1.15);
                    filter: drop-shadow(0 8px 20px rgba(232, 184, 109, 0.6));
                }
                
                .marker-pulse-ring {
                    position: absolute;
                    top: 10px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    background: rgba(232, 184, 109, 0.4);
                    animation: pulse-marker 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                    pointer-events: none;
                }
                
                @keyframes pulse-marker {
                    0% {
                        transform: translateX(-50%) scale(0.8);
                        opacity: 1;
                    }
                    100% {
                        transform: translateX(-50%) scale(2.5);
                        opacity: 0;
                    }
                }
                
                .marker-price-tag {
                    position: absolute;
                    bottom: -20px;
                    background: linear-gradient(135deg, #173B36 0%, #2D5F5D 100%);
                    color: white;
                    padding: 5px 14px;
                    border-radius: 20px;
                    font-size: 13px;
                    font-weight: 800;
                    white-space: nowrap;
                    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.25);
                    transition: all 0.3s ease;
                    border: 2.5px solid white;
                    font-family: 'Inter', sans-serif;
                    letter-spacing: -0.3px;
                }
                
                .marker-wrapper.active .marker-price-tag {
                    background: linear-gradient(135deg, #E8B86D 0%, #D4A05E 100%);
                    color: #173B36;
                    box-shadow: 0 5px 15px rgba(232, 184, 109, 0.5);
                    transform: translateY(-3px) scale(1.05);
                    border-color: #FFF8E7;
                }
                
                .marker-wrapper:hover .marker-price-tag {
                    transform: translateY(-3px);
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.35);
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
                <MapController selectedTrekId={selectedTrekId} treks={treks} />
                {treks.map((trek) => {
                    const isActive = selectedTrekId === trek.id;
                    return (
                        <Marker
                            key={trek.id}
                            position={trek.coordinates}
                            icon={new LeafletMap.DivIcon({
                                className: 'custom-marker-pill',
                                html: `
                                    <div class="marker-wrapper ${isActive ? 'active' : ''}">
                                        ${isActive ? '<div class="marker-pulse-ring"></div>' : ''}
                                        <svg class="marker-pin-svg" width="44" height="56" viewBox="0 0 44 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <defs>
                                                <linearGradient id="pin-gradient-${trek.id}" x1="22" y1="0" x2="22" y2="56" gradientUnits="userSpaceOnUse">
                                                    <stop offset="0%" stop-color="${isActive ? '#E8B86D' : '#173B36'}"/>
                                                    <stop offset="100%" stop-color="${isActive ? '#D4A05E' : '#2D5F5D'}"/>
                                                </linearGradient>
                                                <filter id="pin-shadow-${trek.id}">
                                                    <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
                                                    <feOffset dx="0" dy="2"/>
                                                    <feComponentTransfer>
                                                        <feFuncA type="linear" slope="0.4"/>
                                                    </feComponentTransfer>
                                                    <feMerge>
                                                        <feMergeNode/>
                                                        <feMergeNode in="SourceGraphic"/>
                                                    </feMerge>
                                                </filter>
                                            </defs>
                                            <path d="M22 0C9.85 0 0 9.85 0 22C0 38.5 22 56 22 56C22 56 44 38.5 44 22C44 9.85 34.15 0 22 0Z" 
                                                  fill="url(#pin-gradient-${trek.id})" 
                                                  filter="url(#pin-shadow-${trek.id})"/>
                                            <circle cx="22" cy="22" r="13" fill="white" opacity="0.95"/>
                                            <path d="M22 11L24.5 18.5H32L26 23L28.5 30.5L22 26L15.5 30.5L18 23L12 18.5H19.5L22 11Z" 
                                                  fill="${isActive ? '#E8B86D' : '#173B36'}"/>
                                        </svg>
                                        <div class="marker-price-tag">
                                            $${trek.price}
                                        </div>
                                    </div>
                                `,
                                iconSize: [44, 76],
                                iconAnchor: [22, 56],
                                popupAnchor: [0, -56]
                            })}
                            eventHandlers={{
                                click: () => {
                                    if (onMarkerClick) {
                                        onMarkerClick(trek.id);
                                    }
                                }
                            }}
                        >
                            <Popup>
                                <div className="p-2 min-w-[200px]">
                                    <img
                                        src={trek.image}
                                        alt={trek.name}
                                        className="w-full h-32 object-cover rounded-lg mb-2"
                                    />
                                    <h3 className="font-bold text-sm mb-1">{trek.name}</h3>
                                    <p className="text-xs text-gray-600 mb-2">{trek.location}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="font-black text-green-primary">${trek.price}</span>
                                        <button
                                            onClick={() => onTrekClick(trek.slug)}
                                            className="px-3 py-1 bg-green-primary text-white rounded text-xs font-semibold hover:bg-green-primary/90 flex items-center gap-1"
                                        >
                                            View Details
                                            <ChevronRight className="h-3 w-3" />
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
