// src/features/routes/components/CancelSeriesDialog/CancelSeriesDialog.tsx

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Modal } from '@/shared/ui/Modal';
import { Input } from '@/shared/ui/Input';
import { Checkbox } from '@/shared/ui/Checkbox';
import { Button } from '@/shared/ui/Button';
import { AlertTriangle } from 'lucide-react';
import { useCancelRouteSeries } from '../../hooks/useCancelRouteSeries';
import { RouteSeriesDetail } from '../../types';

const FormGrid = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.lg};
`;

const DangerBanner = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.sm};
    padding: ${({ theme }) => theme.spacing.lg};
    background: ${({ theme }) => theme.colors.danger[50]};
    border: 2px solid ${({ theme }) => theme.colors.danger[300]};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    font-size: 0.9375rem;
    color: ${({ theme }) => theme.colors.danger[900]};

    svg {
        flex-shrink: 0;
        color: ${({ theme }) => theme.colors.danger[600]};
    }
`;

const SeriesInfo = styled.div`
    padding: ${({ theme }) => theme.spacing.md};
    background: ${({ theme }) => theme.colors.slate[50]};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    border: 1px solid ${({ theme }) => theme.colors.slate[200]};
`;

const SeriesName = styled.div`
    font-size: 1.125rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[900]};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const SeriesMeta = styled.div`
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.slate[600]};
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.sm};
    justify-content: flex-end;
    margin-top: ${({ theme }) => theme.spacing.lg};
`;

const DangerButton = styled(Button)`
    background: ${({ theme }) => theme.colors.danger[600]};
    text-transform: uppercase;
    font-weight: 700;
    letter-spacing: 0.05em;

    &:hover:not(:disabled) {
        background: ${({ theme }) => theme.colors.danger[700]};
    }
`;

interface CancelSeriesDialogProps {
    isOpen: boolean;
    onClose: () => void;
    series: RouteSeriesDetail;
}

const getRecurrenceLabel = (interval: number): string => {
    switch (interval) {
        case 1:
            return 'Co tydzień';
        case 2:
            return 'Co 2 tygodnie';
        case 3:
            return 'Co 3 tygodnie';
        case 4:
            return 'Co 4 tygodnie';
        default:
            return `Co ${interval} tygodni`;
    }
};

const getDayLabel = (day: string): string => {
    const days: Record<string, string> = {
        MONDAY: 'Poniedziałki',
        TUESDAY: 'Wtorki',
        WEDNESDAY: 'Środy',
        THURSDAY: 'Czwartki',
        FRIDAY: 'Piątki',
        SATURDAY: 'Soboty',
        SUNDAY: 'Niedziele',
    };
    return days[day] || day;
};

export const CancelSeriesDialog: React.FC<CancelSeriesDialogProps> = ({
                                                                          isOpen,
                                                                          onClose,
                                                                          series,
                                                                      }) => {
    const cancelSeries = useCancelRouteSeries();

    const [reason, setReason] = useState('');
    const [cancelFutureRoutes, setCancelFutureRoutes] = useState(true);

    useEffect(() => {
        if (isOpen) {
            setReason('');
            setCancelFutureRoutes(true);
        }
    }, [isOpen]);

    const handleSubmit = async () => {
        if (!reason.trim()) {
            alert('Podaj powód anulowania');
            return;
        }

        const confirmCancel = window.confirm(
            `CZY NA PEWNO chcesz ANULOWAĆ całą serię "${series.seriesName}"?\n\n` +
            `${cancelFutureRoutes ? 'Wszystkie przyszłe trasy zostaną również ANULOWANE.\n\n' : ''}` +
            `TA OPERACJA JEST NIEODWRACALNA!`
        );

        if (!confirmCancel) return;

        try {
            await cancelSeries.mutateAsync({
                seriesId: series.id,
                data: {
                    reason: reason.trim(),
                    cancelFutureRoutes,
                },
            });

            // Przekieruj do listy serii
            setTimeout(() => {
                window.location.href = '/routes/series';
            }, 1000);
        } catch (error) {
            console.error('Error canceling series:', error);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="⚠️ Anuluj serię tras">
            <FormGrid>
                <SeriesInfo>
                    <SeriesName>{series.seriesName}</SeriesName>
                    <SeriesMeta>
                        {getRecurrenceLabel(series.recurrenceInterval)} • {getDayLabel(series.dayOfWeek)}
                    </SeriesMeta>
                </SeriesInfo>

                <Input
                    label="Powód anulowania"
                    required
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="np. Kierowca zrezygnował"
                    helperText="Powód będzie widoczny w historii"
                />

                <Checkbox
                    label="Anuluj wszystkie przyszłe trasy"
                    checked={cancelFutureRoutes}
                    onChange={(e) => setCancelFutureRoutes(e.target.checked)}
                />

                <DangerBanner>
                    <AlertTriangle size={24} />
                    <div>
                        <strong style={{ fontSize: '1rem', display: 'block', marginBottom: '0.5rem' }}>
                            UWAGA: Ta operacja anuluje całą serię!
                        </strong>
                        <ul style={{ margin: '0.5rem 0 0 1rem', listStyle: 'disc' }}>
                            <li>Seria zostanie oznaczona jako CANCELLED</li>
                            <li>Nie będą generowane nowe trasy</li>
                            {cancelFutureRoutes && <li>Wszystkie przyszłe trasy zostaną anulowane</li>}
                            <li>
                                <strong>Nie można cofnąć tej operacji</strong>
                            </li>
                        </ul>
                    </div>
                </DangerBanner>

                <ButtonGroup>
                    <Button variant="secondary" onClick={onClose} disabled={cancelSeries.isPending}>
                        Nie, zostaw
                    </Button>
                    <DangerButton
                        variant="danger"
                        onClick={handleSubmit}
                        isLoading={cancelSeries.isPending}
                        disabled={!reason.trim() || cancelSeries.isPending}
                    >
                        TAK, ANULUJ SERIĘ
                    </DangerButton>
                </ButtonGroup>
            </FormGrid>
        </Modal>
    );
};