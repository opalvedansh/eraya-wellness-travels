"use client";

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface RouteMapProps {
    route?: Array<{ lat: number; lng: number; name?: string; day?: number }>;
    center?: [number, number];
}

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

export function RouteMap({ route, center }: RouteMapProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);
    const [loaded, setLoaded] = useState(false);

    if ((!route || route.length === 0) && !center) {
        return (
            <div className="bg-card rounded-xl p-8 text-center border border-border">
                <p className="text-text-dark/60">Route map not available for this tour.</p>
            </div>
        );
    }

    // Calculate center and zoom
    const hasRoute = route && route.length > 0;
    let mapCenter: [number, number] = [84.124, 28.3949]; // [lng, lat]
    let zoom = 6;

    if (hasRoute) {
        const lats = route!.map(p => p.lat);
        const lngs = route!.map(p => p.lng);
        mapCenter = [
            (Math.max(...lngs) + Math.min(...lngs)) / 2,
            (Math.max(...lats) + Math.min(...lats)) / 2
        ];

        const latSpread = Math.max(...lats) - Math.min(...lats);
        const lngSpread = Math.max(...lngs) - Math.min(...lngs);
        const maxSpread = Math.max(latSpread, lngSpread);
        zoom = maxSpread > 5 ? 6 : maxSpread > 2 ? 7 : maxSpread > 1 ? 8 : 9;
    } else if (center) {
        mapCenter = [center[1], center[0]]; // Convert [lat, lng] to [lng, lat]
        zoom = 10;
    }

    // Initialize map
    useEffect(() => {
        if (!mapContainer.current || map.current) return;

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: MAP_STYLE,
            center: mapCenter,
            zoom: zoom,
            pitch: 0,
            bearing: 0
        });

        map.current.on('load', () => {
            setLoaded(true);

            // Add route if available
            if (hasRoute && route) {
                // Add route line source
                map.current!.addSource('route', {
                    type: 'geojson',
                    data: {
                        type: 'Feature',
                        properties: {},
                        geometry: {
                            type: 'LineString',
                            coordinates: route.map(p => [p.lng, p.lat])
                        }
                    }
                });

                // Glow layer
                map.current!.addLayer({
                    id: 'route-glow',
                    type: 'line',
                    source: 'route',
                    paint: {
                        'line-color': '#22c55e',
                        'line-width': 8,
                        'line-opacity': 0.3,
                        'line-blur': 3
                    }
                });

                // Main route line
                map.current!.addLayer({
                    id: 'route-line',
                    type: 'line',
                    source: 'route',
                    paint: {
                        'line-color': '#22c55e',
                        'line-width': 4,
                        'line-opacity': 0.9
                    }
                });

                // Add markers for each point using native markers
                route.forEach((point, index) => {
                    const isFirst = index === 0;
                    const isLast = index === route.length - 1;

                    // Create popup
                    const popup = new maplibregl.Popup({ offset: 25 })
                        .setHTML(`
                            <div class="p-2 min-w-[150px]">
                                ${point.day ? `<span class="text-xs font-semibold text-green-600">Day ${point.day}</span>` : ''}
                                <p class="font-medium text-gray-900">${point.name || `Stop ${index + 1}`}</p>
                            </div>
                        `);

                    // Use native colored markers
                    new maplibregl.Marker({
                        color: isFirst ? '#22c55e' : isLast ? '#f59e0b' : '#173B36',
                        scale: (isFirst || isLast) ? 1.1 : 0.9
                    })
                        .setLngLat([point.lng, point.lat])
                        .setPopup(popup)
                        .addTo(map.current!);
                });
            }

            // Add single location marker if no route
            if (!hasRoute && center) {
                new maplibregl.Marker({ color: '#22c55e' })
                    .setLngLat([center[1], center[0]])
                    .addTo(map.current!);
            }
        });

        // Add navigation control
        map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

        return () => {
            map.current?.remove();
            map.current = null;
        };
    }, []);

    return (
        <div className="bg-card rounded-xl overflow-hidden shadow-premium-sm border border-border relative">
            <div ref={mapContainer} style={{ height: 500, width: '100%' }} />
            {!loaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-beige-light">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-primary"></div>
                </div>
            )}
        </div>
    );
}
