import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default icon issue
const defaultIcon = new Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

interface Trek {
    id: number;
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
}

export default function TrekMap({ treks, onTrekClick }: TrekMapProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return (
            <div className="h-[600px] rounded-xl overflow-hidden shadow-premium border border-border flex items-center justify-center bg-beige-light">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-primary mx-auto mb-4"></div>
                    <p className="text-text-dark/70">Loading map...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-[600px] rounded-xl overflow-hidden shadow-premium border border-border">
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
                {treks.map((trek) => (
                    <Marker
                        key={trek.id}
                        position={trek.coordinates}
                        icon={defaultIcon}
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
