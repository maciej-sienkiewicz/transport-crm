// src/features/routes/components/RouteDetail/RouteDetailTabs.tsx

import React, { RefObject } from 'react';
import { Info, Users, History, Repeat } from 'lucide-react';
import { TabbedSection, TabsHeader, Tab, TabContent, EmptyState, EmptyIcon, EmptyText } from './RouteDetailTabs.styles';
import { RouteDetail, RouteStop } from '../../types';
import { ActiveTab, ChildSummaryItem } from '../../hooks/useRouteDetailLogic';
import { RouteInfoTab } from './RouteInfoTab';
import { RouteActivityHistory } from './RouteActivityHistory';
import { RouteSeriesTab } from './RouteSeriesTab';

// Komponent dla sekcji Dzieci (placeholder - do późniejszej implementacji)
const ChildrenTabContent: React.FC<{
    childrenSummary: ChildSummaryItem[];
    uniqueChildrenCount: number;
    handleChildClick: (id: string) => void;
}> = ({ uniqueChildrenCount }) => {
    if (uniqueChildrenCount === 0) {
        return (
            <EmptyState>
                <EmptyIcon>
                    <Users size={32} />
                </EmptyIcon>
                <EmptyText>Brak przypisanych dzieci do tej trasy</EmptyText>
            </EmptyState>
        );
    }

    return (
        <div style={{ padding: '1rem', color: '#334155' }}>
            <p>Wyświetlam listę {uniqueChildrenCount} dzieci.</p>
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.5rem' }}>
                (Pełna implementacja listy dzieci będzie dodana w kolejnej iteracji)
            </p>
        </div>
    );
};

// Interfejs RouteDetailTabsProps
interface RouteDetailTabsProps {
    route: RouteDetail;
    activeTab: ActiveTab;
    setActiveTab: (tab: ActiveTab) => void;
    displayStops: RouteStop[];
    childrenSummary: ChildSummaryItem[];
    uniqueChildrenCount: number;
    isEditMode: boolean;
    stopRefs: RefObject<Record<string, HTMLDivElement | null>>;
    activeStopId: string | null;
    handleChildClick: (id: string) => void;
    handleStopHover: (stop: RouteStop) => void;
    handleStopClick: (stop: RouteStop) => void;
    handleEditModeToggle: () => void;
    handleSaveOrder: () => void;
    handleCancelEdit: () => void;
    handleDriverClick: () => void;
    handleVehicleClick: () => void;
    handleDeleteRoute: () => void;
    isDeletingRoute: boolean;
    handleCreateSeries: () => void;
}

export const RouteDetailTabs: React.FC<RouteDetailTabsProps> = ({
                                                                    route,
                                                                    activeTab,
                                                                    setActiveTab,
                                                                    childrenSummary,
                                                                    uniqueChildrenCount,
                                                                    handleChildClick,
                                                                    handleDriverClick,
                                                                    handleVehicleClick,
                                                                    handleCreateSeries,
                                                                }) => {
    return (
        <TabbedSection>
            <TabsHeader>
                <Tab
                    $active={activeTab === 'info'}
                    onClick={() => setActiveTab('info')}
                >
                    <Info size={18} />
                    Informacje
                </Tab>
                <Tab
                    $active={activeTab === 'children'}
                    onClick={() => setActiveTab('children')}
                >
                    <Users size={18} />
                    Dzieci ({uniqueChildrenCount})
                </Tab>
                <Tab
                    $active={activeTab === 'history'}
                    onClick={() => setActiveTab('history')}
                >
                    <History size={18} />
                    Historia
                </Tab>
                <Tab
                    $active={activeTab === 'series'}
                    onClick={() => setActiveTab('series')}
                >
                    <Repeat size={18} />
                    Seria {route.seriesId && '🔁'}
                </Tab>
            </TabsHeader>

            <TabContent>
                {activeTab === 'info' && (
                    <RouteInfoTab
                        route={route}
                        onDriverClick={handleDriverClick}
                        onVehicleClick={handleVehicleClick}
                    />
                )}

                {activeTab === 'children' && (
                    <ChildrenTabContent
                        childrenSummary={childrenSummary}
                        uniqueChildrenCount={uniqueChildrenCount}
                        handleChildClick={handleChildClick}
                    />
                )}

                {activeTab === 'history' && <RouteActivityHistory routeId={route.id} />}

                {activeTab === 'series' && (
                    <RouteSeriesTab route={route} onCreateSeries={handleCreateSeries} />
                )}
            </TabContent>
        </TabbedSection>
    );
};