import React, { useState } from 'react';
import { User, Clock, FileText, Filter } from 'lucide-react';
import styled from 'styled-components';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const FilterButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Timeline = styled.div`
  position: relative;
  padding-left: ${({ theme }) => theme.spacing.xl};

  &::before {
    content: '';
    position: absolute;
    left: 6px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(
      to bottom,
      ${({ theme }) => theme.colors.slate[200]},
      ${({ theme }) => theme.colors.slate[100]}
    );
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding-left: ${({ theme }) => theme.spacing.lg};
  }
`;

const TimelineItem = styled.div`
  position: relative;
  padding-bottom: ${({ theme }) => theme.spacing.xl};

  &:last-child {
    padding-bottom: 0;
  }
`;

const TimelineDot = styled.div<{ $color: string }>`
  position: absolute;
  left: -30px;
  top: 4px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  border: 3px solid white;
  box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.slate[200]};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    left: -24px;
  }
`;

const EventCard = styled.div`
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.slate[200]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing.lg};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
    border-color: ${({ theme }) => theme.colors.primary[200]};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const EventHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

const EventTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.slate[900]};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const EventMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.slate[600]};
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const EventDescription = styled.div`
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.slate[700]};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const EventDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.slate[50]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.slate[600]};
`;

const DetailRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const DetailLabel = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.slate[700]};
  min-width: 120px;
`;

const EmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing['2xl']};
  text-align: center;
  background: ${({ theme }) => theme.colors.slate[50]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px dashed ${({ theme }) => theme.colors.slate[300]};
`;

const EmptyIcon = styled.div`
  width: 64px;
  height: 64px;
  margin: 0 auto ${({ theme }) => theme.spacing.md};
  background: linear-gradient(to bottom right, ${({ theme }) => theme.colors.slate[100]}, ${({ theme }) => theme.colors.slate[200]});
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

interface ActivityHistoryProps {
    childId: string;
}

interface MockActivity {
    id: string;
    type: 'PROFILE' | 'SCHEDULE' | 'GUARDIAN' | 'ROUTE' | 'ABSENCE' | 'COMMUNICATION';
    title: string;
    description: string;
    performedBy: string;
    timestamp: string;
    details?: Record<string, string>;
}

export const ActivityHistory: React.FC<ActivityHistoryProps> = ({ childId }) => {
    const [filterType, setFilterType] = useState<string>('all');

    const mockActivities: MockActivity[] = [
        {
            id: '1',
            type: 'SCHEDULE',
            title: 'Dodano harmonogram',
            description: 'Utworzono nowy harmonogram "Trasa poranna - Dzielnica Północ"',
            performedBy: 'Jan Kowalski (Operator)',
            timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
            details: {
                'Nazwa harmonogramu': 'Trasa poranna - Dzielnica Północ',
                'Dni tygodnia': 'Pon, Wt, Śr, Czw, Pt',
                'Godzina odbioru': '07:00',
            },
        },
        {
            id: '2',
            type: 'ABSENCE',
            title: 'Zgłoszono nieobecność',
            description: 'Opiekun zgłosił nieobecność dziecka na 15 stycznia 2025',
            performedBy: 'Anna Nowak (Opiekun)',
            timestamp: new Date(Date.now() - 5 * 3600000).toISOString(),
            details: {
                'Data nieobecności': '15 stycznia 2025',
                'Typ': 'Cały dzień',
                'Powód': 'Wizyta lekarska',
            },
        },
        {
            id: '3',
            type: 'GUARDIAN',
            title: 'Zaktualizowano dane opiekuna',
            description: 'Zmieniono numer telefonu głównego opiekuna',
            performedBy: 'Maria Nowak (Operator)',
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            details: {
                'Opiekun': 'Anna Nowak',
                'Poprzedni telefon': '+48 123 456 789',
                'Nowy telefon': '+48 987 654 321',
            },
        },
        {
            id: '4',
            type: 'PROFILE',
            title: 'Zmieniono status dziecka',
            description: 'Status zmieniony z "Czasowo nieaktywny" na "Aktywny"',
            performedBy: 'Jan Kowalski (Operator)',
            timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
        },
        {
            id: '5',
            type: 'ROUTE',
            title: 'Realizacja przejazdu',
            description: 'Dziecko odebrane o czasie i dowiezione do szkoły',
            performedBy: 'Piotr Wiśniewski (Kierowca)',
            timestamp: new Date(Date.now() - 3 * 86400000).toISOString(),
            details: {
                'Trasa': 'Trasa poranna - Dzielnica Północ',
                'Status odbioru': 'Zakończony',
                'Status dowozu': 'Zakończony',
            },
        },
    ];

    const getEventColor = (type: string): string => {
        switch (type) {
            case 'PROFILE':
                return '#10b981';
            case 'SCHEDULE':
                return '#3b82f6';
            case 'GUARDIAN':
                return '#8b5cf6';
            case 'ROUTE':
                return '#06b6d4';
            case 'ABSENCE':
                return '#f59e0b';
            case 'COMMUNICATION':
                return '#ec4899';
            default:
                return '#64748b';
        }
    };

    const getEventBadgeVariant = (type: string) => {
        switch (type) {
            case 'PROFILE':
                return 'success';
            case 'SCHEDULE':
                return 'primary';
            case 'GUARDIAN':
                return 'primary';
            case 'ABSENCE':
                return 'warning';
            default:
                return 'default';
        }
    };

    const getEventTypeLabel = (type: string): string => {
        switch (type) {
            case 'PROFILE':
                return 'Profil';
            case 'SCHEDULE':
                return 'Harmonogram';
            case 'GUARDIAN':
                return 'Opiekun';
            case 'ROUTE':
                return 'Trasa';
            case 'ABSENCE':
                return 'Nieobecność';
            case 'COMMUNICATION':
                return 'Komunikacja';
            default:
                return type;
        }
    };

    const formatTimestamp = (timestamp: string): string => {
        const date = new Date(timestamp);
        return date.toLocaleString('pl-PL', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <Container>
            <Header>
                <FilterButton variant="secondary" size="sm">
                    <Filter size={16} />
                    Filtruj ({filterType === 'all' ? 'Wszystkie' : filterType})
                </FilterButton>
            </Header>

            {mockActivities.length === 0 ? (
                <EmptyState>
                    <EmptyIcon>
                        <FileText size={32} />
                    </EmptyIcon>
                    <EmptyTitle>Brak historii aktywności</EmptyTitle>
                    <EmptyText>
                        Historia zmian i wydarzeń związanych z tym dzieckiem będzie wyświetlana tutaj
                    </EmptyText>
                </EmptyState>
            ) : (
                <Timeline>
                    {mockActivities.map((activity) => (
                        <TimelineItem key={activity.id}>
                            <TimelineDot $color={getEventColor(activity.type)} />
                            <EventCard>
                                <EventHeader>
                                    <div style={{ flex: 1 }}>
                                        <EventTitle>{activity.title}</EventTitle>
                                        <EventMeta>
                                            <MetaItem>
                                                <Clock size={14} />
                                                {formatTimestamp(activity.timestamp)}
                                            </MetaItem>
                                            <MetaItem>
                                                <User size={14} />
                                                {activity.performedBy}
                                            </MetaItem>
                                        </EventMeta>
                                    </div>
                                    <Badge variant={getEventBadgeVariant(activity.type)}>
                                        {getEventTypeLabel(activity.type)}
                                    </Badge>
                                </EventHeader>

                                <EventDescription>{activity.description}</EventDescription>

                                {activity.details && (
                                    <EventDetails>
                                        {Object.entries(activity.details).map(([key, value]) => (
                                            <DetailRow key={key}>
                                                <DetailLabel>{key}:</DetailLabel>
                                                <span>{value}</span>
                                            </DetailRow>
                                        ))}
                                    </EventDetails>
                                )}
                            </EventCard>
                        </TimelineItem>
                    ))}
                </Timeline>
            )}
        </Container>
    );
};