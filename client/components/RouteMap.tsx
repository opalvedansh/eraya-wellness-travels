import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';

// Component to handle global Leaflet configuration side-effects
function MapConfig() {
    useEffect(() => {
        import('leaflet').then((L) => {
            // Fix for default marker icons
            delete (L.Icon.Default.prototype as any)._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: '/assets/leaflet/marker-icon-2x.png',
                iconUrl: '/assets/leaflet/marker-icon.png',
                shadowUrl: '/assets/leaflet/marker-shadow.png',
            });
        });
    }, []);
    return null;
}

interface RouteMapProps {
    route?: Array<{ lat: number; lng: number; name?: string }>;
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
                <MapConfig />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {hasRoute && (
                    <Polyline
                        positions={route!.map(point => [point.lat, point.lng])}
                        pathOptions={{ color: '#22c55e', weight: 3, opacity: 0.8 }}
                    />
                )}

                {hasRoute && route!.map((point, index) => (
                    <Marker key={index} position={[point.lat, point.lng]}>
                        {point.name && <Popup>{point.name}</Popup>}
                    </Marker>
                ))}

                {!hasRoute && center && (
                    <Marker position={center}>
                        <Popup>Tour Location</Popup>
                    </Marker>
                )}
            </MapContainer>
        </div>
    );
}
