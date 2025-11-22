// src/features/routes/components/UpdateRouteStatusModal/UpdateRouteStatusModal.tsx

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { X, Play, CheckCircle, Ban, Clock } from 'lucide-react';
import { Modal } from '@/shared/ui/Modal';
import { Button } from '@/shared/ui/Button';
import { Select } from '@/shared/ui/Select';
import { Input } from '@/shared/ui/Input';
import { RouteStatus, RouteDetail } from '../../types';
import { useUpdateRouteStatus } from '../../hooks/useUpdateRouteStatus';

const FormGrid = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.lg};
`;

const InfoBanner = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.sm};
    padding: ${({ theme }) => theme.spacing.md};
    background: ${({ theme }) => theme.colors.primary[50]};
    border: 1px solid ${({ theme }) => theme.colors.primary[200]};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.primary[900]};
    line-height: 1.5;

    svg {
        flex-shrink: 0;
        color: ${({ theme }) => theme.colors.primary[600]};
    }
`;

const WarningBanner = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.sm};
    padding: ${({ theme }) => theme.spacing.md};
    background: ${({ theme }) => theme.colors.warning[50]};
    border: 1px solid ${({ theme }) => theme.colors.warning[300]};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.warning[900]};
    line-height: 1.5;

    svg {
        flex-shrink: 0;
        color: ${({ theme }) => theme.colors.warning[700]};
    }
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.sm};
    justify-content: flex-end;
    margin-top: ${({ theme }) => theme.spacing.lg};
`;

interface UpdateRouteStatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    route: RouteDetail;
}

const statusOptions = [
    { value: 'IN_PROGRESS', label: 'W trakcie', icon: Play },
    { value: 'COMPLETED', label: 'Zakończona', icon: CheckCircle },
    { value: 'CANCELLED', label: 'Anulowana', icon: Ban },
];

const getCurrentDateTime = (): string => {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const localTime = new Date(now.getTime() - offset * 60 * 1000);
    return localTime.toISOString().slice(0, 16);
};

export const UpdateRouteStatusModal: React.FC<UpdateRouteStatusModalProps> = ({
                                                                                  isOpen,
                                                                                  onClose,
                                                                                  route,
                                                                              }) => {
    const updateStatus = useUpdateRouteStatus();
    const [newStatus, setNewStatus] = useState<RouteStatus>('IN_PROGRESS');
    const [actualStartTime, setActualStartTime] = useState('');
    const [actualEndTime, setActualEndTime] = useState('');

    useEffect(() => {
        if (isOpen) {
            // Ustaw domyślny status w zależności od obecnego
            if (route.status === 'PLANNED') {
                setNewStatus('IN_PROGRESS');
                setActualStartTime(getCurrentDateTime());
            } else if (route.status === 'IN_PROGRESS') {
                setNewStatus('COMPLETED');
                setActualEndTime(getCurrentDateTime());
            }
        }
    }, [isOpen, route.status]);

    const handleSubmit = async () => {
        const data: any = { status: newStatus };

        if (newStatus === 'IN_PROGRESS') {
            if (!actualStartTime) {
                alert('Podaj rzeczywisty czas rozpoczęcia');
                return;
            }
            data.actualStartTime = new Date(actualStartTime).toISOString();
        }

        if (newStatus === 'COMPLETED') {
            if (!actualEndTime) {
                alert('Podaj rzeczywisty czas zakończenia');
                return;
            }
            data.actualEndTime = new Date(actualEndTime).toISOString();
        }

        await updateStatus.mutateAsync({
            routeId: route.id,
            data,
        });

        onClose();
    };

    const getStatusMessage = () => {
        switch (newStatus) {
            case 'IN_PROGRESS':
                return 'Trasa zostanie oznaczona jako rozpoczęta. Musisz podać rzeczywisty czas rozpoczęcia.';
            case 'COMPLETED':
                return 'Trasa zostanie oznaczona jako zakończona. Musisz podać rzeczywisty czas zakończenia.';
            case 'CANCELLED':
                return 'Trasa zostanie anulowana. Tej operacji nie można cofnąć.';
            default:
                return '';
        }
    };

    const isFormValid = () => {
        if (newStatus === 'IN_PROGRESS' && !actualStartTime) return false;
        if (newStatus === 'COMPLETED' && !actualEndTime) return false;
        return true;
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Zmień status trasy">
            <FormGrid>
                <Select
                    label="Nowy status"
                    required
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as RouteStatus)}
                    options={statusOptions.map((opt) => ({
                        value: opt.value,
                        label: opt.label,
                    }))}
                />

                {newStatus === 'IN_PROGRESS' && (
                    <Input
                        label="Rzeczywisty czas rozpoczęcia"
                        type="datetime-local"
                        required
                        value={actualStartTime}
                        onChange={(e) => setActualStartTime(e.target.value)}
                        helperText="Podaj dokładny czas rozpoczęcia trasy"
                    />
                )}

                {newStatus === 'COMPLETED' && (
                    <Input
                        label="Rzeczywisty czas zakończenia"
                        type="datetime-local"
                        required
                        value={actualEndTime}
                        onChange={(e) => setActualEndTime(e.target.value)}
                        helperText="Podaj dokładny czas zakończenia trasy"
                    />
                )}

                {newStatus === 'CANCELLED' ? (
                    <WarningBanner>
                        <Ban size={20} />
                        <div>
                            <strong>Uwaga!</strong>
                            <br />
                            {getStatusMessage()}
                        </div>
                    </WarningBanner>
                ) : (
                    <InfoBanner>
                        <Clock size={20} />
                        <div>{getStatusMessage()}</div>
                    </InfoBanner>
                )}

                <ButtonGroup>
                    <Button variant="secondary" onClick={onClose} disabled={updateStatus.isPending}>
                        Anuluj
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSubmit}
                        isLoading={updateStatus.isPending}
                        disabled={!isFormValid() || updateStatus.isPending}
                    >
                        Zmień status
                    </Button>
                </ButtonGroup>
            </FormGrid>
        </Modal>
    );
};