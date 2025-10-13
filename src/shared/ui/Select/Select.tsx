import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components';

const SelectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.slate[700]};
`;

const RequiredMark = styled.span`
  color: ${({ theme }) => theme.colors.danger[500]};
  margin-left: 2px;
`;

interface StyledSelectProps {
    $hasError?: boolean;
}

const StyledSelect = styled.select<StyledSelectProps>`
  width: 100%;
  padding: 0.625rem ${({ theme }) => theme.spacing.md};
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.slate[900]};
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.slate[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  transition: all ${({ theme }) => theme.transitions.normal};
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.slate[50]};
    cursor: not-allowed;
    opacity: 0.6;
  }

  ${({ $hasError, theme }) =>
    $hasError &&
    css`
      border-color: ${theme.colors.danger[500]};

      &:focus {
        border-color: ${theme.colors.danger[500]};
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
      }
    `}
`;

const ErrorMessage = styled.span`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.danger[600]};
`;

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: Array<{ value: string; label: string }>;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, error, required, id, options, ...props }, ref) => {
        const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

        return (
            <SelectWrapper>
                {label && (
                    <Label htmlFor={selectId}>
                        {label}
                        {required && <RequiredMark>*</RequiredMark>}
                    </Label>
                )}
                <StyledSelect
                    id={selectId}
                    ref={ref}
                    $hasError={Boolean(error)}
                    required={required}
                    {...props}
                >
                    <option value="">Wybierz...</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </StyledSelect>
                {error && <ErrorMessage>{error}</ErrorMessage>}
            </SelectWrapper>
        );
    }
);

Select.displayName = 'Select';