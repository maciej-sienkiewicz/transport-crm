// src/features/routes/components/CreateSeriesModal/CreateSeriesModal.styles.ts

import styled from 'styled-components';

export const FormGrid = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.lg};
`;

export const RecurrenceOptions = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: ${({ theme }) => theme.spacing.sm};

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        grid-template-columns: 1fr;
    }
`;

export const RecurrenceOption = styled.label<{ $checked: boolean }>`
    display: flex;
    align-items: center;
    padding: ${({ theme }) => theme.spacing.md};
    background: ${({ $checked, theme }) =>
    $checked ? theme.colors.primary[50] : theme.colors.slate[50]};
    border: 2px solid
        ${({ $checked, theme }) =>
    $checked ? theme.colors.primary[500] : theme.colors.slate[200]};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    cursor: pointer;
    transition: all ${({ theme }) => theme.transitions.fast};

    &:hover {
        border-color: ${({ theme }) => theme.colors.primary[300]};
        background: ${({ theme }) => theme.colors.primary[50]};
    }

    input {
        margin-right: ${({ theme }) => theme.spacing.sm};
    }
`;

export const InfoSection = styled.div`
    padding: ${({ theme }) => theme.spacing.md};
    background: ${({ theme }) => theme.colors.slate[50]};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    border: 1px solid ${({ theme }) => theme.colors.slate[200]};
`;

export const InfoRow = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.slate[700]};
    margin-bottom: ${({ theme }) => theme.spacing.xs};

    &:last-child {
        margin-bottom: 0;
    }

    svg {
        color: ${({ theme }) => theme.colors.primary[600]};
    }
`;

export const ButtonGroup = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.sm};
    justify-content: flex-end;
    margin-top: ${({ theme }) => theme.spacing.lg};
`;