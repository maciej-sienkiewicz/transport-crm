// /routes/components/RouteDetail/RouteMapTile/RouteMapTile.tsx

import React from 'react';
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
                                                              mapPoints,
                                                              defaultMapCenter,
                                                              onMarkerClick,
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
                    defaultZoom={12}
                    mapId="route-cockpit-map"
                    style={{ width: '100%', height: '100%' }}
                    gestureHandling="greedy"
                    disableDefaultUI={true}
                >
                    <MapInstance setMap={setMap} />
                </MapUI>
            </APIProvider>
        </MapTileContainer>
    );
};