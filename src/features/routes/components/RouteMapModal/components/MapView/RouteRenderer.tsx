// src/features/routes/components/RouteMapModal/components/MapView/RouteRenderer.tsx
import React, { useEffect, useRef } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import { RoutePoint } from '../../utils/types';

interface RouteRendererProps {
    points: RoutePoint[];
    originalChildIndexMap: Record<string, number>;
}

export const RouteRenderer: React.FC<RouteRendererProps> = ({ points, originalChildIndexMap }) => {
    const map = useMap();
    const markersRef = useRef<google.maps.Marker[]>([]);
    const polylineRef = useRef<google.maps.Polyline | null>(null);
    const hasInitializedRef = useRef(false);

    // Inicjalizacja markerów - TYLKO RAZ!
    useEffect(() => {
        if (!map || !window.google || hasInitializedRef.current) return;

        console.log('🎯 Tworzenie markerów (tylko raz!)');

        points.forEach((point) => {
            const childIndex = originalChildIndexMap[point.childName] ?? 0;
            const letter = String.fromCharCode(65 + childIndex);
            const number = point.type === 'pickup' ? '1' : '2';
            const label = `${letter}(${number})`;

            const markerColor = point.isNew
                ? '#8b5cf6'
                : point.type === 'pickup'
                    ? '#2563eb'
                    : '#10b981';

            const svgMarker = {
                url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
                        <circle cx="20" cy="20" r="18" fill="${markerColor}" stroke="white" stroke-width="3"/>
                        ${
                    point.isNew
                        ? '<circle cx="32" cy="8" r="6" fill="#f59e0b" stroke="white" stroke-width="2"/>'
                        : ''
                }
                        <text x="20" y="20" font-family="Arial, sans-serif" font-size="12" font-weight="bold" 
                              fill="white" text-anchor="middle" dominant-baseline="central">${label}</text>
                    </svg>
                `)}`,
                scaledSize: new google.maps.Size(40, 40),
                anchor: new google.maps.Point(20, 20),
            };

            const marker = new google.maps.Marker({
                position: point.hasCoordinates && point.lat !== null && point.lng !== null
                    ? { lat: point.lat, lng: point.lng }
                    : { lat: 0, lng: 0 },
                map: point.hasCoordinates && point.lat !== null && point.lng !== null ? map : null,
                icon: svgMarker,
                title: `${point.childName} - ${point.type === 'pickup' ? 'Odbiór' : 'Dowóz'}${
                    point.isNew ? ' (NOWY)' : ''
                }`,
                zIndex: point.isNew ? 2000 : 1000,
            });

            (marker as any).stopId = point.stopId;
            markersRef.current.push(marker);
        });

        hasInitializedRef.current = true;
        console.log(`📍 Utworzono ${markersRef.current.length} markerów`);

        return () => {
            console.log('🧹 Czyszczenie markerów');
            markersRef.current.forEach(marker => marker.setMap(null));
            markersRef.current = [];
            hasInitializedRef.current = false;
        };
    }, [map]);

    // Aktualizacja trasy - gdy zmieni się kolejność punktów
    useEffect(() => {
        if (!map || !window.google || !hasInitializedRef.current) return;

        const validPoints = points.filter(
            (p) => p.hasCoordinates && p.lat !== null && p.lng !== null
        );

        if (validPoints.length < 2) {
            if (polylineRef.current) {
                polylineRef.current.setMap(null);
                polylineRef.current = null;
            }
            return;
        }

        console.log('🛣️ Aktualizacja trasy (markery pozostają na miejscu)');

        const directionsService = new google.maps.DirectionsService();
        const waypoints = validPoints.slice(1, -1).map((point) => ({
            location: new google.maps.LatLng(point.lat!, point.lng!),
            stopover: true,
        }));

        directionsService.route(
            {
                origin: new google.maps.LatLng(validPoints[0].lat!, validPoints[0].lng!),
                destination: new google.maps.LatLng(
                    validPoints[validPoints.length - 1].lat!,
                    validPoints[validPoints.length - 1].lng!
                ),
                waypoints,
                travelMode: google.maps.TravelMode.DRIVING,
                optimizeWaypoints: false,
            },
            (result, status) => {
                if (status === google.maps.DirectionsStatus.OK && result) {
                    if (polylineRef.current) {
                        polylineRef.current.setMap(null);
                    }

                    const path = result.routes[0].overview_path;
                    polylineRef.current = new google.maps.Polyline({
                        path: path,
                        geodesic: true,
                        strokeColor: '#2563eb',
                        strokeOpacity: 0.8,
                        strokeWeight: 5,
                        map: map,
                    });

                    let totalDistance = 0;
                    let totalDuration = 0;
                    result.routes[0].legs.forEach((leg) => {
                        totalDistance += leg.distance?.value || 0;
                        totalDuration += leg.duration?.value || 0;
                    });

                    console.log(
                        `🗺️ Trasa: ${(totalDistance / 1000).toFixed(1)} km, ${Math.round(
                            totalDuration / 60
                        )} min`
                    );
                } else {
                    console.error('❌ Błąd wyznaczania trasy:', status);
                }
            }
        );

        return () => {
            if (polylineRef.current) {
                polylineRef.current.setMap(null);
                polylineRef.current = null;
            }
        };
    }, [map, points]);

    return null;
};