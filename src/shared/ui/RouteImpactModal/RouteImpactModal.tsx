// src/shared/ui/RouteImpactModal/RouteImpactModal.tsx

import React from 'react';
import styled from 'styled-components';
import { AlertTriangle, Info, AlertCircle, X, Calendar, Repeat, ArrowRight } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { RouteImpactData } from '@/shared/types/routeImpact';

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

const ModalHeader = styled.div<{ $variant: 'info' | 'warning' | 'danger' }>`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.md};
    padding: ${({ theme }) => theme.spacing.xl};
    border-bottom: 1px solid ${({ theme }) => theme.colors.slate[200]};
    background: ${({ theme, $variant }) => {
        switch ($variant) {
            case 'danger':
                return theme.colors.danger[50];
            case 'warning':
                return theme.colors.warning[50];
            default:
                return theme.colors.primary[50];
        }
    }};
    border-radius: ${({ theme }) => theme.borderRadius['2xl']}
    ${({ theme }) => theme.borderRadius['2xl']} 0 0;
`;

const HeaderContent = styled.div`
    display: flex;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.md};
    flex: 1;
`;

const IconWrapper = styled.div<{ $variant: 'info' | 'warning' | 'danger' }>`
    width: 48px;
    height: 48px;
    border-radius: ${({ theme }) => theme.borderRadius.full};
    background: ${({ theme, $variant }) => {
        switch ($variant) {
            case 'danger':
                return theme.colors.danger[100];
            case 'warning':
                return theme.colors.warning[100];
            default:
                return theme.colors.primary[100];
        }
    }};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme, $variant }) => {
        switch ($variant) {
            case 'danger':
                return theme.colors.danger[600];
            case 'warning':
                return theme.colors.warning[600];
            default:
                return theme.colors.primary[600];
        }
    }};
    flex-shrink: 0;
`;

const HeaderText = styled.div`
    flex: 1;
`;

const ModalTitle = styled.h2<{ $variant: 'info' | 'warning' | 'danger' }>`
    font-size: 1.25rem;
    font-weight: 700;
    color: ${({ theme, $variant }) => {
        switch ($variant) {
            case 'danger':
                return theme.colors.danger[900];
            case 'warning':
                return theme.colors.warning[900];
            default:
                return theme.colors.primary[900];
        }
    }};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ModalSubtitle = styled.p<{ $variant: 'info' | 'warning' | 'danger' }>`
    font-size: 0.875rem;
    color: ${({ theme, $variant }) => {
        switch ($variant) {
            case 'danger':
                return theme.colors.danger[700];
            case 'warning':
                return theme.colors.warning[700];
            default:
                return theme.colors.primary[700];
        }
    }};
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

const Section = styled.div`
    margin-bottom: ${({ theme }) => theme.spacing.xl};

    &:last-child {
        margin-bottom: 0;
    }
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

const RouteCard = styled.div`
    padding: ${({ theme }) => theme.spacing.md};
    background: ${({ theme }) => theme.colors.slate[50]};
    border: 1px solid ${({ theme }) => theme.colors.slate[200]};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    transition: all ${({ theme }) => theme.transitions.fast};

    &:hover {
        background: white;
        border-color: ${({ theme }) => theme.colors.primary[200]};
        transform: translateX(4px);
    }

    &:last-child {
        margin-bottom: 0;
    }
`;

const RouteHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.md};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const RouteName = styled.div`
    font-size: 0.9375rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[900]};
    flex: 1;
`;

const RouteDate = styled.div`
    font-size: 0.8125rem;
    color: ${({ theme }) => theme.colors.slate[600]};
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
`;

const StatusChange = styled.div`
    font-size: 0.8125rem;
    color: ${({ theme }) => theme.colors.slate[600]};
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    margin-top: ${({ theme }) => theme.spacing.xs};
`;

const StatusBadge = styled.span<{ $variant: 'old' | 'new' }>`
    padding: 2px 8px;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    font-weight: 600;
    background: ${({ theme, $variant }) =>
            $variant === 'new' ? theme.colors.warning[100] : theme.colors.slate[200]};
    color: ${({ theme, $variant }) =>
            $variant === 'new' ? theme.colors.warning[700] : theme.colors.slate[700]};
`;

const SeriesCard = styled.div`
    padding: ${({ theme }) => theme.spacing.md};
    background: #f5f3ff;
    border: 1px solid #e9d5ff;
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    transition: all ${({ theme }) => theme.transitions.fast};

    &:hover {
        background: white;
        border-color: ${({ theme }) => theme.colors.accent[300]};
        transform: translateX(4px);
    }

    &:last-child {
        margin-bottom: 0;
    }
`;

const SeriesName = styled.div`
    font-size: 0.9375rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[900]};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const SeriesDates = styled.div`
    font-size: 0.8125rem;
    color: ${({ theme }) => theme.colors.slate[600]};
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
`;

const InfoBanner = styled.div<{ $variant: 'info' | 'warning' | 'danger' }>`
    display: flex;
    gap: ${({ theme }) => theme.spacing.sm};
    padding: ${({ theme }) => theme.spacing.md};
    background: ${({ theme, $variant }) => {
        switch ($variant) {
            case 'danger':
                return theme.colors.danger[50];
            case 'warning':
                return theme.colors.warning[50];
            default:
                return theme.colors.primary[50];
        }
    }};
    border: 1px solid ${({ theme, $variant }) => {
        switch ($variant) {
            case 'danger':
                return theme.colors.danger[200];
            case 'warning':
                return theme.colors.warning[200];
            default:
                return theme.colors.primary[200];
        }
    }};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    font-size: 0.875rem;
    color: ${({ theme, $variant }) => {
        switch ($variant) {
            case 'danger':
                return theme.colors.danger[900];
            case 'warning':
                return theme.colors.warning[900];
            default:
                return theme.colors.primary[900];
        }
    }};
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
    text-align: center;
`;

interface RouteImpactModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: RouteImpactData | null;
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

const getIcon = (variant: 'info' | 'warning' | 'danger') => {
    switch (variant) {
        case 'danger':
            return <AlertCircle size={24} />;
        case 'warning':
            return <AlertTriangle size={24} />;
        default:
            return <Info size={24} />;
    }
};

export const RouteImpactModal: React.FC<RouteImpactModalProps> = ({
                                                                      isOpen,
                                                                      onClose,
                                                                      data,
                                                                  }) => {
    if (!data) return null;

    const variant = data.variant || 'info';
    const hasRoutes = data.affectedRoutes && data.affectedRoutes.length > 0;
    const hasSeries = data.affectedSeries && data.affectedSeries.length > 0;

    return (
        <ModalOverlay $isOpen={isOpen} onClick={onClose}>
            <ModalContainer onClick={(e) => e.stopPropagation()}>
                <ModalHeader $variant={variant}>
                    <HeaderContent>
                        <IconWrapper $variant={variant}>
                            {getIcon(variant)}
                        </IconWrapper>
                        <HeaderText>
                            <ModalTitle $variant={variant}>{data.title}</ModalTitle>
                            <ModalSubtitle $variant={variant}>{data.message}</ModalSubtitle>
                        </HeaderText>
                    </HeaderContent>
                    <CloseButton onClick={onClose}>
                        <X size={20} />
                    </CloseButton>
                </ModalHeader>

                <ModalContent>
                    {hasRoutes && (
                        <Section>
                            <SectionTitle>
                                <Calendar size={16} />
                                Zaktualizowane trasy ({data.affectedRoutes!.length})
                            </SectionTitle>
                            {data.affectedRoutes!.map((route) => (
                                <RouteCard key={route.id}>
                                    <RouteHeader>
                                        <RouteName>{route.routeName}</RouteName>
                                        <RouteDate>
                                            <Calendar size={14} />
                                            {formatDate(route.date)}
                                        </RouteDate>
                                    </RouteHeader>
                                    {route.previousStatus && route.newStatus && (
                                        <StatusChange>
                                            <StatusBadge $variant="old">
                                                {route.previousStatus}
                                            </StatusBadge>
                                            <ArrowRight size={14} />
                                            <StatusBadge $variant="new">
                                                {route.newStatus}
                                            </StatusBadge>
                                        </StatusChange>
                                    )}
                                </RouteCard>
                            ))}
                        </Section>
                    )}

                    {hasSeries && (
                        <Section>
                            <SectionTitle>
                                <Repeat size={16} />
                                Zaktualizowane serie ({data.affectedSeries!.length})
                            </SectionTitle>
                            {data.affectedSeries!.map((series) => (
                                <SeriesCard key={series.id}>
                                    <SeriesName>{series.seriesName}</SeriesName>
                                    <SeriesDates>
                                        <Calendar size={14} />
                                        Od: {formatDate(series.startDate)}
                                        {series.endDate
                                            ? ` do ${formatDate(series.endDate)}`
                                            : ' • Bezterminowo'}
                                    </SeriesDates>
                                </SeriesCard>
                            ))}
                        </Section>
                    )}

                    {!hasRoutes && !hasSeries && (
                        <EmptySection>Brak szczegółów o wpływie na trasy</EmptySection>
                    )}

                    <InfoBanner $variant={variant}>
                        <AlertTriangle size={20} style={{ flexShrink: 0 }} />
                        <div>
                            <strong>Co to oznacza?</strong>
                            <br />
                            {variant === 'warning' &&
                                'Trasy zostały zaktualizowane ze względu na nieobecność kierowcy. Należy przypisać nowego kierowcę do tras oznaczonych jako "DRIVER_MISSING".'}
                            {variant === 'info' &&
                                'Operacja została wykonana pomyślnie. Powyższe trasy i serie zostały zaktualizowane.'}
                            {variant === 'danger' &&
                                'Wystąpił problem podczas przetwarzania. Sprawdź powyższe trasy i serie.'}
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