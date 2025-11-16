// src/features/drivers/components/PlannedRoutesTab/PlannedRoutesTab.tsx
import React, { useState } from 'react';
import { Clock, Users, MapPin, Navigation, FileText, Edit, Calendar } from 'lucide-react';
import { usePlannedRoutes } from '../../hooks/useDriverRoutes';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { Select } from '@/shared/ui/Select';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import {
    Container,
    FiltersBar,
    FilterGroup,
    FilterLabel,
    ResultCount,
    NextRouteCard,
    NextRouteHeader,
    NextRouteTitle,
    NextRouteTime,
    NextRouteNumber,
    NextRouteInfo,
    NextRouteInfoItem,
    NextRouteRoute,
    NextRouteActions,
    RoutesList,
    RouteCard,
    RouteHeader,
    RouteMainInfo,
    RouteNumber,
    RouteTime,
    RouteDetails,
    RouteDetailItem,
    RouteDetailLabel,
    RouteActions,
    EmptyState,
    EmptyIcon,
    EmptyTitle,
    EmptyText,
} from './PlannedRoutesTab.styles';

interface PlannedRoutesTabProps {
    driverId: string;
}

export const PlannedRoutesTab: React.FC<PlannedRoutesTabProps> = ({ driverId }) => {
    const [dateFilter, setDateFilter] = useState('today');
    const { data: routes, isLoading } = usePlannedRoutes(driverId);

    const getTimeUntilRoute = (startTime: string) => {
        const now = new Date();
        const start = new Date(startTime);
        const diffMs = start.getTime() - now.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 60) return `Za ${diffMins} min`;
        const diffHours = Math.floor(diffMins / 60);
        const remainingMins = diffMins % 60;
        return `Za ${diffHours} godz. ${remainingMins} min`;
    };

    const formatTime = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PLANNED':
                return <Badge variant="primary">Zaplanowana</Badge>;
            case 'IN_PROGRESS':
                return <Badge variant="warning">W trakcie</Badge>;
            case 'COMPLETED':
                return <Badge variant="success">Zakończona</Badge>;
            case 'CANCELLED':
                return <Badge variant="danger">Anulowana</Badge>;
            default:
                return <Badge variant="default">{status}</Badge>;
        }
    };

    if (isLoading) {
        return (
            <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center' }}>
                <LoadingSpinner />
            </div>
        );
    }

    const nextRoute = routes?.[0];
    const otherRoutes = routes?.slice(1) || [];

    if (!routes || routes.length === 0) {
        return (
            <Container>
                <EmptyState>
                    <EmptyIcon>
                        <Calendar size={32} />
                    </EmptyIcon>
                    <EmptyTitle>Brak zaplanowanych tras</EmptyTitle>
                    <EmptyText>Nie ma żadnych zaplanowanych tras dla tego kierowcy</EmptyText>
                </EmptyState>
            </Container>
        );
    }

    return (
        <Container>
            <FiltersBar>
                <FilterGroup>
                    <FilterLabel>Okres:</FilterLabel>
                    <Select
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        options={[
                            { value: 'today', label: 'Dzisiaj' },
                            { value: 'tomorrow', label: 'Jutro' },
                            { value: 'week', label: 'Ten tydzień' },
                            { value: 'month', label: 'Ten miesiąc' },
                        ]}
                    />
                </FilterGroup>
                <ResultCount>Znaleziono: {routes.length}</ResultCount>
            </FiltersBar>

            {nextRoute && (
                <div>
                    <NextRouteCard>
                        <NextRouteHeader>
                            <div>
                                <NextRouteTitle>Najbliższa trasa</NextRouteTitle>
                                <NextRouteTime>{getTimeUntilRoute(nextRoute.startTime)}</NextRouteTime>
                                <NextRouteNumber>Trasa #{nextRoute.routeNumber}</NextRouteNumber>
                            </div>
                            {getStatusBadge(nextRoute.status)}
                        </NextRouteHeader>

                        <NextRouteInfo>
                            <NextRouteInfoItem>
                                <Clock size={18} />
                                Rozpoczęcie: {formatTime(nextRoute.startTime)}
                            </NextRouteInfoItem>
                            <NextRouteInfoItem>
                                <Users size={18} />
                                Dzieci: {nextRoute.childrenCount}
                            </NextRouteInfoItem>
                            <NextRouteInfoItem>
                                <Navigation size={18} />
                                Pojazd: {nextRoute.vehicleRegistrationNumber}
                            </NextRouteInfoItem>
                            <NextRouteInfoItem>
                                <MapPin size={18} />
                                Przystanków: {nextRoute.stopsCount}
                            </NextRouteInfoItem>
                        </NextRouteInfo>

                        <NextRouteRoute>
                            📍 {nextRoute.firstStopAddress} → {nextRoute.lastStopAddress}
                        </NextRouteRoute>

                        <NextRouteActions>
                            <Button variant="secondary" size="sm">
                                <MapPin size={16} />
                                Zobacz na mapie
                            </Button>
                            <Button variant="secondary" size="sm">
                                <FileText size={16} />
                                Szczegóły trasy
                            </Button>
                            <Button variant="secondary" size="sm">
                                <Edit size={16} />
                                Edytuj
                            </Button>
                        </NextRouteActions>
                    </NextRouteCard>
                </div>
            )}

            {otherRoutes.length > 0 && (
                <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: '#0f172a' }}>
                        Pozostałe trasy ({otherRoutes.length})
                    </h3>
                    <RoutesList>
                        {otherRoutes.map((route) => (
                            <RouteCard key={route.id}>
                                <RouteHeader>
                                    <RouteMainInfo>
                                        <RouteNumber>Trasa #{route.routeNumber}</RouteNumber>
                                        <RouteTime>
                                            <Clock size={14} />
                                            {formatTime(route.startTime)} • {route.estimatedDuration} min
                                        </RouteTime>
                                    </RouteMainInfo>
                                    {getStatusBadge(route.status)}
                                </RouteHeader>

                                <RouteDetails>
                                    <RouteDetailItem>
                                        <RouteDetailLabel>Trasa</RouteDetailLabel>
                                        {route.startLocation} → {route.endLocation}
                                    </RouteDetailItem>
                                    <RouteDetailItem>
                                        <RouteDetailLabel>Dzieci</RouteDetailLabel>
                                        {route.childrenCount}
                                    </RouteDetailItem>
                                    <RouteDetailItem>
                                        <RouteDetailLabel>Pojazd</RouteDetailLabel>
                                        {route.vehicleRegistrationNumber}
                                    </RouteDetailItem>
                                    <RouteDetailItem>
                                        <RouteDetailLabel>Przystanki</RouteDetailLabel>
                                        {route.stopsCount}
                                    </RouteDetailItem>
                                </RouteDetails>

                                <RouteActions>
                                    <Button variant="secondary" size="sm">
                                        <MapPin size={14} />
                                        Mapa
                                    </Button>
                                    <Button variant="secondary" size="sm">
                                        <FileText size={14} />
                                        Szczegóły
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                        <Edit size={14} />
                                        Edytuj
                                    </Button>
                                </RouteActions>
                            </RouteCard>
                        ))}
                    </RoutesList>
                </div>
            )}
        </Container>
    );
};