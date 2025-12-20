import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface RouteMapProps {
    route: Array<{ lat: number; lng: number; name?: string }>;
}

export function RouteMap({ route }: RouteMapProps) {
    if (!route || route.length === 0) {
        return (
            <div className="bg-card rounded-xl p-8 text-center border border-border">
                <p className="text-text-dark/60">Route map not available for this tour.</p>
            </div>
        );
    }

    // Calculate center point
    const centerLat = route.reduce((sum, point) => sum + point.lat, 0) / route.length;
    const centerLng = route.reduce((sum, point) => sum + point.lng, 0) / route.length;

    // Calculate zoom level based on route spread
    const latSpread = Math.max(...route.map(p => p.lat)) - Math.min(...route.map(p => p.lat));
    const lngSpread = Math.max(...route.map(p => p.lng)) - Math.min(...route.map(p => p.lng));
    const maxSpread = Math.max(latSpread, lngSpread);
    const zoom = maxSpread > 5 ? 6 : maxSpread > 2 ? 7 : maxSpread > 1 ? 8 : 9;

    return (
        <div className="bg-card rounded-xl overflow-hidden shadow-premium-sm border border-border">
            <MapContainer
                center={[centerLat, centerLng]}
                zoom={zoom}
                scrollWheelZoom={false}
                style={{ height: '500px', width: '100%' }}
                className="z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Polyline
                    positions={route.map(point => [point.lat, point.lng])}
                    pathOptions={{ color: '#22c55e', weight: 3, opacity: 0.8 }}
                />
                {route.map((point, index) => (
                    <Marker key={index} position={[point.lat, point.lng]}>
                        {point.name && <Popup>{point.name}</Popup>}
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
