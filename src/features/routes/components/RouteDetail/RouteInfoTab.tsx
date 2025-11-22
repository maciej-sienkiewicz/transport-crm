// src/features/routes/components/RouteDetail/RouteInfoTab.tsx

import React, { useState } from 'react';
import styled from 'styled-components';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { User, Truck, Clock, MapPin, Users, RefreshCw, Activity } from 'lucide-react';
import { RouteDetail } from '../../types';
import { statusVariants, statusLabels } from '../../hooks/useRouteDetailLogic';
import { UpdateRouteStatusModal } from '../UpdateRouteStatusModal';
import toast from 'react-hot-toast';

const InfoGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: ${({ theme }) => theme.spacing.lg};
`;

const InfoCard = styled.div`
    padding: ${({ theme }) => theme.spacing.lg};
    background: ${({ theme }) => theme.colors.slate[50]};
    border-radius: ${({ theme }) => theme.borderRadius.xl};
    border: 1px solid ${({ theme }) => theme.colors.slate[200]};
    position: relative;
`;

const InfoLabel = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    font-size: 0.8125rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[600]};
    text-transform: uppercase;
    letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wide};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const InfoValue = styled.div`
    font-size: 1rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[900]};
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${({ theme }) => theme.spacing.sm};
`;

const InfoLink = styled.button`
    background: none;
    border: none;
    padding: 0;
    font-family: inherit;
    font-size: 1rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.primary[700]};
    cursor: pointer;
    transition: color ${({ theme }) => theme.transitions.fast};
    text-align: left;
    display: inline;

    &:hover {
        color: ${({ theme }) => theme.colors.primary[800]};
        text-decoration: underline;
    }
`;

const ChangeButton = styled(Button)`
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
    font-size: 0.75rem;
    gap: 4px;
    flex-shrink: 0;
`;

const StatusCard = styled.div`
    padding: ${({ theme }) => theme.spacing.lg};
    background: ${({ theme }) => theme.gradients.cardHeader};
    border-radius: ${({ theme }) => theme.borderRadius.xl};
    border: 1px solid ${({ theme }) => theme.colors.slate[200]};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const StatusHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const StatusTitle = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    font-size: 0.8125rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[600]};
    text-transform: uppercase;
    letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wide};
`;

const StatusContent = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${({ theme }) => theme.spacing.md};
`;

const StatusInfo = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.md};
`;

const StatusBadgeWrapper = styled.div`
    display: flex;
    align-items: center;
`;

interface RouteInfoTabProps {
    route: RouteDetail;
    onDriverClick: () => void;
    onVehicleClick: () => void;
    onChangeDriver: () => void;
}

export const RouteInfoTab: React.FC<RouteInfoTabProps> = ({
                                                              route,
                                                              onDriverClick,
                                                              onVehicleClick,
                                                              onChangeDriver,
                                                          }) => {
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const estimatedChildrenCount = Math.ceil(route.stops.length / 2);
    const canReassign = route.status === 'PLANNED';
    const canChangeStatus = ['PLANNED', 'IN_PROGRESS'].includes(route.status);

    const handleChangeVehicle = () => {
        toast('Funkcja zmiany pojazdu będzie dostępna wkrótce', {
            icon: '🚧',
        });
    };

    const formatDateTime = (isoString: string): string => {
        const date = new Date(isoString);
        return date.toLocaleString('pl-PL', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div>
            <StatusCard>
                <StatusHeader>
                    <StatusTitle>
                        <Activity size={16} />
                        Status trasy
                    </StatusTitle>
                </StatusHeader>
                <StatusContent>
                    <StatusInfo>
                        <StatusBadgeWrapper>
                            <Badge variant={statusVariants[route.status]} size="lg">
                                {statusLabels[route.status]}
                            </Badge>
                        </StatusBadgeWrapper>
                        {route.actualStartTime && (
                            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                                Rozpoczęto: {formatDateTime(route.actualStartTime)}
                            </div>
                        )}
                        {route.actualEndTime && (
                            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                                Zakończono: {formatDateTime(route.actualEndTime)}
                            </div>
                        )}
                    </StatusInfo>
                    {canChangeStatus && (
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setIsStatusModalOpen(true)}
                        >
                            <RefreshCw size={14} />
                            Zmień status
                        </Button>
                    )}
                </StatusContent>
            </StatusCard>

            <InfoGrid>
                <InfoCard>
                    <InfoLabel>
                        <User size={16} />
                        Kierowca
                    </InfoLabel>
                    <InfoValue>
                        <InfoLink onClick={onDriverClick}>
                            {route.driver.firstName} {route.driver.lastName}
                        </InfoLink>
                        {canReassign && (
                            <ChangeButton
                                variant="secondary"
                                size="sm"
                                onClick={onChangeDriver}
                            >
                                <RefreshCw size={12} />
                                Zmień
                            </ChangeButton>
                        )}
                    </InfoValue>
                </InfoCard>

                <InfoCard>
                    <InfoLabel>
                        <Truck size={16} />
                        Pojazd
                    </InfoLabel>
                    <InfoValue>
                        <InfoLink onClick={onVehicleClick}>
                            {route.vehicle.registrationNumber} ({route.vehicle.make}{' '}
                            {route.vehicle.model})
                        </InfoLink>
                        {canReassign && (
                            <ChangeButton
                                variant="secondary"
                                size="sm"
                                onClick={handleChangeVehicle}
                            >
                                <RefreshCw size={12} />
                                Zmień
                            </ChangeButton>
                        )}
                    </InfoValue>
                </InfoCard>

                <InfoCard>
                    <InfoLabel>
                        <Clock size={16} />
                        Planowany czas
                    </InfoLabel>
                    <InfoValue>
                        {route.estimatedStartTime} - {route.estimatedEndTime}
                    </InfoValue>
                </InfoCard>

                <InfoCard>
                    <InfoLabel>
                        <Users size={16} />
                        Liczba dzieci
                    </InfoLabel>
                    <InfoValue>
                        {estimatedChildrenCount}{' '}
                        {estimatedChildrenCount === 1
                            ? 'dziecko'
                            : 'dzieci'}
                    </InfoValue>
                </InfoCard>

                <InfoCard>
                    <InfoLabel>
                        <MapPin size={16} />
                        Liczba stopów
                    </InfoLabel>
                    <InfoValue>
                        {route.stops.length}{' '}
                        {route.stops.length === 1
                            ? 'punkt'
                            : route.stops.length < 5
                                ? 'punkty'
                                : 'punktów'}
                    </InfoValue>
                </InfoCard>
            </InfoGrid>

            <UpdateRouteStatusModal
                isOpen={isStatusModalOpen}
                onClose={() => setIsStatusModalOpen(false)}
                route={route}
            />
        </div>
    );
};