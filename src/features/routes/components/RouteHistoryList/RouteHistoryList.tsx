// src/features/routes/components/RouteHistoryList/RouteHistoryList.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { Calendar, User, Car, CheckCircle, ChevronRight } from 'lucide-react';
import { useRouteHistory } from '../../hooks/useRouteHistory';
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

const RouteFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.slate[200]};
`;

const StatsGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  font-size: 0.875rem;
`;

const StatItem = styled.div<{ $completed?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ $completed, theme }) =>
    $completed ? theme.colors.success[600] : theme.colors.slate[600]};
  font-weight: 500;
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

interface RouteHistoryListProps {
    scheduleId: string;
}

export const RouteHistoryList: React.FC<RouteHistoryListProps> = ({ scheduleId }) => {
    const [page, setPage] = useState(0);
    const { data, isLoading } = useRouteHistory({ scheduleId, page, size: 5 });

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
    const getStatusBadge = (status: 'COMPLETED' | 'CANCELLED') => {
        return status === 'COMPLETED' ? (
            <Badge variant="success">Zakończona</Badge>
        ) : (
            <Badge variant="danger">Anulowana</Badge>
        );
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (!data?.content.length) {
        return (
            <EmptyState>
                <p>Brak historii tras dla tego harmonogramu</p>
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
                    </RouteInfo>

                    <RouteFooter>
                        <StatsGroup>
                            <StatItem $completed>
                                <CheckCircle size={14} />
                                {route.completedStopsCount} z {route.stopsCount} przystanków
                            </StatItem>
                        </StatsGroup>
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