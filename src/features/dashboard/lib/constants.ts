import { AlertType, AlertScope } from '../types';

export const ALERT_TYPE_CONFIG: Record<AlertType, {
    icon: string;
    title: string;
    getDescription: (count: number) => string;
    primaryAction: {
        label: string;
        route: string;
    };
}> = {
    CHILDREN_NO_ROUTES: {
        icon: '👶',
        title: 'Dzieci bez tras',
        getDescription: (count) =>
            count === 0
                ? 'Wszystkie dzieci mają przypisane trasy'
                : `${count} ${count === 1 ? 'dziecko wymaga' : 'dzieci wymagają'} przypisania do tras`,
        primaryAction: {
            label: 'Przypisz do tras',
            route: '/routes/unassigned'
        }
    },
    ROUTES_NO_DRIVERS: {
        icon: '🚗',
        title: 'Trasy bez kierowców',
        getDescription: (count) =>
            count === 0
                ? 'Wszystkie trasy mają kierowców'
                : `${count} ${count === 1 ? 'trasa wymaga' : 'tras wymagają'} przypisania kierowcy`,
        primaryAction: {
            label: 'Przypisz kierowców',
            route: '/routes?filter=no-drivers'
        }
    },
    DRIVER_DOCUMENTS: {
        icon: '📄',
        title: 'Dokumenty kierowców',
        getDescription: (count) =>
            count === 0
                ? 'Wszystkie dokumenty aktualne'
                : `${count} ${count === 1 ? 'kierowca' : 'kierowców'} z wygasającymi dokumentami`,
        primaryAction: {
            label: 'Przedłuż dokumenty',
            route: '/drivers?filter=expiring-docs'
        }
    },
    VEHICLE_DOCUMENTS: {
        icon: '🚙',
        title: 'Dokumenty pojazdów',
        getDescription: (count) =>
            count === 0
                ? 'Wszystkie dokumenty aktualne'
                : `${count} ${count === 1 ? 'pojazd' : 'pojazdów'} z wygasającymi dokumentami`,
        primaryAction: {
            label: 'Przedłuż dokumenty',
            route: '/vehicles?filter=expiring-docs'
        }
    },
    ROUTES_NO_VEHICLES: {
        icon: '🚐',
        title: 'Trasy bez pojazdów',
        getDescription: (count) =>
            count === 0
                ? 'Wszystkie trasy mają pojazdy'
                : `${count} ${count === 1 ? 'trasa wymaga' : 'tras wymagają'} przypisania pojazdu`,
        primaryAction: {
            label: 'Przypisz pojazdy',
            route: '/routes?filter=no-vehicles'
        }
    }
};

export const ALERT_SCOPE_LABELS: Record<AlertScope, string> = {
    TOMORROW: 'Jutro',
    THREE_DAYS: '3 dni',
    SEVEN_DAYS: '7 dni',
    THIRTY_DAYS: '30 dni'
};