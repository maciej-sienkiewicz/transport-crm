import styled from 'styled-components';

export const PoolContainer = styled.div`
    background: white;
    border-radius: ${({ theme }) => theme.borderRadius['2xl']};
    box-shadow: ${({ theme }) => theme.shadows.md};
    border: 1px solid ${({ theme }) => theme.colors.slate[200]};
    overflow: hidden;
`;

export const PoolHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${({ theme }) => theme.spacing.lg};
    background: ${({ theme }) => theme.gradients.cardHeader};
    border-bottom: 1px solid ${({ theme }) => theme.colors.slate[200]};
`;

export const PoolTitle = styled.h3`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
    font-size: 0.875rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[700]};
    text-transform: uppercase;
    letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wide};
`;

export const PoolCount = styled.div<{ $isEmpty?: boolean }>`
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 32px;
    height: 32px;
    padding: 0 ${({ theme }) => theme.spacing.sm};
    background: ${({ $isEmpty, theme }) =>
    $isEmpty ? theme.colors.slate[200] : theme.gradients.primaryButton};
    color: ${({ $isEmpty, theme }) =>
    $isEmpty ? theme.colors.slate[600] : 'white'};
    border-radius: ${({ theme }) => theme.borderRadius.full};
    font-size: 0.875rem;
    font-weight: 700;
`;

export const PoolContent = styled.div`
    max-height: 280px;
    overflow-x: auto;
    overflow-y: hidden;
    padding: ${({ theme }) => theme.spacing.lg};

    /* Custom scrollbar */
    &::-webkit-scrollbar {
        height: 8px;
    }

    &::-webkit-scrollbar-track {
        background: ${({ theme }) => theme.colors.slate[100]};
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

export const ChildrenGrid = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.md};
    min-width: max-content;

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        flex-wrap: wrap;
        min-width: auto;
    }
`;

export const ChildCard = styled.div`
    flex: 0 0 260px;
    background: ${({ theme }) => theme.colors.slate[50]};
    border: 2px solid ${({ theme }) => theme.colors.slate[200]};
    border-radius: ${({ theme }) => theme.borderRadius.xl};
    cursor: grab;
    transition: all ${({ theme }) => theme.transitions.normal};

    &:active {
        cursor: grabbing;
    }

    &:hover {
        transform: translateY(-4px);
        box-shadow: ${({ theme }) => theme.shadows.lg};
        border-color: ${({ theme }) => theme.colors.primary[300]};
        background: white;
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        flex: 1 1 calc(50% - ${({ theme }) => theme.spacing.md});
        min-width: 240px;
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        flex: 1 1 100%;
    }
`;

export const ChildCardContent = styled.div`
    padding: ${({ theme }) => theme.spacing.md};
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};
`;

export const ChildName = styled.div`
    font-size: 0.9375rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[900]};
`;

export const ChildAge = styled.div`
    font-size: 0.8125rem;
    color: ${({ theme }) => theme.colors.slate[600]};
`;

export const ChildSchedule = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-top: ${({ theme }) => theme.spacing.xs};
`;

export const ScheduleItem = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.slate[600]};
`;

export const NeedsRow = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-top: ${({ theme }) => theme.spacing.xs};
`;

export const NeedBadge = styled.span<{ $variant: 'wheelchair' | 'seat' | 'belt' }>`
    display: inline-flex;
    align-items: center;
    padding: 2px 6px;
    font-size: 0.6875rem;
    font-weight: 600;
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    background: ${({ $variant, theme }) => {
    switch ($variant) {
        case 'wheelchair':
            return theme.colors.warning[100];
        case 'seat':
            return theme.colors.primary[100];
        case 'belt':
            return theme.colors.success[100];
    }
}};
    color: ${({ $variant, theme }) => {
    switch ($variant) {
        case 'wheelchair':
            return theme.colors.warning[700];
        case 'seat':
            return theme.colors.primary[700];
        case 'belt':
            return theme.colors.success[700];
    }
}};
`;

export const EmptyPool = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: ${({ theme }) => theme.spacing.xl};
    text-align: center;
    color: ${({ theme }) => theme.colors.slate[400]};
`;

export const EmptyIcon = styled.div`
    width: 64px;
    height: 64px;
    margin-bottom: ${({ theme }) => theme.spacing.md};
    background: ${({ theme }) => theme.colors.slate[100]};
    border-radius: ${({ theme }) => theme.borderRadius.full};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.colors.slate[400]};
`;

export const EmptyText = styled.p`
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.slate[500]};
`;