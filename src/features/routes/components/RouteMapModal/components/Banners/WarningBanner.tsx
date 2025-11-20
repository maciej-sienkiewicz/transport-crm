// src/features/routes/components/RouteMapModal/components/Banners/WarningBanner.tsx
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { WarningBanner as StyledWarningBanner, ValidationError } from './Banners.styles';

interface WarningBannerProps {
    missingCount: number;
}

export const WarningBanner: React.FC<WarningBannerProps> = ({ missingCount }) => {
    if (missingCount === 0) return null;

    return (
        <StyledWarningBanner>
            <AlertCircle size={16} />
            <div>
                {missingCount} {missingCount === 1 ? 'punkt nie ma' : 'punktów nie ma'} współrzędnych GPS i nie{' '}
                {missingCount === 1 ? 'jest wyświetlany' : 'są wyświetlane'} na mapie</div>
        </StyledWarningBanner>
    );
};

interface ValidationErrorsProps {
    errors: string[];
}

export const ValidationErrors: React.FC<ValidationErrorsProps> = ({ errors }) => {
    if (errors.length === 0) return null;

    return (
        <>
            {errors.map((error, idx) => (
                <ValidationError key={idx}>
                    <AlertCircle size={14} />
                    {error}
                </ValidationError>
            ))}
        </>
    );
};