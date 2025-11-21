// src/features/routes/components/RouteSeriesList/RouteSeriesList.styles.ts

import styled from 'styled-components';

export const FiltersContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: ${({ theme }) => theme.spacing.md};
    margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

export const SeriesCard = styled.div`
    background: white;
    border: 1px solid ${({ theme }) => theme.colors.slate[200]};
    border-radius: ${({ theme }) => theme.borderRadius.xl};
    padding: ${({ theme }) => theme.spacing.xl};
    transition: all ${({ theme }) => theme.transitions.normal};
    cursor: pointer;

    &:hover {
        transform: translateY(-2px);
        box-shadow: ${({ theme }) => theme.shadows.lg};
        border-color: ${({ theme }) => theme.colors.primary[300]};
    }
`;

export const SeriesHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: ${({ theme }) => theme.spacing.md};
    gap: ${({ theme }) => theme.spacing.md};
`;

export const SeriesIcon = styled.div`
    width: 48px;
    height: 48px;
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    background: ${({ theme }) => theme.gradients.avatar};
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    flex-shrink: 0;
`;

export const SeriesInfo = styled.div`
    flex: 1;
    min-width: 0;
`;

export const SeriesName = styled.h3`
    font-size: 1.125rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[900]};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

export const SeriesMeta = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: ${({ theme }) => theme.spacing.md};
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.slate[600]};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

export const MetaItem = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
`;

export const SeriesFooter = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: ${({ theme }) => theme.spacing.md};
    border-top: 1px solid ${({ theme }) => theme.colors.slate[100]};
`;

export const EmptyState = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: ${({ theme }) => theme.spacing['2xl']};
    text-align: center;
    background: white;
    border-radius: ${({ theme }) => theme.borderRadius['2xl']};
    border: 2px dashed ${({ theme }) => theme.colors.slate[300]};
`;

export const EmptyIcon = styled.div`
    width: 80px;
    height: 80px;
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    background: ${({ theme }) => theme.colors.slate[100]};
    border-radius: ${({ theme }) => theme.borderRadius.full};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.colors.slate[400]};
`;

export const EmptyText = styled.p`
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.slate[600]};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

export const EmptyHint = styled.p`
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.slate[500]};
`;