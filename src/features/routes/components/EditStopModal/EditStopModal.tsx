// src/features/routes/components/EditStopModal/EditStopModal.tsx

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { X, MapPin, Clock } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { RouteStop } from '../../types';
import {useUpdateStop} from "@/features/routes/hooks/useUpdateStop.ts";

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${({ theme }) => theme.spacing.lg};
  animation: fadeIn 0.2s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  box-shadow: ${({ theme }) => theme.shadows['2xl']};
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xl};
  border-bottom: 1px solid ${({ theme }) => theme.colors.slate[200]};
  background: ${({ theme }) => theme.gradients.cardHeader};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']}
    ${({ theme }) => theme.borderRadius['2xl']} 0 0;
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.slate[900]};
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.slate[600]};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.slate[100]};
    color: ${({ theme }) => theme.colors.slate[900]};
  }
`;

const ModalContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.slate[700]};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 2px solid ${({ theme }) => theme.colors.slate[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: 0.9375rem;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[50]};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.slate[400]};
  }
`;

const AddressGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.xl};
  border-top: 1px solid ${({ theme }) => theme.colors.slate[200]};
  background: ${({ theme }) => theme.colors.slate[50]};
  border-radius: 0 0 ${({ theme }) => theme.borderRadius['2xl']}
    ${({ theme }) => theme.borderRadius['2xl']};
`;

const InfoBadge = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.primary[50]};
  border: 1px solid ${({ theme }) => theme.colors.primary[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const InfoText = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.primary[700]};
  margin: 0;
`;

interface EditStopModalProps {
    isOpen: boolean;
    onClose: () => void;
    routeId: string;
    stop: RouteStop | null;
}

export const EditStopModal: React.FC<EditStopModalProps> = ({
                                                                isOpen,
                                                                onClose,
                                                                routeId,
                                                                stop,
                                                            }) => {
    const [formData, setFormData] = useState({
        estimatedTime: '',
        label: '',
        street: '',
        houseNumber: '',
        apartmentNumber: '',
        postalCode: '',
        city: '',
    });

    const updateStop = useUpdateStop();

    useEffect(() => {
        if (stop) {
            setFormData({
                estimatedTime: stop.estimatedTime,
                label: stop.address.label || '',
                street: stop.address.street,
                houseNumber: stop.address.houseNumber,
                apartmentNumber: stop.address.apartmentNumber || '',
                postalCode: stop.address.postalCode,
                city: stop.address.city,
            });
        }
    }, [stop]);

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (!stop) return;

        try {
            await updateStop.mutateAsync({
                routeId,
                stopId: stop.id,
                data: {
                    estimatedTime: formData.estimatedTime,
                    address: {
                        label: formData.label || undefined,
                        street: formData.street,
                        houseNumber: formData.houseNumber,
                        apartmentNumber: formData.apartmentNumber || undefined,
                        postalCode: formData.postalCode,
                        city: formData.city,
                    },
                },
            });

            onClose();
        } catch (error) {
            console.error('Error updating stop:', error);
        }
    };

    const handleClose = () => {
        onClose();
    };

    if (!stop) return null;

    return (
        <ModalOverlay $isOpen={isOpen} onClick={handleClose}>
            <ModalContainer onClick={(e) => e.stopPropagation()}>
                <ModalHeader>
                    <ModalTitle>
                        Edytuj punkt {stop.stopType === 'PICKUP' ? 'odbioru' : 'dowozu'}
                    </ModalTitle>
                    <CloseButton onClick={handleClose}>
                        <X size={20} />
                    </CloseButton>
                </ModalHeader>

                <ModalContent>
                    <InfoBadge>
                        <InfoText>
                            <strong>Dziecko:</strong> {stop.childFirstName} {stop.childLastName}
                        </InfoText>
                    </InfoBadge>

                    <FormGroup>
                        <Label>
                            <Clock size={16} />
                            Planowany czas
                        </Label>
                        <Input
                            type="time"
                            value={formData.estimatedTime}
                            onChange={(e) => handleChange('estimatedTime', e.target.value)}
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label>
                            <MapPin size={16} />
                            Etykieta adresu (opcjonalnie)
                        </Label>
                        <Input
                            type="text"
                            placeholder="np. Dom, Szkoła"
                            value={formData.label}
                            onChange={(e) => handleChange('label', e.target.value)}
                            maxLength={100}
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label>Ulica *</Label>
                        <Input
                            type="text"
                            placeholder="np. Kwiatowa"
                            value={formData.street}
                            onChange={(e) => handleChange('street', e.target.value)}
                            required
                        />
                    </FormGroup>

                    <AddressGrid>
                        <FormGroup>
                            <Label>Numer domu *</Label>
                            <Input
                                type="text"
                                placeholder="np. 10"
                                value={formData.houseNumber}
                                onChange={(e) => handleChange('houseNumber', e.target.value)}
                                required
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label>Numer mieszkania</Label>
                            <Input
                                type="text"
                                placeholder="np. 5"
                                value={formData.apartmentNumber}
                                onChange={(e) => handleChange('apartmentNumber', e.target.value)}
                            />
                        </FormGroup>
                    </AddressGrid>

                    <AddressGrid>
                        <FormGroup>
                            <Label>Kod pocztowy *</Label>
                            <Input
                                type="text"
                                placeholder="00-001"
                                value={formData.postalCode}
                                onChange={(e) => handleChange('postalCode', e.target.value)}
                                required
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label>Miasto *</Label>
                            <Input
                                type="text"
                                placeholder="Warszawa"
                                value={formData.city}
                                onChange={(e) => handleChange('city', e.target.value)}
                                required
                            />
                        </FormGroup>
                    </AddressGrid>
                </ModalContent>

                <ModalFooter>
                    <Button variant="secondary" onClick={handleClose}>
                        Anuluj
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSave}
                        disabled={
                            !formData.street ||
                            !formData.houseNumber ||
                            !formData.postalCode ||
                            !formData.city ||
                            !formData.estimatedTime ||
                            updateStop.isPending
                        }
                        isLoading={updateStop.isPending}
                    >
                        Zapisz zmiany
                    </Button>
                </ModalFooter>
            </ModalContainer>
        </ModalOverlay>
    );
};