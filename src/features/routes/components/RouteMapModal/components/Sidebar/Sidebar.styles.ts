// src/features/routes/components/RouteMapModal/components/Sidebar/Sidebar.styles.ts
import styled from 'styled-components';

export const SidebarContainer = styled.div`
    width: 350px;
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
    overflow-y: auto;

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        width: 100%;
        max-height: 300px;
    }
`;

export const RouteStats = styled.div`
    padding: ${({ theme }) => theme.spacing.md};
    background: ${({ theme }) => theme.colors.slate[50]};
    border: 1px solid ${({ theme }) => theme.colors.slate[200]};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xs};
`;

export const StatRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.75rem;
`;

export const StatLabel = styled.div`
    color: ${({ theme }) => theme.colors.slate[600]};
`;

export const StatValue = styled.div`
    color: ${({ theme }) => theme.colors.slate[900]};
    font-weight: 600;
`;

export const ActionButtons = styled.div`
    display: flex;
    gap: 12px;
`;

export const ActionButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px 16px;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
    border: none;

    ${({ $variant }) => {
    if ($variant === 'primary') {
        return `
                background: #2563eb;
                color: white;
                &:hover:not(:disabled) {
                    background: #1d4ed8;
                }
            `;
    }
    return `
            background: #f1f5f9;
            color: #475569;
            &:hover:not(:disabled) {
                background: #e2e8f0;
            }
        `;
}}

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;