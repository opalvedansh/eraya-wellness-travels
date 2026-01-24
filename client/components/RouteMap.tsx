import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Configure default marker icons immediately (synchronous)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Create a custom icon for explicit use
const customIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

interface RouteMapProps {
    route?: Array<{ lat: number; lng: number; name?: string; day?: number }>;
    center?: [number, number];
}

export function RouteMap({ route, center }: RouteMapProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if ((!route || route.length === 0) && !center) {
        return (
            <div className="bg-card rounded-xl p-8 text-center border border-border">
                <p className="text-text-dark/60">Route map not available for this tour.</p>
            </div>
        );
    }

    if (!isMounted) {
        return (
            <div className="bg-card rounded-xl p-8 text-center border border-border h-[500px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-primary"></div>
            </div>
        );
    }

    // Determine what to render
    const hasRoute = route && route.length > 0;

    // Calculate center point
    let mapCenter: [number, number] = [0, 0];
    let zoom = 6;

    if (hasRoute) {
        mapCenter = [
            route!.reduce((sum, point) => sum + point.lat, 0) / route!.length,
            route!.reduce((sum, point) => sum + point.lng, 0) / route!.length
        ];

        // Calculate zoom level based on route spread
        const latSpread = Math.max(...route!.map(p => p.lat)) - Math.min(...route!.map(p => p.lat));
        const lngSpread = Math.max(...route!.map(p => p.lng)) - Math.min(...route!.map(p => p.lng));
        const maxSpread = Math.max(latSpread, lngSpread);
        zoom = maxSpread > 5 ? 6 : maxSpread > 2 ? 7 : maxSpread > 1 ? 8 : 9;
    } else if (center) {
        mapCenter = center;
        zoom = 8;
    }

    return (
        <div className="bg-card rounded-xl overflow-hidden shadow-premium-sm border border-border">
            <MapContainer
                center={mapCenter}
                zoom={zoom}
                scrollWheelZoom={false}
                style={{ height: '500px', width: '100%' }}
                className="z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />

                {hasRoute && (
                    <Polyline
                        positions={route!.map(point => [point.lat, point.lng])}
                        pathOptions={{ color: '#22c55e', weight: 3, opacity: 0.8 }}
                    />
                )}

                {hasRoute && route!.map((point, index) => (
                    <Marker key={index} position={[point.lat, point.lng]} icon={customIcon}>
                        <Popup>
                            {point.day && <span className="font-bold">Day {point.day}: </span>}
                            {point.name || `Stop ${index + 1}`}
                        </Popup>
                    </Marker>
                ))}

                {!hasRoute && center && (
                    <Marker position={center} icon={customIcon}>
                        <Popup>Tour Location</Popup>
                    </Marker>
                )}
            </MapContainer>
        </div>
    );
}
