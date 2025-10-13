import { DisabilityType, ChildStatus, GuardianRelationship } from '../types';

export const disabilityLabels: Record<DisabilityType, string> = {
    INTELLECTUAL: 'Niepełnosprawność intelektualna',
    PHYSICAL: 'Niepełnosprawność ruchowa',
    SENSORY_VISUAL: 'Niepełnosprawność wzrokowa',
    SENSORY_HEARING: 'Niepełnosprawność słuchowa',
    AUTISM: 'Spektrum autyzmu',
    MULTIPLE: 'Niepełnosprawność sprzężona',
    SPEECH: 'Zaburzenia mowy',
    MENTAL: 'Zaburzenia psychiczne',
};

export const disabilityOptions = Object.entries(disabilityLabels).map(([value, label]) => ({
    value,
    label,
}));

export const statusLabels: Record<ChildStatus, string> = {
    ACTIVE: 'Aktywny',
    INACTIVE: 'Nieaktywny',
    TEMPORARY_INACTIVE: 'Czasowo nieaktywny',
};

export const statusOptions = Object.entries(statusLabels).map(([value, label]) => ({
    value,
    label,
}));

export const relationshipLabels: Record<GuardianRelationship, string> = {
    PARENT: 'Rodzic',
    LEGAL_GUARDIAN: 'Opiekun prawny',
    GRANDPARENT: 'Dziadek/Babcia',
    RELATIVE: 'Inny członek rodziny',
    OTHER: 'Inna osoba upoważniona',
};

export const relationshipOptions = Object.entries(relationshipLabels).map(([value, label]) => ({
    value,
    label,
}));