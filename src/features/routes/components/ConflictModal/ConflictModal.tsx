// src/features/routes/components/ConflictModal/ConflictModal.tsx

import React from 'react';
import styled from 'styled-components';
import { AlertTriangle, X, Calendar, Repeat } from 'lucide-react';
import { Button } from '@/shared/ui/Button';

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(15, 23, 42, 0.7);
    backdrop-filter: blur(4px);
    display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
    align-items: center;
    justify-content: center;
    z-index: 2000;
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
    max-width: 700px;
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
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.md};
    padding: ${({ theme }) => theme.spacing.xl};
    border-bottom: 1px solid ${({ theme }) => theme.colors.slate[200]};
    background: ${({ theme }) => theme.colors.danger[50]};
    border-radius: ${({ theme }) => theme.borderRadius['2xl']}
    ${({ theme }) => theme.borderRadius['2xl']} 0 0;
`;

const HeaderContent = styled.div`
    display: flex;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.md};
    flex: 1;
`;

const IconWrapper = styled.div`
    width: 48px;
    height: 48px;
    border-radius: ${({ theme }) => theme.borderRadius.full};
    background: ${({ theme }) => theme.colors.danger[100]};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.colors.danger[600]};
    flex-shrink: 0;
`;

const HeaderText = styled.div`
    flex: 1;
`;

const ModalTitle = styled.h2`
    font-size: 1.25rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.danger[900]};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ModalSubtitle = styled.p`
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.danger[700]};
    line-height: 1.5;
`;

const CloseButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: ${({ theme }) => theme.borderRadius.full};
    border: none;
    background: transparent;
    color: ${({ theme }) => theme.colors.slate[600]};
    cursor: pointer;
    transition: all ${({ theme }) => theme.transitions.fast};
    flex-shrink: 0;

    &:hover {
        background: ${({ theme }) => theme.colors.slate[100]};
        color: ${({ theme }) => theme.colors.slate[900]};
    }
`;

const ModalContent = styled.div`
    flex: 1;
    overflow-y: auto;
    padding: ${({ theme }) => theme.spacing.xl};

    &::-webkit-scrollbar {
        width: 8px;
    }

    &::-webkit-scrollbar-track {
        background: ${({ theme }) => theme.colors.slate[50]};
        border-radius: ${({ theme }) => theme.borderRadius.sm};
    }

    &::-webkit-scrollbar-thumb {
        background: ${({ theme }) => theme.colors.slate[300]};
        border-radius: ${({ theme }) => theme.borderRadius.sm};

        &:hover {
            background: ${({ theme }) => theme.colors.slate[400]};
        }
    }
`;

const ConflictsList = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.lg};
`;

const SectionTitle = styled.h3`
    font-size: 0.875rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[700]};
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: ${({ theme }) => theme.spacing.md};
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
`;

const ConflictCard = styled.div`
    padding: ${({ theme }) => theme.spacing.lg};
    background: ${({ theme }) => theme.colors.slate[50]};
    border: 1px solid ${({ theme }) => theme.colors.slate[200]};
    border-radius: ${({ theme }) => theme.borderRadius.xl};
`;

const ChildName = styled.h4`
    font-size: 1rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[900]};
    margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const DatesList = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xs};
`;

const DateItem = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.slate[700]};
    padding: ${({ theme }) => theme.spacing.sm};
    background: white;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    border: 1px solid ${({ theme }) => theme.colors.slate[200]};

    svg {
        color: ${({ theme }) => theme.colors.danger[500]};
        flex-shrink: 0;
    }
`;

const SeriesCard = styled.div`
    padding: ${({ theme }) => theme.spacing.lg};
    background: #f5f3ff;
    border: 1px solid #e9d5ff;
    border-radius: ${({ theme }) => theme.borderRadius.xl};
`;

const SeriesChildName = styled.h4`
    font-size: 1rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[900]};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const SeriesName = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.slate[700]};
    padding: ${({ theme }) => theme.spacing.sm};
    background: white;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    border: 1px solid #e9d5ff;

    svg {
        color: ${({ theme }) => theme.colors.accent[600]};
        flex-shrink: 0;
    }
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
    margin-top: ${({ theme }) => theme.spacing.lg};
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

const EmptySection = styled.div`
    padding: ${({ theme }) => theme.spacing.md};
    color: ${({ theme }) => theme.colors.slate[500]};
    font-size: 0.875rem;
    font-style: italic;
`;

export interface ConflictData {
    message: string;
    conflicts: {
        singleRoutes: Record<string, string[]>;
        series: Record<string, string>;
    };
    timestamp: string;
}

interface ConflictModalProps {
    isOpen: boolean;
    onClose: () => void;
    conflictData: ConflictData | null;
}

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
};

const getTotalConflicts = (conflicts: ConflictData['conflicts']): number => {
    const singleRoutesCount = conflicts.singleRoutes
        ? Object.values(conflicts.singleRoutes).reduce(
            (sum, dates) => sum + (Array.isArray(dates) ? dates.length : 0),
            0
        )
        : 0;
    const seriesCount = conflicts.series
        ? Object.keys(conflicts.series).length
        : 0;
    return singleRoutesCount + seriesCount;
};

export const ConflictModal: React.FC<ConflictModalProps> = ({
                                                                isOpen,
                                                                onClose,
                                                                conflictData,
                                                            }) => {
    if (!conflictData) return null;

    const totalConflicts = getTotalConflicts(conflictData.conflicts);
    const hasSingleRoutes =
        conflictData.conflicts.singleRoutes &&
        Object.keys(conflictData.conflicts.singleRoutes).length > 0;
    const hasSeries =
        conflictData.conflicts.series &&
        Object.keys(conflictData.conflicts.series).length > 0;

    return (
        <ModalOverlay $isOpen={isOpen} onClick={onClose}>
            <ModalContainer onClick={(e) => e.stopPropagation()}>
                <ModalHeader>
                    <HeaderContent>
                        <IconWrapper>
                            <AlertTriangle size={24} />
                        </IconWrapper>
                        <HeaderText>
                            <ModalTitle>Wykryto konflikty harmonogramów</ModalTitle>
                            <ModalSubtitle>
                                Znaleziono {totalConflicts}{' '}
                                {totalConflicts === 1 ? 'konflikt' : 'konfliktów'}
                            </ModalSubtitle>
                        </HeaderText>
                    </HeaderContent>
                    <CloseButton onClick={onClose}>
                        <X size={20} />
                    </CloseButton>
                </ModalHeader>

                <ModalContent>
                    <ConflictsList>
                        {hasSingleRoutes && (
                            <div>
                                <SectionTitle>
                                    <Calendar size={16} />
                                    Konflikty w pojedynczych trasach
                                </SectionTitle>
                                {Object.entries(conflictData.conflicts.singleRoutes || {}).map(
                                    ([childName, dates]) => {
                                        // Upewnij się, że dates jest tablicą
                                        if (!Array.isArray(dates) || dates.length === 0) return null;

                                        return (
                                            <ConflictCard key={childName}>
                                                <ChildName>{childName}</ChildName>
                                                <DatesList>
                                                    {dates.map((date) => (
                                                        <DateItem key={date}>
                                                            <Calendar size={14} />
                                                            {formatDate(date)}
                                                        </DateItem>
                                                    ))}
                                                </DatesList>
                                            </ConflictCard>
                                        );
                                    }
                                )}
                            </div>
                        )}

                        {hasSeries && (
                            <div>
                                <SectionTitle>
                                    <Repeat size={16} />
                                    Konflikty w seriach tras
                                </SectionTitle>
                                <ConflictsList>
                                    {Object.entries(conflictData.conflicts.series || {}).map(
                                        ([childName, seriesName]) => (
                                            <SeriesCard key={childName}>
                                                <SeriesChildName>{childName}</SeriesChildName>
                                                <SeriesName>
                                                    <Repeat size={14} />
                                                    {seriesName}
                                                </SeriesName>
                                            </SeriesCard>
                                        )
                                    )}
                                </ConflictsList>
                            </div>
                        )}

                        {!hasSingleRoutes && !hasSeries && (
                            <EmptySection>Brak szczegółów konfliktów</EmptySection>
                        )}
                    </ConflictsList>

                    <InfoBanner>
                        <AlertTriangle size={20} style={{ flexShrink: 0 }} />
                        <div>
                            <strong>Co to oznacza?</strong>
                            <br />
                            {hasSingleRoutes &&
                                'Dzieci są już przypisane do tras w wybranych datach. '}
                            {hasSeries &&
                                'Dzieci są już przypisane do cyklicznych serii tras. '}
                            Usuń konflikty lub wybierz inne daty/dzieci, aby kontynuować.
                        </div>
                    </InfoBanner>
                </ModalContent>

                <ModalFooter>
                    <Button variant="primary" onClick={onClose}>
                        Rozumiem
                    </Button>
                </ModalFooter>
            </ModalContainer>
        </ModalOverlay>
    );
};