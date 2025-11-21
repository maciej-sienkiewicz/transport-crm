// src/features/children/components/RouteSearchManagement/RouteSearchTable.tsx
import React from 'react';
import styled from 'styled-components';
import { Eye, Calendar, User, Car, Clock, MapPin, CheckCircle } from 'lucide-react';
import { Badge } from '@/shared/ui/Badge';
import { Table } from '@/shared/ui/Table';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';

const TableContainer = styled.div`
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.slate[200]};
  overflow: hidden;
`;

const EmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing['2xl']};
  text-align: center;
  background: ${({ theme }) => theme.colors.slate[50]};
`;

const EmptyIcon = styled.div`
  width: 64px;
  height: 64px;
  margin: 0 auto ${({ theme }) => theme.spacing.md};
  background: linear-gradient(
    to bottom right,
    ${({ theme }) => theme.colors.slate[100]},
    ${({ theme }) => theme.colors.slate[200]}
  );
  border-radius: ${({ theme }) => theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.slate[500]};
`;

const EmptyTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.slate[900]};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const EmptyText = styled.p`
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.slate[600]};
`;

const RouteNameCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const RouteName = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.slate[900]};
`;

const RouteDate = styled.span`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.slate[500]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const InfoCell = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.slate[700]};
`;

const StopsCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: 0.875rem;
`;

const StopItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.slate[600]};
`;

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.slate[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  color: ${({ theme }) => theme.colors.primary[600]};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.primary[50]};
    border-color: ${({ theme }) => theme.colors.primary[300]};
  }
`;

const CompletionInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.success[600]};
  font-weight: 500;
`;

interface Route {
    id: string;
    routeName: string;
    date: string;
    status: string;
    driver: {
        firstName: string;
        lastName: string;
    };
    vehicle: {
        registrationNumber: string;
        model: string;
    };
    estimatedStartTime: string;
    estimatedEndTime: string;
    actualStartTime?: string;
    actualEndTime?: string;
    stops: Array<{
        id: string;
        stopType: 'PICKUP' | 'DROPOFF';
        estimatedTime: string;
        address: {
            label: string;
        };
    }>;
    stopsCount: number;
    completedStopsCount?: number;
}

interface RouteSearchTableProps {
    routes: Route[];
    isLoading: boolean;
    type: 'history' | 'upcoming';
}

export const RouteSearchTable: React.FC<RouteSearchTableProps> = ({
                                                                      routes,
                                                                      isLoading,
                                                                      type,
                                                                  }) => {
    const handleViewRoute = (routeId: string) => {
        window.location.href = `/routes/${routeId}`;
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pl-PL', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    const formatTime = (timeString: string): string => {
        return timeString.substring(0, 5);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return <Badge variant="success">Zakończona</Badge>;
            case 'CANCELLED':
                return <Badge variant="danger">Anulowana</Badge>;
            case 'IN_PROGRESS':
                return <Badge variant="warning">W trakcie</Badge>;
            case 'PLANNED':
                return <Badge variant="primary">Zaplanowana</Badge>;
            default:
                return <Badge variant="default">{status}</Badge>;
        }
    };

    const getStopTypeBadge = (type: 'PICKUP' | 'DROPOFF') => {
        return type === 'PICKUP' ? (
            <Badge variant="success">Odbiór</Badge>
        ) : (
            <Badge variant="primary">Dowóz</Badge>
        );
    };

    if (isLoading) {
        return (
            <TableContainer>
                <LoadingSpinner />
            </TableContainer>
        );
    }

    if (routes.length === 0) {
        return (
            <EmptyState>
                <EmptyIcon>
                    <Calendar size={32} />
                </EmptyIcon>
                <EmptyTitle>Brak tras</EmptyTitle>
                <EmptyText>
                    {type === 'history'
                        ? 'Nie znaleziono tras w historii dla wybranego okresu'
                        : 'Nie znaleziono zaplanowanych tras dla wybranego okresu'}
                </EmptyText>
            </EmptyState>
        );
    }

    return (
        <TableContainer>
            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.Head>Trasa</Table.Head>
                        <Table.Head>Status</Table.Head>
                        <Table.Head>Kierowca</Table.Head>
                        <Table.Head>Pojazd</Table.Head>
                        <Table.Head>Czas</Table.Head>
                        <Table.Head>Przystanki dziecka</Table.Head>
                        {type === 'history' && <Table.Head>Postęp</Table.Head>}
                        <Table.Head className="text-right">Akcje</Table.Head>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {routes.map((route) => (
                        <Table.Row key={route.id}>
                            <Table.Cell>
                                <RouteNameCell>
                                    <RouteName>{route.routeName}</RouteName>
                                    <RouteDate>
                                        <Calendar size={12} />
                                        {formatDate(route.date)}
                                    </RouteDate>
                                </RouteNameCell>
                            </Table.Cell>

                            <Table.Cell>{getStatusBadge(route.status)}</Table.Cell>

                            <Table.Cell>
                                <InfoCell>
                                    <User size={14} />
                                    {route.driver.firstName} {route.driver.lastName}
                                </InfoCell>
                            </Table.Cell>

                            <Table.Cell>
                                <InfoCell>
                                    <Car size={14} />
                                    {route.vehicle.registrationNumber}
                                </InfoCell>
                            </Table.Cell>

                            <Table.Cell>
                                <InfoCell>
                                    <Clock size={14} />
                                    {formatTime(
                                        route.actualStartTime || route.estimatedStartTime
                                    )}{' '}
                                    -{' '}
                                    {formatTime(
                                        route.actualEndTime || route.estimatedEndTime
                                    )}
                                </InfoCell>
                            </Table.Cell>

                            <Table.Cell>
                                <StopsCell>
                                    {route.stops.map((stop) => (
                                        <StopItem key={stop.id}>
                                            <MapPin size={12} />
                                            {getStopTypeBadge(stop.stopType)}
                                            <span>{formatTime(stop.estimatedTime)}</span>
                                            <span style={{ color: '#94a3b8' }}>
                        - {stop.address.label}
                      </span>
                                        </StopItem>
                                    ))}
                                </StopsCell>
                            </Table.Cell>

                            {type === 'history' && (
                                <Table.Cell>
                                    <CompletionInfo>
                                        <CheckCircle size={14} />
                                        {route.completedStopsCount || 0} / {route.stopsCount}
                                    </CompletionInfo>
                                </Table.Cell>
                            )}

                            <Table.Cell className="text-right">
                                <ActionButton onClick={() => handleViewRoute(route.id)}>
                                    <Eye size={14} />
                                    Szczegóły
                                </ActionButton>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </TableContainer>
    );
};