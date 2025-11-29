import React, { useEffect, useRef } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import { RoutePoint } from '../../utils/types';

interface RouteRendererProps {
    points: RoutePoint[];
    originalChildIndexMap: Record<string, number>;
    onMarkerClick?: (point: RoutePoint, screenPosition: { x: number; y: number }) => void;
}

export const RouteRenderer: React.FC<RouteRendererProps> = ({
                                                                points,
                                                                originalChildIndexMap,
                                                                onMarkerClick,
                                                            }) => {
    const map = useMap();
    const markersRef = useRef<google.maps.Marker[]>([]);
    const markerDataMap = useRef<Map<google.maps.Marker, RoutePoint>>(new Map());
    const polylineRef = useRef<google.maps.Polyline | null>(null);
    const hasInitializedRef = useRef(false);

    useEffect(() => {
        if (!map || !window.google || hasInitializedRef.current) return;

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
                    <svg xmlns="http://www.w3.org/2000/svg" width="44" height="50" viewBox="0 0 44 50">
                        <circle cx="22" cy="22" r="18" fill="${markerColor}" stroke="white" stroke-width="3"/>
                        ${
                    point.isNew
                        ? '<circle cx="36" cy="8" r="6" fill="#f59e0b" stroke="white" stroke-width="2"/>'
                        : ''
                }
                        <text x="22" y="22" font-family="Arial, sans-serif" font-size="11" font-weight="bold" 
                              fill="white" text-anchor="middle" dominant-baseline="central">${label}</text>
                        <rect x="14" y="38" width="16" height="12" rx="6" fill="white" stroke="${markerColor}" stroke-width="2"/>
                        <text x="22" y="44" font-family="Arial, sans-serif" font-size="9" font-weight="bold" 
                              fill="${markerColor}" text-anchor="middle" dominant-baseline="middle">${point.order}</text>
                    </svg>
                `)}`,
                scaledSize: new google.maps.Size(44, 50),
                anchor: new google.maps.Point(22, 25),
            };

            const marker = new google.maps.Marker({
                position: point.hasCoordinates && point.lat !== null && point.lng !== null
                    ? { lat: point.lat, lng: point.lng }
                    : { lat: 0, lng: 0 },
                map: point.hasCoordinates && point.lat !== null && point.lng !== null ? map : null,
                icon: svgMarker,
                title: `${point.childName} - ${point.type === 'pickup' ? 'Odbiór' : 'Dowóz'}${
                    point.isNew ? ' (NOWY)' : ''
                }\nKliknij aby zmienić kolejność\nAktualnie: pozycja ${point.order}`,
                zIndex: point.isNew ? 2000 : 1000,
            });

            markerDataMap.current.set(marker, { ...point });

            marker.addListener('click', () => {
                const pointData = markerDataMap.current.get(marker);

                if (!pointData || !onMarkerClick) {
                    return;
                }

                const mapDiv = map.getDiv();
                const bounds = mapDiv.getBoundingClientRect();

                const screenX = bounds.left + bounds.width / 2;
                const screenY = bounds.top + bounds.height / 2 - 100;

                onMarkerClick(pointData, { x: screenX, y: screenY });
            });

            markersRef.current.push(marker);
        });

        hasInitializedRef.current = true;

        return () => {
            markersRef.current.forEach(marker => {
                google.maps.event.clearInstanceListeners(marker);
                marker.setMap(null);
            });
            markersRef.current = [];
            markerDataMap.current.clear();
            hasInitializedRef.current = false;
        };
    }, [map, onMarkerClick, points, originalChildIndexMap]);

    useEffect(() => {
        if (!map || !window.google || !hasInitializedRef.current) return;
        if (markersRef.current.length !== points.length) return;

        points.forEach((point, index) => {
            const marker = markersRef.current[index];
            if (!marker) {
                return;
            }

            markerDataMap.current.set(marker, { ...point });

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
                    <svg xmlns="http://www.w3.org/2000/svg" width="44" height="50" viewBox="0 0 44 50">
                        <circle cx="22" cy="22" r="18" fill="${markerColor}" stroke="white" stroke-width="3"/>
                        ${
                    point.isNew
                        ? '<circle cx="36" cy="8" r="6" fill="#f59e0b" stroke="white" stroke-width="2"/>'
                        : ''
                }
                        <text x="22" y="22" font-family="Arial, sans-serif" font-size="11" font-weight="bold" 
                              fill="white" text-anchor="middle" dominant-baseline="central">${label}</text>
                        <rect x="14" y="38" width="16" height="12" rx="6" fill="white" stroke="${markerColor}" stroke-width="2"/>
                        <text x="22" y="44" font-family="Arial, sans-serif" font-size="9" font-weight="bold" 
                              fill="${markerColor}" text-anchor="middle" dominant-baseline="middle">${point.order}</text>
                    </svg>
                `)}`,
                scaledSize: new google.maps.Size(44, 50),
                anchor: new google.maps.Point(22, 25),
            };

            marker.setIcon(svgMarker);
            marker.setTitle(`${point.childName} - ${point.type === 'pickup' ? 'Odbiór' : 'Dowóz'}${
                point.isNew ? ' (NOWY)' : ''
            }\nKliknij aby zmienić kolejność\nAktualnie: pozycja ${point.order}`);
        });
    }, [points, originalChildIndexMap, map]);

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