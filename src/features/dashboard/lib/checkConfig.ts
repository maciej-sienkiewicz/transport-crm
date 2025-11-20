// src/features/dashboard/lib/checkConfig.ts

import { CheckType, CheckStatus, ReadinessCheck } from '../types';

interface CheckActionConfig {
    label: string;
    route: string;
}

interface CheckTypeConfig {
    label: string;
    getMessage: (check: ReadinessCheck) => string;
    getCountDisplay: (check: ReadinessCheck) => string | null;
    getAction: (status: CheckStatus) => CheckActionConfig | null;
}

/**
 * Typy sprawdzeń które pokazujemy w dual column (tylko 3)
 */
export const DISPLAYED_CHECK_TYPES: CheckType[] = [
    'ROUTES_DRIVERS',
    'ROUTES_VEHICLES',
    'CHILDREN_ASSIGNED'
];

/**
 * Konfiguracja dla wszystkich typów sprawdzeń
 */
export const CHECK_TYPE_CONFIG: Record<CheckType, CheckTypeConfig> = {
    ROUTES_DRIVERS: {
        label: 'Kierowcy na trasach',
        getMessage: (check) => {
            if (check.status === 'OK') {
                return 'Wszystkie trasy mają kierowców';
            }
            if (check.count !== undefined && check.totalCount !== undefined) {
                const missing = check.totalCount - check.count;
                return `${missing} ${missing === 1 ? 'trasa' : 'tras'} bez kierowców`;
            }
            return 'Część tras nie ma kierowców';
        },
        getCountDisplay: (check) => {
            if (check.count !== undefined && check.totalCount !== undefined) {
                return `${check.count}/${check.totalCount}`;
            }
            return null;
        },
        getAction: (status) => {
            if (status !== 'OK') {
                return {
                    label: 'Przypisz kierowców',
                    route: '/routes'
                };
            }
            return null;
        }
    },

    ROUTES_VEHICLES: {
        label: 'Pojazdy na trasach',
        getMessage: (check) => {
            if (check.status === 'OK') {
                return 'Wszystkie trasy mają pojazdy';
            }
            if (check.count !== undefined && check.totalCount !== undefined) {
                const missing = check.totalCount - check.count;
                return `${missing} ${missing === 1 ? 'trasa' : 'tras'} bez pojazdów`;
            }
            return 'Część tras nie ma pojazdów';
        },
        getCountDisplay: (check) => {
            if (check.count !== undefined && check.totalCount !== undefined) {
                return `${check.count}/${check.totalCount}`;
            }
            return null;
        },
        getAction: (status) => {
            if (status !== 'OK') {
                return {
                    label: 'Przypisz pojazdy',
                    route: '/routes'
                };
            }
            return null;
        }
    },

    CHILDREN_ASSIGNED: {
        label: 'Dzieci przypisane',
        getMessage: (check) => {
            if (check.status === 'OK') {
                return 'Wszystkie dzieci mają trasy';
            }
            if (check.count !== undefined && check.totalCount !== undefined) {
                const missing = check.totalCount - check.count;
                return `${missing} ${missing === 1 ? 'dziecko' : 'dzieci'} bez tras`;
            }
            return 'Część dzieci nie ma tras';
        },
        getCountDisplay: (check) => {
            if (check.count !== undefined && check.totalCount !== undefined) {
                return `${check.count}/${check.totalCount}`;
            }
            return null;
        },
        getAction: (status) => {
            if (status !== 'OK') {
                return {
                    label: 'Przypisz do tras',
                    route: '/routes/unassigned'
                };
            }
            return null;
        }
    },

    DRIVER_DOCUMENTS: {
        label: 'Dokumenty kierowców',
        getMessage: (check) => {
            if (check.status === 'OK') {
                return 'Dokumenty wszystkich kierowców są aktualne';
            }
            if (check.count !== undefined && check.totalCount !== undefined) {
                const expiring = check.totalCount - check.count;
                return `${expiring} ${expiring === 1 ? 'kierowca' : 'kierowców'} z wygasającymi dokumentami`;
            }
            return 'Część kierowców ma wygasające dokumenty';
        },
        getCountDisplay: (check) => {
            if (check.count !== undefined && check.totalCount !== undefined) {
                return `${check.count}/${check.totalCount}`;
            }
            return null;
        },
        getAction: (status) => {
            if (status !== 'OK') {
                return {
                    label: 'Przedłuż dokumenty',
                    route: '/drivers'
                };
            }
            return null;
        }
    },

    VEHICLES_TECHNICAL: {
        label: 'Przeglądy techniczne',
        getMessage: (check) => {
            if (check.status === 'OK') {
                return 'Wszystkie pojazdy mają aktualny przegląd';
            }
            if (check.count !== undefined && check.totalCount !== undefined) {
                const expiring = check.totalCount - check.count;
                return `${expiring} ${expiring === 1 ? 'pojazd wymaga' : 'pojazdy wymagają'} przeglądu`;
            }
            return 'Część pojazdów wymaga przeglądu';
        },
        getCountDisplay: (check) => {
            if (check.count !== undefined && check.totalCount !== undefined) {
                return `${check.count}/${check.totalCount}`;
            }
            return null;
        },
        getAction: (status) => {
            if (status !== 'OK') {
                return {
                    label: 'Zobacz szczegóły',
                    route: '/vehicles'
                };
            }
            return null;
        }
    }
};

/**
 * Filtruje sprawdzenia do tylko tych wyświetlanych (3 typy)
 */
export const filterChecks = (checks: ReadinessCheck[]): ReadinessCheck[] => {
    const filtered = checks.filter(check =>
        DISPLAYED_CHECK_TYPES.includes(check.type)
    );

    // Sortuj według kolejności w DISPLAYED_CHECK_TYPES
    filtered.sort((a, b) =>
        DISPLAYED_CHECK_TYPES.indexOf(a.type) - DISPLAYED_CHECK_TYPES.indexOf(b.type)
    );

    // Upewnij się że mamy wszystkie 3 typy (dodaj placeholder jeśli brakuje)
    DISPLAYED_CHECK_TYPES.forEach(type => {
        if (!filtered.find(c => c.type === type)) {
            filtered.push({
                type,
                status: 'OK',
                message: CHECK_TYPE_CONFIG[type].getMessage({
                    type,
                    status: 'OK',
                    message: ''
                })
            });
        }
    });

    return filtered;
};