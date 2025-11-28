import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { Check } from 'lucide-react';

const CheckboxContainer = styled.div`
    display: inline-flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
`;

const CheckboxLabel = styled.label`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
    cursor: pointer;
    user-select: none;
    position: relative;
`;

const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
`;

const StyledCheckbox = styled.div<{ $checked: boolean; $disabled: boolean }>`
  width: 20px;
  height: 20px;
  min-width: 20px;
  min-height: 20px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 2px solid ${({ theme, $checked, $disabled }) =>
    $disabled
        ? theme.colors.slate[200]
        : $checked
            ? theme.colors.primary[600]
            : theme.colors.slate[300]};
  background: ${({ theme, $checked, $disabled }) =>
    $disabled
        ? theme.colors.slate[100]
        : $checked
            ? theme.colors.primary[600]
            : 'white'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ${({ theme }) => theme.transitions.fast};
  flex-shrink: 0;

  ${CheckboxLabel}:hover &:not([disabled]) {
    border-color: ${({ theme, $checked }) =>
    $checked ? theme.colors.primary[700] : theme.colors.primary[400]};
  }

  ${CheckboxLabel}:active &:not([disabled]) {
    transform: scale(0.95);
  }
`;

const CheckIcon = styled(Check)`
    color: white;
    width: 14px;
    height: 14px;
`;

const LabelText = styled.span<{ $disabled: boolean }>`
  font-size: 0.9375rem;
  color: ${({ theme, $disabled }) =>
    $disabled ? theme.colors.slate[400] : theme.colors.slate[700]};
  line-height: 1.5;
`;

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    ({ label, checked = false, disabled = false, id, onChange, ...props }, ref) => {
        const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

        return (
            <CheckboxContainer>
                <CheckboxLabel htmlFor={checkboxId}>
                    <HiddenCheckbox
                        ref={ref}
                        id={checkboxId}
                        checked={checked}
                        disabled={disabled}
                        onChange={onChange}
                        {...props}
                    />
                    <StyledCheckbox $checked={checked} $disabled={!!disabled}>
                        {checked && <CheckIcon />}
                    </StyledCheckbox>
                    {label && <LabelText $disabled={!!disabled}>{label}</LabelText>}
                </CheckboxLabel>
            </CheckboxContainer>
        );
    }
);

Checkbox.displayName = 'Checkbox';