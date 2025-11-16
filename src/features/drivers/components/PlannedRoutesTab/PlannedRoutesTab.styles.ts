// src/features/drivers/components/PlannedRoutesTab/PlannedRoutesTab.styles.ts
import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xl};
`;

export const FiltersBar = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.md};
    align-items: center;
    flex-wrap: wrap;
`;

export const FilterGroup = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.sm};
    align-items: center;
`;

export const FilterLabel = styled.span`
    font-size: 0.875rem;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.slate[700]};
`;

export const ResultCount = styled.div`
    margin-left: auto;
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.slate[600]};
`;

export const NextRouteCard = styled.div`
    padding: ${({ theme }) => theme.spacing.xl};
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: ${({ theme }) => theme.borderRadius['2xl']};
    color: white;
    box-shadow: ${({ theme }) => theme.shadows.xl};
`;

export const NextRouteHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: ${({ theme }) => theme.spacing.lg};

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        flex-direction: column;
        gap: ${({ theme }) => theme.spacing.md};
    }
`;

export const NextRouteTitle = styled.div`
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wide};
    opacity: 0.9;
    margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

export const NextRouteTime = styled.div`
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export const NextRouteNumber = styled.div`
    font-size: 1.125rem;
    font-weight: 600;
`;

export const NextRouteInfo = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: ${({ theme }) => theme.spacing.lg};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const NextRouteInfoItem = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
    font-size: 0.9375rem;
`;

export const NextRouteRoute = styled.div`
    font-size: 1rem;
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    opacity: 0.95;
`;

export const NextRouteActions = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.sm};

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        flex-direction: column;
    }
`;

export const RoutesList = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
`;

export const RouteCard = styled.div`
    padding: ${({ theme }) => theme.spacing.lg};
    background: white;
    border: 1px solid ${({ theme }) => theme.colors.slate[200]};
    border-radius: ${({ theme }) => theme.borderRadius.xl};
    transition: all ${({ theme }) => theme.transitions.normal};

    &:hover {
        box-shadow: ${({ theme }) => theme.shadows.md};
        border-color: ${({ theme }) => theme.colors.primary[200]};
    }
`;

export const RouteHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: ${({ theme }) => theme.spacing.md};
    gap: ${({ theme }) => theme.spacing.md};

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        flex-direction: column;
    }
`;

export const RouteMainInfo = styled.div`
    flex: 1;
`;

export const RouteNumber = styled.div`
    font-size: 1rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[900]};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export const RouteTime = styled.div`
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.slate[600]};
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
`;

export const RouteDetails = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: ${({ theme }) => theme.spacing.md};
    padding: ${({ theme }) => theme.spacing.md};
    background: ${({ theme }) => theme.colors.slate[50]};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const RouteDetailItem = styled.div`
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.slate[700]};
`;

export const RouteDetailLabel = styled.div`
    font-size: 0.75rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[500]};
    text-transform: uppercase;
    letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wide};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export const RouteActions = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.xs};
    flex-wrap: wrap;
`;

export const EmptyState = styled.div`
    padding: ${({ theme }) => theme.spacing['2xl']};
    text-align: center;
    background: ${({ theme }) => theme.colors.slate[50]};
    border-radius: ${({ theme }) => theme.borderRadius.xl};
    border: 1px dashed ${({ theme }) => theme.colors.slate[300]};
`;

export const EmptyIcon = styled.div`
    width: 64px;
    height: 64px;
    margin: 0 auto ${({ theme }) => theme.spacing.md};
    background: linear-gradient(
        to bottom right,
        ${({ theme }) => theme.colors.slate[100]},
        ${({ theme }) => theme.colors.slate[200]}
    );
    border-radius: ${({ theme }) => theme.borderRadius.full};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.colors.slate[500]};
`;

export const EmptyTitle = styled.h3`
    font-size: 1.125rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[900]};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export const EmptyText = styled.p`
    font-size: 0.9375rem;
    color: ${({ theme }) => theme.colors.slate[600]};
`;