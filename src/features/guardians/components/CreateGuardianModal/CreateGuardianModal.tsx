import React, { useState } from 'react';
import styled from 'styled-components';
import { X } from 'lucide-react';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { CreateGuardianRequest } from '../../types';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: ${({ theme }) => theme.shadows.xl};
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xl};
  border-bottom: 1px solid ${({ theme }) => theme.colors.slate[200]};
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
  width: 32px;
  height: 32px;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.slate[500]};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.slate[100]};
    color: ${({ theme }) => theme.colors.slate[900]};
  }
`;

const ModalBody = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.xl};
  border-top: 1px solid ${({ theme }) => theme.colors.slate[200]};
`;

const HelpText = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.slate[600]};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

interface CreateGuardianModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateGuardianRequest) => Promise<void>;
    isLoading?: boolean;
}

export const CreateGuardianModal: React.FC<CreateGuardianModalProps> = ({
                                                                            isOpen,
                                                                            onClose,
                                                                            onSubmit,
                                                                            isLoading = false,
                                                                        }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));

        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'Imię jest wymagane';
        } else if (formData.firstName.length > 255) {
            newErrors.firstName = 'Imię może mieć maksymalnie 255 znaków';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Nazwisko jest wymagane';
        } else if (formData.lastName.length > 255) {
            newErrors.lastName = 'Nazwisko może mieć maksymalnie 255 znaków';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Numer telefonu jest wymagany';
        } else if (!/^\+?[0-9\s\-()]{9,20}$/.test(formData.phone)) {
            newErrors.phone = 'Nieprawidłowy format numeru telefonu';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            await onSubmit({
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                email: null,
                phone: formData.phone.trim(),
                address: null,
            });

            // Reset form
            setFormData({
                firstName: '',
                lastName: '',
                phone: '',
            });
            setErrors({});
        } catch (error) {
            console.error('Error creating guardian:', error);
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            setFormData({
                firstName: '',
                lastName: '',
                phone: '',
            });
            setErrors({});
            onClose();
        }
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    if (!isOpen) return null;

    return (
        <ModalOverlay onClick={handleOverlayClick}>
            <ModalContainer>
                <ModalHeader>
                    <ModalTitle>Dodaj nowego opiekuna</ModalTitle>
                    <CloseButton onClick={handleClose} disabled={isLoading}>
                        <X size={20} />
                    </CloseButton>
                </ModalHeader>

                <form onSubmit={handleSubmit}>
                    <ModalBody>
                        <HelpText>
                            Wypełnij podstawowe dane opiekuna. Dodatkowe informacje będzie można uzupełnić później.
                        </HelpText>

                        <FormGroup>
                            <Input
                                label="Imię"
                                value={formData.firstName}
                                onChange={(e) => handleChange('firstName', e.target.value)}
                                error={errors.firstName}
                                required
                                disabled={isLoading}
                                autoFocus
                            />

                            <Input
                                label="Nazwisko"
                                value={formData.lastName}
                                onChange={(e) => handleChange('lastName', e.target.value)}
                                error={errors.lastName}
                                required
                                disabled={isLoading}
                            />

                            <Input
                                label="Numer telefonu"
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => handleChange('phone', e.target.value)}
                                error={errors.phone}
                                placeholder="+48123456789"
                                required
                                disabled={isLoading}
                            />
                        </FormGroup>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleClose}
                            disabled={isLoading}
                        >
                            Anuluj
                        </Button>
                        <Button type="submit" isLoading={isLoading}>
                            Dodaj opiekuna
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContainer>
        </ModalOverlay>
    );
};