// src/features/routes/components/RouteDetail/RouteDetail.tsx

import React, { useState } from 'react';
import styled from 'styled-components';
import { Trash2, Map as MapIcon, Plus } from 'lucide-react';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { Button } from '@/shared/ui/Button';
import { useRouteDetailLogic } from '../../hooks/useRouteDetailLogic';
import { RouteMapTile } from './RouteMapTile';
import { RouteDetailTabs } from './RouteDetailTabs';
import { RouteTimeline } from './RouteTimeline';
import { AddChildToRouteModal } from '../AddChildToRouteModal/AddChildToRouteModal';
import { EditStopModal } from '../EditStopModal/EditStopModal';
import { StopContextMenu } from '../StopContextMenu/StopContextMenu';
import { RouteStop } from '../../types';
import toast from 'react-hot-toast';
import {useDeleteScheduleFromRoute} from "@/features/routes/hooks/useDeleteScheduleFromRoute.ts";
import {RouteMapModal} from "@/features/routes/components/RouteMapModal/RouteMapModal.tsx";
import { CreateSeriesModal } from '../CreateSeriesModal';

const RouteDetailContainer = styled.div`
    max-width: 1600px;
    margin: 0 auto;
    padding: ${({ theme }) => theme.spacing.xl};
    padding-top: 0;
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.lg};
`;

const MainLayoutGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 500px;
    gap: ${({ theme }) => theme.spacing.xl};
    align-items: start;

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        grid-template-columns: 1fr;
    }
`;

const TimelineSection = styled.div`
    background: white;
    border-radius: ${({ theme }) => theme.borderRadius['2xl']};
    border: 1px solid ${({ theme }) => theme.colors.slate[200]};
    box-shadow: ${({ theme }) => theme.shadows.sm};
    overflow: hidden;
    display: flex;
    flex-direction: column;
`;

const TimelineHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
    border-bottom: 1px solid ${({ theme }) => theme.colors.slate[200]};
    background: ${({ theme }) => theme.gradients.cardHeader};
    gap: ${({ theme }) => theme.spacing.md};
    flex-wrap: wrap;

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        padding: ${({ theme }) => theme.spacing.md};
    }
`;

const TimelineTitle = styled.h2`
    font-size: 1.25rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.slate[900]};

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        font-size: 1.125rem;
    }
`;

const HeaderActions = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.sm};
    flex-wrap: wrap;

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        width: 100%;

        button {
            flex: 1;
            min-width: 0;
        }
    }
`;

const TimelineContent = styled.div`
    height: 450px;
    overflow-y: auto;
    padding: ${({ theme }) => theme.spacing.xl};

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        height: 400px;
    }

    &::-webkit-scrollbar {
        width: 8px;
    }

    &::-webkit-scrollbar-track {
        background: ${({ theme }) => theme.colors.slate[50]};
        border-radius: ${({ theme }) => theme.borderRadius.sm};
    }

    &::-webkit-scrollbar-thumb {
        background: linear-gradient(
                to bottom,
                ${({ theme }) => theme.colors.slate[300]},
                ${({ theme }) => theme.colors.slate[400]}
        );
        border-radius: ${({ theme }) => theme.borderRadius.sm};

        &:hover {
            background: linear-gradient(
                    to bottom,
                    ${({ theme }) => theme.colors.slate[400]},
                    ${({ theme }) => theme.colors.slate[500]}
            );
        }
    }
`;

interface RouteDetailProps {
    id: string;
}

export const RouteDetail: React.FC<RouteDetailProps> = ({ id }) => {
    const {
        route,
        isLoading,
        displayStops,
        mapPoints,
        defaultMapCenter,
        handleMarkerClick,
        setMap,
        hoveredStopId,
        activeTab,
        setActiveTab,
        uniqueChildrenCount,
        childrenSummary,
        isMapModalOpen,
        handleOpenMapModal,
        handleCloseMapModal,
        handleSaveOrderFromMap,
        handleDriverClick,
        handleVehicleClick,
        handleChildClick,
        handleStopHover,
        handleStopClick,
        activeStopId,
        stopRefs,
        API_KEY,
        handleDeleteRoute,
        isDeletingRoute,
        isCreateSeriesModalOpen,
        handleCreateSeries,
        handleCloseCreateSeriesModal,
    } = useRouteDetailLogic(id);

    const [isAddChildModalOpen, setIsAddChildModalOpen] = useState(false);
    const [isEditStopModalOpen, setIsEditStopModalOpen] = useState(false);
    const [contextMenu, setContextMenu] = useState<{
        x: number;
        y: number;
        stop: RouteStop;
    } | null>(null);
    const [selectedStop, setSelectedStop] = useState<RouteStop | null>(null);

    const deleteSchedule = useDeleteScheduleFromRoute();

    const handleStopContextMenu = (e: React.MouseEvent, stop: RouteStop) => {
        e.preventDefault();
        e.stopPropagation();

        if (stop.isCancelled || stop.executionStatus) {
            toast.error('Nie można edytować anulowanego lub wykonanego stopu');
            return;
        }

        setContextMenu({
            x: e.clientX,
            y: e.clientY,
            stop,
        });
    };

    const handleEditStop = () => {
        if (contextMenu) {
            setSelectedStop(contextMenu.stop);
            setIsEditStopModalOpen(true);
            setContextMenu(null);
        }
    };

    const handleDeleteStop = async () => {
        if (!contextMenu || !route) return;

        const stop = contextMenu.stop;
        setContextMenu(null);

        const confirmDelete = window.confirm(
            `Czy na pewno chcesz usunąć dziecko "${stop.childFirstName} ${stop.childLastName}" z trasy? 
      
Zostaną usunięte oba punkty (odbiór i dowóz).`
        );

        if (!confirmDelete) return;

        try {
            await deleteSchedule.mutateAsync({
                routeId: route.id,
                scheduleId: stop.scheduleId,
            });
        } catch (error) {
            console.error('Error deleting schedule:', error);
        }
    };

    const maxStopOrder = displayStops.length > 0
        ? Math.max(...displayStops.map((s) => s.stopOrder))
        : 0;

    if (isLoading || !route) {
        return <LoadingSpinner />;
    }

    const showActionButtons = route.status === 'PLANNED';

    return (
        <RouteDetailContainer>
            <MainLayoutGrid>
                <TimelineSection>
                    <TimelineHeader>
                        <TimelineTitle>{route.routeName}</TimelineTitle>

                        {showActionButtons && (
                            <HeaderActions>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => setIsAddChildModalOpen(true)}
                                >
                                    <Plus size={16} />
                                    Dodaj dziecko
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={handleOpenMapModal}
                                >
                                    <MapIcon size={16} />
                                    Edytuj kolejność
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={handleDeleteRoute}
                                    isLoading={isDeletingRoute}
                                    disabled={isDeletingRoute}
                                >
                                    <Trash2 size={16} />
                                    Usuń trasę
                                </Button>
                            </HeaderActions>
                        )}
                    </TimelineHeader>

                    <TimelineContent>
                        <RouteTimeline
                            displayStops={displayStops}
                            isEditMode={false}
                            stopRefs={stopRefs}
                            activeStopId={activeStopId}
                            handleChildClick={handleChildClick}
                            handleStopHover={handleStopHover}
                            handleStopClick={handleStopClick}
                            handleStopContextMenu={handleStopContextMenu}
                            canEditStops={showActionButtons}
                        />
                    </TimelineContent>
                </TimelineSection>

                <RouteMapTile
                    mapPoints={mapPoints}
                    defaultMapCenter={defaultMapCenter}
                    onMarkerClick={handleMarkerClick}
                    setMap={setMap}
                    hoveredStopId={hoveredStopId}
                    displayStops={displayStops}
                    API_KEY={API_KEY}
                />
            </MainLayoutGrid>

            <RouteDetailTabs
                route={route}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                displayStops={displayStops}
                childrenSummary={childrenSummary}
                uniqueChildrenCount={uniqueChildrenCount}
                isEditMode={false}
                stopRefs={stopRefs}
                activeStopId={activeStopId}
                handleChildClick={handleChildClick}
                handleStopHover={handleStopHover}
                handleStopClick={handleStopClick}
                handleEditModeToggle={handleOpenMapModal}
                handleSaveOrder={() => {}}
                handleCancelEdit={() => {}}
                handleDriverClick={handleDriverClick}
                handleVehicleClick={handleVehicleClick}
                handleDeleteRoute={handleDeleteRoute}
                isDeletingRoute={isDeletingRoute}
                handleCreateSeries={handleCreateSeries}
            />

            {route.stops.length > 0 && (
                <RouteMapModal
                    isOpen={isMapModalOpen}
                    onClose={handleCloseMapModal}
                    routeName={route.routeName}
                    points={mapPoints}
                    apiKey={API_KEY}
                    onSaveOrder={handleSaveOrderFromMap}
                />
            )}

            <AddChildToRouteModal
                isOpen={isAddChildModalOpen}
                onClose={() => setIsAddChildModalOpen(false)}
                routeId={route.id}
                routeDate={route.date}
                maxStopOrder={maxStopOrder}
            />

            <EditStopModal
                isOpen={isEditStopModalOpen}
                onClose={() => {
                    setIsEditStopModalOpen(false);
                    setSelectedStop(null);
                }}
                routeId={route.id}
                stop={selectedStop}
            />

            {contextMenu && (
                <StopContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    onEdit={handleEditStop}
                    onDelete={handleDeleteStop}
                    onClose={() => setContextMenu(null)}
                />
            )}

            {route && (
                <CreateSeriesModal
                    isOpen={isCreateSeriesModalOpen}
                    onClose={handleCloseCreateSeriesModal}
                    route={route}
                />
            )}
        </RouteDetailContainer>
    );
};