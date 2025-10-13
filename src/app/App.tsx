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
import { UserInfo } from '@/widgets/UserInfo/UserInfo';

const AppContainer = styled.div`
    min-height: 100vh;
    background: ${({ theme }) => theme.colors.slate[50]};
`;

type Route =
    | { type: 'guardians-list' }
    | { type: 'guardian-detail'; id: string }
    | { type: 'children-list' }
    | { type: 'child-detail'; id: string }
    | { type: 'vehicles-list' }
    | { type: 'vehicle-detail'; id: string }
    | { type: 'drivers-list' }
    | { type: 'driver-detail'; id: string };

function App() {
    const [currentRoute, setCurrentRoute] = useState<Route>(() => {
        const path = window.location.pathname;

        if (path === '/children') {
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

    React.useEffect(() => {
        const handlePopState = () => {
            const path = window.location.pathname;

            if (path === '/children') {
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

    const renderPage = () => {
        switch (currentRoute.type) {
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
                <UserInfo />
                {renderPage()}
            </AppContainer>
        </AppProvider>
    );
}

export default App;