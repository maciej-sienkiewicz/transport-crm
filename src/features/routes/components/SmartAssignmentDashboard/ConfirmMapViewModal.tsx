// src/features/routes/components/SmartAssignmentDashboard/ConfirmMapViewModal.tsx
import React from 'react';
import styled from 'styled-components';
import { Map, X, Check } from 'lucide-react';
import { Button } from '@/shared/ui/Button';

const ModalOverlay = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: ${({ theme }) => theme.spacing.lg};
`;

const ModalContent = styled.div`
    background: white;
    border-radius: ${({ theme }) => theme.borderRadius['2xl']};
    padding: ${({ theme }) => theme.spacing['2xl']};
    max-width: 500px;
    width: 100%;
    box-shadow: ${({ theme }) => theme.shadows['2xl']};
`;

const ModalHeader = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.md};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SuccessIcon = styled.div`
    width: 48px;
    height: 48px;
    border-radius: ${({ theme }) => theme.borderRadius.full};
    background: ${({ theme }) => theme.colors.success[100]};
    color: ${({ theme }) => theme.colors.success[700]};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
`;

const ModalTitle = styled.h3`
    font-size: 1.25rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.slate[900]};
    margin: 0;
`;

const ModalBody = styled.div`
    margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const MessageText = styled.p`
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.slate[600]};
    line-height: 1.6;
    margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
`;

const InfoBox = styled.div`
    background: ${({ theme }) => theme.colors.primary[50]};
    border: 1px solid ${({ theme }) => theme.colors.primary[200]};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    padding: ${({ theme }) => theme.spacing.md};
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.primary[800]};
`;

const ModalFooter = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.md};
    justify-content: flex-end;

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        flex-direction: column-reverse;
        
        button {
            width: 100%;
        }
    }
`;

interface ConfirmMapViewModalProps {
    isOpen: boolean;
    childName: string;
    routeName: string;
    onViewMap: () => void;
    onClose: () => void;
}

export const ConfirmMapViewModal: React.FC<ConfirmMapViewModalProps> = ({
                                                                            isOpen,
                                                                            childName,
                                                                            routeName,
                                                                            onViewMap,
                                                                            onClose,
                                                                        }) => {
    if (!isOpen) return null;

    return (
        <ModalOverlay onClick={onClose}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                <ModalHeader>
                    <SuccessIcon>
                        <Check size={24} />
                    </SuccessIcon>
                    <ModalTitle>Dziecko przypisane</ModalTitle>
                </ModalHeader>

                <ModalBody>
                    <MessageText>
                        <strong>{childName}</strong> został przypisany na koniec trasy{' '}
                        <strong>{routeName}</strong>.
                    </MessageText>
                    <InfoBox>
                        💡 Możesz teraz podejrzeć mapę trasy i opcjonalnie zmienić kolejność
                        punktów zatrzymania.
                    </InfoBox>
                </ModalBody>

                <ModalFooter>
                    <Button variant="secondary" onClick={onClose}>
                        <X size={16} />
                        Zamknij
                    </Button>
                    <Button variant="primary" onClick={onViewMap}>
                        <Map size={16} />
                        Pokaż mapę
                    </Button>
                </ModalFooter>
            </ModalContent>
        </ModalOverlay>
    );
};