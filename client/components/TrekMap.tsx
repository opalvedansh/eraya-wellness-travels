import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Icon, Map as LeafletMap } from "leaflet";

// Fix Leaflet default icon issue
const defaultIcon = new Icon({
    iconUrl: "/assets/leaflet/marker-icon.png",
    iconRetinaUrl: "/assets/leaflet/marker-icon-2x.png",
    shadowUrl: "/assets/leaflet/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

// Highlighted marker icon
const highlightedIcon = new Icon({
    iconUrl: "/assets/leaflet/marker-icon.png",
    iconRetinaUrl: "/assets/leaflet/marker-icon-2x.png",
    shadowUrl: "/assets/leaflet/marker-shadow.png",
    iconSize: [35, 57],
    iconAnchor: [17, 57],
    className: "marker-highlighted",
});

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

// Component to handle map instance and programmatic control
function MapController({
    selectedTrekId,
    treks
}: {
    selectedTrekId: string | null;
    treks: Trek[];
}) {
    const map = useMap();

    useEffect(() => {
        if (selectedTrekId !== null) {
            const trek = treks.find(t => t.id === selectedTrekId);
            if (trek) {
                map.flyTo(trek.coordinates, 10, {
                    duration: 1.5,
                    easeLinearity: 0.25
                });
            }
        }
    }, [selectedTrekId, treks, map]);

    return null;
}

export default function TrekMap({
    treks,
    onTrekClick,
    onMarkerClick,
    selectedTrekId = null,
    className = "h-[600px] rounded-xl overflow-hidden shadow-premium border border-border"
}: TrekMapProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
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
            <MapContainer
                center={[28.3949, 84.1240]}
                zoom={7}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapController selectedTrekId={selectedTrekId} treks={treks} />
                {treks.map((trek) => (
                    <Marker
                        key={trek.id}
                        position={trek.coordinates}
                        icon={selectedTrekId === trek.id ? highlightedIcon : defaultIcon}
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
                                        className="px-3 py-1 bg-green-primary text-white rounded text-xs font-semibold hover:bg-green-primary/90"
                                    >
                                        View Trek
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
