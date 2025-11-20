// src/features/routes/components/RouteMapModal/components/Footer/Footer.tsx
import React from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import {
    ModalFooter,
    FooterLeft,
    FooterRight,
    FooterButton,
} from './Footer.styles';
import { ValidationResult } from '../../utils/types';

interface FooterProps {
    hasChanges: boolean;
    validation: ValidationResult;
    onSave: () => void;
    onCancel: () => void;
}

export const Footer: React.FC<FooterProps> = ({
                                                  hasChanges,
                                                  validation,
                                                  onSave,
                                                  onCancel,
                                              }) => {
    return (
        <ModalFooter>
            <FooterLeft>
                {hasChanges && validation.isValid && (
                    <>
                        <AlertCircle size={16} style={{ color: '#f59e0b' }} />
                        Masz niezapisane zmiany
                    </>
                )}
                {!validation.isValid && (
                    <>
                        <AlertCircle size={16} style={{ color: '#dc2626' }} />
                        Napraw błędy przed zapisaniem
                    </>
                )}
            </FooterLeft>
            <FooterRight>
                <FooterButton onClick={onCancel}>
                    <X size={16} />
                    Anuluj
                </FooterButton>
                <FooterButton
                    $variant="primary"
                    onClick={onSave}
                    disabled={!hasChanges || !validation.isValid}
                >
                    <Save size={16} />
                    Zapisz i przypisz
                </FooterButton>
            </FooterRight>
        </ModalFooter>
    );
};