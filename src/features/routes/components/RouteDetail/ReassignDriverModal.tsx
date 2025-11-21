// src/features/routes/components/RouteDetail/ReassignDriverModal.tsx

import React, { useState } from 'react';
import styled from 'styled-components';
import { Modal } from '@/shared/ui/Modal';
import { Button } from '@/shared/ui/Button';
import { Select } from '@/shared/ui/Select';
import { Input } from '@/shared/ui/Input';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { AlertCircle } from 'lucide-react';
import { useAvailableDrivers } from '../../hooks/useAvailableDrivers';
import { useReassignDriver } from '../../hooks/useReassignDriver';
import {useAvailableDriversForDate} from "@/features/drivers/hooks/useAvailableDriversForDate.ts";

const FormContainer = styled.form`
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
    color: ${({ theme }) => theme.colors.primary[700]};

    svg {
        flex-shrink: 0;
        margin-top: 2px;
    }
`;

const CurrentDriverInfo = styled.div`
    padding: ${({ theme }) => theme.spacing.md};
    background: ${({ theme }) => theme.colors.slate[50]};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.slate[700]};
`;

const DriverOption = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
`;

const DriverName = styled.span`
    font-weight: 600;
`;

const DriverInfo = styled.span`
    font-size: 0.8125rem;
    color: ${({ theme }) => theme.colors.slate[500]};
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.sm};
    justify-content: flex-end;
    margin-top: ${({ theme }) => theme.spacing.md};
`;

interface ReassignDriverModalProps {
    isOpen: boolean;
    onClose: () => void;
    routeId: string;
    routeDate: string;
    currentDriver: {
        id: string;
        firstName: string;
        lastName: string;
        phone: string;
    };
}

export const ReassignDriverModal: React.FC<ReassignDriverModalProps> = ({
                                                                            isOpen,
                                                                            onClose,
                                                                            routeId,
                                                                            routeDate,
                                                                            currentDriver,
                                                                        }) => {
    const [selectedDriverId, setSelectedDriverId] = useState('');
    const [reason, setReason] = useState('');

    const { data: availableDrivers, isLoading } = useAvailableDrivers();

    const reassignDriver = useReassignDriver();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedDriverId) {
            return;
        }

        try {
            await reassignDriver.mutateAsync({
                routeId,
                newDriverId: selectedDriverId,
                reason: reason || undefined,
            });
            onClose();
            setSelectedDriverId('');
            setReason('');
        } catch (error) {
            // Error handled by mutation
        }
    };

    const handleClose = () => {
        onClose();
        setSelectedDriverId('');
        setReason('');
    };

    // Filtruj dostępnych kierowców (bez obecnego kierowcy)
    const filteredDrivers = availableDrivers?.content || [];

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Zmień kierowcę">
            <FormContainer onSubmit={handleSubmit}>
                <CurrentDriverInfo>
                    <strong>Obecny kierowca:</strong> {currentDriver.firstName}{' '}
                    {currentDriver.lastName} ({currentDriver.phone})
                </CurrentDriverInfo>

                <InfoBanner>
                    <AlertCircle size={16} />
                    <div>
                        Lista zawiera tylko kierowców dostępnych w dniu realizacji trasy (
                        {new Date(routeDate).toLocaleDateString('pl-PL')}).
                    </div>
                </InfoBanner>

                {isLoading ? (
                    <LoadingSpinner />
                ) : filteredDrivers.length === 0 ? (
                    <InfoBanner>
                        <AlertCircle size={16} />
                        <div>
                            Brak innych dostępnych kierowców w tym dniu. Wszyscy kierowcy mogą być
                            już przypisani do innych tras lub być nieaktywni.
                        </div>
                    </InfoBanner>
                ) : (
                    <>
                        <Select
                            label="Nowy kierowca"
                            value={selectedDriverId}
                            onChange={(e) => setSelectedDriverId(e.target.value)}
                            options={filteredDrivers.map((driver) => {
                                const assignmentInfo =
                                    driver.todayRoutesCount > 0
                                        ? ` (Przypisany do ${driver.todayRoutesCount} tras)`
                                        : ' (Wolny)';

                                return {
                                    value: driver.id,
                                    label: `${driver.firstName} ${driver.lastName}${assignmentInfo}`,
                                };
                            })}
                            required
                        />

                        <Input
                            label="Powód zmiany (opcjonalnie)"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="np. Choroba kierowcy, zmiana dyspozycyjności..."
                            maxLength={5000}
                        />
                    </>
                )}

                <ButtonGroup>
                    <Button type="button" variant="secondary" onClick={handleClose}>
                        Anuluj
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={!selectedDriverId || reassignDriver.isPending}
                        isLoading={reassignDriver.isPending}
                    >
                        Zmień kierowcę
                    </Button>
                </ButtonGroup>
            </FormContainer>
        </Modal>
    );
};