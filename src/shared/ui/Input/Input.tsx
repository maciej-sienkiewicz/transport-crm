import React, { forwardRef } from 'react';
import {
    InputWrapper,
    Label,
    RequiredMark,
    StyledInput,
    ErrorMessage,
    HelperText,
} from './Input.styles';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, helperText, required, id, ...props }, ref) => {
        const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

        return (
            <InputWrapper>
                {label && (
                    <Label htmlFor={inputId}>
                        {label}
                        {required && <RequiredMark>*</RequiredMark>}
                    </Label>
                )}
                <StyledInput
                    id={inputId}
                    ref={ref}
                    $hasError={Boolean(error)}
                    required={required}
                    {...props}
                />
                {error && <ErrorMessage>{error}</ErrorMessage>}
                {!error && helperText && <HelperText>{helperText}</HelperText>}
            </InputWrapper>
        );
    }
);

Input.displayName = 'Input';