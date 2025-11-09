// /routes/components/RouteDetail/RouteDetail.tsx

import React from 'react';
import styled from 'styled-components';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { useRouteDetailLogic } from './../../hooks/useRouteDetailLogic';
import {RouteDetailHeader} from "@/features/routes/components/RouteDetail/RouteDetailHeader.tsx";
import {RouteMapTile} from "@/features/routes/components/RouteDetail/RouteMapTile.tsx";
import {RouteDetailTabs} from "@/features/routes/components/RouteDetail/RouteDetailTabs.tsx";

const RouteDetailContainer = styled.div`
    max-width: 1600px;
    margin: 0 auto;
    padding: ${({ theme }) => theme.spacing.xl};
    padding-top: 0; 
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.lg};
`;

const TopLayoutGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 500px; /* Lewa kolumna na info, Prawa na mapę */
    gap: ${({ theme }) => theme.spacing.xl};
    align-items: start;

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        grid-template-columns: 1fr; /* Na mniejszych ekranach mapa pod spodem */
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
        isEditMode,
        handleEditModeToggle,
        handleSaveOrder,
        handleCancelEdit,
        handleDriverClick,
        handleVehicleClick,
        handleChildClick,
        handleStopHover,
        handleStopClick,
        activeStopId,
        stopRefs,
        API_KEY,
    } = useRouteDetailLogic(id);

    if (isLoading || !route) {
        return <LoadingSpinner />;
    }

    return (
        <RouteDetailContainer>
            <TopLayoutGrid>
                {/* 1. NAGŁÓWEK + AKCJE */}
                <RouteDetailHeader
                    route={route}
                    isEditMode={isEditMode}
                    onEditToggle={handleEditModeToggle}
                    onSave={handleSaveOrder}
                    onCancel={handleCancelEdit}
                    onDriverClick={handleDriverClick}
                    onVehicleClick={handleVehicleClick}
                />

                <RouteMapTile
                    mapPoints={mapPoints}
                    defaultMapCenter={defaultMapCenter}
                    onMarkerClick={handleMarkerClick}
                    setMap={setMap}
                    hoveredStopId={hoveredStopId}
                    displayStops={displayStops}
                    API_KEY={API_KEY}
                />
            </TopLayoutGrid>

            <RouteDetailTabs
                route={route}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                displayStops={displayStops}
                childrenSummary={childrenSummary}
                uniqueChildrenCount={uniqueChildrenCount}
                isEditMode={isEditMode}
                stopRefs={stopRefs}
                activeStopId={activeStopId}
                handleChildClick={handleChildClick}
                handleStopHover={handleStopHover}
                handleStopClick={handleStopClick}
            />
        </RouteDetailContainer>
    );
};