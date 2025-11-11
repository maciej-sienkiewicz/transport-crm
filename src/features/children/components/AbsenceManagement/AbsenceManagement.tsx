import React, { useState } from 'react';
import { Plus, Calendar, Clock, FileText, CalendarOff } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { useChildAbsences } from '../../hooks/useChildAbsences';
import { useCancelAbsence } from '../../hooks/useCancelAbsence';
import { Absence, AbsenceStatus, AbsenceType } from '@/shared/types/absence';
import { CreateAbsenceModal } from '../CreateAbsenceModal/CreateAbsenceModal';
import { CancelAbsenceModal } from '../CancelAbsenceModal/CancelAbsenceModal';
import { // Importy stylów pozostawione w jednym bloku
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
} from './AbsenceManagement.styles';

interface AbsenceManagementProps {
    childId: string;
}

export const AbsenceManagement: React.FC<AbsenceManagementProps> = ({ childId }) => {
    // Stan do zarządzania modalem tworzenia nieobecności
    const [showCreateModal, setShowCreateModal] = useState(false);
    // Stan do zarządzania modalem anulowania nieobecności (przechowuje obiekt nieobecności)
    const [absenceToCancel, setAbsenceToCancel] = useState<Absence | null>(null);

    // 1. Użycie prawdziwego hooka do pobierania nieobecności
    const { data, isLoading } = useChildAbsences(childId); //
    const absences = data?.absences || [];

    // 2. Użycie prawdziwego hooka do anulowania nieobecności (aby śledzić stan ładowania)
    const cancelAbsenceMutation = useCancelAbsence(childId); //
    const isCancelling = cancelAbsenceMutation.isPending;

    // Funkcje do zarządzania modalem anulowania
    const handleOpenCancelModal = (absence: Absence) => {
        setAbsenceToCancel(absence);
    };

    const handleCloseCancelModal = () => {
        setAbsenceToCancel(null);
    };

    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
    };

    // --- Logika sortowania i filtrowania ---

    // Nadchodzące (zaplanowane lub aktywne)
    const upcomingAbsences = absences
        .filter((a) => a.status === 'PLANNED' || a.status === 'ACTIVE') //
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    // Zakończone lub anulowane (historia)
    const completedAbsences = absences
        .filter((a) => a.status === 'COMPLETED' || a.status === 'CANCELLED') //
        .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

    // --- Funkcje pomocnicze widoku (zaktualizowane do obsługi typu Absence) ---

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

    const getUrgency = (absence: Absence): 'urgent' | 'upcoming' | 'planned' | 'completed' | 'cancelled' => {
        if (absence.status === 'COMPLETED') return 'completed';
        if (absence.status === 'CANCELLED') return 'cancelled';

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startDate = new Date(absence.startDate);
        startDate.setHours(0, 0, 0, 0);
        const diffDays = Math.floor((startDate.getTime() - today.getTime()) / 86400000);

        if (diffDays <= 1 && diffDays >= 0) return 'urgent'; // Dzisiaj/Jutro lub w trakcie trwania
        if (diffDays <= 7 && diffDays > 1) return 'upcoming';
        return 'planned';
    };

    const getDateLabel = (absence: Absence): string => {
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

    const getStatusBadge = (status: AbsenceStatus) => { //
        switch (status) {
            case 'PLANNED':
                return <Badge variant="warning">Zaplanowana</Badge>; //
            case 'ACTIVE':
                return <Badge variant="primary">Aktywna</Badge>;
            case 'COMPLETED':
                return <Badge variant="default">Zakończona</Badge>; //
            case 'CANCELLED':
                return <Badge variant="danger">Anulowana</Badge>; //
            default:
                return null;
        }
    };

    const getTypeBadge = (type: AbsenceType, scheduleName: string | null) => { //
        return type === 'FULL_DAY' ? (
            <Badge variant="warning">Cały dzień</Badge> //
        ) : (
            <Badge variant="primary">{scheduleName || 'Specyficzny harmonogram'}</Badge> //
        );
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
                        Nie ma żadnych zaplanowanych ani zrealizowanych nieobecności dla tego dziecka
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
                                                <Button size="sm" variant="secondary" disabled={isCancelling}>
                                                    Edytuj
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="danger"
                                                    onClick={() => handleOpenCancelModal(absence)}
                                                    // Dezaktywuj przycisk, jeśli trwa anulowanie innej nieobecności
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
                                                <InfoValue>
                                                    {getTypeBadge(absence.type, absence.scheduleName)}
                                                </InfoValue>
                                            </InfoRow>

                                            {absence.reason && (
                                                <InfoRow>
                                                    <FileText size={16} />
                                                    <InfoLabel>Powód zgłoszenia:</InfoLabel>
                                                    <InfoValue>{absence.reason}</InfoValue>
                                                </InfoRow>
                                            )}

                                            <InfoRow>
                                                <Clock size={16} />
                                                <InfoLabel>Zgłoszono:</InfoLabel>
                                                <InfoValue>
                                                    {formatDateTime(absence.createdAt)}
                                                    {/* W typie Absence nie ma pola 'name' osoby zgłaszającej */}
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
                                                <InfoValue>
                                                    {absence.type === 'FULL_DAY'
                                                        ? 'Cały dzień'
                                                        : absence.scheduleName}
                                                </InfoValue>
                                            </InfoRow>

                                            {absence.reason && (
                                                <InfoRow>
                                                    <FileText size={16} />
                                                    <InfoLabel>Powód zgłoszenia:</InfoLabel>
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

            {/* Modale */}
            <CreateAbsenceModal
                isOpen={showCreateModal}
                onClose={handleCloseCreateModal}
                childId={childId}
            /> {/* */}

            <CancelAbsenceModal
                isOpen={!!absenceToCancel}
                onClose={handleCloseCancelModal}
                absence={absenceToCancel}
                childId={childId}
            /> {/* */}
        </Container>
    );
};