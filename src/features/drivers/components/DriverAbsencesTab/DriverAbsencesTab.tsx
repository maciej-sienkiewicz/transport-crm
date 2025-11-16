// src/features/drivers/components/DriverAbsencesTab/DriverAbsencesTab.tsx
import React, { useState } from 'react';
import { Plus, Calendar, Clock, FileText, CalendarOff } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { useDriverAbsences, useCancelDriverAbsence } from '../../hooks/useDriverAbsences';
import { DriverAbsence, DriverAbsenceStatus, DriverAbsenceType } from '../../types';
import { CreateDriverAbsenceModal } from '../CreateDriverAbsenceModal';
import { CancelDriverAbsenceModal } from '../../CancelDriverAbsenceModal/CancelDriverAbsenceModal.tsx';
import {
    Container,
    Header,
    SectionTitle,
    AbsencesList,
    AbsenceCard,
    AbsenceHeader,
    AbsenceDate,
    AbsenceActions,
    AbsenceInfo,
    InfoRow,
    InfoLabel,
    InfoValue,
    Divider,
    EmptyState,
    EmptyIcon,
    EmptyTitle,
    EmptyText,
} from './DriverAbsencesTab.styles';

interface DriverAbsencesTabProps {
    driverId: string;
}

export const DriverAbsencesTab: React.FC<DriverAbsencesTabProps> = ({ driverId }) => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [absenceToCancel, setAbsenceToCancel] = useState<DriverAbsence | null>(null);

    const { data, isLoading } = useDriverAbsences(driverId);
    const absences = data || [];

    const cancelAbsenceMutation = useCancelDriverAbsence(driverId);
    const isCancelling = cancelAbsenceMutation.isPending;

    const handleOpenCancelModal = (absence: DriverAbsence) => {
        setAbsenceToCancel(absence);
    };

    const handleCloseCancelModal = () => {
        setAbsenceToCancel(null);
    };

    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
    };

    const upcomingAbsences = absences
        .filter((a) => a.status === 'PLANNED' || a.status === 'ACTIVE')
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    const completedAbsences = absences
        .filter((a) => a.status === 'COMPLETED' || a.status === 'CANCELLED')
        .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pl-PL', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };

    const formatDateTime = (timestamp: string): string => {
        const date = new Date(timestamp);
        return date.toLocaleString('pl-PL', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getUrgency = (absence: DriverAbsence): 'urgent' | 'upcoming' | 'planned' | 'completed' => {
        if (absence.status === 'COMPLETED' || absence.status === 'CANCELLED') return 'completed';

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startDate = new Date(absence.startDate);
        startDate.setHours(0, 0, 0, 0);
        const diffDays = Math.floor((startDate.getTime() - today.getTime()) / 86400000);

        if (diffDays <= 1 && diffDays >= 0) return 'urgent';
        if (diffDays <= 7 && diffDays > 1) return 'upcoming';
        return 'planned';
    };

    const getDateLabel = (absence: DriverAbsence): string => {
        if (absence.startDate === absence.endDate) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const absDate = new Date(absence.startDate);
            absDate.setHours(0, 0, 0, 0);
            const diffDays = Math.floor((absDate.getTime() - today.getTime()) / 86400000);

            if (diffDays === 0) return 'Dzisiaj';
            if (diffDays === 1) return 'Jutro';
            return formatDate(absence.startDate);
        }
        return `${formatDate(absence.startDate)} - ${formatDate(absence.endDate)}`;
    };

    const getStatusBadge = (status: DriverAbsenceStatus) => {
        switch (status) {
            case 'PLANNED':
                return <Badge variant="warning">Zaplanowana</Badge>;
            case 'ACTIVE':
                return <Badge variant="primary">Aktywna</Badge>;
            case 'COMPLETED':
                return <Badge variant="default">Zakończona</Badge>;
            case 'CANCELLED':
                return <Badge variant="danger">Anulowana</Badge>;
            default:
                return null;
        }
    };

    const getTypeBadge = (type: DriverAbsenceType) => {
        const labels: Record<DriverAbsenceType, string> = {
            SICK_LEAVE: 'L4 / Zwolnienie',
            VACATION: 'Urlop',
            PERSONAL_LEAVE: 'Urlop okolicznościowy',
            UNPAID_LEAVE: 'Urlop bezpłatny',
            OTHER: 'Inna',
        };

        return <Badge variant="primary">{labels[type]}</Badge>;
    };

    if (isLoading) {
        return (
            <Container>
                <p>Ładowanie nieobecności...</p>
            </Container>
        );
    }

    return (
        <Container>
            <Header>
                <Button size="sm" onClick={() => setShowCreateModal(true)} disabled={isCancelling}>
                    <Plus size={16} />
                    Zgłoś nieobecność
                </Button>
            </Header>

            {absences.length === 0 ? (
                <EmptyState>
                    <EmptyIcon>
                        <CalendarOff size={32} />
                    </EmptyIcon>
                    <EmptyTitle>Brak nieobecności</EmptyTitle>
                    <EmptyText>
                        Nie ma żadnych zaplanowanych ani zrealizowanych nieobecności dla tego kierowcy
                    </EmptyText>
                </EmptyState>
            ) : (
                <>
                    {upcomingAbsences.length > 0 && (
                        <>
                            <SectionTitle>
                                📍 Nadchodzące nieobecności ({upcomingAbsences.length})
                            </SectionTitle>
                            <AbsencesList>
                                {upcomingAbsences.map((absence) => (
                                    <AbsenceCard key={absence.id} $urgency={getUrgency(absence)}>
                                        <AbsenceHeader>
                                            <AbsenceDate>
                                                <Calendar size={20} />
                                                {getDateLabel(absence)}
                                            </AbsenceDate>
                                            <AbsenceActions>
                                                <Button
                                                    size="sm"
                                                    variant="danger"
                                                    onClick={() => handleOpenCancelModal(absence)}
                                                    isLoading={isCancelling && absenceToCancel?.id === absence.id}
                                                    disabled={isCancelling && absenceToCancel?.id !== absence.id}
                                                >
                                                    Anuluj
                                                </Button>
                                            </AbsenceActions>
                                        </AbsenceHeader>

                                        <AbsenceInfo>
                                            <InfoRow>
                                                <InfoLabel>Typ:</InfoLabel>
                                                <InfoValue>{getTypeBadge(absence.type)}</InfoValue>
                                            </InfoRow>

                                            {absence.reason && (
                                                <InfoRow>
                                                    <FileText size={16} />
                                                    <InfoLabel>Powód:</InfoLabel>
                                                    <InfoValue>{absence.reason}</InfoValue>
                                                </InfoRow>
                                            )}

                                            <InfoRow>
                                                <Clock size={16} />
                                                <InfoLabel>Zgłoszono:</InfoLabel>
                                                <InfoValue>
                                                    {formatDateTime(absence.createdAt)} przez {absence.createdBy}
                                                </InfoValue>
                                            </InfoRow>
                                        </AbsenceInfo>
                                    </AbsenceCard>
                                ))}
                            </AbsencesList>
                        </>
                    )}

                    {upcomingAbsences.length > 0 && completedAbsences.length > 0 && <Divider />}

                    {completedAbsences.length > 0 && (
                        <>
                            <SectionTitle>
                                📊 Historia ({completedAbsences.length})
                            </SectionTitle>
                            <AbsencesList>
                                {completedAbsences.map((absence) => (
                                    <AbsenceCard key={absence.id} $urgency={getUrgency(absence)}>
                                        <AbsenceHeader>
                                            <AbsenceDate>
                                                <Calendar size={20} />
                                                {getDateLabel(absence)}
                                            </AbsenceDate>
                                            {getStatusBadge(absence.status)}
                                        </AbsenceHeader>

                                        <AbsenceInfo>
                                            <InfoRow>
                                                <InfoLabel>Typ:</InfoLabel>
                                                <InfoValue>{getTypeBadge(absence.type)}</InfoValue>
                                            </InfoRow>

                                            {absence.reason && (
                                                <InfoRow>
                                                    <FileText size={16} />
                                                    <InfoLabel>Powód:</InfoLabel>
                                                    <InfoValue>{absence.reason}</InfoValue>
                                                </InfoRow>
                                            )}

                                            {absence.status === 'CANCELLED' && absence.cancellationReason && (
                                                <InfoRow>
                                                    <FileText size={16} />
                                                    <InfoLabel>Powód anulowania:</InfoLabel>
                                                    <InfoValue>{absence.cancellationReason}</InfoValue>
                                                </InfoRow>
                                            )}
                                        </AbsenceInfo>
                                    </AbsenceCard>
                                ))}
                            </AbsencesList>
                        </>
                    )}
                </>
            )}

            <CreateDriverAbsenceModal
                isOpen={showCreateModal}
                onClose={handleCloseCreateModal}
                driverId={driverId}
            />

            <CancelDriverAbsenceModal
                isOpen={!!absenceToCancel}
                onClose={handleCloseCancelModal}
                absence={absenceToCancel}
                driverId={driverId}
            />
        </Container>
    );
};