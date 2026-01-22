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
    const [icons, setIcons] = useState<{ defaultIcon: Icon; highlightedIcon: Icon } | null>(null);

    // Initialize icons safely
    useEffect(() => {
        let isMounted = true;

        import("leaflet").then((L) => {
            if (!isMounted) return;

            const defaultIcon = L.icon({
                iconUrl: "/assets/leaflet/marker-icon.png",
                iconRetinaUrl: "/assets/leaflet/marker-icon-2x.png",
                shadowUrl: "/assets/leaflet/marker-shadow.png",
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41],
            });

            const highlightedIcon = L.icon({
                iconUrl: "/assets/leaflet/marker-icon.png",
                iconRetinaUrl: "/assets/leaflet/marker-icon-2x.png",
                shadowUrl: "/assets/leaflet/marker-shadow.png",
                iconSize: [35, 57],
                iconAnchor: [17, 57],
                popupAnchor: [1, -50],
                shadowSize: [57, 57],
                className: "marker-highlighted",
            });

            setIcons({ defaultIcon, highlightedIcon });
        });

        return () => {
            isMounted = false;
        };
    }, []);

    if (!icons) {
        return (
            <div className={`${className} flex items-center justify-center bg-beige-light`}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-primary mx-auto mb-4"></div>
                    <p className="text-text-dark/70">Loading map configuration...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={className}>
            <MapContainer
                center={[28.3949, 84.1240]}
                zoom={7}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={true}
            >
                <MapIconSetup />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />
                <MapController selectedTrekId={selectedTrekId} treks={treks} />
                {treks.map((trek) => (
                    <Marker
                        key={trek.id}
                        position={trek.coordinates}
                        icon={selectedTrekId === trek.id ? icons.highlightedIcon : icons.defaultIcon}
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
                ))}
            </MapContainer>
        </div>
    );
}
