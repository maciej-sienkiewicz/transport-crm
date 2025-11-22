// src/features/routes/components/AddChildToSeriesModal/AddChildToSeriesModal.tsx

import React, { useState, useEffect } from 'react';
import { Modal } from '@/shared/ui/Modal';
import { Input } from '@/shared/ui/Input';
import { Select } from '@/shared/ui/Select';
import { Button } from '@/shared/ui/Button';
import { Info } from 'lucide-react';
import { useAddChildToSeries } from '../../hooks/useAddChildToSeries';
import { useAvailableChildren } from '../../hooks/useAvailableChildren';
import { RouteSeriesDetail } from '../../types';
import { getTomorrowDate } from '@/shared/utils/urlParams';
import { ConflictModal, ConflictData } from '../ConflictModal';
import {
    FormGrid,
    GridRow,
    InfoBanner,
    ButtonGroup,
} from './AddChildToSeriesModal.styles';

interface AddChildToSeriesModalProps {
    isOpen: boolean;
    onClose: () => void;
    series: RouteSeriesDetail;
}

export const AddChildToSeriesModal: React.FC<AddChildToSeriesModalProps> = ({
                                                                                isOpen,
                                                                                onClose,
                                                                                series,
                                                                            }) => {
    const addChild = useAddChildToSeries();

    const [effectiveFrom, setEffectiveFrom] = useState(getTomorrowDate());
    const [effectiveTo, setEffectiveTo] = useState('');
    const [selectedChildId, setSelectedChildId] = useState('');
    const [selectedScheduleId, setSelectedScheduleId] = useState('');
    const [pickupStopOrder, setPickupStopOrder] = useState('1');
    const [dropoffStopOrder, setDropoffStopOrder] = useState('2');
    const [conflictData, setConflictData] = useState<ConflictData | null>(null);
    const [isConflictModalOpen, setIsConflictModalOpen] = useState(false);

    const { data: availableChildren } = useAvailableChildren(effectiveFrom, isOpen);

    useEffect(() => {
        if (addChild.isError && addChild.error) {
            const error: any = addChild.error;

            if (error?.statusCode === 409 && error?.data?.conflicts) {
                setConflictData({
                    message: error.data.message || 'Schedule conflicts detected',
                    conflicts: error.data.conflicts,
                    timestamp: error.data.timestamp || new Date().toISOString(),
                });
                setIsConflictModalOpen(true);
                addChild.reset();
            }
        }
    }, [addChild.isError, addChild.error]);

    useEffect(() => {
        if (isOpen) {
            setEffectiveFrom(getTomorrowDate());
            setEffectiveTo('');
            setSelectedChildId('');
            setSelectedScheduleId('');
            setPickupStopOrder('1');
            setDropoffStopOrder('2');
            setConflictData(null);
            setIsConflictModalOpen(false);
        }
    }, [isOpen]);

    const handleSubmit = async () => {
        if (!selectedChildId || !selectedScheduleId) {
            alert('Wybierz dziecko i harmonogram');
            return;
        }

        const pickupOrder = parseInt(pickupStopOrder, 10);
        const dropoffOrder = parseInt(dropoffStopOrder, 10);

        if (isNaN(pickupOrder) || isNaN(dropoffOrder) || pickupOrder >= dropoffOrder) {
            alert('Nieprawidłowe numery pozycji stopów');
            return;
        }

        try {
            await addChild.mutateAsync({
                seriesId: series.id,
                data: {
                    childId: selectedChildId,
                    scheduleId: selectedScheduleId,
                    pickupStopOrder: pickupOrder,
                    dropoffStopOrder: dropoffOrder,
                    effectiveFrom,
                    effectiveTo: effectiveTo || null,
                },
            });
            onClose();
        } catch (error: any) {
            // ApiError ma statusCode i data
            if (error?.statusCode === 409 && error?.data?.conflicts) {
                setConflictData({
                    message: error.data.message || 'Schedule conflicts detected',
                    conflicts: error.data.conflicts,
                    timestamp: error.data.timestamp || new Date().toISOString(),
                });
                setIsConflictModalOpen(true);
            }
        }
    };

    const handleCloseConflictModal = () => {
        setIsConflictModalOpen(false);
        setConflictData(null);
    };

    const selectedChild = availableChildren?.find((c) => c.id === selectedChildId);

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} title="Dodaj dziecko do serii">
                <FormGrid>
                    <Select
                        label="Dziecko"
                        required
                        value={selectedChildId}
                        onChange={(e) => {
                            setSelectedChildId(e.target.value);
                            const child = availableChildren?.find((c) => c.id === e.target.value);
                            if (child?.schedule) {
                                setSelectedScheduleId(child.schedule.id);
                            }
                        }}
                        options={
                            availableChildren?.map((child) => ({
                                value: child.id,
                                label: `${child.firstName} ${child.lastName} (${child.age} lat)`,
                            })) || []
                        }
                    />

                    {selectedChild && (
                        <Select
                            label="Harmonogram"
                            required
                            value={selectedScheduleId}
                            onChange={(e) => setSelectedScheduleId(e.target.value)}
                            options={[
                                {
                                    value: selectedChild.schedule.id,
                                    label: selectedChild.schedule.name,
                                },
                            ]}
                        />
                    )}

                    <GridRow>
                        <Input
                            label="Pozycja odbioru"
                            type="number"
                            required
                            min="1"
                            value={pickupStopOrder}
                            onChange={(e) => setPickupStopOrder(e.target.value)}
                            helperText="Numer kolejności w trasie"
                        />
                        <Input
                            label="Pozycja dowozu"
                            type="number"
                            required
                            min="2"
                            value={dropoffStopOrder}
                            onChange={(e) => setDropoffStopOrder(e.target.value)}
                            helperText="Musi być większy od odbioru"
                        />
                    </GridRow>

                    <GridRow>
                        <Input
                            label="Obowiązuje od"
                            type="date"
                            required
                            value={effectiveFrom}
                            onChange={(e) => setEffectiveFrom(e.target.value)}
                        />
                        <Input
                            label="Obowiązuje do (opcjonalnie)"
                            type="date"
                            value={effectiveTo}
                            onChange={(e) => setEffectiveTo(e.target.value)}
                            helperText="Zostaw puste dla bezterminowego"
                        />
                    </GridRow>

                    <InfoBanner>
                        <Info size={20} />
                        <div>
                            <strong>Wpływ na trasy:</strong>
                            <br />
                            Dziecko zostanie dodane do wszystkich przyszłych tras w tej serii od wybranej
                            daty. Istniejące trasy zostaną automatycznie zaktualizowane.
                        </div>
                    </InfoBanner>

                    <ButtonGroup>
                        <Button variant="secondary" onClick={onClose} disabled={addChild.isPending}>
                            Anuluj
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleSubmit}
                            isLoading={addChild.isPending}
                            disabled={!selectedChildId || !selectedScheduleId || addChild.isPending}
                        >
                            Dodaj do serii
                        </Button>
                    </ButtonGroup>
                </FormGrid>
            </Modal>

            <ConflictModal
                isOpen={isConflictModalOpen}
                onClose={handleCloseConflictModal}
                conflictData={conflictData}
            />
        </>
    );
};