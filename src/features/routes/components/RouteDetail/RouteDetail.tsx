import React from 'react';
import styled from 'styled-components';
import { useRoute } from '../../hooks/useRoute';
import { Card } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import {
    Calendar,
    User,
    Truck,
    Clock,
    MapPin,
    Phone,
    AlertCircle,
} from 'lucide-react';
import { RouteStatus, ChildInRouteStatus } from '../../types';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xl};
`;

const RouteHeader = styled.div`
    background: ${({ theme }) => theme.gradients.cardHeader};
    padding: ${({ theme }) => theme.spacing.xl};
    border-radius: ${({ theme }) => theme.borderRadius['2xl']};
    border: 1px solid ${({ theme }) => theme.colors.slate[200]};
`;

const RouteTitleRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    gap: ${({ theme }) => theme.spacing.md};
`;

const RouteTitle = styled.h2`
    font-size: 1.5rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.slate[900]};
`;

const MetaGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: ${({ theme }) => theme.spacing.lg};
`;

const MetaItem = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
    font-size: 0.9375rem;
    color: ${({ theme }) => theme.colors.slate[700]};
`;

const MetaLabel = styled.span`
    color: ${({ theme }) => theme.colors.slate[500]};
    font-size: 0.875rem;
`;

const ChildrenSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
`;

const ChildCard = styled.div`
    padding: ${({ theme }) => theme.spacing.lg};
    background: white;
    border: 1px solid ${({ theme }) => theme.colors.slate[200]};
    border-radius: ${({ theme }) => theme.borderRadius.xl};
    display: grid;
    grid-template-columns: 40px 1fr auto;
    gap: ${({ theme }) => theme.spacing.md};
    align-items: start;
    transition: all ${({ theme }) => theme.transitions.normal};

    &:hover {
        border-color: ${({ theme }) => theme.colors.slate[300]};
        box-shadow: ${({ theme }) => theme.shadows.sm};
    }
`;

const OrderNumber = styled.div`
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${({ theme }) => theme.gradients.primaryButton};
    color: white;
    border-radius: ${({ theme }) => theme.borderRadius.full};
    font-weight: 700;
    font-size: 1rem;
`;

const ChildInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};
`;

const ChildName = styled.div`
    font-size: 1rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[900]};
`;

const AddressInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xs};
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.slate[600]};
`;

const AddressRow = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
`;

const TimeInfo = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.slate[600]};
`;

const GuardianInfo = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.slate[600]};
    margin-top: ${({ theme }) => theme.spacing.xs};
`;

const SpecialNeedsWarning = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    padding: ${({ theme }) => theme.spacing.sm};
    background: ${({ theme }) => theme.colors.warning[50]};
    border: 1px solid ${({ theme }) => theme.colors.warning[200]};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    color: ${({ theme }) => theme.colors.warning[700]};
    font-size: 0.875rem;
    margin-top: ${({ theme }) => theme.spacing.sm};
`;

const NotesSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
`;

const NoteCard = styled.div`
    padding: ${({ theme }) => theme.spacing.md};
    background: ${({ theme }) => theme.colors.slate[50]};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    border: 1px solid ${({ theme }) => theme.colors.slate[200]};
`;

const NoteHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const NoteAuthor = styled.span`
    font-weight: 600;
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.slate[700]};
`;

const NoteTime = styled.span`
    font-size: 0.8125rem;
    color: ${({ theme }) => theme.colors.slate[500]};
`;

const NoteContent = styled.p`
    font-size: 0.9375rem;
    color: ${({ theme }) => theme.colors.slate[700]};
    line-height: 1.5;
`;

const statusLabels: Record<RouteStatus, string> = {
    PLANNED: 'Zaplanowana',
    IN_PROGRESS: 'W trakcie',
    COMPLETED: 'Zakończona',
    CANCELLED: 'Anulowana',
};

const statusVariants: Record<RouteStatus, 'default' | 'primary' | 'success' | 'warning' | 'danger'> = {
    PLANNED: 'primary',
    IN_PROGRESS: 'warning',
    COMPLETED: 'success',
    CANCELLED: 'default',
};

const childStatusLabels: Record<ChildInRouteStatus, string> = {
    PENDING: 'Oczekuje',
    IN_VEHICLE: 'W pojeździe',
    DELIVERED: 'Dostarczony',
    ABSENT: 'Nieobecny',
};

const childStatusVariants: Record<ChildInRouteStatus, 'default' | 'primary' | 'success' | 'warning' | 'danger'> = {
    PENDING: 'default',
    IN_VEHICLE: 'warning',
    DELIVERED: 'success',
    ABSENT: 'danger',
};

interface RouteDetailProps {
    id: string;
}

export const RouteDetail: React.FC<RouteDetailProps> = ({ id }) => {
    const { data: route, isLoading } = useRoute(id);

    if (isLoading || !route) {
        return <LoadingSpinner />;
    }

    return (
        <Container>
            <RouteHeader>
                <RouteTitleRow>
                    <RouteTitle>{route.routeName}</RouteTitle>
                    <Badge variant={statusVariants[route.status]}>
                        {statusLabels[route.status]}
                    </Badge>
                </RouteTitleRow>
                <MetaGrid>
                    <MetaItem>
                        <Calendar size={18} />
                        <div>
                            <MetaLabel>Data:</MetaLabel>{' '}
                            {new Date(route.date).toLocaleDateString('pl-PL', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </div>
                    </MetaItem>
                    <MetaItem>
                        <User size={18} />
                        <div>
                            <MetaLabel>Kierowca:</MetaLabel> {route.driver.firstName}{' '}
                            {route.driver.lastName}
                        </div>
                    </MetaItem>
                    <MetaItem>
                        <Truck size={18} />
                        <div>
                            <MetaLabel>Pojazd:</MetaLabel> {route.vehicle.registrationNumber} (
                            {route.vehicle.make} {route.vehicle.model})
                        </div>
                    </MetaItem>
                    <MetaItem>
                        <Clock size={18} />
                        <div>
                            <MetaLabel>Plan:</MetaLabel> {route.estimatedStartTime} -{' '}
                            {route.estimatedEndTime}
                        </div>
                    </MetaItem>
                    {route.actualStartTime && (
                        <MetaItem>
                            <Clock size={18} />
                            <div>
                                <MetaLabel>Rzeczywiste:</MetaLabel> {route.actualStartTime}
                                {route.actualEndTime && ` - ${route.actualEndTime}`}
                            </div>
                        </MetaItem>
                    )}
                </MetaGrid>
            </RouteHeader>

            <Card>
                <Card.Header>
                    <Card.Title>Dzieci na trasie ({route.children.length})</Card.Title>
                </Card.Header>
                <Card.Content>
                    <ChildrenSection>
                        {route.children.map((child) => (
                            <ChildCard key={child.id}>
                                <OrderNumber>{child.pickupOrder}</OrderNumber>
                                <ChildInfo>
                                    <ChildName>
                                        {child.firstName} {child.lastName}
                                    </ChildName>
                                    <AddressInfo>
                                        <AddressRow>
                                            <MapPin size={14} />
                                            <strong>Odbiór:</strong> {child.pickupAddress.label} -{' '}
                                            {child.pickupAddress.street} {child.pickupAddress.houseNumber}
                                            {child.pickupAddress.apartmentNumber &&
                                                `/${child.pickupAddress.apartmentNumber}`}
                                            , {child.pickupAddress.postalCode} {child.pickupAddress.city}
                                        </AddressRow>
                                        <AddressRow>
                                            <MapPin size={14} />
                                            <strong>Dowóz:</strong> {child.dropoffAddress.label} -{' '}
                                            {child.dropoffAddress.street} {child.dropoffAddress.houseNumber}
                                            {child.dropoffAddress.apartmentNumber &&
                                                `/${child.dropoffAddress.apartmentNumber}`}
                                            , {child.dropoffAddress.postalCode} {child.dropoffAddress.city}
                                        </AddressRow>
                                    </AddressInfo>
                                    <TimeInfo>
                                        <Clock size={14} />
                                        Plan: {child.estimatedPickupTime} - {child.estimatedDropoffTime}
                                        {child.actualPickupTime && ` | Rzeczywiste: ${child.actualPickupTime}`}
                                        {child.actualDropoffTime && ` - ${child.actualDropoffTime}`}
                                    </TimeInfo>
                                    <GuardianInfo>
                                        <Phone size={14} />
                                        Opiekun: {child.guardian.firstName} {child.guardian.lastName} (
                                        {child.guardian.phone})
                                    </GuardianInfo>
                                    {(child.pickupAddress.street.includes('wózek') ||
                                        child.dropoffAddress.street.includes('wózek')) && (
                                        <SpecialNeedsWarning>
                                            <AlertCircle size={16} />
                                            Wymaga specjalnego wyposażenia
                                        </SpecialNeedsWarning>
                                    )}
                                </ChildInfo>
                                <Badge variant={childStatusVariants[child.status]}>
                                    {childStatusLabels[child.status]}
                                </Badge>
                            </ChildCard>
                        ))}
                    </ChildrenSection>
                </Card.Content>
            </Card>

            {route.notes && route.notes.length > 0 && (
                <Card>
                    <Card.Header>
                        <Card.Title>Notatki ({route.notes.length})</Card.Title>
                    </Card.Header>
                    <Card.Content>
                        <NotesSection>
                            {route.notes.map((note) => (
                                <NoteCard key={note.id}>
                                    <NoteHeader>
                                        <NoteAuthor>{note.author}</NoteAuthor>
                                        <NoteTime>
                                            {new Date(note.createdAt).toLocaleString('pl-PL')}
                                        </NoteTime>
                                    </NoteHeader>
                                    <NoteContent>{note.content}</NoteContent>
                                </NoteCard>
                            ))}
                        </NotesSection>
                    </Card.Content>
                </Card>
            )}
        </Container>
    );
};