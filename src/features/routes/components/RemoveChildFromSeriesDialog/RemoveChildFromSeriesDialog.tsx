// src/features/routes/components/RemoveChildFromSeriesDialog/RemoveChildFromSeriesDialog.tsx

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Modal } from '@/shared/ui/Modal';
import { Input } from '@/shared/ui/Input';
import { Checkbox } from '@/shared/ui/Checkbox';
import { Button } from '@/shared/ui/Button';
import { AlertTriangle } from 'lucide-react';
import { useRemoveChildFromSeries } from '../../hooks/useRemoveChildFromSeries';
import { getTomorrowDate } from '@/shared/utils/urlParams';

const FormGrid = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.lg};
`;

const WarningBanner = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.sm};
    padding: ${({ theme }) => theme.spacing.md};
    background: ${({ theme }) => theme.colors.danger[50]};
    border: 1px solid ${({ theme }) => theme.colors.danger[200]};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.danger[900]};

    svg {
        flex-shrink: 0;
        color: ${({ theme }) => theme.colors.danger[600]};
    }
`;

const ChildInfo = styled.div`
    padding: ${({ theme }) => theme.spacing.md};
    background: ${({ theme }) => theme.colors.slate[50]};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    border: 1px solid ${({ theme }) => theme.colors.slate[200]};
`;

const ChildName = styled.div`
    font-size: 1rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[900]};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ChildMeta = styled.div`
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.slate[600]};
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.sm};
    justify-content: flex-end;
    margin-top: ${({ theme }) => theme.spacing.lg};
`;

interface RemoveChildFromSeriesDialogProps {
    isOpen: boolean;
    onClose: () => void;
    seriesId: string;
    scheduleId: string;
    childName: string;
}

export const RemoveChildFromSeriesDialog: React.FC<RemoveChildFromSeriesDialogProps> = ({
                                                                                            isOpen,
                                                                                            onClose,
                                                                                            seriesId,
                                                                                            scheduleId,
                                                                                            childName,
                                                                                        }) => {
    const removeChild = useRemoveChildFromSeries();

    const [effectiveFrom, setEffectiveFrom] = useState(getTomorrowDate());
    const [cancelExistingStops, setCancelExistingStops] = useState(true);

    useEffect(() => {
        if (isOpen) {
            setEffectiveFrom(getTomorrowDate());
            setCancelExistingStops(true);
        }
    }, [isOpen]);

    const handleSubmit = async () => {
        if (!effectiveFrom) {
            alert('Wybierz datę');
            return;
        }

        const confirmRemove = window.confirm(
            `Czy na pewno chcesz usunąć ${childName} z serii od ${effectiveFrom}?\n\nTa operacja jest nieodwracalna.`
        );

        if (!confirmRemove) return;

        try {
            await removeChild.mutateAsync({
                seriesId,
                scheduleId,
                data: {
                    effectiveFrom,
                    cancelExistingStops,
                },
            });
            onClose();
        } catch (error) {
            console.error('Error removing child from series:', error);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Usuń dziecko z serii">
            <FormGrid>
                <ChildInfo>
                    <ChildName>{childName}</ChildName>
                    <ChildMeta>ID Harmonogramu: {scheduleId}</ChildMeta>
                </ChildInfo>

                <Input
                    label="Usunąć od daty"
                    type="date"
                    required
                    value={effectiveFrom}
                    onChange={(e) => setEffectiveFrom(e.target.value)}
                    helperText="Od tej daty dziecko nie będzie już w serii"
                />

                <Checkbox
                    label="Anuluj już zaplanowane przystanki"
                    checked={cancelExistingStops}
                    onChange={(e) => setCancelExistingStops(e.target.checked)}
                />

                <WarningBanner>
                    <AlertTriangle size={20} />
                    <div>
                        <strong>Uwaga:</strong> Ta operacja jest nieodwracalna. Dziecko zostanie usunięte
                        ze wszystkich przyszłych tras w tej serii.
                        {cancelExistingStops && (
                            <>
                                <br />
                                <br />
                                Wszystkie już zaplanowane przystanki dla tego dziecka zostaną anulowane.
                            </>
                        )}
                    </div>
                </WarningBanner>

                <ButtonGroup>
                    <Button variant="secondary" onClick={onClose} disabled={removeChild.isPending}>
                        Anuluj
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleSubmit}
                        isLoading={removeChild.isPending}
                        disabled={!effectiveFrom || removeChild.isPending}
                    >
                        Usuń z serii
                    </Button>
                </ButtonGroup>
            </FormGrid>
        </Modal>
    );
};