// src/features/routes/components/CreateSeriesModal/CreateSeriesModal.tsx

import React, { useState, useEffect } from 'react';
import { Modal } from '@/shared/ui/Modal';
import { Input } from '@/shared/ui/Input';
import { Checkbox } from '@/shared/ui/Checkbox';
import { Button } from '@/shared/ui/Button';
import { Info, Calendar, Repeat } from 'lucide-react';
import { useCreateRouteSeries } from '../../hooks/useCreateRouteSeries';
import { RouteDetail, RecurrenceInterval } from '../../types';
import {
    FormGrid,
    RecurrenceOptions,
    RecurrenceOption,
    InfoSection,
    InfoRow,
    ButtonGroup,
} from './CreateSeriesModal.styles';

interface CreateSeriesModalProps {
    isOpen: boolean;
    onClose: () => void;
    route: RouteDetail;
}

const getDayOfWeek = (dateString: string): string => {
    const days = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];
    const date = new Date(dateString);
    return days[date.getDay()];
};

const getNextSameDay = (dateString: string): string => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 7);
    return date.toISOString().split('T')[0];
};

const calculateEstimatedRoutes = (
    startDate: string,
    endDate: string | null,
    interval: RecurrenceInterval
): number => {
    if (!endDate) return 999; // Bezterminowo

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));

    return Math.floor(diffWeeks / interval);
};

export const CreateSeriesModal: React.FC<CreateSeriesModalProps> = ({
                                                                        isOpen,
                                                                        onClose,
                                                                        route,
                                                                    }) => {
    const createSeries = useCreateRouteSeries();

    const [seriesName, setSeriesName] = useState(route.routeName);
    const [recurrenceInterval, setRecurrenceInterval] = useState<RecurrenceInterval>(1);
    const [startDate, setStartDate] = useState(getNextSameDay(route.date));
    const [hasEndDate, setHasEndDate] = useState(false);
    const [endDate, setEndDate] = useState('');

    const dayOfWeek = getDayOfWeek(startDate);
    const estimatedRoutes = calculateEstimatedRoutes(
        startDate,
        hasEndDate ? endDate : null,
        recurrenceInterval
    );

    useEffect(() => {
        if (isOpen) {
            setSeriesName(route.routeName);
            setRecurrenceInterval(1);
            setStartDate(getNextSameDay(route.date));
            setHasEndDate(false);
            setEndDate('');
        }
    }, [isOpen, route]);

    const handleSubmit = async () => {
        if (!seriesName.trim()) {
            return;
        }

        if (hasEndDate && endDate && new Date(endDate) <= new Date(startDate)) {
            alert('Data zakończenia musi być późniejsza niż data rozpoczęcia');
            return;
        }

        await createSeries.mutateAsync({
            routeId: route.id,
            data: {
                seriesName: seriesName.trim(),
                recurrenceInterval,
                startDate,
                endDate: hasEndDate ? endDate : null,
            },
        });

        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Utwórz cykliczną serię tras">
            <FormGrid>
                <Input
                    label="Nazwa serii"
                    required
                    value={seriesName}
                    onChange={(e) => setSeriesName(e.target.value)}
                    placeholder="np. Monday Morning Route A"
                />

                <div>
                    <label
                        style={{
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            color: '#334155',
                            marginBottom: '0.5rem',
                        }}
                    >
                        Częstotliwość *
                    </label>
                    <RecurrenceOptions>
                        <RecurrenceOption $checked={recurrenceInterval === 1}>
                            <input
                                type="radio"
                                name="recurrence"
                                checked={recurrenceInterval === 1}
                                onChange={() => setRecurrenceInterval(1)}
                            />
                            Co tydzień
                        </RecurrenceOption>
                        <RecurrenceOption $checked={recurrenceInterval === 2}>
                            <input
                                type="radio"
                                name="recurrence"
                                checked={recurrenceInterval === 2}
                                onChange={() => setRecurrenceInterval(2)}
                            />
                            Co 2 tygodnie
                        </RecurrenceOption>
                        <RecurrenceOption $checked={recurrenceInterval === 3}>
                            <input
                                type="radio"
                                name="recurrence"
                                checked={recurrenceInterval === 3}
                                onChange={() => setRecurrenceInterval(3)}
                            />
                            Co 3 tygodnie
                        </RecurrenceOption>
                        <RecurrenceOption $checked={recurrenceInterval === 4}>
                            <input
                                type="radio"
                                name="recurrence"
                                checked={recurrenceInterval === 4}
                                onChange={() => setRecurrenceInterval(4)}
                            />
                            Co 4 tygodnie
                        </RecurrenceOption>
                    </RecurrenceOptions>
                </div>

                <Input
                    label="Powtarzaj od"
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />

                <Checkbox
                    label="Ustaw datę zakończenia"
                    checked={hasEndDate}
                    onChange={(e) => setHasEndDate(e.target.checked)}
                />

                {hasEndDate && (
                    <Input
                        label="Data zakończenia"
                        type="date"
                        required={hasEndDate}
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        helperText="Pozostaw puste dla bezterminowej serii"
                    />
                )}

                <InfoSection>
                    <InfoRow>
                        <Calendar size={16} />
                        <strong>Dzień tygodnia:</strong> {dayOfWeek}
                    </InfoRow>
                    <InfoRow>
                        <Repeat size={16} />
                        <strong>Szacowana liczba tras:</strong>{' '}
                        {hasEndDate && endDate ? `~${estimatedRoutes}` : 'Bezterminowo'}
                    </InfoRow>
                    <InfoRow>
                        <Info size={16} />
                        System wygeneruje automatycznie 2 trasy od razu, pozostałe będą
                        generowane codziennie o 2:00
                    </InfoRow>
                </InfoSection>

                <ButtonGroup>
                    <Button variant="secondary" onClick={onClose} disabled={createSeries.isPending}>
                        Anuluj
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSubmit}
                        isLoading={createSeries.isPending}
                        disabled={!seriesName.trim() || createSeries.isPending}
                    >
                        Utwórz serię
                    </Button>
                </ButtonGroup>
            </FormGrid>
        </Modal>
    );
};