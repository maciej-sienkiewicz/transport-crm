// src/features/routes/components/SmartAssignmentDashboard/SmartAssignmentDashboard.styles.ts
import styled from 'styled-components';

export const DashboardContainer = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background: ${({ theme }) => theme.colors.slate[50]};
`;

export const DashboardHeader = styled.div`
    background: white;
    border-bottom: 1px solid ${({ theme }) => theme.colors.slate[200]};
    padding: ${({ theme }) => theme.spacing.xl};
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.lg};

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        flex-direction: column;
        align-items: flex-start;
        padding: ${({ theme }) => theme.spacing.lg};
    }
`;

export const HeaderContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xs};
`;

export const HeaderTitle = styled.h1`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.md};
    font-size: 1.875rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.slate[900]};

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        font-size: 1.5rem;
    }
`;

export const HeaderSubtitle = styled.p`
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.slate[600]};
`;

export const HeaderActions = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.md};
    align-items: flex-end;

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        width: 100%;
        flex-direction: column;
        align-items: stretch;
    }
`;

export const DateSelector = styled.div`
    min-width: 200px;

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        width: 100%;
    }
`;

export const StatsBar = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: ${({ theme }) => theme.spacing.lg};
    padding: ${({ theme }) => theme.spacing.xl};
    background: white;
    border-bottom: 1px solid ${({ theme }) => theme.colors.slate[200]};

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        grid-template-columns: 1fr;
        padding: ${({ theme }) => theme.spacing.lg};
        gap: ${({ theme }) => theme.spacing.md};
    }
`;

export const StatCard = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.md};
    padding: ${({ theme }) => theme.spacing.lg};
    background: ${({ theme }) => theme.colors.slate[50]};
    border: 1px solid ${({ theme }) => theme.colors.slate[200]};
    border-radius: ${({ theme }) => theme.borderRadius.xl};
    transition: all ${({ theme }) => theme.transitions.normal};

    &:hover {
        transform: translateY(-2px);
        box-shadow: ${({ theme }) => theme.shadows.md};
    }
`;

export const StatIcon = styled.div<{ $variant: 'total' | 'matched' | 'unmatched' | 'progress' }>`
    width: 56px;
    height: 56px;
    border-radius: ${({ theme }) => theme.borderRadius.xl};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    ${({ $variant, theme }) => {
    switch ($variant) {
        case 'total':
            return `
                    background: ${theme.colors.primary[100]};
                    color: ${theme.colors.primary[700]};
                `;
        case 'matched':
            return `
                    background: ${theme.colors.success[100]};
                    color: ${theme.colors.success[700]};
                `;
        case 'unmatched':
            return `
                    background: ${theme.colors.warning[100]};
                    color: ${theme.colors.warning[700]};
                `;
        case 'progress':
            return `
                    background: ${theme.colors.accent[400]}33;
                    color: ${theme.colors.accent[600]};
                `;
    }
}}
`;

export const StatContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xs};
`;

export const StatLabel = styled.div`
    font-size: 0.875rem;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.slate[600]};
`;

export const StatValue = styled.div`
    font-size: 1.875rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.slate[900]};
`;

export const DashboardBody = styled.div`
    flex: 1;
    display: grid;
    grid-template-columns: 40% 60%;
    gap: 0;
    overflow: hidden;

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        grid-template-columns: 1fr;
        overflow-y: auto;
    }
`;

export const LeftPanel = styled.div`
    background: white;
    border-right: 1px solid ${({ theme }) => theme.colors.slate[200]};
    display: flex;
    flex-direction: column;
    overflow: hidden;

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        border-right: none;
        border-bottom: 1px solid ${({ theme }) => theme.colors.slate[200]};
    }
`;

export const RightPanel = styled.div`
    background: ${({ theme }) => theme.colors.slate[50]};
    display: flex;
    flex-direction: column;
    overflow: hidden;
`;

export const PanelHeader = styled.div`
    padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
    border-bottom: 1px solid ${({ theme }) => theme.colors.slate[200]};
    background: ${({ theme }) => theme.gradients.cardHeader};

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
    }
`;

export const PanelTitle = styled.h2`
    font-size: 1.125rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[900]};
`;

export const FilterBar = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.sm};
    padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
    background: white;
    border-bottom: 1px solid ${({ theme }) => theme.colors.slate[200]};

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
        overflow-x: auto;
    }
`;