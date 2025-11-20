// src/features/routes/components/SmartAssignmentDashboard/RoutesTimeline.styles.ts
import styled, { css } from 'styled-components';

export const TimelineContainer = styled.div`
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

export const RouteTimelineCard = styled.div<{
    $isSuggested: boolean;
    $hasSelectedSchedule: boolean;
}>`
    background: white;
    border: 2px solid ${({ theme }) => theme.colors.slate[200]};
    border-radius: ${({ theme }) => theme.borderRadius.xl};
    overflow: hidden;
    transition: all ${({ theme }) => theme.transitions.normal};

    ${({ $isSuggested, theme }) =>
    $isSuggested &&
    css`
            border-color: ${theme.colors.primary[500]};
            box-shadow: 0 0 0 4px ${theme.colors.primary[100]};
        `}

    ${({ $hasSelectedSchedule }) =>
    !$hasSelectedSchedule &&
    css`
            opacity: 1;
        `}

    &:hover {
        transform: translateY(-2px);
        box-shadow: ${({ theme }) => theme.shadows.lg};
    }
`;

export const MatchIndicator = styled.div<{ $confidence: 'high' | 'medium' | 'low' }>`
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    text-align: center;
    font-size: 0.875rem;
    font-weight: 600;

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
    }
}}
`;

export const RouteCardHeader = styled.div`
    padding: ${({ theme }) => theme.spacing.lg};
    background: ${({ theme }) => theme.gradients.cardHeader};
    border-bottom: 1px solid ${({ theme }) => theme.colors.slate[200]};
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.md};
`;

export const RouteInfo = styled.div`
    flex: 1;
    min-width: 0;
`;

export const RouteName = styled.h3`
    font-size: 1rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[900]};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export const RouteMetadata = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: ${({ theme }) => theme.spacing.md};
`;

export const MetadataItem = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    font-size: 0.8125rem;
    color: ${({ theme }) => theme.colors.slate[600]};
`;

export const RouteCardBody = styled.div`
    padding: ${({ theme }) => theme.spacing.lg};
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
`;

export const TimeSlot = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.md};
    padding: ${({ theme }) => theme.spacing.sm};
    background: ${({ theme }) => theme.colors.slate[50]};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    color: ${({ theme }) => theme.colors.slate[700]};
`;

export const TimeLabel = styled.div`
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.slate[500]};
    margin-bottom: 2px;
`;

export const CapacityBar = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};
`;

export const CapacityLabel = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    font-size: 0.8125rem;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.slate[700]};
`;

export const CapacityFill = styled.div<{ $percent: number; $isOverCapacity: boolean }>`
    height: 100%;
    width: ${({ $percent }) => Math.min($percent, 100)}%;
    background: ${({ $isOverCapacity, theme }) =>
    $isOverCapacity
        ? `linear-gradient(to right, ${theme.colors.danger[500]}, ${theme.colors.danger[600]})`
        : `linear-gradient(to right, ${theme.colors.success[500]}, ${theme.colors.success[600]})`};
    border-radius: 4px;
    transition: width ${({ theme }) => theme.transitions.normal};
`;

export const RouteCardFooter = styled.div`
    padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
    background: ${({ theme }) => theme.colors.slate[50]};
    border-top: 1px solid ${({ theme }) => theme.colors.slate[200]};
`;

export const EmptyRoutes = styled.div`
    /* Wypełnij całą dostępną wysokość i wycentruj na górze */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start; /* Zmienione z center na flex-start */
    padding: ${({ theme }) => theme.spacing['2xl']};
    padding-top: ${({ theme }) => theme.spacing['4xl']}; /* Dodany większy padding od góry */
    text-align: center;
    color: ${({ theme }) => theme.colors.slate[500]};
    min-height: 400px; /* Minimalna wysokość aby mieć przestrzeń */

    svg {
        color: ${({ theme }) => theme.colors.warning[500]};
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
        max-width: 400px;
        line-height: 1.6;
    }
`;