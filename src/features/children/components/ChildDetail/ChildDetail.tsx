import React from 'react';
import { Edit2, Trash2, ArrowLeft, Check, X } from 'lucide-react';
import { useChild } from '../../hooks/useChild';
import { useDeleteChild } from '../../hooks/useDeleteChild';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { statusLabels, disabilityLabels, relationshipLabels } from '../../lib/constants';
import { formatBirthDate } from '../../lib/utils';
import {
    DetailContainer,
    DetailHeader,
    HeaderInfo,
    ChildName,
    ChildAge,
    HeaderActions,
    InfoGrid,
    InfoItem,
    InfoLabel,
    InfoValue,
    DisabilityList,
    TransportNeedsList,
    TransportNeedItem,
    SectionTitle,
    GuardiansGrid,
    GuardianCard,
    GuardianName,
    GuardianInfo,
    GuardianBadges,
    SchedulesGrid,
    ScheduleCard,
    ScheduleName,
    ScheduleHeader,
    ScheduleRow,
    ScheduleLabel,
    ScheduleValue,
    DaysList,
} from './ChildDetail.styles';

interface ChildDetailProps {
    id: string;
    onEdit: () => void;
    onBack: () => void;
}

const dayLabels: Record<string, string> = {
    MONDAY: 'Pon',
    TUESDAY: 'Wt',
    WEDNESDAY: 'Śr',
    THURSDAY: 'Czw',
    FRIDAY: 'Pt',
    SATURDAY: 'Sob',
    SUNDAY: 'Ndz',
};

export const ChildDetail: React.FC<ChildDetailProps> = ({ id, onEdit, onBack }) => {
    const { data: child, isLoading } = useChild(id);
    const deleteChild = useDeleteChild();

    const handleDelete = async () => {
        if (window.confirm(`Czy na pewno chcesz usunąć dziecko ${child?.firstName} ${child?.lastName}?`)) {
            await deleteChild.mutateAsync(id);
            onBack();
        }
    };

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return 'success';
            case 'INACTIVE':
                return 'danger';
            case 'TEMPORARY_INACTIVE':
                return 'warning';
            default:
                return 'default';
        }
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (!child) {
        return (
            <Card>
                <Card.Content>
                    <p>Nie znaleziono dziecka</p>
                </Card.Content>
            </Card>
        );
    }

    return (
        <DetailContainer>
            <DetailHeader>
                <HeaderInfo>
                    <ChildName>
                        {child.firstName} {child.lastName}
                    </ChildName>
                    <ChildAge>{child.age} lat • {formatBirthDate(child.birthDate)}</ChildAge>
                </HeaderInfo>
                <HeaderActions>
                    <Button variant="ghost" onClick={onBack}>
                        <ArrowLeft size={16} />
                        Powrót
                    </Button>
                    <Button variant="secondary" onClick={onEdit}>
                        <Edit2 size={16} />
                        Edytuj
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        <Trash2 size={16} />
                        Usuń
                    </Button>
                </HeaderActions>
            </DetailHeader>

            <Card>
                <Card.Header>
                    <Card.Title>Informacje podstawowe</Card.Title>
                </Card.Header>
                <Card.Content>
                    <InfoGrid>
                        <InfoItem>
                            <InfoLabel>Status</InfoLabel>
                            <InfoValue>
                                <Badge variant={getStatusVariant(child.status)}>
                                    {statusLabels[child.status]}
                                </Badge>
                            </InfoValue>
                        </InfoItem>
                        <InfoItem>
                            <InfoLabel>Niepełnosprawność</InfoLabel>
                            <DisabilityList>
                                {child.disability.map((d) => (
                                    <Badge key={d} variant="primary">
                                        {disabilityLabels[d]}
                                    </Badge>
                                ))}
                            </DisabilityList>
                        </InfoItem>
                    </InfoGrid>
                </Card.Content>
            </Card>

            <Card>
                <Card.Header>
                    <Card.Title>Potrzeby transportowe</Card.Title>
                </Card.Header>
                <Card.Content>
                    <TransportNeedsList>
                        <TransportNeedItem>
                            {child.transportNeeds.wheelchair ? <Check size={16} color="#10b981" /> : <X size={16} color="#ef4444" />}
                            Wózek inwalidzki
                        </TransportNeedItem>
                        <TransportNeedItem>
                            {child.transportNeeds.specialSeat ? <Check size={16} color="#10b981" /> : <X size={16} color="#ef4444" />}
                            Specjalne siedzenie
                        </TransportNeedItem>
                        <TransportNeedItem>
                            {child.transportNeeds.safetyBelt ? <Check size={16} color="#10b981" /> : <X size={16} color="#ef4444" />}
                            Pas bezpieczeństwa
                        </TransportNeedItem>
                    </TransportNeedsList>
                </Card.Content>
            </Card>

            {child.notes && (
                <Card>
                    <Card.Header>
                        <Card.Title>Notatki</Card.Title>
                    </Card.Header>
                    <Card.Content>
                        <InfoValue>{child.notes}</InfoValue>
                    </Card.Content>
                </Card>
            )}

            {child.guardians && child.guardians.length > 0 && (
                <div>
                    <SectionTitle>Opiekunowie ({child.guardians.length})</SectionTitle>
                    <GuardiansGrid>
                        {child.guardians.map((guardian) => (
                            <GuardianCard
                                key={guardian.id}
                                onClick={() => (window.location.href = `/guardians/${guardian.id}`)}
                            >
                                <GuardianName>
                                    {guardian.firstName} {guardian.lastName}
                                </GuardianName>
                                <GuardianInfo>{guardian.email}</GuardianInfo>
                                <GuardianInfo>{guardian.phone}</GuardianInfo>
                                <GuardianInfo>{relationshipLabels[guardian.relationship]}</GuardianInfo>
                                <GuardianBadges>
                                    {guardian.isPrimary && <Badge variant="success">Opiekun główny</Badge>}
                                    {guardian.canPickup && <Badge variant="primary">Może odbierać</Badge>}
                                    {guardian.canAuthorize && <Badge variant="primary">Może autoryzować</Badge>}
                                </GuardianBadges>
                            </GuardianCard>
                        ))}
                    </GuardiansGrid>
                </div>
            )}

            {child.schedules && child.schedules.length > 0 && (
                <div>
                    <SectionTitle>Harmonogramy ({child.schedules.length})</SectionTitle>
                    <SchedulesGrid>
                        {child.schedules.map((schedule) => (
                            <ScheduleCard key={schedule.id}>
                                <ScheduleHeader>
                                    <ScheduleName>{schedule.name}</ScheduleName>
                                    {schedule.active ? (
                                        <Badge variant="success">Aktywny</Badge>
                                    ) : (
                                        <Badge variant="default">Nieaktywny</Badge>
                                    )}
                                </ScheduleHeader>
                                <ScheduleRow>
                                    <ScheduleLabel>Odbiór</ScheduleLabel>
                                    <ScheduleValue>{schedule.pickupTime}</ScheduleValue>
                                </ScheduleRow>
                                <ScheduleRow>
                                    <ScheduleLabel>Adres odbioru</ScheduleLabel>
                                    <ScheduleValue>{schedule.pickupAddress.label}</ScheduleValue>
                                </ScheduleRow>
                                <ScheduleRow>
                                    <ScheduleLabel>Dowóz</ScheduleLabel>
                                    <ScheduleValue>{schedule.dropoffTime}</ScheduleValue>
                                </ScheduleRow>
                                <ScheduleRow>
                                    <ScheduleLabel>Adres dowozu</ScheduleLabel>
                                    <ScheduleValue>{schedule.dropoffAddress.label}</ScheduleValue>
                                </ScheduleRow>
                                <DaysList>
                                    {schedule.days.map((day) => (
                                        <Badge key={day} variant="default">
                                            {dayLabels[day]}
                                        </Badge>
                                    ))}
                                </DaysList>
                            </ScheduleCard>
                        ))}
                    </SchedulesGrid>
                </div>
            )}
        </DetailContainer>
    );
};