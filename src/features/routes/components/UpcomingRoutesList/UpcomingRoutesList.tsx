// src/features/routes/components/UpcomingRoutesList/UpcomingRoutesList.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { Calendar, User, Car, Clock, MapPin, ChevronRight } from 'lucide-react';
import { useUpcomingRoutes } from '../../hooks/useUpcomingRoutes';
import { Badge } from '@/shared/ui/Badge';
import { Pagination } from '@/shared/ui/Pagination';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const RouteCard = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.slate[200]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  transition: all ${({ theme }) => theme.transitions.fast};
  cursor: pointer;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
    border-color: ${({ theme }) => theme.colors.primary[200]};
  }
`;

const RouteHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

const RouteTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.slate[900]};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const RouteDate = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.slate[600]};
`;

const RouteInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.slate[600]};
`;

const ChildStopsSection = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.slate[50]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ChildStopsTitle = styled.h5`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.slate[700]};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ChildStopsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ChildStop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm};
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
`;

const StopInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.slate[700]};
`;

const StopTime = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.slate[900]};
`;

const RouteFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.slate[200]};
`;

const ViewButton = styled.button`
  display: inline-flex;
  align-items: center;
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

const EmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  color: ${({ theme }) => theme.colors.slate[500]};
  background: ${({ theme }) => theme.colors.slate[50]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px dashed ${({ theme }) => theme.colors.slate[300]};
`;

interface UpcomingRoutesListProps {
    scheduleId: string;
}

export const UpcomingRoutesList: React.FC<UpcomingRoutesListProps> = ({ scheduleId }) => {
    const [page, setPage] = useState(0);
    const { data, isLoading } = useUpcomingRoutes({ scheduleId, page, size: 5 });

    const handleViewRoute = (routeId: string) => {
        window.location.href = `/routes/${routeId}`;
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pl-PL', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };

    const formatTime = (timeString: string): string => {
        return timeString.substring(0, 5);
    };

    const getStatusBadge = (status: 'PLANNED' | 'IN_PROGRESS') => {
        return status === 'PLANNED' ? (
            <Badge variant="primary">Zaplanowana</Badge>
        ) : (
            <Badge variant="warning">W trakcie</Badge>
        );
    };

    const getStopTypeBadge = (type: string) => {
        return type === 'PICKUP' ? (
            <Badge variant="success">Odbiór</Badge>
        ) : (
            <Badge variant="primary">Dowóz</Badge>
        );
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (!data?.content.length) {
        return (
            <EmptyState>
                <p>Brak zaplanowanych tras dla tego harmonogramu</p>
            </EmptyState>
        );
    }

    return (
        <Container>
            {data.content.map((route) => (
                <RouteCard key={route.id} onClick={() => handleViewRoute(route.id)}>
                    <RouteHeader>
                        <div>
                            <RouteTitle>{route.routeName}</RouteTitle>
                            <RouteDate>
                                <Calendar size={14} />
                                {formatDate(route.date)}
                            </RouteDate>
                        </div>
                        {getStatusBadge(route.status)}
                    </RouteHeader>

                    <RouteInfo>
                        <InfoItem>
                            <User size={14} />
                            {route.driver.firstName} {route.driver.lastName}
                        </InfoItem>
                        <InfoItem>
                            <Car size={14} />
                            {route.vehicle.registrationNumber} - {route.vehicle.model}
                        </InfoItem>
                        <InfoItem>
                            <Clock size={14} />
                            {formatTime(route.estimatedStartTime)} - {formatTime(route.estimatedEndTime)}
                        </InfoItem>
                    </RouteInfo>

                    {route.childStops && route.childStops.length > 0 && (
                        <ChildStopsSection>
                            <ChildStopsTitle>Przystanki dziecka:</ChildStopsTitle>
                            <ChildStopsList>
                                {route.childStops.map((stop) => (
                                    <ChildStop key={stop.stopId}>
                                        <StopInfo>
                                            <MapPin size={14} />
                                            {getStopTypeBadge(stop.stopType)}
                                            <span>
                        {stop.childFirstName} {stop.childLastName}
                      </span>
                                        </StopInfo>
                                        <StopTime>{formatTime(stop.estimatedTime)}</StopTime>
                                    </ChildStop>
                                ))}
                            </ChildStopsList>
                        </ChildStopsSection>
                    )}

                    <RouteFooter>
            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
              Liczba przystanków: {route.stopsCount}
            </span>
                        <ViewButton onClick={(e) => {
                            e.stopPropagation();
                            handleViewRoute(route.id);
                        }}>
                            Szczegóły
                            <ChevronRight size={14} />
                        </ViewButton>
                    </RouteFooter>
                </RouteCard>
            ))}

            {data.totalPages > 1 && (
                <Pagination
                    currentPage={page}
                    totalPages={data.totalPages}
                    onPageChange={setPage}
                />
            )}
        </Container>
    );
};