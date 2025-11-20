// src/features/routes/components/RouteMapModal/hooks/useMapModal.ts
import { useEffect, useMemo, useCallback, useRef } from 'react';
import { RoutePoint } from '../utils/types';
import { getChildIndexMap } from '../utils/pointLabels';
import { validatePointsOrder, calculateRouteStats } from '../utils/validation';
import { useMapSetup } from './useMapSetup';
import { usePointsReorder } from './usePointsReorder';
import { useStopNumberEditor } from './useStopNumberEditor';

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
        movePointToOrder,
        refreshMap,
        setHasChanges,
        setNeedsRefresh,
    } = usePointsReorder(points);

    const {
        editorState,
        openEditor,
        closeEditor,
        updateNewOrder,
    } = useStopNumberEditor();

    // REF do zapobiegania podwójnemu wykonaniu
    const isConfirmingRef = useRef(false);

    const originalChildIndexMap = useMemo(() => {
        return getChildIndexMap(points);
    }, [isOpen]);

    const validation = useMemo(() => validatePointsOrder(editedPoints), [editedPoints]);
    const stats = useMemo(() => calculateRouteStats(editedPoints), [editedPoints]);

    useEffect(() => {
        if (isOpen) {
            console.log('🗺️ Modal otwarty z', points.length, 'punktami');
            resetPoints(points);
            isConfirmingRef.current = false; // Reset przy otwarciu
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
        closeEditor();
        isConfirmingRef.current = false;
        onClose?.();
    }, [points, onClose, resetPoints, closeEditor]);

    const handleRefreshMap = useCallback(() => {
        if (validation.isValid) {
            console.log('🔄 Odświeżanie trasy na mapie');
            refreshMap();
        }
    }, [validation.isValid, refreshMap]);

    // POPRAWIONA FUNKCJA - z zabezpieczeniem przed podwójnym wywołaniem
    const handleConfirmNewOrder = useCallback(() => {
        // Zabezpieczenie przed podwójnym wywołaniem
        if (isConfirmingRef.current) {
            console.log('⚠️ handleConfirmNewOrder już się wykonuje, pomijam');
            return;
        }

        if (!editorState.point || editorState.newOrder === '') {
            console.log('⚠️ Brak punktu lub pustą wartość, zamykam edytor');
            closeEditor();
            return;
        }

        const newOrderNumber = parseInt(editorState.newOrder, 10);

        if (isNaN(newOrderNumber) || newOrderNumber < 1 || newOrderNumber > editedPoints.length) {
            console.error('❌ Nieprawidłowy numer:', newOrderNumber);
            closeEditor();
            return;
        }

        console.log(`✅ handleConfirmNewOrder: stopId=${editorState.point.stopId}, newOrder=${newOrderNumber}`);

        // Ustaw flagę
        isConfirmingRef.current = true;

        try {
            movePointToOrder(editorState.point.stopId, newOrderNumber);
            closeEditor();
        } finally {
            // Reset flagi po krótkiej chwili (żeby zdążyły się wykonać wszystkie side effects)
            setTimeout(() => {
                isConfirmingRef.current = false;
            }, 100);
        }
    }, [editorState, editedPoints.length, movePointToOrder, closeEditor]);

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

        // Editor state
        editorState,

        // Actions
        movePointUp,
        movePointDown,
        handleRefreshMap,
        handleSave,
        handleCancel,
        openEditor,
        closeEditor,
        updateNewOrder,
        handleConfirmNewOrder,
    };
};