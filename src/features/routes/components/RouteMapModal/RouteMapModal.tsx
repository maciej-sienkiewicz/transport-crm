// src/features/routes/components/RouteMapModal/RouteMapModal.tsx
import React, { useCallback } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import { X, Navigation } from 'lucide-react';
import {
    Overlay,
    ModalContainer,
    ModalHeader,
    ModalTitle,
    CloseButton,
    ModalBody,
    MapContainer,
} from './RouteMapModal.styles';
import { MapView } from './components/MapView/MapView';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Footer } from './components/Footer/Footer';
import { StopNumberEditor } from './components/StopNumberEditor/StopNumberEditor';
import { RouteMapModalProps, RoutePoint } from './utils/types';
import { useMapModal } from './hooks/useMapModal';

export const RouteMapModal: React.FC<RouteMapModalProps> = ({
                                                                isOpen,
                                                                onClose,
                                                                routeName,
                                                                points,
                                                                apiKey,
                                                                onSaveOrder,
                                                            }) => {
    const {
        center,
        zoom,
        mapKey,
        editedPoints,
        displayedPoints,
        hasChanges,
        needsRefresh,
        originalChildIndexMap,
        validation,
        stats,
        editorState,
        movePointUp,
        movePointDown,
        handleRefreshMap,
        handleSave,
        handleCancel,
        openEditor,
        closeEditor,
        updateNewOrder,
        handleConfirmNewOrder,
    } = useMapModal(isOpen, points, onSaveOrder, onClose);

    const handleOverlayClick = useCallback(
        (e: React.MouseEvent) => {
            if (e.target === e.currentTarget) {
                onClose();
            }
        },
        [onClose]
    );

    const handleMarkerClick = useCallback(
        (point: RoutePoint, screenPosition: { x: number; y: number }) => {
            openEditor(point, screenPosition);
        },
        [openEditor]
    );

    const validPoints = displayedPoints.filter(
        (p) => p.hasCoordinates && p.lat !== null && p.lng !== null
    );
    const hasValidPoints = validPoints.length >= 2;

    if (!isOpen) return null;

    return (
        <APIProvider apiKey={apiKey}>
            <Overlay $isOpen={isOpen} onClick={handleOverlayClick}>
                <ModalContainer onClick={(e) => e.stopPropagation()}>
                    <ModalHeader>
                        <ModalTitle>
                            <Navigation size={24} />
                            {routeName}
                        </ModalTitle>
                        <CloseButton onClick={handleCancel}>
                            <X size={20} />
                        </CloseButton>
                    </ModalHeader>

                    <ModalBody>
                        <MapContainer>
                            <MapView
                                mapKey={mapKey}
                                center={center}
                                zoom={zoom}
                                displayedPoints={displayedPoints}
                                originalChildIndexMap={originalChildIndexMap}
                                hasValidPoints={hasValidPoints}
                                onMarkerClick={handleMarkerClick}
                            />
                        </MapContainer>

                        <Sidebar
                            editedPoints={editedPoints}
                            stats={stats}
                            validation={validation}
                            needsRefresh={needsRefresh}
                            originalChildIndexMap={originalChildIndexMap}
                            onRefreshMap={handleRefreshMap}
                            onMoveUp={movePointUp}
                            onMoveDown={movePointDown}
                        />
                    </ModalBody>

                    <Footer
                        hasChanges={hasChanges}
                        validation={validation}
                        onSave={handleSave}
                        onCancel={handleCancel}
                    />
                </ModalContainer>

                {/* Editor numeracji stopu */}
                <StopNumberEditor
                    editorState={editorState}
                    maxOrder={editedPoints.length}
                    onConfirm={handleConfirmNewOrder}
                    onCancel={closeEditor}
                    onUpdateValue={updateNewOrder}
                />
            </Overlay>
        </APIProvider>
    );
};