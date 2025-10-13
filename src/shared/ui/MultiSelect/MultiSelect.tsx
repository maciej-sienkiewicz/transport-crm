import React from 'react';
import styled from 'styled-components';
import { Checkbox } from '../Checkbox';

const MultiSelectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
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

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.slate[50]};
  border: 1px solid ${({ theme }) => theme.colors.slate[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
`;

const ErrorMessage = styled.span`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.danger[600]};
`;

interface Option {
    value: string;
    label: string;
}

interface MultiSelectProps {
    label?: string;
    required?: boolean;
    options: Option[];
    value: string[];
    onChange: (value: string[]) => void;
    error?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
                                                            label,
                                                            required,
                                                            options,
                                                            value,
                                                            onChange,
                                                            error,
                                                        }) => {
    const handleToggle = (optionValue: string) => {
        if (value.includes(optionValue)) {
            onChange(value.filter((v) => v !== optionValue));
        } else {
            onChange([...value, optionValue]);
        }
    };

    return (
        <MultiSelectWrapper>
            {label && (
                <Label>
                    {label}
                    {required && <RequiredMark>*</RequiredMark>}
                </Label>
            )}
            <OptionsContainer>
                {options.map((option) => (
                    <Checkbox
                        key={option.value}
                        label={option.label}
                        checked={value.includes(option.value)}
                        onChange={() => handleToggle(option.value)}
                    />
                ))}
            </OptionsContainer>
            {error && <ErrorMessage>{error}</ErrorMessage>}
        </MultiSelectWrapper>
    );
};