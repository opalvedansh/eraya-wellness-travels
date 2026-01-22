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
    const [icons, setIcons] = useState<{ defaultIcon: Icon; highlightedIcon: Icon } | null>(null);

    // Initialize icons safely on client-side only
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
                <MapController selectedTourId={selectedTourId} tours={tours} />
                {tours.map((tour) => (
                    <Marker
                        key={tour.id}
                        position={tour.coordinates}
                        icon={selectedTourId === tour.id ? icons.highlightedIcon : icons.defaultIcon}
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
                ))}
            </MapContainer>
        </div>
    );
}
