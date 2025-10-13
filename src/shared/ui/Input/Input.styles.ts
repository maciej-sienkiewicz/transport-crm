import styled, { css } from 'styled-components';

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
`;

export const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.slate[700]};
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.normal};
`;

export const RequiredMark = styled.span`
  color: ${({ theme }) => theme.colors.danger[500]};
  margin-left: 2px;
`;

interface StyledInputProps {
    $hasError?: boolean;
}

export const StyledInput = styled.input<StyledInputProps>`
  width: 100%;
  padding: 0.625rem ${({ theme }) => theme.spacing.md};
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.slate[900]};
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.slate[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  transition: all ${({ theme }) => theme.transitions.normal};
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.colors.slate[400]};
  }

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

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 0.875rem;
    padding: 0.5rem ${({ theme }) => theme.spacing.sm};
  }
`;

export const ErrorMessage = styled.span`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.danger[600]};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

export const HelperText = styled.span`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.slate[500]};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;