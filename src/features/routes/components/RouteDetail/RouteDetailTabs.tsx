// src/features/routes/components/RouteDetail/RouteDetailTabs.tsx

import React, { RefObject } from 'react';
import { Info, Users, History } from 'lucide-react';
import { TabbedSection, TabsHeader, Tab, TabContent, EmptyState, EmptyIcon, EmptyText } from './RouteDetailTabs.styles';
import { RouteDetail, RouteStop } from '../../types';
import { ActiveTab, ChildSummaryItem } from '../../hooks/useRouteDetailLogic';
import { RouteInfoTab } from './RouteInfoTab';
// Importujemy nowy komponent
import { RouteActivityHistory } from './RouteActivityHistory';

// Komponent dla sekcji Dzieci (niezmieniony, używa placeholdera)
const ChildrenTabContent: React.FC<{
    childrenSummary: ChildSummaryItem[],
    uniqueChildrenCount: number,
    handleChildClick: (id: string) => void
}> = ({ childrenSummary, uniqueChildrenCount, handleChildClick }) => {
    if (uniqueChildrenCount === 0) {
        return (
            <EmptyState>
                <EmptyIcon><Users size={32} /></EmptyIcon>
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

// Interfejs RouteDetailTabsProps (przywrócony)
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

                {/* Nowa implementacja zakładki Historia */}
                {activeTab === 'history' && (
                    <RouteActivityHistory routeId={route.id} />
                )}
            </TabContent>
        </TabbedSection>
    );
};