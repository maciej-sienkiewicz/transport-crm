// src/features/routes/components/RouteMapModal/components/Banners/Banners.styles.ts
import styled from 'styled-components';

export const InfoBanner = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.sm};
    padding: ${({ theme }) => theme.spacing.md};
    background: linear-gradient(135deg, #ede9fe, #ddd6fe);
    border: 1px solid #c4b5fd;
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    color: #6d28d9;
    font-size: 0.8125rem;
    line-height: 1.5;
    font-weight: 500;
`;

export const WarningBanner = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.sm};
    padding: ${({ theme }) => theme.spacing.md};
    background: ${({ theme }) => theme.colors.warning[50]};
    border: 1px solid ${({ theme }) => theme.colors.warning[200]};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    color: ${({ theme }) => theme.colors.warning[800]};
    font-size: 0.75rem;
    line-height: 1.5;
`;

export const ValidationError = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 8px;
    color: #dc2626;
    font-size: 0.75rem;
    margin-top: 8px;
`;