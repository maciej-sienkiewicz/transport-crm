// src/features/routes/components/RouteDetail/RouteMapTile.tsx

import React, { useEffect } from 'react';
import {
    APIProvider,
    Map as MapUI,
    useMap,
} from '@vis.gl/react-google-maps';
import { RouteStop } from '../../types';
import { MapTileContainer } from './RouteMapTile.styles';

interface MapInstanceProps {
    setMap: (map: google.maps.Map) => void;
}

const MapInstance: React.FC<MapInstanceProps> = ({ setMap }) => {
    const map = useMap();
    React.useEffect(() => {
        if (map) setMap(map);
    }, [map, setMap]);
    return null;
};

interface MapPoint {
    address: string;
    lat: number;
    lng: number;
    type: 'pickup' | 'dropoff';
    childName: string;
    order: number;
    hasCoordinates: boolean;
}

// Komponent renderujący trasę na mapie
const RouteRenderer: React.FC<{
    displayStops: RouteStop[];
    hoveredStopId: string | null;
}> = ({ displayStops, hoveredStopId }) => {
    const map = useMap();

    useEffect(() => {
        if (!map || !window.google) return;

        // Filtrujemy tylko stopy z współrzędnymi
        const validStops = displayStops.filter(
            (s) => s.address.latitude != null && s.address.longitude != null
        );

        if (validStops.length < 2) return;

        const directionsService = new google.maps.DirectionsService();

        // Tablica do przechowywania elementów do wyczyszczenia
        const markers: google.maps.Marker[] = [];
        let polyline: google.maps.Polyline | null = null;

        // Przygotuj waypoints (wszystkie punkty oprócz pierwszego i ostatniego)
        const waypoints = validStops.slice(1, -1).map((stop) => ({
            location: new google.maps.LatLng(stop.address.latitude!, stop.address.longitude!),
            stopover: true,
        }));

        // Wyznacz trasę
        directionsService.route(
            {
                origin: new google.maps.LatLng(validStops[0].address.latitude!, validStops[0].address.longitude!),
                destination: new google.maps.LatLng(
                    validStops[validStops.length - 1].address.latitude!,
                    validStops[validStops.length - 1].address.longitude!
                ),
                waypoints,
                travelMode: google.maps.TravelMode.DRIVING,
                optimizeWaypoints: false,
            },
            (result, status) => {
                if (status === google.maps.DirectionsStatus.OK && result) {
                    // Narysuj linię trasy
                    const path = result.routes[0].overview_path;
                    polyline = new google.maps.Polyline({
                        path: path,
                        geodesic: true,
                        strokeColor: '#2563eb',
                        strokeOpacity: 0.8,
                        strokeWeight: 5,
                        map: map,
                    });

                    // Dodaj markery dla każdego stopu
                    displayStops.forEach((stop, index) => {
                        if (stop.address.latitude == null || stop.address.longitude == null) {
                            return;
                        }

                        const isPickup = stop.stopType === 'PICKUP';
                        const isCancelled = stop.isCancelled;
                        const isExecuted = stop.actualTime != null;
                        const isHovered = hoveredStopId === stop.id;

                        // Określ kolor markera
                        let markerColor = isPickup ? '#2563eb' : '#10b981';
                        if (isCancelled) markerColor = '#dc2626';
                        else if (isExecuted) markerColor = '#059669';

                        const size = isHovered ? 50 : 40;
                        const zIndex = isHovered ? 2000 : 1000 + index;

                        // Tworzymy SVG marker jako data URL
                        const svgMarker = {
                            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                                <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
                                    <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 3}" fill="${markerColor}" stroke="white" stroke-width="3"/>
                                    <text x="${size/2}" y="${size/2}" font-family="Arial, sans-serif" font-size="14" font-weight="bold" 
                                          fill="white" text-anchor="middle" dominant-baseline="central">${stop.stopOrder}</text>
                                </svg>
                            `)}`,
                            scaledSize: new google.maps.Size(size, size),
                            anchor: new google.maps.Point(size/2, size/2),
                        };

                        const marker = new google.maps.Marker({
                            position: { lat: stop.address.latitude, lng: stop.address.longitude },
                            map: map,
                            icon: svgMarker,
                            title: `${stop.childFirstName} ${stop.childLastName} - ${isPickup ? 'Odbiór' : 'Dowóz'}`,
                            zIndex: zIndex,
                        });

                        markers.push(marker);
                    });

                    console.log(`✅ Trasa wyrenderowana: ${markers.length} markerów`);
                } else {
                    console.error('❌ Błąd wyznaczania trasy:', status);
                }
            }
        );

        return () => {
            // Cleanup
            if (polyline) polyline.setMap(null);
            markers.forEach(marker => marker.setMap(null));
        };
    }, [map, displayStops, hoveredStopId]);

    return null;
};

interface RouteMapTileProps {
    mapPoints: MapPoint[];
    defaultMapCenter: { lat: number; lng: number };
    onMarkerClick: (stop: RouteStop) => void;
    setMap: (map: google.maps.Map | null) => void;
    hoveredStopId: string | null;
    displayStops: RouteStop[];
    API_KEY: string;
}

export const RouteMapTile: React.FC<RouteMapTileProps> = ({
                                                              defaultMapCenter,
                                                              setMap,
                                                              hoveredStopId,
                                                              displayStops,
                                                              API_KEY,
                                                          }) => {
    return (
        <MapTileContainer>
            <APIProvider apiKey={API_KEY}>
                <MapUI
                    defaultCenter={defaultMapCenter}
                    defaultZoom={13}
                    mapId="route-detail-map"
                    style={{ width: '100%', height: '100%' }}
                    gestureHandling="greedy"
                    disableDefaultUI={false}
                >
                    <MapInstance setMap={setMap} />
                    <RouteRenderer
                        displayStops={displayStops}
                        hoveredStopId={hoveredStopId}
                    />
                </MapUI>
            </APIProvider>
        </MapTileContainer>
    );
};