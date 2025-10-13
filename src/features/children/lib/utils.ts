import { DisabilityType } from '../types';
import { disabilityLabels } from './constants';

export const formatDisabilities = (disabilities: DisabilityType[]): string => {
    if (disabilities.length === 0) return 'Brak';
    if (disabilities.length === 1) return disabilityLabels[disabilities[0]];
    return `${disabilityLabels[disabilities[0]]} +${disabilities.length - 1}`;
};

export const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }

    return age;
};

export const formatBirthDate = (birthDate: string): string => {
    const date = new Date(birthDate);
    return date.toLocaleDateString('pl-PL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};