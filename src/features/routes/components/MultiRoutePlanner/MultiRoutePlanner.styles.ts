import styled from 'styled-components';
import { Button } from '@/shared/ui/Button';

export const PlannerContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: calc(100vh - 120px);
    gap: ${({ theme }) => theme.spacing.lg};

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        height: auto;
    }
`;

export const TopSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.lg};
`;

export const GlobalControls = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.xl};
    padding: ${({ theme }) => theme.spacing.lg};
    background: white;
    border-radius: ${({ theme }) => theme.borderRadius['2xl']};
    box-shadow: ${({ theme }) => theme.shadows.md};
    border: 1px solid ${({ theme }) => theme.colors.slate[200]};

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        flex-direction: column;
    }
`;

export const DateSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};
    flex: 1;
`;

export const DateLabel = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
    font-size: 0.875rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[700]};
    text-transform: uppercase;
    letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wide};
`;

export const DateInfo = styled.div`
    font-size: 1.125rem;
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
    gap: ${({ theme }) => theme.spacing.xl};
    padding: ${({ theme }) => theme.spacing.md};
    background: ${({ theme }) => theme.gradients.cardHeader};
    border-radius: ${({ theme }) => theme.borderRadius.xl};
    border: 1px solid ${({ theme }) => theme.colors.slate[200]};
`;

export const StatItem = styled.div<{ $warning?: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    min-width: 80px;

    ${({ $warning, theme }) =>
    $warning &&
    `
        color: ${theme.colors.warning[600]};
    `}
`;

export const StatValue = styled.div`
    font-size: 1.75rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.slate[900]};
    line-height: 1;
`;

export const StatLabel = styled.div`
    font-size: 0.75rem;
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
    overflow-y: auto;
    padding: ${({ theme }) => theme.spacing.md} 0;

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        overflow-y: visible;
    }
`;

export const RoutesGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
    gap: ${({ theme }) => theme.spacing.xl};
    margin-bottom: ${({ theme }) => theme.spacing.xl};

    @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
        grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        grid-template-columns: 1fr;
    }
`;

export const AddRouteCard = styled.div`
    min-height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    border: 2px dashed ${({ theme }) => theme.colors.slate[300]};
    border-radius: ${({ theme }) => theme.borderRadius['2xl']};
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
    gap: ${({ theme }) => theme.spacing.md};
    padding: ${({ theme }) => theme.spacing.xl};
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
    font-size: 1rem;
    font-weight: 600;
`;

export const EmptyState = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    text-align: center;
    padding: ${({ theme }) => theme.spacing['2xl']};
`;

export const EmptyIcon = styled.div`
    width: 100px;
    height: 100px;
    margin-bottom: ${({ theme }) => theme.spacing.xl};
    background: ${({ theme }) => theme.gradients.cardHeader};
    border-radius: ${({ theme }) => theme.borderRadius.full};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.colors.primary[600]};
`;

export const EmptyText = styled.p`
    font-size: 1.25rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[700]};
    margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

export const BulkActions = styled.div`
    position: sticky;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.md};
    padding: ${({ theme }) => theme.spacing.lg};
    background: white;
    border-top: 1px solid ${({ theme }) => theme.colors.slate[200]};
    box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.05);
    border-radius: ${({ theme }) => theme.borderRadius['2xl']} ${({ theme }) => theme.borderRadius['2xl']} 0 0;
    z-index: 10;

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        flex-direction: column;
        
        button {
            width: 100%;
        }
    }
`;

export const SaveAllButton = styled(Button)`
    min-width: 250px;

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        min-width: 100%;
    }
`;