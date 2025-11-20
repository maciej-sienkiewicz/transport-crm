// src/features/routes/components/RouteMapModal/hooks/useMapSetup.ts
import { useState, useEffect } from 'react';
import { RoutePoint } from '../utils/types.ts';

export const useMapSetup = (isOpen: boolean, points: RoutePoint[]) => {
    const [center, setCenter] = useState({ lat: 52.2297, lng: 21.0122 });
    const [zoom, setZoom] = useState(13);
    const [mapKey, setMapKey] = useState(0);

    useEffect(() => {
        if (!isOpen) return;

        const validPointsForMap = points.filter(
            (p) => p.hasCoordinates && p.lat !== null && p.lng !== null
        );

        if (validPointsForMap.length > 0) {
            const avgLat = validPointsForMap.reduce((sum, p) => sum + p.lat!, 0) / validPointsForMap.length;
            const avgLng = validPointsForMap.reduce((sum, p) => sum + p.lng!, 0) / validPointsForMap.length;

            setCenter({ lat: avgLat, lng: avgLng });

            if (validPointsForMap.length === 2) {
                setZoom(14);
            } else if (validPointsForMap.length <= 5) {
                setZoom(14);
            } else if (validPointsForMap.length <= 10) {
                setZoom(13);
            } else {
                setZoom(12);
            }
        }

        setMapKey(prev => prev + 1);
    }, [isOpen, points]);

    return { center, zoom, mapKey };
};