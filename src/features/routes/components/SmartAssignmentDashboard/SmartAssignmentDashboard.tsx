// src/features/routes/components/SmartAssignmentDashboard/SmartAssignmentDashboard.tsx
import React, { useState, useMemo, useCallback } from 'react';
import { Calendar, Users, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRoutes } from '../../hooks/useRoutes';
import { useAddScheduleToRoute } from '../../hooks/useAddScheduleToRoute';
import { useReorderStops } from '../../hooks/useReorderStops';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { UnassignedSchedulesList } from './UnassignedSchedulesList';
import { RoutesTimeline, RoutePoint } from './RoutesTimeline';
import { AutoMatchEngine } from './AutoMatchEngine';
import {
    DashboardContainer,
    DashboardHeader,
    HeaderContent,
    HeaderTitle,
    HeaderSubtitle,
    HeaderActions,
    DateSelector,
    StatsBar,
    StatCard,
    StatIcon,
    StatContent,
    StatLabel,
    StatValue,
    DashboardBody,
    LeftPanel,
    RightPanel,
    PanelHeader,
    PanelTitle,
    FilterBar,
} from './SmartAssignmentDashboard.styles';
import {useUnassignedSchedules} from "@/features/routes/api/useUnassignedSchedules.ts";

export const SmartAssignmentDashboard: React.FC = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const [selectedDate, setSelectedDate] = useState(
        tomorrow.toISOString().split('T')[0]
    );
    const [filterSchedules, setFilterSchedules] = useState<'all' | 'matched' | 'unmatched'>('all');
    const [sortBy, setSortBy] = useState<'time' | 'priority' | 'location'>('priority');
    const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);
    const [assignedScheduleIds, setAssignedScheduleIds] = useState<Set<string>>(new Set());

    const { data: unassignedData, isLoading: isLoadingSchedules } = useUnassignedSchedules(selectedDate);
    const { data: routesData, isLoading: isLoadingRoutes } = useRoutes({
        date: selectedDate,
        status: 'PLANNED',
        page: 0,
        size: 100,
    });
    const addScheduleToRoute = useAddScheduleToRoute();
    const reorderStops = useReorderStops();

    // Auto-match engine
    const autoMatches = useMemo(() => {
        if (!unassignedData?.schedules || !routesData?.content) return new Map();

        // Filtruj harmonogramy które już zostały przypisane lokalnie
        const remainingSchedules = unassignedData.schedules.filter(
            s => !assignedScheduleIds.has(s.scheduleId)
        );

        return AutoMatchEngine.calculateMatches(
            remainingSchedules,
            routesData.content
        );
    }, [unassignedData, routesData, assignedScheduleIds]);

    // Statystyki
    const stats = useMemo(() => {
        const total = (unassignedData?.totalCount || 0) - assignedScheduleIds.size;
        const remainingSchedules = unassignedData?.schedules.filter(
            s => !assignedScheduleIds.has(s.scheduleId)
        ) || [];
        const matched = remainingSchedules.filter(s => autoMatches.has(s.scheduleId)).length;
        const unmatched = total - matched;

        return { total, matched, unmatched };
    }, [unassignedData, autoMatches, assignedScheduleIds]);

    // Filtrowanie harmonogramów
    const filteredSchedules = useMemo(() => {
        if (!unassignedData?.schedules) return [];

        // Filtruj przypisane lokalnie
        let filtered = unassignedData.schedules.filter(
            s => !assignedScheduleIds.has(s.scheduleId)
        );

        if (filterSchedules === 'matched') {
            filtered = filtered.filter(s => autoMatches.has(s.scheduleId));
        } else if (filterSchedules === 'unmatched') {
            filtered = filtered.filter(s => !autoMatches.has(s.scheduleId));
        }

        // Sortowanie
        filtered.sort((a, b) => {
            if (sortBy === 'time') {
                return a.pickupTime.localeCompare(b.pickupTime);
            } else if (sortBy === 'priority') {
                const aMatch = autoMatches.get(a.scheduleId);
                const bMatch = autoMatches.get(b.scheduleId);
                if (!aMatch && !bMatch) return 0;
                if (!aMatch) return 1;
                if (!bMatch) return -1;
                const confidenceOrder = { high: 0, medium: 1, low: 2 };
                return confidenceOrder[aMatch.confidence] - confidenceOrder[bMatch.confidence];
            }
            return 0;
        });

        return filtered;
    }, [unassignedData, filterSchedules, sortBy, autoMatches, assignedScheduleIds]);

    // Dane wybranego harmonogramu
    const selectedScheduleData = useMemo(() => {
        if (!selectedScheduleId || !unassignedData?.schedules) return null;
        return unassignedData.schedules.find(s => s.scheduleId === selectedScheduleId) || null;
    }, [selectedScheduleId, unassignedData]);

    // Filtrowanie tras na podstawie wybranego harmonogramu
    const filteredRoutes = useMemo(() => {
        if (!routesData?.content) return [];
        if (!selectedScheduleId) return routesData.content;

        const selectedSchedule = unassignedData?.schedules.find(
            s => s.scheduleId === selectedScheduleId
        );
        if (!selectedSchedule) return routesData.content;

        // Filtruj trasy które są kompatybilne czasowo
        return routesData.content.filter(route => {
            const routeStart = route.estimatedStartTime;
            const routeEnd = route.estimatedEndTime;
            const pickupTime = selectedSchedule.pickupTime;

            return pickupTime >= routeStart && pickupTime <= routeEnd;
        });
    }, [routesData, selectedScheduleId, unassignedData]);

    // Handler dla automatycznego przypisania
    const handleAutoAssignAll = useCallback(async () => {
        const highConfidenceMatches = Array.from(autoMatches.entries())
            .filter(([_, match]) => match.confidence === 'high');

        if (highConfidenceMatches.length === 0) {
            toast.error('Brak harmonogramów do automatycznego przypisania');
            return;
        }

        const confirmMessage = `Czy na pewno chcesz automatycznie przypisać ${highConfidenceMatches.length} harmonogramów?`;
        if (!window.confirm(confirmMessage)) return;

        // Progress toast
        let successCount = 0;
        let errorCount = 0;
        const totalCount = highConfidenceMatches.length;

        const progressToast = toast.loading(`Przypisuję 0/${totalCount} harmonogramów...`);

        for (const [scheduleId, match] of highConfidenceMatches) {
            const schedule = unassignedData?.schedules.find(s => s.scheduleId === scheduleId);
            if (!schedule) continue;

            try {
                await addScheduleToRoute.mutateAsync({
                    routeId: match.routeId,
                    data: {
                        childId: schedule.childId,
                        scheduleId: schedule.scheduleId,
                        pickupStop: {
                            stopOrder: 999,
                            estimatedTime: schedule.pickupTime,
                            address: schedule.pickupAddress,
                        },
                        dropoffStop: {
                            stopOrder: 999,
                            estimatedTime: schedule.dropoffTime,
                            address: schedule.dropoffAddress,
                        },
                    },
                });
                successCount++;

                // Update progress
                toast.loading(`Przypisuję ${successCount}/${totalCount} harmonogramów...`, {
                    id: progressToast,
                });
            } catch (error) {
                console.error(`Błąd przypisywania ${scheduleId}:`, error);
                errorCount++;
            }
        }

        // Final toast
        toast.dismiss(progressToast);

        if (errorCount === 0) {
            toast.success(`✅ Pomyślnie przypisano ${successCount} harmonogramów`, {
                duration: 5000,
            });
        } else {
            toast.error(
                `Przypisano ${successCount} harmonogramów, ${errorCount} nie udało się przypisać`,
                { duration: 6000 }
            );
        }
    }, [autoMatches, unassignedData, addScheduleToRoute]);

    // Handler dla manualnego przypisania z opcjonalnym reorderowaniem
    const handleManualAssign = useCallback(
        async (
            scheduleId: string,
            routeId: string,
            reorderedPoints?: RoutePoint[]
        ) => {
            const schedule = unassignedData?.schedules.find(s => s.scheduleId === scheduleId);
            if (!schedule) {
                console.error('❌ Nie znaleziono harmonogramu:', scheduleId);
                return;
            }

            console.log('📝 handleManualAssign wywołane:', {
                scheduleId,
                routeId,
                hasReorderedPoints: !!reorderedPoints,
                pointsCount: reorderedPoints?.length
            });

            // Optimistic update - usuń natychmiast z UI
            setAssignedScheduleIds(prev => new Set(prev).add(scheduleId));

            try {
                const toastId = toast.loading('Przypisuję dziecko do trasy...');

                // Znajdź pickup i dropoff dla nowego dziecka w reorderedPoints
                let pickupOrder = 999;
                let dropoffOrder = 999;

                if (reorderedPoints && reorderedPoints.length > 0) {
                    const pickupPoint = reorderedPoints.find(
                        p => p.scheduleId === scheduleId && p.type === 'pickup'
                    );
                    const dropoffPoint = reorderedPoints.find(
                        p => p.scheduleId === scheduleId && p.type === 'dropoff'
                    );

                    if (pickupPoint) {
                        pickupOrder = pickupPoint.order;
                        console.log('✅ Pickup order:', pickupOrder);
                    }
                    if (dropoffPoint) {
                        dropoffOrder = dropoffPoint.order;
                        console.log('✅ Dropoff order:', dropoffOrder);
                    }
                }

                console.log('📤 Krok 1: Dodaję dziecko do trasy z orderami:', { pickupOrder, dropoffOrder });

                // Najpierw dodaj dziecko do trasy
                await addScheduleToRoute.mutateAsync({
                    routeId,
                    data: {
                        childId: schedule.childId,
                        scheduleId: schedule.scheduleId,
                        pickupStop: {
                            stopOrder: pickupOrder,
                            estimatedTime: schedule.pickupTime,
                            address: schedule.pickupAddress,
                        },
                        dropoffStop: {
                            stopOrder: dropoffOrder,
                            estimatedTime: schedule.dropoffTime,
                            address: schedule.dropoffAddress,
                        },
                    },
                });

                console.log('✅ Dziecko dodane do trasy');

                // Jeśli użytkownik zmienił kolejność istniejących stopów, zaktualizuj ją
                if (reorderedPoints && reorderedPoints.length > 0) {
                    console.log('📤 Krok 2: Sprawdzam czy trzeba zaktualizować kolejność stopów');

                    // Przygotuj stopOrders - mapuj tylko istniejące stopy (nie temp-*)
                    const existingStopsOrders = reorderedPoints
                        .filter(p => !p.stopId.startsWith('temp-')) // Pomijamy temporary IDs
                        .map(p => ({
                            stopId: p.stopId,
                            newOrder: p.order
                        }));

                    if (existingStopsOrders.length > 0) {
                        console.log('📤 Aktualizuję kolejność', existingStopsOrders.length, 'istniejących stopów');

                        await reorderStops.mutateAsync({
                            routeId,
                            stopOrders: existingStopsOrders
                        });

                        console.log('✅ Kolejność zaktualizowana');
                    } else {
                        console.log('ℹ️ Brak istniejących stopów do przesortowania (same nowe)');
                    }
                }

                toast.dismiss(toastId);
                toast.success(`${schedule.childFirstName} ${schedule.childLastName} przypisany do trasy`);
                setSelectedScheduleId(null);

                console.log('✅ Operacja zakończona pomyślnie');
            } catch (error) {
                console.error('❌ Błąd przypisywania:', error);
                toast.dismiss();

                // Rollback optimistic update w przypadku błędu
                setAssignedScheduleIds(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(scheduleId);
                    return newSet;
                });
            }
        },
        [unassignedData, addScheduleToRoute, reorderStops]
    );

    // Resetuj lokalny stan gdy zmienia się data
    React.useEffect(() => {
        setAssignedScheduleIds(new Set());
        setSelectedScheduleId(null);
    }, [selectedDate]);

    const isLoading = isLoadingSchedules || isLoadingRoutes;

    return (
        <DashboardContainer>
            <DashboardHeader>
                <HeaderContent>
                    <HeaderTitle>
                        <Calendar size={28} />
                        Przypisywanie harmonogramów
                    </HeaderTitle>
                    <HeaderSubtitle>
                        Planowanie na{' '}
                        {new Date(selectedDate).toLocaleDateString('pl-PL', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                        })}
                    </HeaderSubtitle>
                </HeaderContent>
                <HeaderActions>
                    <DateSelector>
                        <Input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            label="Data"
                        />
                    </DateSelector>
                    <Button
                        variant="primary"
                        onClick={handleAutoAssignAll}
                        disabled={stats.matched === 0 || isLoading}
                    >
                        <CheckCircle size={20} />
                        Auto-przypisz ({stats.matched})
                    </Button>
                </HeaderActions>
            </DashboardHeader>

            <StatsBar>
                <StatCard>
                    <StatIcon $variant="total">
                        <Users size={24} />
                    </StatIcon>
                    <StatContent>
                        <StatLabel>Nieprzypisanych</StatLabel>
                        <StatValue>{stats.total}</StatValue>
                    </StatContent>
                </StatCard>

                <StatCard>
                    <StatIcon $variant="matched">
                        <CheckCircle size={24} />
                    </StatIcon>
                    <StatContent>
                        <StatLabel>Auto-dopasowanych</StatLabel>
                        <StatValue>{stats.matched}</StatValue>
                    </StatContent>
                </StatCard>

                <StatCard>
                    <StatIcon $variant="unmatched">
                        <AlertCircle size={24} />
                    </StatIcon>
                    <StatContent>
                        <StatLabel>Bez dopasowania</StatLabel>
                        <StatValue>{stats.unmatched}</StatValue>
                    </StatContent>
                </StatCard>

                <StatCard>
                    <StatIcon $variant="progress">
                        <TrendingUp size={24} />
                    </StatIcon>
                    <StatContent>
                        <StatLabel>Postęp</StatLabel>
                        <StatValue>
                            {stats.total > 0
                                ? Math.round((stats.matched / stats.total) * 100)
                                : 0}
                            %
                        </StatValue>
                    </StatContent>
                </StatCard>
            </StatsBar>

            <DashboardBody>
                <LeftPanel>
                    <PanelHeader>
                        <PanelTitle>Nieprzypisane harmonogramy ({filteredSchedules.length})</PanelTitle>
                    </PanelHeader>
                    <FilterBar>
                        <Button
                            variant={filterSchedules === 'all' ? 'primary' : 'ghost'}
                            size="sm"
                            onClick={() => setFilterSchedules('all')}
                        >
                            Wszystkie
                        </Button>
                        <Button
                            variant={filterSchedules === 'matched' ? 'primary' : 'ghost'}
                            size="sm"
                            onClick={() => setFilterSchedules('matched')}
                        >
                            Dopasowane
                        </Button>
                        <Button
                            variant={filterSchedules === 'unmatched' ? 'primary' : 'ghost'}
                            size="sm"
                            onClick={() => setFilterSchedules('unmatched')}
                        >
                            Bez dopasowania
                        </Button>
                    </FilterBar>
                    <UnassignedSchedulesList
                        schedules={filteredSchedules}
                        autoMatches={autoMatches}
                        selectedScheduleId={selectedScheduleId}
                        onSelectSchedule={setSelectedScheduleId}
                        onQuickAssign={handleManualAssign}
                        isLoading={isLoading}
                    />
                </LeftPanel>

                <RightPanel>
                    <PanelHeader>
                        <PanelTitle>
                            {selectedScheduleId
                                ? 'Dostępne trasy (filtrowane)'
                                : 'Wszystkie trasy'}
                        </PanelTitle>
                    </PanelHeader>
                    <RoutesTimeline
                        routes={filteredRoutes}
                        selectedScheduleId={selectedScheduleId}
                        selectedScheduleData={selectedScheduleData}
                        autoMatches={autoMatches}
                        onAssignToRoute={handleManualAssign}
                        isLoading={isLoading}
                    />
                </RightPanel>
            </DashboardBody>
        </DashboardContainer>
    );
};