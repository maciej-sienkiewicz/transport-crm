// src/features/routes/components/SmartAssignmentDashboard/SmartAssignmentDashboard.tsx
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRoutes } from '../../hooks/useRoutes';
import { useRoute } from '../../hooks/useRoute';
import { useAddScheduleToRoute } from '../../hooks/useAddScheduleToRoute';
import { useReorderStops } from '../../hooks/useReorderStops';
import { Input } from '@/shared/ui/Input';
import { UnassignedSchedulesList } from './UnassignedSchedulesList';
import { RoutesTimeline } from './RoutesTimeline';
import { RouteSuggestionsModal } from './RouteSuggestionsModal';
import { ConfirmMapViewModal } from './ConfirmMapViewModal';
import { RouteMapModal } from '../MultiRoutePlanner/RouteMapModal';
import { UnassignedScheduleItem } from '../../types';
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

export const SmartAssignmentDashboard: React.FC = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const [selectedDate, setSelectedDate] = useState(tomorrow.toISOString().split('T')[0]);
    const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);
    const [assignedScheduleIds, setAssignedScheduleIds] = useState<Set<string>>(new Set());
    const [draggedScheduleId, setDraggedScheduleId] = useState<string | null>(null);

    // Stany dla modali
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

    const [routeIdToFetch, setRouteIdToFetch] = useState<string | null>(null);

    const { data: unassignedData, isLoading: isLoadingSchedules } =
        useUnassignedSchedules(selectedDate);
    const { data: routesData, isLoading: isLoadingRoutes } = useRoutes({
        date: selectedDate,
        status: 'PLANNED',
        page: 0,
        size: 100,
    });
    const { data: routeDataForMap, isLoading: isLoadingRouteDetails } = useRoute(
        routeIdToFetch || ''
    );

    const addScheduleToRoute = useAddScheduleToRoute();
    const reorderStops = useReorderStops();

    // Gdy dane trasy są gotowe dla mapy edycji
    useEffect(() => {
        if (routeDataForMap && routeIdToFetch) {
            console.log('📍 Dane trasy pobrane, przygotowuję punkty dla mapy edycji');

            const existingPoints: RoutePoint[] = routeDataForMap.stops
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
                    hasCoordinates:
                        stop.address.latitude != null && stop.address.longitude != null,
                    stopId: stop.id,
                    scheduleId: stop.scheduleId,
                    isNew: false,
                }));

            console.log('✅ Otwieram modal edycji z', existingPoints.length, 'punktami');

            setMapModalState({
                isOpen: true,
                routeId: routeIdToFetch,
                routeName: routeDataForMap.routeName,
                points: existingPoints,
            });

            setRouteIdToFetch(null);
        }
    }, [routeDataForMap, routeIdToFetch]);

    // Filtrowane harmonogramy
    const filteredSchedules = useMemo(() => {
        if (!unassignedData?.schedules) return [];
        return unassignedData.schedules.filter((s) => !assignedScheduleIds.has(s.scheduleId));
    }, [unassignedData, assignedScheduleIds]);

    // Dane wybranego harmonogramu
    const selectedScheduleData = useMemo(() => {
        if (!selectedScheduleId || !unassignedData?.schedules) return null;
        return (
            unassignedData.schedules.find((s) => s.scheduleId === selectedScheduleId) || null
        );
    }, [selectedScheduleId, unassignedData]);

    // Wszystkie trasy
    const displayRoutes = useMemo(() => {
        if (!routesData?.content) return [];
        return routesData.content;
    }, [routesData]);

    // Czy są jakiekolwiek trasy
    const hasAnyRoutes = displayRoutes.length > 0;

    const hasSelectedSchedule = Boolean(selectedScheduleId);

    // Handler przypisywania
    const handleAssignToRoute = useCallback(
        async (scheduleId: string, routeId: string) => {
            const schedule = unassignedData?.schedules.find((s) => s.scheduleId === scheduleId);
            if (!schedule) {
                console.error('❌ Nie znaleziono harmonogramu:', scheduleId);
                return;
            }

            console.log('📝 Przypisuję harmonogram do trasy:', { scheduleId, routeId });

            setAssignedScheduleIds((prev) => new Set(prev).add(scheduleId));

            try {
                const toastId = toast.loading('Przypisuję dziecko do trasy...');

                const currentRoute = routesData?.content.find((r) => r.id === routeId);
                if (!currentRoute) {
                    throw new Error('Nie znaleziono trasy');
                }

                // Sprawdź pojemność
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

                console.log('📤 Przypisuję dziecko na koniec:', { pickupOrder, dropoffOrder });

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

                toast.dismiss(toastId);
                setSelectedScheduleId(null);

                // Pokaż modal potwierdzenia
                setConfirmModalState({
                    isOpen: true,
                    childName: `${schedule.childFirstName} ${schedule.childLastName}`,
                    routeName: currentRoute.routeName,
                    routeId: routeId,
                });

                console.log('✅ Dziecko przypisane');
            } catch (error) {
                console.error('❌ Błąd przypisywania:', error);
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

    // Handler wyświetlenia sugestii
    const handleShowSuggestions = (schedule: UnassignedScheduleItem) => {
        setSuggestionsModalState({
            isOpen: true,
            schedule,
        });
    };

    // Handler wyboru trasy z sugestii
    const handleSelectSuggestion = async (routeId: string) => {
        if (!suggestionsModalState.schedule) return;
        await handleAssignToRoute(suggestionsModalState.schedule.scheduleId, routeId);
        setSuggestionsModalState({ isOpen: false, schedule: null });
    };

    // Handler otwarcia mapy edycji
    const handleViewMapFromConfirm = () => {
        const routeId = confirmModalState.routeId;

        if (!routeId) {
            console.error('❌ Brak routeId w confirmModalState');
            return;
        }

        console.log('🗺️ Użytkownik chce zobaczyć mapę dla trasy:', routeId);

        setConfirmModalState({
            isOpen: false,
            childName: '',
            routeName: '',
            routeId: null,
        });

        setRouteIdToFetch(routeId);
    };

    const handleCloseConfirmModal = () => {
        console.log('🚪 Zamykanie modala potwierdzenia');
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
            console.error('❌ Brak routeId w mapModalState');
            return;
        }

        console.log('💾 Zapisywanie nowej kolejności z mapy:', newPoints.length, 'punktów');

        try {
            const toastId = toast.loading('Zapisywanie nowej kolejności...');

            const stopOrders = newPoints
                .filter((p) => !p.stopId.startsWith('temp-'))
                .map((p) => ({
                    stopId: p.stopId,
                    newOrder: p.order,
                }));

            console.log('📤 StopOrders do wysłania:', stopOrders);

            if (stopOrders.length === 0) {
                throw new Error('Brak stopów do zaktualizowania');
            }

            await reorderStops.mutateAsync({
                routeId,
                stopOrders,
            });

            toast.dismiss(toastId);
            toast.success('Kolejność stopów została zaktualizowana');

            console.log('✅ Kolejność zapisana pomyślnie');

            setMapModalState({
                isOpen: false,
                routeId: null,
                routeName: null,
                points: [],
            });
        } catch (error) {
            console.error('❌ Błąd podczas zapisywania kolejności:', error);
            toast.error('Nie udało się zapisać nowej kolejności');
        }
    };

    const handleCloseMapModal = () => {
        console.log('🚪 Zamykanie modala mapy');
        setMapModalState({
            isOpen: false,
            routeId: null,
            routeName: null,
            points: [],
        });
    };

    // Drag & Drop handlers
    const handleDragStart = (scheduleId: string) => {
        setDraggedScheduleId(scheduleId);
        console.log('🎯 Rozpoczęto przeciąganie:', scheduleId);
    };

    const handleDragEnd = () => {
        setDraggedScheduleId(null);
        console.log('🎯 Zakończono przeciąganie');
    };

    const handleDrop = async (routeId: string) => {
        if (!draggedScheduleId) return;

        console.log('🎯 Upuszczono na trasę:', { draggedScheduleId, routeId });

        await handleAssignToRoute(draggedScheduleId, routeId);
        setDraggedScheduleId(null);
    };

    // Reset przy zmianie daty
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

            {/* Modals */}
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