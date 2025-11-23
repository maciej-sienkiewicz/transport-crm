// src/features/routes/components/ConflictModal/ConflictModal.tsx

import React from 'react';
import { RouteImpactModal, RouteImpactData } from '@/shared/ui/RouteImpactModal';

export interface ConflictData {
    message: string;
    conflicts: {
        singleRoutes: Record<string, string[]>;
        series: Record<string, string>;
    };
    timestamp: string;
}

interface ConflictModalProps {
    isOpen: boolean;
    onClose: () => void;
    conflictData: ConflictData | null;
}

/**
 * ConflictModal - wrapper wokół RouteImpactModal do obsługi konfliktów harmonogramów
 * Konwertuje format danych z API konfliktów na format RouteImpactData
 */
export const ConflictModal: React.FC<ConflictModalProps> = ({
                                                                isOpen,
                                                                onClose,
                                                                conflictData,
                                                            }) => {
    if (!conflictData) return null;

    // Konwertuj dane konfliktów na format RouteImpactData
    const affectedRoutes = conflictData.conflicts.singleRoutes
        ? Object.entries(conflictData.conflicts.singleRoutes).flatMap(([childName, dates]) => {
            if (!Array.isArray(dates)) return [];

            return dates.map((date) => ({
                id: `conflict-${childName}-${date}`,
                routeName: `Konflikt: ${childName}`,
                date: date,
                previousStatus: 'AVAILABLE',
                newStatus: 'CONFLICT',
            }));
        })
        : [];

    const affectedSeries = conflictData.conflicts.series
        ? Object.entries(conflictData.conflicts.series).map(([childName, seriesName]) => ({
            id: `series-${childName}`,
            seriesName: `${childName} - ${seriesName}`,
            startDate: new Date().toISOString().split('T')[0],
            endDate: null,
        }))
        : [];

    const totalConflicts =
        (conflictData.conflicts.singleRoutes
            ? Object.values(conflictData.conflicts.singleRoutes).reduce(
                (sum, dates) => sum + (Array.isArray(dates) ? dates.length : 0),
                0
            )
            : 0) +
        (conflictData.conflicts.series ? Object.keys(conflictData.conflicts.series).length : 0);

    const impactData: RouteImpactData = {
        title: 'Wykryto konflikty harmonogramów',
        message: `Znaleziono ${totalConflicts} ${
            totalConflicts === 1 ? 'konflikt' : 'konfliktów'
        }. Dzieci są już przypisane do poniższych tras lub serii.`,
        affectedRoutes: affectedRoutes.length > 0 ? affectedRoutes : undefined,
        affectedSeries: affectedSeries.length > 0 ? affectedSeries : undefined,
        variant: 'danger',
    };

    return <RouteImpactModal isOpen={isOpen} onClose={onClose} data={impactData} />;
};