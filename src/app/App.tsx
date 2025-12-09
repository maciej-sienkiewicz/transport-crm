// src/app/App.tsx - UPDATED with Statistics Module

import React, { useState } from 'react';
import styled from 'styled-components';
import { AppProvider } from './providers/AppProvider';
import { GuardiansListPage } from '@/pages/guardians/GuardiansListPage';
import { GuardianDetailPage } from '@/pages/guardians/GuardianDetailPage';
import { ChildrenListPage } from '@/pages/children/ChildrenListPage';
import { ChildDetailPage } from '@/pages/children/ChildDetailPage';
import { VehiclesListPage } from '@/pages/vehicles/VehiclesListPage';
import { VehicleDetailPage } from '@/pages/vehicles/VehicleDetailPage';
import { DriversListPage } from '@/pages/drivers/DriversListPage';
import { DriverDetailPage } from '@/pages/drivers/DriverDetailPage';
import { RoutesListPage } from '@/pages/routes/RoutesListPage';
import { RouteDetailPage } from '@/pages/routes/RouteDetailPage';
import { CreateRoutePage } from '@/pages/routes/CreateRoutePage';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { AlertsOverviewPage } from '@/pages/alerts/AlertsOverviewPage';
import { UnassignedSchedulesPage } from '@/pages/routes/UnassignedSchedulesPage';
import { RouteSeriesListPage } from '@/pages/routes/RouteSeriesListPage';
import { RouteSeriesDetailPage } from '@/pages/routes/RouteSeriesDetailPage';
import { UserInfo } from '@/widgets/UserInfo/UserInfo';
import { Sidebar } from '@/widgets/Sidebar';

// Statistics Pages
import { DriverPerformancePage } from '@/pages/statistics/DriverPerformancePage';
import { DriverDetailPage as StatDriverDetailPage } from '@/pages/statistics/DriverDetailPage';
import { FleetAnalyticsPage } from '@/pages/statistics/FleetAnalyticsPage';
import { WorkloadAnalyticsPage } from '@/pages/statistics/WorkloadAnalyticsPage';
import { ServiceQualityPage } from '@/pages/statistics/ServiceQualityPage';

const AppContainer = styled.div`
    min-height: 100vh;
    background: ${({ theme }) => theme.colors.slate[50]};
    display: flex;
    overflow: hidden;
`;

const MainContent = styled.div<{ $isCollapsed: boolean }>`
    flex: 1;
    margin-left: ${({ $isCollapsed }) => ($isCollapsed ? '80px' : '280px')};
    transition: margin-left ${({ theme }) => theme.transitions.normal};
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    overflow: hidden;

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        margin-left: 0;
    }
`;

const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
`;

const PageContent = styled.div`
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
`;

type Route =
    | { type: 'dashboard' }
    | { type: 'alerts-overview' }
    | { type: 'guardians-list' }
    | { type: 'guardian-detail'; id: string }
    | { type: 'children-list' }
    | { type: 'child-detail'; id: string }
    | { type: 'vehicles-list' }
    | { type: 'vehicle-detail'; id: string }
    | { type: 'drivers-list' }
    | { type: 'driver-detail'; id: string }
    | { type: 'routes-list' }
    | { type: 'route-detail'; id: string }
    | { type: 'route-create' }
    | { type: 'unassigned-schedules' }
    | { type: 'route-series-list' }
    | { type: 'route-series-detail'; id: string }
    // Statistics Routes
    | { type: 'statistics-drivers' }
    | { type: 'statistics-driver-detail'; id: string }
    | { type: 'statistics-fleet' }
    | { type: 'statistics-capacity' }
    | { type: 'statistics-workload' }
    | { type: 'statistics-service-quality' };

function App() {
    const [currentRoute, setCurrentRoute] = useState<Route>(() => {
        const path = window.location.pathname;

        // Statistics Routes
        if (path === '/statistics/drivers') {
            return { type: 'statistics-drivers' };
        } else if (path.startsWith('/statistics/drivers/')) {
            const id = path.split('/')[3];
            return { type: 'statistics-driver-detail', id };
        } else if (path === '/statistics/fleet') {
            return { type: 'statistics-fleet' };
        } else if (path === '/statistics/capacity') {
            return { type: 'statistics-capacity' };
        } else if (path === '/statistics/workload') {
            return { type: 'statistics-workload' };
        } else if (path === '/statistics/service-quality') {
            return { type: 'statistics-service-quality' };
        }

        // Existing Routes
        if (path === '/routes/series') {
            return { type: 'route-series-list' };
        } else if (path.startsWith('/routes/series/')) {
            const id = path.split('/')[3];
            return { type: 'route-series-detail', id };
        } else if (path === '/routes/unassigned') {
            return { type: 'unassigned-schedules' };
        } else if (path === '/dashboard' || path === '/') {
            return { type: 'dashboard' };
        } else if (path === '/alerts/overview') {
            return { type: 'alerts-overview' };
        } else if (path === '/routes/create') {
            return { type: 'route-create' };
        } else if (path === '/routes') {
            return { type: 'routes-list' };
        } else if (path.startsWith('/routes/')) {
            const id = path.split('/')[2];
            return { type: 'route-detail', id };
        } else if (path === '/children') {
            return { type: 'children-list' };
        } else if (path.startsWith('/children/')) {
            const id = path.split('/')[2];
            return { type: 'child-detail', id };
        } else if (path === '/vehicles') {
            return { type: 'vehicles-list' };
        } else if (path.startsWith('/vehicles/')) {
            const id = path.split('/')[2];
            return { type: 'vehicle-detail', id };
        } else if (path === '/drivers') {
            return { type: 'drivers-list' };
        } else if (path.startsWith('/drivers/')) {
            const id = path.split('/')[2];
            return { type: 'driver-detail', id };
        } else if (path === '/guardians' || path === '/') {
            return { type: 'guardians-list' };
        } else if (path.startsWith('/guardians/')) {
            const id = path.split('/')[2];
            return { type: 'guardian-detail', id };
        }

        return { type: 'guardians-list' };
    });

    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    React.useEffect(() => {
        const handlePopState = () => {
            const path = window.location.pathname;

            // Statistics Routes
            if (path === '/statistics/drivers') {
                setCurrentRoute({ type: 'statistics-drivers' });
            } else if (path.startsWith('/statistics/drivers/')) {
                const id = path.split('/')[3];
                setCurrentRoute({ type: 'statistics-driver-detail', id });
            } else if (path === '/statistics/fleet') {
                setCurrentRoute({ type: 'statistics-fleet' });
            } else if (path === '/statistics/capacity') {
                setCurrentRoute({ type: 'statistics-capacity' });
            } else if (path === '/statistics/workload') {
                setCurrentRoute({ type: 'statistics-workload' });
            } else if (path === '/statistics/service-quality') {
                setCurrentRoute({ type: 'statistics-service-quality' });
            }

            // Existing routes handling...
            else if (path === '/routes/series') {
                setCurrentRoute({ type: 'route-series-list' });
            } else if (path.startsWith('/routes/series/')) {
                const id = path.split('/')[3];
                setCurrentRoute({type: 'route-series-detail', id});
            } else if (path === '/routes/unassigned') {
                setCurrentRoute({ type: 'unassigned-schedules' });
            } else if (path === '/dashboard' || path === '/') {
                setCurrentRoute({ type: 'dashboard' });
            } else if (path === '/alerts/overview') {
                setCurrentRoute({ type: 'alerts-overview' });
            } else if (path === '/routes/create') {
                setCurrentRoute({ type: 'route-create' });
            } else if (path === '/routes') {
                setCurrentRoute({ type: 'routes-list' });
            } else if (path.startsWith('/routes/')) {
                const id = path.split('/')[2];
                setCurrentRoute({ type: 'route-detail', id });
            } else if (path === '/children') {
                setCurrentRoute({ type: 'children-list' });
            } else if (path.startsWith('/children/')) {
                const id = path.split('/')[2];
                setCurrentRoute({ type: 'child-detail', id });
            } else if (path === '/vehicles') {
                setCurrentRoute({ type: 'vehicles-list' });
            } else if (path.startsWith('/vehicles/')) {
                const id = path.split('/')[2];
                setCurrentRoute({ type: 'vehicle-detail', id });
            } else if (path === '/drivers') {
                setCurrentRoute({ type: 'drivers-list' });
            } else if (path.startsWith('/drivers/')) {
                const id = path.split('/')[2];
                setCurrentRoute({ type: 'driver-detail', id });
            } else if (path === '/guardians' || path === '/') {
                setCurrentRoute({ type: 'guardians-list' });
            } else if (path.startsWith('/guardians/')) {
                const id = path.split('/')[2];
                setCurrentRoute({ type: 'guardian-detail', id });
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    React.useEffect(() => {
        const handleSidebarCollapse = ((e: CustomEvent) => {
            setIsSidebarCollapsed(e.detail.isCollapsed);
        }) as EventListener;

        window.addEventListener('sidebar-collapse', handleSidebarCollapse);
        return () => window.removeEventListener('sidebar-collapse', handleSidebarCollapse);
    }, []);

    const renderPage = () => {
        switch (currentRoute.type) {
            // Statistics Routes
            case 'statistics-drivers':
                return <DriverPerformancePage />;
            case 'statistics-driver-detail':
                return <StatDriverDetailPage id={currentRoute.id} />;
            case 'statistics-fleet':
                return <FleetAnalyticsPage />;
            case 'statistics-workload':
                return <WorkloadAnalyticsPage />;
            case 'statistics-service-quality':
                return <ServiceQualityPage />;

            // Existing Routes
            case 'route-series-list':
                return <RouteSeriesListPage />;
            case 'route-series-detail':
                return <RouteSeriesDetailPage id={currentRoute.id} />;
            case 'unassigned-schedules':
                return <UnassignedSchedulesPage />;
            case 'dashboard':
                return <DashboardPage />;
            case 'alerts-overview':
                return <AlertsOverviewPage />;
            case 'routes-list':
                return <RoutesListPage />;
            case 'route-detail':
                return <RouteDetailPage id={currentRoute.id} />;
            case 'route-create':
                return <CreateRoutePage />;
            case 'guardians-list':
                return <GuardiansListPage />;
            case 'guardian-detail':
                return <GuardianDetailPage id={currentRoute.id} />;
            case 'children-list':
                return <ChildrenListPage />;
            case 'child-detail':
                return <ChildDetailPage id={currentRoute.id} />;
            case 'vehicles-list':
                return <VehiclesListPage />;
            case 'vehicle-detail':
                return <VehicleDetailPage id={currentRoute.id} />;
            case 'drivers-list':
                return <DriversListPage />;
            case 'driver-detail':
                return <DriverDetailPage id={currentRoute.id} />;
            default:
                return <GuardiansListPage />;
        }
    };

    return (
        <AppProvider>
            <AppContainer>
                <Sidebar />
                <MainContent $isCollapsed={isSidebarCollapsed}>
                    <ContentWrapper>
                        <UserInfo />
                        <PageContent>
                            {renderPage()}
                        </PageContent>
                    </ContentWrapper>
                </MainContent>
            </AppContainer>
        </AppProvider>
    );
}

export default App;