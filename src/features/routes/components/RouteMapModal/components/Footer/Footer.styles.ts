// src/features/routes/components/RouteMapModal/components/Footer/Footer.styles.ts
import styled from 'styled-components';

export const ModalFooter = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    padding: 20px;
    border-top: 1px solid #e2e8f0;
    background: #f8fafc;
`;

export const FooterLeft = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.8125rem;
    color: ${({ theme }) => theme.colors.slate[600]};
`;

export const FooterRight = styled.div`
    display: flex;
    gap: 12px;
`;

export const FooterButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 24px;
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
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
                }
            `;
    }
    return `
            background: white;
            color: #475569;
            border: 1px solid #cbd5e1;
            &:hover:not(:disabled) {
                background: #f8fafc;
            }
        `;
}}

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;