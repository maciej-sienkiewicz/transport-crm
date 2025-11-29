import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRoutes } from '../../hooks/useRoutes';
import { useRoute } from '../../hooks/useRoute';
import { useAddScheduleToRoute } from '../../hooks/useAddScheduleToRoute';
import { useReorderStops } from '../../hooks/useReorderStops';
import { useQueryParam } from '@/shared/hooks/useQueryParam';
import { getTomorrowDate, isValidDateString } from '@/shared/utils/urlParams';
import { Input } from '@/shared/ui/Input';
import { UnassignedSchedulesList } from './UnassignedSchedulesList';
import { RoutesTimeline } from './RoutesTimeline';
import { RouteSuggestionsModal } from './RouteSuggestionsModal';
import { ConfirmMapViewModal } from './ConfirmMapViewModal';
import { UnassignedScheduleItem, RouteDetail } from '../../types';
import {
    DashboardContainer,
    DashboardHeader,
    HeaderContent,
    HeaderTitle,
    DateSelectorLarge,
    DashboardBody,
    LeftPanel,
    RightPanel,
    PanelHeader,
    PanelTitle,
} from './SmartAssignmentDashboard.styles';
import { useUnassignedSchedules } from '@/features/routes/api/useUnassignedSchedules.ts';
import {RouteMapModal} from "@/features/routes/components/RouteMapModal/RouteMapModal.tsx";
import { useQueryClient } from '@tanstack/react-query';

const API_KEY = 'AIzaSyAr0qHze3moiMPHo-cwv171b8luH-anyXA';

export interface RoutePoint {
    address: string;
    lat: number | null;
    lng: number | null;
    type: 'pickup' | 'dropoff';
    childName: string;
    order: number;
    hasCoordinates: boolean;
    stopId: string;
    scheduleId: string;
    isNew?: boolean;
}

// Funkcja pomocnicza do konwersji RouteDetail na RoutePoint[]
const convertRouteToPoints = (route: RouteDetail): RoutePoint[] => {
    return route.stops
        .filter((stop) => !stop.isCancelled)
        .sort((a, b) => a.stopOrder - b.stopOrder)
        .map((stop) => ({
            address: `${stop.address.street} ${stop.address.houseNumber}${
                stop.address.apartmentNumber ? `/${stop.address.apartmentNumber}` : ''
            }, ${stop.address.city}`,
            lat: stop.address.latitude ?? null,
            lng: stop.address.longitude ?? null,
            type: stop.stopType === 'PICKUP' ? ('pickup' as const) : ('dropoff' as const),
            childName: `${stop.childFirstName} ${stop.childLastName}`,
            order: stop.stopOrder,
            hasCoordinates: stop.address.latitude != null && stop.address.longitude != null,
            stopId: stop.id,
            scheduleId: stop.scheduleId,
            isNew: false,
        }));
};

export const SmartAssignmentDashboard: React.FC = () => {
    const queryClient = useQueryClient();
    const [selectedDate, setSelectedDate] = useQueryParam('date', getTomorrowDate());

    const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);
    const [assignedScheduleIds, setAssignedScheduleIds] = useState<Set<string>>(new Set());
    const [draggedScheduleId, setDraggedScheduleId] = useState<string | null>(null);

    // State dla route ID, który chcemy załadować do mapy
    const [pendingMapRouteId, setPendingMapRouteId] = useState<string | null>(null);

    useEffect(() => {
        if (!isValidDateString(selectedDate)) {
            setSelectedDate(getTomorrowDate());
        }
    }, [selectedDate, setSelectedDate]);

    const [suggestionsModalState, setSuggestionsModalState] = useState<{
        isOpen: boolean;
        schedule: UnassignedScheduleItem | null;
    }>({
        isOpen: false,
        schedule: null,
    });

    const [confirmModalState, setConfirmModalState] = useState<{
        isOpen: boolean;
        childName: string;
        routeName: string;
        routeId: string | null;
    }>({
        isOpen: false,
        childName: '',
        routeName: '',
        routeId: null,
    });

    const [mapModalState, setMapModalState] = useState<{
        isOpen: boolean;
        routeId: string | null;
        routeName: string | null;
        points: RoutePoint[];
    }>({
        isOpen: false,
        routeId: null,
        routeName: null,
        points: [],
    });

    const { data: unassignedData, isLoading: isLoadingSchedules } =
        useUnassignedSchedules(selectedDate);

    const { data: routesData, isLoading: isLoadingRoutes } = useRoutes({
        date: selectedDate,
        status: 'PLANNED',
        page: 0,
        size: 100,
    });

    // Hook do ładowania trasy dla mapy - włączony TYLKO gdy mamy pendingMapRouteId
    const {
        data: routeForMap,
        isLoading: isLoadingRouteForMap,
        isSuccess: isRouteForMapLoaded
    } = useRoute(
        pendingMapRouteId || '',
        { enabled: !!pendingMapRouteId }
    );

    const addScheduleToRoute = useAddScheduleToRoute();
    const reorderStops = useReorderStops();

    // Effect: Gdy route się załaduje, otwórz modal z mapą
    useEffect(() => {
        if (isRouteForMapLoaded && routeForMap && pendingMapRouteId) {
            console.log('✅ Route załadowana, otwieranie mapy z', routeForMap.stops.length, 'stopami');

            const points = convertRouteToPoints(routeForMap);

            setMapModalState({
                isOpen: true,
                routeId: routeForMap.id,
                routeName: routeForMap.routeName,
                points,
            });

            // Wyczyść pending ID
            setPendingMapRouteId(null);
        }
    }, [isRouteForMapLoaded, routeForMap, pendingMapRouteId]);

    const filteredSchedules = useMemo(() => {
        if (!unassignedData?.schedules) return [];
        return unassignedData.schedules.filter((s) => !assignedScheduleIds.has(s.scheduleId));
    }, [unassignedData, assignedScheduleIds]);

    const selectedScheduleData = useMemo(() => {
        if (!selectedScheduleId || !unassignedData?.schedules) return null;
        return (
            unassignedData.schedules.find((s) => s.scheduleId === selectedScheduleId) || null
        );
    }, [selectedScheduleId, unassignedData]);

    const displayRoutes = useMemo(() => {
        if (!routesData?.content) return [];
        return routesData.content;
    }, [routesData]);

    const hasAnyRoutes = displayRoutes.length > 0;
    const hasSelectedSchedule = Boolean(selectedScheduleId);

    const handleAssignToRoute = useCallback(
        async (scheduleId: string, routeId: string) => {
            const schedule = unassignedData?.schedules.find((s) => s.scheduleId === scheduleId);
            if (!schedule) {
                return;
            }

            setAssignedScheduleIds((prev) => new Set(prev).add(scheduleId));

            try {
                const toastId = toast.loading('Przypisuję dziecko do trasy...');

                const currentRoute = routesData?.content.find((r) => r.id === routeId);
                if (!currentRoute) {
                    throw new Error('Nie znaleziono trasy');
                }

                const capacityUsed = currentRoute.stopsCount / 2;
                if (capacityUsed >= 10) {
                    toast.dismiss(toastId);
                    toast.error('Trasa jest pełna - nie można dodać więcej dzieci');
                    setAssignedScheduleIds((prev) => {
                        const newSet = new Set(prev);
                        newSet.delete(scheduleId);
                        return newSet;
                    });
                    return;
                }

                const pickupOrder = currentRoute.stopsCount + 1;
                const dropoffOrder = currentRoute.stopsCount + 2;

                // Wykonaj mutację
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

                // Mutacja automatycznie invaliduje queries (dzięki onSuccess w hooku)
                // Nie musimy ręcznie invalidować tutaj

                toast.dismiss(toastId);
                setSelectedScheduleId(null);

                setConfirmModalState({
                    isOpen: true,
                    childName: `${schedule.childFirstName} ${schedule.childLastName}`,
                    routeName: currentRoute.routeName,
                    routeId: routeId,
                });
            } catch (error) {
                toast.dismiss();

                setAssignedScheduleIds((prev) => {
                    const newSet = new Set(prev);
                    newSet.delete(scheduleId);
                    return newSet;
                });

                throw error;
            }
        },
        [unassignedData, routesData, addScheduleToRoute]
    );

    const handleShowSuggestions = (schedule: UnassignedScheduleItem) => {
        setSuggestionsModalState({
            isOpen: true,
            schedule,
        });
    };

    const handleSelectSuggestion = async (routeId: string) => {
        if (!suggestionsModalState.schedule) return;
        await handleAssignToRoute(suggestionsModalState.schedule.scheduleId, routeId);
        setSuggestionsModalState({ isOpen: false, schedule: null });
    };

    const handleViewMapFromConfirm = () => {
        const routeId = confirmModalState.routeId;

        if (!routeId) {
            console.error('❌ Brak routeId w confirmModalState');
            return;
        }

        console.log('🗺️ Rozpoczynam ładowanie mapy dla trasy:', routeId);

        // Zamknij modal potwierdzenia
        setConfirmModalState({
            isOpen: false,
            childName: '',
            routeName: '',
            routeId: null,
        });

        // Invaliduj cache dla tej konkretnej trasy aby wymusić świeże dane
        queryClient.invalidateQueries({ queryKey: ['route', routeId] });

        // Ustaw pending route ID - to włączy useRoute hook który pobierze świeże dane
        setPendingMapRouteId(routeId);
    };

    const handleCloseConfirmModal = () => {
        setConfirmModalState({
            isOpen: false,
            childName: '',
            routeName: '',
            routeId: null,
        });
    };

    const handleSaveOrderFromMap = async (newPoints: RoutePoint[]) => {
        const routeId = mapModalState.routeId;

        if (!routeId) {
            return;
        }

        try {
            const toastId = toast.loading('Zapisywanie nowej kolejności...');

            const stopOrders = newPoints
                .filter((p) => !p.stopId.startsWith('temp-'))
                .map((p, index) => ({
                    stopId: p.stopId,
                    newOrder: index + 1,
                }));

            if (stopOrders.length === 0) {
                throw new Error('Brak stopów do zaktualizowania');
            }

            await reorderStops.mutateAsync({
                routeId,
                stopOrders,
            });

            toast.dismiss(toastId);
            toast.success('Kolejność stopów została zaktualizowana');

            setMapModalState({
                isOpen: false,
                routeId: null,
                routeName: null,
                points: [],
            });
        } catch (error) {
            toast.error('Nie udało się zapisać nowej kolejności');
        }
    };

    const handleCloseMapModal = () => {
        setMapModalState({
            isOpen: false,
            routeId: null,
            routeName: null,
            points: [],
        });
    };

    const handleDragStart = (scheduleId: string) => {
        setDraggedScheduleId(scheduleId);
    };

    const handleDragEnd = () => {
        setDraggedScheduleId(null);
    };

    const handleDrop = async (routeId: string) => {
        if (!draggedScheduleId) return;

        await handleAssignToRoute(draggedScheduleId, routeId);
        setDraggedScheduleId(null);
    };

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
                        <Calendar size={32} />
                        Przypisywanie harmonogramów
                    </HeaderTitle>
                </HeaderContent>
                <DateSelectorLarge>
                    <Input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        label=""
                    />
                </DateSelectorLarge>
            </DashboardHeader>

            <DashboardBody>
                <LeftPanel>
                    <PanelHeader>
                        <PanelTitle>Nieprzypisane harmonogramy ({filteredSchedules.length})</PanelTitle>
                    </PanelHeader>
                    <UnassignedSchedulesList
                        schedules={filteredSchedules}
                        selectedScheduleId={selectedScheduleId}
                        onSelectSchedule={setSelectedScheduleId}
                        onShowSuggestions={handleShowSuggestions}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        isLoading={isLoading}
                        hasAnyRoutes={hasAnyRoutes}
                    />
                </LeftPanel>

                <RightPanel>
                    <PanelHeader>
                        <PanelTitle>
                            {hasSelectedSchedule
                                ? `Wszystkie trasy na ${new Date(selectedDate).toLocaleDateString('pl-PL', { day: '2-digit', month: 'long' })}`
                                : 'Wszystkie trasy'}
                        </PanelTitle>
                    </PanelHeader>
                    <RoutesTimeline
                        routes={displayRoutes}
                        selectedScheduleId={selectedScheduleId}
                        selectedScheduleData={selectedScheduleData}
                        onAssignToRoute={handleAssignToRoute}
                        onDrop={handleDrop}
                        isLoading={isLoading}
                    />
                </RightPanel>
            </DashboardBody>

            {suggestionsModalState.isOpen && suggestionsModalState.schedule && (
                <RouteSuggestionsModal
                    isOpen={suggestionsModalState.isOpen}
                    scheduleId={suggestionsModalState.schedule.scheduleId}
                    date={selectedDate}
                    childName={`${suggestionsModalState.schedule.childFirstName} ${suggestionsModalState.schedule.childLastName}`}
                    schedulePickupAddress={suggestionsModalState.schedule.pickupAddress}
                    scheduleDropoffAddress={suggestionsModalState.schedule.dropoffAddress}
                    onClose={() =>
                        setSuggestionsModalState({ isOpen: false, schedule: null })
                    }
                    onSelectRoute={handleSelectSuggestion}
                    apiKey={API_KEY}
                />
            )}

            <ConfirmMapViewModal
                isOpen={confirmModalState.isOpen}
                childName={confirmModalState.childName}
                routeName={confirmModalState.routeName}
                onViewMap={handleViewMapFromConfirm}
                onClose={handleCloseConfirmModal}
            />

            {/* Pokaż loading podczas ładowania danych dla mapy */}
            {isLoadingRouteForMap && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                }}>
                    <div style={{
                        background: 'white',
                        padding: '2rem',
                        borderRadius: '1rem',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                    }}>
                        Ładowanie mapy trasy...
                    </div>
                </div>
            )}

            {mapModalState.isOpen && (
                <RouteMapModal
                    isOpen={mapModalState.isOpen}
                    onClose={handleCloseMapModal}
                    routeName={mapModalState.routeName || 'Trasa'}
                    points={mapModalState.points}
                    apiKey={API_KEY}
                    onSaveOrder={handleSaveOrderFromMap}
                />
            )}
        </DashboardContainer>
    );
};