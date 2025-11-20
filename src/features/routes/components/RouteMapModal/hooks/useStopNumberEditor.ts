// src/features/routes/components/RouteMapModal/hooks/useStopNumberEditor.ts
import { useState, useCallback } from 'react';
import { RoutePoint, StopNumberEditorState } from '../utils/types';

export const useStopNumberEditor = () => {
    const [editorState, setEditorState] = useState<StopNumberEditorState>({
        isOpen: false,
        point: null,
        currentOrder: 0,
        newOrder: '',
        position: null,
    });

    const openEditor = useCallback((point: RoutePoint, screenPosition: { x: number; y: number }) => {
        console.log('📝 Otwieranie edytora dla punktu:', {
            childName: point.childName,
            stopId: point.stopId,
            scheduleId: point.scheduleId,
            order: point.order,
            type: point.type,
        });

        setEditorState({
            isOpen: true,
            point: { ...point }, // KLUCZOWE: Twórz kopię punktu
            currentOrder: point.order,
            newOrder: point.order.toString(),
            position: screenPosition,
        });
    }, []);

    const closeEditor = useCallback(() => {
        console.log('❌ Zamykanie edytora');
        setEditorState({
            isOpen: false,
            point: null,
            currentOrder: 0,
            newOrder: '',
            position: null,
        });
    }, []);

    const updateNewOrder = useCallback((value: string) => {
        // Pozwól tylko na cyfry
        if (value === '' || /^\d+$/.test(value)) {
            setEditorState(prev => ({ ...prev, newOrder: value }));
        }
    }, []);

    return {
        editorState,
        openEditor,
        closeEditor,
        updateNewOrder,
    };
};