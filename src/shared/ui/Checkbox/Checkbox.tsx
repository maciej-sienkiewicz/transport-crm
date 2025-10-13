import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { Check } from 'lucide-react';

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
`;

const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  position: absolute;
  opacity: 0;
  cursor: pointer;
`;

const StyledCheckbox = styled.div<{ $checked: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 2px solid ${({ theme, $checked }) =>
    $checked ? theme.colors.primary[600] : theme.colors.slate[300]};
  background: ${({ theme, $checked }) =>
    $checked ? theme.colors.primary[600] : 'white'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[600]};
  }
`;

const CheckIcon = styled(Check)`
  color: white;
  width: 14px;
  height: 14px;
`;

const Label = styled.label`
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.slate[700]};
  cursor: pointer;
  user-select: none;
`;

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    ({ label, checked, ...props }, ref) => {
        return (
            <CheckboxWrapper>
                <HiddenCheckbox ref={ref} checked={checked} {...props} />
                <StyledCheckbox $checked={!!checked}>
                    {checked && <CheckIcon />}
                </StyledCheckbox>
                {label && <Label>{label}</Label>}
            </CheckboxWrapper>
        );
    }
);

Checkbox.displayName = 'Checkbox';