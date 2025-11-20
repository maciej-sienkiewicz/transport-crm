// src/features/routes/components/RouteMapModal/hooks/useMapModal.ts
import { useState, useEffect, useMemo, useCallback } from 'react';
import { RoutePoint } from '../utils/types';
import { getChildIndexMap } from '../utils/pointLabels';
import { validatePointsOrder, calculateRouteStats } from '../utils/validation';
import { useMapSetup } from './useMapSetup';
import { usePointsReorder } from './usePointsReorder';

export const useMapModal = (
    isOpen: boolean,
    points: RoutePoint[],
    onSaveOrder?: (newPoints: RoutePoint[]) => void,
    onClose?: () => void
) => {
    const { center, zoom, mapKey } = useMapSetup(isOpen, points);
    const {
        editedPoints,
        displayedPoints,
        hasChanges,
        needsRefresh,
        resetPoints,
        movePointUp,
        movePointDown,
        refreshMap,
        setHasChanges,
        setNeedsRefresh,
    } = usePointsReorder(points);

    const originalChildIndexMap = useMemo(() => {
        return getChildIndexMap(points);
    }, [isOpen]);

    const validation = useMemo(() => validatePointsOrder(editedPoints), [editedPoints]);
    const stats = useMemo(() => calculateRouteStats(editedPoints), [editedPoints]);

    useEffect(() => {
        if (isOpen) {
            console.log('🗺️ Modal otwarty z', points.length, 'punktami');
            resetPoints(points);
        }
    }, [isOpen, points, resetPoints]);

    const handleSave = useCallback(() => {
        if (!validation.isValid) {
            console.log('❌ Walidacja nie przeszła');
            return;
        }

        if (onSaveOrder) {
            console.log('✅ Zapisuję nową kolejność punktów');
            onSaveOrder(editedPoints);
        }

        setHasChanges(false);
        setNeedsRefresh(false);
        onClose?.();
    }, [validation.isValid, onSaveOrder, editedPoints, onClose, setHasChanges, setNeedsRefresh]);

    const handleCancel = useCallback(() => {
        console.log('❌ Anulowanie zmian');
        resetPoints(points);
        onClose?.();
    }, [points, onClose, resetPoints]);

    const handleRefreshMap = useCallback(() => {
        if (validation.isValid) {
            console.log('🔄 Odświeżanie trasy na mapie');
            refreshMap();
        }
    }, [validation.isValid, refreshMap]);

    return {
        // Map setup
        center,
        zoom,
        mapKey,

        // Points state
        editedPoints,
        displayedPoints,
        hasChanges,
        needsRefresh,

        // Metadata
        originalChildIndexMap,
        validation,
        stats,

        // Actions
        movePointUp,
        movePointDown,
        handleRefreshMap,
        handleSave,
        handleCancel,
    };
};