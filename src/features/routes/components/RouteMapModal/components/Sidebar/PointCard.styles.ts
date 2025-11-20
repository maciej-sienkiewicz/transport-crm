// src/features/routes/components/RouteMapModal/components/Sidebar/PointCard.tsx.styles.ts
import styled from 'styled-components';

export const PointCardContainer = styled.div<{
    $type: 'pickup' | 'dropoff';
    $noCoordinates?: boolean;
    $isNew?: boolean;
}>`
    position: relative;
    padding: ${({ theme }) => theme.spacing.md};
    background: ${({ $type, $noCoordinates, $isNew, theme }) => {
    if ($noCoordinates) return theme.colors.slate[50];
    if ($isNew) return 'linear-gradient(135deg, #faf5ff, #f3e8ff)';
    return $type === 'pickup' ? theme.colors.primary[50] : theme.colors.success[50];
}};
    border: ${({ $isNew, $type, $noCoordinates, theme }) => {
    if ($isNew) return '2px solid #a78bfa';
    if ($noCoordinates) return `1px solid ${theme.colors.slate[200]}`;
    return $type === 'pickup'
        ? `1px solid ${theme.colors.primary[200]}`
        : `1px solid ${theme.colors.success[200]}`;
}};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    display: flex;
    gap: ${({ theme }) => theme.spacing.sm};
    align-items: center;
    opacity: ${({ $noCoordinates }) => ($noCoordinates ? 0.6 : 1)};
    transition: all 0.2s;
    box-shadow: ${({ $isNew }) => ($isNew ? '0 4px 12px rgba(139, 92, 246, 0.15)' : 'none')};

    &:hover {
        box-shadow: ${({ $isNew }) =>
    $isNew ? '0 6px 16px rgba(139, 92, 246, 0.25)' : '0 2px 8px rgba(0, 0, 0, 0.08)'};
        transform: translateY(-1px);
    }
`;

export const NewPointBadge = styled.div`
    position: absolute;
    top: 8px;
    right: 8px;
    padding: 4px 10px;
    background: linear-gradient(135deg, #8b5cf6, #a78bfa);
    color: white;
    border-radius: ${({ theme }) => theme.borderRadius.full};
    font-size: 0.625rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
    display: flex;
    align-items: center;
    gap: 4px;
    animation: pulse 2s ease-in-out infinite;

    @keyframes pulse {
        0%, 100% {
            opacity: 1;
            transform: scale(1);
        }
        50% {
            opacity: 0.8;
            transform: scale(1.05);
        }
    }
`;

export const PointOrder = styled.div<{ $type: 'pickup' | 'dropoff'; $noCoordinates?: boolean; $isNew?: boolean }>`
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 46px;
    height: 32px;
    padding: 0 8px;
    background: ${({ $type, $noCoordinates, $isNew, theme }) => {
    if ($noCoordinates) return theme.colors.slate[400];
    if ($isNew) return 'linear-gradient(135deg, #8b5cf6, #a78bfa)';
    return $type === 'pickup' ? theme.colors.primary[600] : theme.colors.success[600];
}};
    color: white;
    border-radius: ${({ theme }) => theme.borderRadius.full};
    font-size: 0.8125rem;
    font-weight: 700;
    flex-shrink: 0;
    white-space: nowrap;
    box-shadow: ${({ $isNew }) => ($isNew ? '0 2px 8px rgba(139, 92, 246, 0.3)' : 'none')};
`;

export const PointInfo = styled.div`
    flex: 1;
    min-width: 0;
`;

export const PointChild = styled.div`
    font-size: 0.875rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[900]};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export const PointAddress = styled.div`
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.slate[600]};
    line-height: 1.4;
`;

export const PointType = styled.div<{ $type: 'pickup' | 'dropoff' }>`
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 0.6875rem;
    font-weight: 600;
    text-transform: uppercase;
    color: ${({ $type, theme }) =>
    $type === 'pickup' ? theme.colors.primary[700] : theme.colors.success[700]};
    margin-top: ${({ theme }) => theme.spacing.xs};
`;

export const NoCoordinatesWarning = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.6875rem;
    color: ${({ theme }) => theme.colors.warning[700]};
    background: ${({ theme }) => theme.colors.warning[100]};
    padding: 3px 6px;
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    margin-top: ${({ theme }) => theme.spacing.xs};
`;

export const MoveButtons = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin-left: auto;
`;

export const MoveButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    padding: 0;
    background: white;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    color: #64748b;
    cursor: pointer;
    transition: all 0.15s;

    &:hover:not(:disabled) {
        background: #f1f5f9;
        border-color: #94a3b8;
        color: #475569;
    }

    &:disabled {
        opacity: 0.3;
        cursor: not-allowed;
    }

    &:active:not(:disabled) {
        transform: scale(0.95);
    }
`;