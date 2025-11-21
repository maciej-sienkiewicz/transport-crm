// src/features/routes/components/RouteSeriesDetail/RouteSeriesDetail.styles.ts

import styled from 'styled-components';

export const DetailContainer = styled.div`
    max-width: 1400px;
    margin: 0 auto;
    padding: ${({ theme }) => theme.spacing.xl};
    padding-top: 0;
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xl};
`;

export const HeaderCard = styled.div`
    background: white;
    border-radius: ${({ theme }) => theme.borderRadius['2xl']};
    border: 1px solid ${({ theme }) => theme.colors.slate[200]};
    box-shadow: ${({ theme }) => theme.shadows.sm};
    overflow: hidden;
`;

export const HeaderTop = styled.div`
    padding: ${({ theme }) => theme.spacing.xl};
    background: ${({ theme }) => theme.gradients.cardHeader};
    border-bottom: 1px solid ${({ theme }) => theme.colors.slate[200]};
`;

export const HeaderRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.lg};
    margin-bottom: ${({ theme }) => theme.spacing.lg};

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        flex-direction: column;
    }
`;

export const SeriesTitle = styled.h1`
    font-size: 1.875rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.slate[900]};
    margin-bottom: ${({ theme }) => theme.spacing.sm};

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        font-size: 1.5rem;
    }
`;

export const SeriesMeta = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: ${({ theme }) => theme.spacing.md};
    align-items: center;
    font-size: 0.9375rem;
    color: ${({ theme }) => theme.colors.slate[600]};
`;

export const MetaItem = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
`;

export const HeaderActions = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.sm};

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        width: 100%;
        flex-direction: column;

        button {
            width: 100%;
        }
    }
`;

export const StatsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: ${({ theme }) => theme.spacing.lg};
    padding: ${({ theme }) => theme.spacing.xl};
`;

export const StatCard = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xs};
`;

export const StatLabel = styled.div`
    font-size: 0.75rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[500]};
    text-transform: uppercase;
    letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wide};
`;

export const StatValue = styled.div`
    font-size: 1.25rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.slate[900]};
`;

export const SectionCard = styled.div`
    background: white;
    border-radius: ${({ theme }) => theme.borderRadius['2xl']};
    border: 1px solid ${({ theme }) => theme.colors.slate[200]};
    box-shadow: ${({ theme }) => theme.shadows.sm};
    overflow: hidden;
`;

export const SectionHeader = styled.div`
    padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
    background: ${({ theme }) => theme.gradients.cardHeader};
    border-bottom: 1px solid ${({ theme }) => theme.colors.slate[200]};
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.md};
`;

export const SectionTitle = styled.h2`
    font-size: 1.125rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[900]};
`;

export const SectionContent = styled.div`
    padding: ${({ theme }) => theme.spacing.xl};
`;