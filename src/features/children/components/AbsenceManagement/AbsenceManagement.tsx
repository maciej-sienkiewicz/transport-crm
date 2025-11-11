import React, { useState } from 'react';
import { Plus, Calendar, Clock, User, FileText, CalendarOff } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
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
} from './AbsenceManagement.styles';

interface AbsenceManagementProps {
    childId: string;
}

interface MockAbsence {
    id: string;
    type: 'FULL_DAY' | 'SPECIFIC_ROUTE';
    startDate: string;
    endDate: string;
    scheduleName?: string;
    reason?: string;
    status: 'PLANNED' | 'ACTIVE' | 'COMPLETED';
    reportedBy: {
        name: string;
        timestamp: string;
    };
}

export const AbsenceManagement: React.FC<AbsenceManagementProps> = ({ childId }) => {
    const [showCreateModal, setShowCreateModal] = useState(false);

    const mockAbsences: MockAbsence[] = [
        {
            id: '1',
            type: 'FULL_DAY',
            startDate: '2025-01-15',
            endDate: '2025-01-15',
            reason: 'Wizyta lekarska',
            status: 'PLANNED',
            reportedBy: {
                name: 'Anna Nowak',
                timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
            },
        },
        {
            id: '2',
            type: 'SPECIFIC_ROUTE',
            startDate: '2025-01-18',
            endDate: '2025-01-20',
            scheduleName: 'Trasa poranna - Dzielnica Północ',
            reason: 'Wyjazd rodzinny',
            status: 'PLANNED',
            reportedBy: {
                name: 'Anna Nowak',
                timestamp: new Date(Date.now() - 5 * 86400000).toISOString(),
            },
        },
        {
            id: '3',
            type: 'FULL_DAY',
            startDate: '2025-01-12',
            endDate: '2025-01-12',
            reason: 'Choroba',
            status: 'COMPLETED',
            reportedBy: {
                name: 'Anna Nowak',
                timestamp: new Date(Date.now() - 3 * 86400000).toISOString(),
            },
        },
    ];

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

    const getUrgency = (absence: MockAbsence): 'urgent' | 'upcoming' | 'planned' | 'completed' => {
        if (absence.status === 'COMPLETED') return 'completed';

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startDate = new Date(absence.startDate);
        startDate.setHours(0, 0, 0, 0);
        const diffDays = Math.floor((startDate.getTime() - today.getTime()) / 86400000);

        if (diffDays <= 1) return 'urgent';
        if (diffDays <= 7) return 'upcoming';
        return 'planned';
    };

    const getDateLabel = (absence: MockAbsence): string => {
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

    const upcomingAbsences = mockAbsences.filter((a) => a.status === 'PLANNED');
    const completedAbsences = mockAbsences.filter((a) => a.status === 'COMPLETED');

    return (
        <Container>
            <Header>
                <Button size="sm" onClick={() => setShowCreateModal(true)}>
                    <Plus size={16} />
                    Zgłoś nieobecność
                </Button>
            </Header>

            {upcomingAbsences.length === 0 && completedAbsences.length === 0 ? (
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
                                                <Button size="sm" variant="secondary">
                                                    Edytuj
                                                </Button>
                                                <Button size="sm" variant="danger">
                                                    Anuluj
                                                </Button>
                                            </AbsenceActions>
                                        </AbsenceHeader>

                                        <AbsenceInfo>
                                            <InfoRow>
                                                <InfoLabel>Typ:</InfoLabel>
                                                <InfoValue>
                                                    {absence.type === 'FULL_DAY' ? (
                                                        <Badge variant="warning">Cały dzień</Badge>
                                                    ) : (
                                                        <Badge variant="primary">{absence.scheduleName}</Badge>
                                                    )}
                                                </InfoValue>
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
                                                <InfoLabel>Zgłoszone:</InfoLabel>
                                                <InfoValue>
                                                    {formatDateTime(absence.reportedBy.timestamp)} przez{' '}
                                                    {absence.reportedBy.name}
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
                                📊 Historia (ostatnie 30 dni)
                            </SectionTitle>
                            <AbsencesList>
                                {completedAbsences.map((absence) => (
                                    <AbsenceCard key={absence.id} $urgency="completed">
                                        <AbsenceHeader>
                                            <AbsenceDate>
                                                <Calendar size={20} />
                                                {getDateLabel(absence)}
                                            </AbsenceDate>
                                            <Badge variant="default">Zakończona</Badge>
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
                                                    <InfoLabel>Powód:</InfoLabel>
                                                    <InfoValue>{absence.reason}</InfoValue>
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
        </Container>
    );
};