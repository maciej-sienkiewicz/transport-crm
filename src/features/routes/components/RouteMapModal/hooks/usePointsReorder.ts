import { useState, useCallback } from 'react';
import { RoutePoint } from '../utils/types';

export const usePointsReorder = (initialPoints: RoutePoint[]) => {
    const [editedPoints, setEditedPoints] = useState<RoutePoint[]>(initialPoints);
    const [displayedPoints, setDisplayedPoints] = useState<RoutePoint[]>(initialPoints);
    const [hasChanges, setHasChanges] = useState(false);
    const [needsRefresh, setNeedsRefresh] = useState(false);

    const resetPoints = useCallback((points: RoutePoint[]) => {
        const hasNewPoints = points.some(p => p.isNew);
        setEditedPoints(points);
        setDisplayedPoints(points);
        setHasChanges(hasNewPoints);
        setNeedsRefresh(false);
    }, []);

    const movePointUp = useCallback((index: number) => {
        if (index === 0) return;

        setEditedPoints(prev => {
            const newPoints = [...prev];
            [newPoints[index - 1], newPoints[index]] = [newPoints[index], newPoints[index - 1]];

            newPoints.forEach((point, idx) => {
                point.order = idx + 1;
            });

            return newPoints;
        });

        setHasChanges(true);
        setNeedsRefresh(true);
    }, []);

    const movePointDown = useCallback((index: number) => {
        setEditedPoints(prev => {
            if (index === prev.length - 1) return prev;

            const newPoints = [...prev];
            [newPoints[index], newPoints[index + 1]] = [newPoints[index + 1], newPoints[index]];

            newPoints.forEach((point, idx) => {
                point.order = idx + 1;
            });

            return newPoints;
        });

        setHasChanges(true);
        setNeedsRefresh(true);
    }, []);

    const movePointToOrder = useCallback((stopId: string, newOrderNumber: number) => {
        setEditedPoints(prev => {
            const currentIndex = prev.findIndex(p => p.stopId === stopId);

            if (currentIndex === -1) {
                return prev;
            }

            const targetOrder = Math.max(1, Math.min(newOrderNumber, prev.length));
            const targetIndex = targetOrder - 1;

            if (currentIndex === targetIndex) {
                return prev;
            }

            const newPoints = [...prev];
            const [movedPoint] = newPoints.splice(currentIndex, 1);
            newPoints.splice(targetIndex, 0, movedPoint);

            newPoints.forEach((point, idx) => {
                point.order = idx + 1;
            });

            return newPoints;
        });

        setHasChanges(true);
        setNeedsRefresh(true);
    }, []);

    const refreshMap = useCallback(() => {
        setDisplayedPoints([...editedPoints]);
        setNeedsRefresh(false);
    }, [editedPoints]);

    return {
        editedPoints,
        displayedPoints,
        hasChanges,
        needsRefresh,
        resetPoints,
        movePointUp,
        movePointDown,
        movePointToOrder,
        refreshMap,
        setHasChanges,
        setNeedsRefresh,
    };
};