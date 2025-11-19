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
    padding: ${({ theme }) => theme.spacing['2xl']};
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xl};

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
    font-size: 2rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.slate[900]};

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        font-size: 1.75rem;
    }
`;

export const DateSelectorLarge = styled.div`
    min-width: 280px;

    input[type="date"] {
        font-size: 1.25rem;
        font-weight: 600;
        padding: ${({ theme }) => theme.spacing.lg};
        border: 2px solid ${({ theme }) => theme.colors.primary[500]};
        border-radius: ${({ theme }) => theme.borderRadius.xl};
        background: ${({ theme }) => theme.colors.primary[50]};
        color: ${({ theme }) => theme.colors.primary[900]};
        cursor: pointer;
        transition: all ${({ theme }) => theme.transitions.fast};

        &:hover {
            background: ${({ theme }) => theme.colors.primary[100]};
            border-color: ${({ theme }) => theme.colors.primary[600]};
        }

        &:focus {
            outline: none;
            ring: 2px solid ${({ theme }) => theme.colors.primary[500]};
            box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
        }
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        width: 100%;
    }
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