// src/features/routes/components/SmartAssignmentDashboard/UnassignedSchedulesList.styles.ts
import styled, { css } from 'styled-components';

export const SchedulesListContainer = styled.div`
    flex: 1;
    overflow-y: auto;
    padding: ${({ theme }) => theme.spacing.lg};
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        padding: ${({ theme }) => theme.spacing.md};
    }
`;

export const ScheduleCard = styled.div<{ $hasMatch: boolean; $isSelected: boolean }>`
    background: white;
    border: 2px solid ${({ theme }) => theme.colors.slate[200]};
    border-radius: ${({ theme }) => theme.borderRadius.xl};
    padding: ${({ theme }) => theme.spacing.lg};
    cursor: pointer;
    transition: all ${({ theme }) => theme.transitions.normal};

    ${({ $hasMatch, theme }) =>
    $hasMatch &&
    css`
            border-color: ${theme.colors.success[300]};
            background: ${theme.colors.success[50]};
        `}

    ${({ $isSelected, theme }) =>
    $isSelected &&
    css`
            border-color: ${theme.colors.primary[500]};
            box-shadow: 0 0 0 3px ${theme.colors.primary[100]};
        `}

    &:hover {
        transform: translateY(-2px);
        box-shadow: ${({ theme }) => theme.shadows.lg};
        border-color: ${({ theme }) => theme.colors.primary[400]};
    }
`;

export const ScheduleHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: ${({ theme }) => theme.spacing.md};
    gap: ${({ theme }) => theme.spacing.md};
`;

export const ChildInfo = styled.div`
    flex: 1;
    min-width: 0;
`;

export const ChildName = styled.div`
    font-size: 1rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.slate[900]};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export const ScheduleName = styled.div`
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.slate[600]};
`;

export const MatchBadge = styled.div<{ $confidence: 'high' | 'medium' | 'low' | 'none' }>`
    display: inline-flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
    border-radius: ${({ theme }) => theme.borderRadius.full};
    font-size: 0.75rem;
    font-weight: 600;
    white-space: nowrap;

    ${({ $confidence, theme }) => {
    switch ($confidence) {
        case 'high':
            return css`
                    background: ${theme.colors.success[100]};
                    color: ${theme.colors.success[700]};
                `;
        case 'medium':
            return css`
                    background: ${theme.colors.warning[100]};
                    color: ${theme.colors.warning[700]};
                `;
        case 'low':
            return css`
                    background: ${theme.colors.slate[100]};
                    color: ${theme.colors.slate[700]};
                `;
        case 'none':
            return css`
                    background: ${theme.colors.danger[100]};
                    color: ${theme.colors.danger[700]};
                `;
    }
}}
`;

export const ScheduleBody = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};
    margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const ScheduleDetail = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
    color: ${({ theme }) => theme.colors.slate[600]};
`;

export const DetailLabel = styled.div`
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.slate[500]};
`;

export const DetailValue = styled.div`
    font-size: 0.9375rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[900]};
`;

export const AddressInfo = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    font-size: 0.8125rem;
    color: ${({ theme }) => theme.colors.slate[600]};
    padding-left: ${({ theme }) => theme.spacing.xl};
`;

export const ScheduleFooter = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${({ theme }) => theme.spacing.md};
    padding-top: ${({ theme }) => theme.spacing.md};
    border-top: 1px solid ${({ theme }) => theme.colors.slate[200]};
`;

export const SuggestionBox = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xs};
`;

export const SuggestionTitle = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    font-size: 0.75rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.success[700]};
`;

export const SuggestionDetails = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
    font-size: 0.8125rem;
    
    strong {
        color: ${({ theme }) => theme.colors.slate[900]};
    }
    
    span {
        color: ${({ theme }) => theme.colors.slate[600]};
    }
`;

export const EmptyState = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: ${({ theme }) => theme.spacing['2xl']};
    text-align: center;
    color: ${({ theme }) => theme.colors.slate[500]};

    svg {
        color: ${({ theme }) => theme.colors.success[500]};
        margin-bottom: ${({ theme }) => theme.spacing.lg};
    }

    h3 {
        font-size: 1.25rem;
        font-weight: 600;
        color: ${({ theme }) => theme.colors.slate[900]};
        margin-bottom: ${({ theme }) => theme.spacing.sm};
    }

    p {
        font-size: 0.9375rem;
    }
`;