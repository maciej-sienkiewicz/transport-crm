// /routes/components/RouteDetail/RouteDetailHeader/RouteDetailHeader.styles.ts

import styled from 'styled-components';

export const LeftColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.lg};
    min-width: 0;
`;

export const RouteHeaderContainer = styled.div`
    background: ${({ theme }) => theme.gradients.cardHeader};
    padding: ${({ theme }) => theme.spacing.xl};
    border-radius: ${({ theme }) => theme.borderRadius['2xl']};
    border: 1px solid ${({ theme }) => theme.colors.slate[200]};
`;

export const RouteTitleRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    gap: ${({ theme }) => theme.spacing.md};

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        flex-direction: column;
    }
`;

export const RouteTitle = styled.h2`
    font-size: 1.75rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.slate[900]};

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        font-size: 1.5rem;
    }
`;

export const SimplifiedMetaGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: ${({ theme }) => theme.spacing.md};
`;

export const MetaItem = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
    font-size: 0.9375rem;
    color: ${({ theme }) => theme.colors.slate[700]};
`;

export const MetaLabel = styled.span`
    color: ${({ theme }) => theme.colors.slate[500]};
    font-size: 0.875rem;
`;

export const MetaLinkButton = styled.button`
    background: none;
    border: none;
    padding: 0;
    font-family: inherit;
    font-size: 0.9375rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[800]};
    cursor: pointer;
    transition: color ${({ theme }) => theme.transitions.fast};
    text-align: left;
    display: inline;

    &:hover {
        color: ${({ theme }) => theme.colors.primary[600]};
        text-decoration: underline;
    }
`;

export const ActionButtons = styled.div`
    display: flex;
    flex-direction: row;
    gap: ${({ theme }) => theme.spacing.sm};
    flex-wrap: wrap;
`;