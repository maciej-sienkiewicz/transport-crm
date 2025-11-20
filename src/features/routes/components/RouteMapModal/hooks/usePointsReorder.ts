// src/features/routes/components/RouteMapModal/hooks/usePointsReorder.ts
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
        console.log(`🔄 movePointToOrder wywołane: stopId=${stopId}, newOrder=${newOrderNumber}`);

        setEditedPoints(prev => {
            const currentIndex = prev.findIndex(p => p.stopId === stopId);

            if (currentIndex === -1) {
                console.error('❌ Nie znaleziono punktu o stopId:', stopId);
                console.log('📋 Dostępne punkty:', prev.map((p, i) => ({
                    index: i,
                    stopId: p.stopId,
                    childName: p.childName,
                    type: p.type,
                    order: p.order,
                })));
                return prev;
            }

            const targetOrder = Math.max(1, Math.min(newOrderNumber, prev.length));
            const targetIndex = targetOrder - 1;

            console.log(`📊 currentIndex: ${currentIndex}, targetIndex: ${targetIndex}`);
            console.log(`📊 current order: ${prev[currentIndex].order}, target order: ${targetOrder}`);

            if (currentIndex === targetIndex) {
                console.log('⚠️ Punkt już jest na tej pozycji (indeks się nie zmienia)');
                return prev;
            }

            console.log(`✅ Przenoszę punkt z indeksu ${currentIndex} na ${targetIndex}`);

            const newPoints = [...prev];
            const [movedPoint] = newPoints.splice(currentIndex, 1);
            newPoints.splice(targetIndex, 0, movedPoint);

            newPoints.forEach((point, idx) => {
                point.order = idx + 1;
            });

            console.log('📋 Nowa kolejność:', newPoints.map(p => `${p.childName}(${p.type}): order=${p.order}`));

            return newPoints;
        });

        setHasChanges(true);
        setNeedsRefresh(true);
    }, []);

    const refreshMap = useCallback(() => {
        console.log('🔄 refreshMap - kopiuję editedPoints do displayedPoints');
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