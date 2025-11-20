// src/features/routes/components/RouteMapModal/utils/validation.ts
import { RoutePoint, ValidationResult } from './types';

export const validatePointsOrder = (points: RoutePoint[]): ValidationResult => {
    const errors: string[] = [];
    const childPickupIndices: Record<string, number> = {};

    points.forEach((point, index) => {
        if (point.type === 'pickup') {
            childPickupIndices[point.childName] = index;
        } else if (point.type === 'dropoff') {
            const pickupIndex = childPickupIndices[point.childName];
            if (pickupIndex === undefined) {
                errors.push(`Dowóz ${point.childName} występuje przed odbiorem`);
            } else if (pickupIndex >= index) {
                errors.push(`Dowóz ${point.childName} musi być po odbiór`);
            }
        }
    });

    return {
        isValid: errors.length === 0,
        errors,
    };
};

export const calculateRouteStats = (points: RoutePoint[]): RouteStats => {
    const newPoints = points.filter(p => p.isNew);
    const validPoints = points.filter(p => p.hasCoordinates && p.lat !== null && p.lng !== null);

    return {
        totalPoints: points.length,
        existingPoints: points.length - newPoints.length,
        newPoints: newPoints.length,
        validPoints: validPoints.length,
        missingCoordinates: points.length - validPoints.length,
    };
};