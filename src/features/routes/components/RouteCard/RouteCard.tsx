import React, { useState } from 'react';
import { Calendar, Clock, User, Car, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '@/shared/ui/Badge';
import { RouteHistoryItem, UpcomingRouteItem, ChildStopInfo } from '../../types';
import {
    Card,
    CardHeader,
    RouteTitle,
    HeaderMeta,
    MetaItem,
    CardContent,
    InfoGrid,
    InfoItem,
    InfoLabel,
    InfoValue,
    StopsSection,
    StopsHeader,
    StopsTitle,
    ExpandButton,
    StopsList,
    StopItem,
    StopIcon,
    StopContent,
    StopHeader,
    ChildName,
    StopTime,
    StopAddress,
} from './RouteCard.styles';

interface RouteCardProps {
    route: RouteHistoryItem | UpcomingRouteItem;
    type: 'history' | 'upcoming';
}

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
};

const formatTime = (timeString: string): string => {
    if (!timeString) return '-';
    if (timeString.includes('T')) {
        return new Date(timeString).toLocaleTimeString('pl-PL', {
            hour: '2-digit',
            minute: '2-digit',
        });
    }
    return timeString;
};

const getStatusVariant = (status: string) => {
    switch (status) {
        case 'COMPLETED':
            return 'success';
        case 'CANCELLED':
            return 'danger';
        case 'PLANNED':
            return 'primary';
        case 'IN_PROGRESS':
            return 'warning';
        default:
            return 'default';
    }
};

const getStatusLabel = (status: string) => {
    switch (status) {
        case 'COMPLETED':
            return 'Zakończona';
        case 'CANCELLED':
            return 'Anulowana';
        case 'PLANNED':
            return 'Zaplanowana';
        case 'IN_PROGRESS':
            return 'W trakcie';
        default:
            return status;
    }
};

export const RouteCard: React.FC<RouteCardProps> = ({ route, type }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const isHistoryRoute = (r: RouteHistoryItem | UpcomingRouteItem): r is RouteHistoryItem => {
        return 'actualStartTime' in r;
    };

    const isUpcomingRoute = (r: RouteHistoryItem | UpcomingRouteItem): r is UpcomingRouteItem => {
        return 'childStops' in r;
    };

    const hasStops = isUpcomingRoute(route) && route.childStops && route.childStops.length > 0;

    return (
        <Card>
            <CardHeader>
                <RouteTitle>{route.routeName}</RouteTitle>
                <HeaderMeta>
                    <MetaItem>
                        <Calendar size={16} />
                        {formatDate(route.date)}
                    </MetaItem>
                    <MetaItem>
                        <Clock size={16} />
                        {route.estimatedStartTime} - {route.estimatedEndTime}
                    </MetaItem>
                    <MetaItem>
                        <User size={16} />
                        {route.driver.firstName} {route.driver.lastName}
                    </MetaItem>
                    <MetaItem>
                        <Car size={16} />
                        {route.vehicle.registrationNumber}
                    </MetaItem>
                    <Badge variant={getStatusVariant(route.status)}>
                        {getStatusLabel(route.status)}
                    </Badge>
                </HeaderMeta>
            </CardHeader>

            <CardContent>
                <InfoGrid>
                    {type === 'history' && isHistoryRoute(route) && (
                        <>
                            <InfoItem>
                                <InfoLabel>Faktyczny start</InfoLabel>
                                <InfoValue>{formatTime(route.actualStartTime)}</InfoValue>
                            </InfoItem>
                            <InfoItem>
                                <InfoLabel>Faktyczny koniec</InfoLabel>
                                <InfoValue>{formatTime(route.actualEndTime)}</InfoValue>
                            </InfoItem>
                        </>
                    )}
                </InfoGrid>

                {hasStops && (
                    <StopsSection>
                        <StopsHeader>
                            <StopsTitle>
                                Przystanki ({isUpcomingRoute(route) ? route.childStops.length : 0})
                            </StopsTitle>
                            <ExpandButton onClick={() => setIsExpanded(!isExpanded)}>
                                {isExpanded ? (
                                    <>
                                        Zwiń
                                        <ChevronUp size={16} />
                                    </>
                                ) : (
                                    <>
                                        Rozwiń
                                        <ChevronDown size={16} />
                                    </>
                                )}
                            </ExpandButton>
                        </StopsHeader>

                        <StopsList $isExpanded={isExpanded}>
                            {isUpcomingRoute(route) &&
                                route.childStops.map((stop: ChildStopInfo) => (
                                    <StopItem key={stop.stopId}>
                                        <StopIcon $type={stop.stopType}>
                                            {stop.stopType === 'PICKUP' ? '↑' : '↓'}
                                        </StopIcon>
                                        <StopContent>
                                            <StopHeader>
                                                <ChildName>
                                                    {stop.childFirstName} {stop.childLastName}
                                                </ChildName>
                                                <StopTime>
                                                    <Clock size={14} />
                                                    {formatTime(stop.estimatedTime)}
                                                </StopTime>
                                            </StopHeader>
                                            <StopAddress>
                                                <MapPin size={14} />
                                                {stop.address.label} - {stop.address.street}{' '}
                                                {stop.address.houseNumber}
                                                {stop.address.apartmentNumber &&
                                                    `/${stop.address.apartmentNumber}`}
                                                , {stop.address.city}
                                            </StopAddress>
                                        </StopContent>
                                    </StopItem>
                                ))}
                        </StopsList>
                    </StopsSection>
                )}
            </CardContent>
        </Card>
    );
};