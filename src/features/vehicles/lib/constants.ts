// src/features/vehicles/lib/constants.ts
import { VehicleType, VehicleStatus } from '../types';

export const vehicleTypeLabels: Record<VehicleType, string> = {
    BUS: 'Autobus (20+ miejsc)',
    MICROBUS: 'Mikrobus (10-20 miejsc)',
    VAN: 'Van (do 10 miejsc)',
};

export const vehicleTypeOptions = Object.entries(vehicleTypeLabels).map(([value, label]) => ({
    value,
    label,
}));

export const vehicleStatusLabels: Record<VehicleStatus, string> = {
    AVAILABLE: 'Dostępny',
    IN_ROUTE: 'Na trasie',
    MAINTENANCE: 'W serwisie',
    OUT_OF_SERVICE: 'Wycofany z użytku',
};

export const vehicleStatusOptions = Object.entries(vehicleStatusLabels).map(([value, label]) => ({
    value,
    label,
}));