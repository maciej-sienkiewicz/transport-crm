// src/features/routes/components/SmartAssignmentDashboard/RoutesTimeline.tsx
import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Users, Car, User, AlertCircle } from 'lucide-react';
import { RouteListItem, AutoMatchSuggestion, UnassignedScheduleItem } from '../../types';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { RouteMapModal } from '../MultiRoutePlanner/RouteMapModal';
import { ConfirmMapViewModal } from './ConfirmMapViewModal';
import { useRoute } from '../../hooks/useRoute';
import { useReorderStops } from '../../hooks/useReorderStops';
import toast from 'react-hot-toast';
import {
    TimelineContainer,
    RouteTimelineCard,
    RouteCardHeader,
    RouteInfo,
    RouteName,
    RouteMetadata,
    MetadataItem,
    MatchIndicator,
    RouteCardBody,
    TimeSlot,
    TimeLabel,
    CapacityBar,
    CapacityFill,
    CapacityLabel,
    RouteCardFooter,
    EmptyRoutes,
} from './RoutesTimeline.styles';

interface RoutesTimelineProps {
    routes: RouteListItem[];
    selectedScheduleId: string | null;
    selectedScheduleData: UnassignedScheduleItem | null;
    autoMatches: Map<string, AutoMatchSuggestion>;
    onAssignToRoute: (scheduleId: string, routeId: string) => Promise<void>;
    isLoading: boolean;
}

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

const API_KEY = 'AIzaSyAr0qHze3moiMPHo-cwv171b8luH-anyXA';

export const RoutesTimeline: React.FC<RoutesTimelineProps> = ({
                                                                  routes,
                                                                  selectedScheduleId,
                                                                  selectedScheduleData,
                                                                  autoMatches,
                                                                  onAssignToRoute,
                                                                  isLoading,
                                                              }) => {
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

    const { data: routeDataForMap, isLoading: isLoadingRouteDetails } = useRoute(
        routeIdToFetch || ''
    );

    const reorderStops = useReorderStops();

    // Gdy dane trasy są gotowe dla mapy - POPRAWIONY useEffect
    useEffect(() => {
        if (routeDataForMap && routeIdToFetch) {
            console.log('📍 Dane trasy pobrane, przygotowuję punkty dla mapy');

            const existingPoints: RoutePoint[] = routeDataForMap.stops
                .filter(stop => !stop.isCancelled)
                .sort((a, b) => a.stopOrder - b.stopOrder)
                .map(stop => ({
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

            console.log('✅ Otwieram modal z', existingPoints.length, 'punktami');

            setMapModalState({
                isOpen: true,
                routeId: routeIdToFetch,
                routeName: routeDataForMap.routeName,
                points: existingPoints,
            });

            // Reset routeIdToFetch DOPIERO TUTAJ
            setRouteIdToFetch(null);
        }
    }, [routeDataForMap, routeIdToFetch]); // Usunięto selectedScheduleData z zależności

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (routes.length === 0) {
        return (
            <EmptyRoutes>
                <AlertCircle size={64} />
                <h3>Brak tras</h3>
                <p>
                    {selectedScheduleId
                        ? 'Brak kompatybilnych tras dla wybranego harmonogramu.'
                        : 'Nie znaleziono zaplanowanych tras na wybrany dzień.'}
                </p>
            </EmptyRoutes>
        );
    }

    const selectedMatch = selectedScheduleId
        ? Array.from(autoMatches.entries()).find(
            ([scheduleId]) => scheduleId === selectedScheduleId
        )
        : null;

    const handleAssignClick = async (route: RouteListItem) => {
        if (!selectedScheduleData || !selectedScheduleId) {
            console.error('❌ Brak danych wybranego harmonogramu');
            return;
        }

        console.log('🎯 Przypisuję dziecko na koniec trasy:', route.id);

        try {
            // 1. Przypisz dziecko na koniec trasy
            await onAssignToRoute(selectedScheduleId, route.id);

            // 2. Pokaż modal z pytaniem o mapę
            setConfirmModalState({
                isOpen: true,
                childName: `${selectedScheduleData.childFirstName} ${selectedScheduleData.childLastName}`,
                routeName: route.routeName,
                routeId: route.id,
            });
        } catch (error) {
            console.error('❌ Błąd podczas przypisywania:', error);
        }
    };

    const handleViewMapFromConfirm = () => {
        const routeId = confirmModalState.routeId;

        if (!routeId) {
            console.error('❌ Brak routeId w confirmModalState');
            return;
        }

        console.log('🗺️ Użytkownik chce zobaczyć mapę dla trasy:', routeId);

        // Zamknij modal potwierdzenia
        setConfirmModalState({
            isOpen: false,
            childName: '',
            routeName: '',
            routeId: null
        });

        // Ustaw ID trasy do pobrania - to uruchomi useEffect
        setRouteIdToFetch(routeId);
    };

    const handleCloseConfirmModal = () => {
        console.log('🚪 Zamykanie modala potwierdzenia');
        setConfirmModalState({
            isOpen: false,
            childName: '',
            routeName: '',
            routeId: null
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

            // Przygotuj dane dla API - mapuj punkty na stopOrders
            const stopOrders = newPoints
                .filter(p => !p.stopId.startsWith('temp-')) // Pomijamy tymczasowe ID
                .map(p => ({
                    stopId: p.stopId,
                    newOrder: p.order,
                }));

            console.log('📤 StopOrders do wysłania:', stopOrders);

            if (stopOrders.length === 0) {
                throw new Error('Brak stopów do zaktualizowania');
            }

            // Wywołaj mutację
            await reorderStops.mutateAsync({
                routeId,
                stopOrders,
            });

            toast.dismiss(toastId);
            toast.success('Kolejność stopów została zaktualizowana');

            console.log('✅ Kolejność zapisana pomyślnie');

            // Zamknij modal
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

    return (
        <>
            <TimelineContainer>
                {routes.map((route) => {
                    const isSuggested = selectedMatch && selectedMatch[1].routeId === route.id;
                    const matchConfidence = isSuggested ? selectedMatch[1].confidence : null;

                    const capacityUsed = route.stopsCount / 2;
                    const capacityTotal = 10;
                    const capacityPercent = (capacityUsed / capacityTotal) * 100;

                    return (
                        <RouteTimelineCard
                            key={route.id}
                            $isSuggested={isSuggested}
                            $hasSelectedSchedule={Boolean(selectedScheduleId)}
                        >
                            {isSuggested && matchConfidence && (
                                <MatchIndicator $confidence={matchConfidence}>
                                    {matchConfidence === 'high' && '⚡ Najlepsze dopasowanie'}
                                    {matchConfidence === 'medium' && '✓ Dobre dopasowanie'}
                                    {matchConfidence === 'low' && '~ Możliwe dopasowanie'}
                                </MatchIndicator>
                            )}

                            <RouteCardHeader>
                                <RouteInfo>
                                    <RouteName>{route.routeName}</RouteName>
                                    <RouteMetadata>
                                        <MetadataItem>
                                            <User size={14} />
                                            {route.driver.firstName} {route.driver.lastName}
                                        </MetadataItem>
                                        <MetadataItem>
                                            <Car size={14} />
                                            {route.vehicle.registrationNumber}
                                        </MetadataItem>
                                    </RouteMetadata>
                                </RouteInfo>
                                <Badge variant="primary">{route.stopsCount} stopów</Badge>
                            </RouteCardHeader>

                            <RouteCardBody>
                                <TimeSlot>
                                    <Clock size={16} />
                                    <div>
                                        <TimeLabel>Start trasy</TimeLabel>
                                        <strong>{route.estimatedStartTime}</strong>
                                    </div>
                                </TimeSlot>

                                <TimeSlot>
                                    <Clock size={16} />
                                    <div>
                                        <TimeLabel>Koniec trasy</TimeLabel>
                                        <strong>{route.estimatedEndTime}</strong>
                                    </div>
                                </TimeSlot>

                                <CapacityBar>
                                    <CapacityLabel>
                                        <Users size={14} />
                                        Pojemność: {capacityUsed} / {capacityTotal}
                                    </CapacityLabel>
                                    <div
                                        style={{
                                            position: 'relative',
                                            height: '8px',
                                            background: '#e2e8f0',
                                            borderRadius: '4px',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <CapacityFill
                                            $percent={capacityPercent}
                                            $isOverCapacity={capacityPercent > 100}
                                        />
                                    </div>
                                </CapacityBar>
                            </RouteCardBody>

                            {selectedScheduleId && (
                                <RouteCardFooter>
                                    <Button
                                        variant={isSuggested ? 'primary' : 'secondary'}
                                        fullWidth
                                        onClick={() => handleAssignClick(route)}
                                    >
                                        <MapPin size={16} />
                                        Przypisz do trasy
                                    </Button>
                                </RouteCardFooter>
                            )}
                        </RouteTimelineCard>
                    );
                })}
            </TimelineContainer>

            {/* Modal potwierdzenia z opcją podglądu mapy */}
            <ConfirmMapViewModal
                isOpen={confirmModalState.isOpen}
                childName={confirmModalState.childName}
                routeName={confirmModalState.routeName}
                onViewMap={handleViewMapFromConfirm}
                onClose={handleCloseConfirmModal}
            />

            {/* Modal z mapą */}
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
        </>
    );
};