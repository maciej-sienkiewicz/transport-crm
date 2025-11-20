// src/features/routes/components/RouteMapModal/components/StopNumberEditor/StopNumberEditor.styles.ts
import styled from 'styled-components';

export const EditorOverlay = styled.div`
    position: fixed;
    inset: 0;
    z-index: 2000;
    background: rgba(0, 0, 0, 0.3);
`;

export const EditorContainer = styled.div<{ $x: number; $y: number }>`
    position: fixed;
    left: ${({ $x }) => $x}px;
    top: ${({ $y }) => $y}px;
    transform: translate(-50%, -50%);
    background: white;
    border-radius: ${({ theme }) => theme.borderRadius.xl};
    box-shadow: ${({ theme }) => theme.shadows.xl};
    padding: ${({ theme }) => theme.spacing.lg};
    min-width: 280px;
    z-index: 2001;
    animation: popIn 0.2s cubic-bezier(0.4, 0, 0.2, 1);

    @keyframes popIn {
        from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.9);
        }
        to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
    }
`;

export const EditorTitle = styled.div`
    font-size: 0.875rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[900]};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export const EditorSubtitle = styled.div`
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.slate[600]};
    margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const EditorInputGroup = styled.div`
    margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const EditorLabel = styled.label`
    display: block;
    font-size: 0.75rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[700]};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export const EditorInput = styled.input`
    width: 100%;
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    border: 2px solid ${({ theme }) => theme.colors.slate[200]};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    font-size: 1.25rem;
    font-weight: 700;
    text-align: center;
    color: ${({ theme }) => theme.colors.slate[900]};
    transition: all ${({ theme }) => theme.transitions.fast};

    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.colors.primary[500]};
        box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
    }

    &::placeholder {
        color: ${({ theme }) => theme.colors.slate[400]};
    }
`;

export const EditorHint = styled.div`
    font-size: 0.6875rem;
    color: ${({ theme }) => theme.colors.slate[500]};
    margin-top: ${({ theme }) => theme.spacing.xs};
    text-align: center;
`;

export const EditorButtons = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.sm};
`;

export const EditorButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
    flex: 1;
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all ${({ theme }) => theme.transitions.fast};
    border: none;

    ${({ $variant, theme }) => {
    if ($variant === 'primary') {
        return `
                background: ${theme.gradients.primaryButton};
                color: white;
                box-shadow: ${theme.shadows.sm};

                &:hover:not(:disabled) {
                    transform: translateY(-1px);
                    box-shadow: ${theme.shadows.md};
                }

                &:active:not(:disabled) {
                    transform: translateY(0);
                }
            `;
    }
    return `
            background: ${theme.colors.slate[100]};
            color: ${theme.colors.slate[700]};

            &:hover:not(:disabled) {
                background: ${theme.colors.slate[200]};
            }
        `;
}}

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;