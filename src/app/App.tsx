// src/app/App.tsx
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
import { UserInfo } from '@/widgets/UserInfo/UserInfo';
import { Sidebar } from '@/widgets/Sidebar';

const AppContainer = styled.div`
    min-height: 100vh;
    background: ${({ theme }) => theme.colors.slate[50]};
    display: flex;
`;

const MainContent = styled.div<{ $isCollapsed: boolean }>`
    flex: 1;
    margin-left: ${({ $isCollapsed }) => ($isCollapsed ? '80px' : '280px')};
    transition: margin-left ${({ theme }) => theme.transitions.normal};

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        margin-left: 0;
    }
`;

const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
`;

type Route =
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
    | { type: 'route-create' };

function App() {
    const [currentRoute, setCurrentRoute] = useState<Route>(() => {
        const path = window.location.pathname;

        if (path === '/routes/create') {
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

            if (path === '/routes/create') {
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
                        {renderPage()}
                    </ContentWrapper>
                </MainContent>
            </AppContainer>
        </AppProvider>
    );
}

export default App;