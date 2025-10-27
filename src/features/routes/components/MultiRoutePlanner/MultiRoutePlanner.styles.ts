import styled from 'styled-components';
import { Button } from '@/shared/ui/Button';

export const PlannerContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
    padding-bottom: 80px;

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        padding-bottom: ${({ theme }) => theme.spacing.xl};
    }
`;

export const TopSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
`;

export const GlobalControls = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.lg};
    padding: ${({ theme }) => theme.spacing.md};
    background: white;
    border-radius: ${({ theme }) => theme.borderRadius.xl};
    box-shadow: ${({ theme }) => theme.shadows.sm};
    border: 1px solid ${({ theme }) => theme.colors.slate[200]};

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        flex-direction: column;
    }
`;

export const DateSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xs};
    flex: 1;
`;

export const DateLabel = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    font-size: 0.8125rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[700]};
    text-transform: uppercase;
    letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wide};
`;

export const DateInfo = styled.div`
    font-size: 0.9375rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[900]};
    margin-top: ${({ theme }) => theme.spacing.xs};
`;

export const ActionsSection = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.md};
`;

export const StatsBar = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.lg};
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    background: ${({ theme }) => theme.gradients.cardHeader};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    border: 1px solid ${({ theme }) => theme.colors.slate[200]};
`;

export const StatItem = styled.div<{ $warning?: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    min-width: 60px;

    ${({ $warning, theme }) =>
            $warning &&
            `
        color: ${theme.colors.warning[600]};
    `}
`;

export const StatValue = styled.div`
    font-size: 1.375rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.slate[900]};
    line-height: 1;
`;

export const StatLabel = styled.div`
    font-size: 0.6875rem;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.slate[600]};
    text-transform: uppercase;
    letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wide};
`;

export const ChildrenPoolSection = styled.div`
    position: relative;
`;

export const RoutesSection = styled.div`
    flex: 1;
    padding: ${({ theme }) => theme.spacing.sm} 0;
`;

export const RoutesGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
    gap: ${({ theme }) => theme.spacing.lg};
    margin-bottom: ${({ theme }) => theme.spacing.lg};

    @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
        grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        grid-template-columns: 1fr;
    }
`;

export const AddRouteCard = styled.div`
    min-height: 240px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    border: 2px dashed ${({ theme }) => theme.colors.slate[300]};
    border-radius: ${({ theme }) => theme.borderRadius.xl};
    transition: all ${({ theme }) => theme.transitions.normal};

    &:hover {
        border-color: ${({ theme }) => theme.colors.primary[400]};
        background: ${({ theme }) => theme.colors.primary[50]};
    }
`;

export const AddRouteButton = styled.button`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
    padding: ${({ theme }) => theme.spacing.lg};
    background: transparent;
    border: none;
    color: ${({ theme }) => theme.colors.slate[400]};
    cursor: pointer;
    transition: all ${({ theme }) => theme.transitions.normal};

    &:hover {
        color: ${({ theme }) => theme.colors.primary[600]};
        transform: scale(1.05);
    }
`;

export const AddRouteText = styled.span`
    font-size: 0.875rem;
    font-weight: 600;
`;

export const EmptyState = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 320px;
    text-align: center;
    padding: ${({ theme }) => theme.spacing.xl};
`;

export const EmptyIcon = styled.div`
    width: 80px;
    height: 80px;
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    background: ${({ theme }) => theme.gradients.cardHeader};
    border-radius: ${({ theme }) => theme.borderRadius.full};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.colors.primary[600]};
`;

export const EmptyText = styled.p`
    font-size: 1.125rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[700]};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const BulkActions = styled.div`
    position: fixed;
    bottom: ${({ theme }) => theme.spacing.md};
    right: ${({ theme }) => theme.spacing.lg};
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    background: white;
    border: 1px solid ${({ theme }) => theme.colors.slate[200]};
    box-shadow: ${({ theme }) => theme.shadows.lg};
    border-radius: ${({ theme }) => theme.borderRadius.xl};
    z-index: 10;

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        left: ${({ theme }) => theme.spacing.md};
        right: ${({ theme }) => theme.spacing.md};
        bottom: ${({ theme }) => theme.spacing.md};
        flex-direction: column;

        button {
            width: 100%;
        }
    }
`;

export const SaveAllButton = styled(Button)`
    min-width: 180px;
    font-size: 0.875rem;
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        min-width: 100%;
    }
`;