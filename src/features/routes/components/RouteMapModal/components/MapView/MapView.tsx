// src/features/routes/components/RouteMapModal/components/MapView/MapView.tsx
import React from 'react';
import { Map } from '@vis.gl/react-google-maps';
import { AlertCircle } from 'lucide-react';
import { RouteRenderer } from './RouteRenderer';
import { RoutePoint } from '../../utils/types';

interface MapViewProps {
    mapKey: number;
    center: { lat: number; lng: number };
    zoom: number;
    displayedPoints: RoutePoint[];
    originalChildIndexMap: Record<string, number>;
    hasValidPoints: boolean;
}

export const MapView: React.FC<MapViewProps> = ({
                                                    mapKey,
                                                    center,
                                                    zoom,
                                                    displayedPoints,
                                                    originalChildIndexMap,
                                                    hasValidPoints,
                                                }) => {
    if (!hasValidPoints) {
        return (
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    padding: '2rem',
                    textAlign: 'center',
                    color: '#64748b',
                }}
            >
                <div>
                    <AlertCircle
                        size={48}
                        style={{ margin: '0 auto 1rem', color: '#f59e0b' }}
                    />
                    <p
                        style={{
                            fontSize: '1rem',
                            fontWeight: 600,
                            marginBottom: '0.5rem',
                        }}
                    >
                        Nie można wyświetlić trasy
                    </p>
                    <p style={{ fontSize: '0.875rem' }}>
                        Co najmniej 2 punkty muszą mieć współrzędne GPS
                    </p>
                </div>
            </div>
        );
    }

    return (
        <Map
            key={mapKey}
            defaultCenter={center}
            defaultZoom={zoom}
            gestureHandling="greedy"
            disableDefaultUI={false}
            mapId="route-map"
        >
            <RouteRenderer
                points={displayedPoints}
                originalChildIndexMap={originalChildIndexMap}
            />
        </Map>
    );
};