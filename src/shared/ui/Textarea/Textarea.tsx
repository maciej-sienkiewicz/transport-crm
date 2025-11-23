// src/shared/ui/Textarea/Textarea.tsx
import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xs};
`;

const Label = styled.label<{ $required?: boolean }>`
    font-size: 0.875rem;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.slate[700]};

    ${({ $required }) =>
    $required &&
    `
        &::after {
            content: ' *';
            color: #ef4444;
        }
    `}
`;

const StyledTextarea = styled.textarea<{ $hasError?: boolean }>`
    width: 100%;
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    font-size: 0.9375rem;
    color: ${({ theme }) => theme.colors.slate[900]};
    background: white;
    border: 1px solid
        ${({ $hasError, theme }) =>
    $hasError ? theme.colors.danger[300] : theme.colors.slate[300]};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    transition: all ${({ theme }) => theme.transitions.fast};
    resize: vertical;
    font-family: inherit;
    line-height: 1.5;

    &:focus {
        outline: none;
        border-color: ${({ $hasError, theme }) =>
    $hasError ? theme.colors.danger[500] : theme.colors.primary[500]};
        box-shadow: 0 0 0 3px
            ${({ $hasError, theme }) =>
    $hasError ? theme.colors.danger[100] : theme.colors.primary[100]};
    }

    &:disabled {
        background: ${({ theme }) => theme.colors.slate[100]};
        cursor: not-allowed;
        opacity: 0.6;
    }

    &::placeholder {
        color: ${({ theme }) => theme.colors.slate[400]};
    }
`;

const ErrorText = styled.span`
    font-size: 0.8125rem;
    color: ${({ theme }) => theme.colors.danger[600]};
`;

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
                                                      label,
                                                      error,
                                                      required,
                                                      id,
                                                      ...props
                                                  }) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <Container>
            {label && (
                <Label htmlFor={textareaId} $required={required}>
                    {label}
                </Label>
            )}
            <StyledTextarea id={textareaId} $hasError={!!error} {...props} />
            {error && <ErrorText>{error}</ErrorText>}
        </Container>
    );
};