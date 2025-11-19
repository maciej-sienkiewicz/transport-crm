// src/features/routes/components/SmartAssignmentDashboard/AutoMatchEngine.ts
import { UnassignedScheduleItem, RouteListItem, AutoMatchSuggestion } from '../../types';

export class AutoMatchEngine {
    /**
     * Oblicza dopasowania między harmonogramami a trasami
     */
    static calculateMatches(
        schedules: UnassignedScheduleItem[],
        routes: RouteListItem[]
    ): Map<string, AutoMatchSuggestion> {
        const matches = new Map<string, AutoMatchSuggestion>();

        schedules.forEach((schedule) => {
            const bestMatch = this.findBestMatch(schedule, routes);
            if (bestMatch) {
                matches.set(schedule.scheduleId, bestMatch);
            }
        });

        return matches;
    }

    /**
     * Znajduje najlepsze dopasowanie dla harmonogramu
     */
    private static findBestMatch(
        schedule: UnassignedScheduleItem,
        routes: RouteListItem[]
    ): AutoMatchSuggestion | null {
        let bestRoute: RouteListItem;
        let bestScore = 0;
        const reasons: string[] = [];

        routes.forEach((route) => {
            const score = this.calculateMatchScore(schedule, route);
            if (score > bestScore) {
                bestScore = score;
                bestRoute = route;
            }
        });

        if (bestScore < 30) {
            return null;
        }

        // Określ poziom pewności
        let confidence: 'high' | 'medium' | 'low';
        if (bestScore >= 80) {
            confidence = 'high';
            reasons.push('Doskonałe dopasowanie czasowe i geograficzne');
        } else if (bestScore >= 60) {
            confidence = 'medium';
            reasons.push('Dobre dopasowanie czasowe');
        } else {
            confidence = 'low';
            reasons.push('Możliwe dopasowanie');
        }

        return {
            scheduleId: schedule.scheduleId,
            routeId: bestRoute!!.id,
            routeName: bestRoute!!.routeName,
            confidence,
            reasons,
            estimatedPickupTime: schedule.pickupTime,
            estimatedDropoffTime: schedule.dropoffTime,
        };
    }

    /**
     * Oblicza wynik dopasowania (0-100)
     */
    private static calculateMatchScore(
        schedule: UnassignedScheduleItem,
        route: RouteListItem
    ): number {
        let score = 0;

        // 1. Dopasowanie czasowe (40 punktów)
        score += this.calculateTimeScore(schedule, route);

        // 2. Pojemność trasy (30 punktów)
        score += this.calculateCapacityScore(route);

        // 3. Dopasowanie geograficzne (30 punktów) - uproszczone
        score += this.calculateGeographicScore(schedule, route);

        return Math.min(score, 100);
    }

    /**
     * Wynik dopasowania czasowego
     */
    private static calculateTimeScore(
        schedule: UnassignedScheduleItem,
        route: RouteListItem
    ): number {
        const pickupTime = this.timeToMinutes(schedule.pickupTime);
        const routeStart = this.timeToMinutes(route.estimatedStartTime);
        const routeEnd = this.timeToMinutes(route.estimatedEndTime);

        // Sprawdź czy pickup mieści się w oknie trasy
        if (pickupTime < routeStart || pickupTime > routeEnd) {
            return 0;
        }

        // Im bliżej środka okna, tym lepiej
        const routeMiddle = (routeStart + routeEnd) / 2;
        const distanceFromMiddle = Math.abs(pickupTime - routeMiddle);
        const maxDistance = (routeEnd - routeStart) / 2;

        return 40 * (1 - distanceFromMiddle / maxDistance);
    }

    /**
     * Wynik pojemności trasy
     */
    private static calculateCapacityScore(route: RouteListItem): number {
        // Uproszczone - zakładamy max 20 stopów (10 dzieci)
        const maxStops = 20;
        const currentStops = route.stopsCount;
        const utilization = currentStops / maxStops;

        // Najlepiej gdy trasa jest w 40-80% wykorzystania
        if (utilization < 0.4) {
            return 30 * (utilization / 0.4);
        } else if (utilization <= 0.8) {
            return 30;
        } else if (utilization < 1.0) {
            return 30 * (1 - (utilization - 0.8) / 0.2);
        } else {
            return 0; // Przepełniona
        }
    }

    /**
     * Wynik dopasowania geograficznego (uproszczony - do rozwinięcia)
     */
    private static calculateGeographicScore(
        schedule: UnassignedScheduleItem,
        route: RouteListItem
    ): number {
        // TODO: Implementacja na podstawie współrzędnych GPS
        // Na razie zwracamy stałą wartość
        return 15;
    }

    /**
     * Konwersja czasu HH:mm na minuty
     */
    private static timeToMinutes(time: string): number {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    }
}