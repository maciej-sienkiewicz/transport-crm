// src/features/routes/components/SmartAssignmentDashboard/RoutesTimeline.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Clock, MapPin, Users, Car, User, AlertCircle } from 'lucide-react';
import { RouteListItem, AutoMatchSuggestion, UnassignedScheduleItem } from '../../types';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { RouteMapModal } from '../MultiRoutePlanner/RouteMapModal';
import { useRoute } from '../../hooks/useRoute';
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
    onAssignToRoute: (
        scheduleId: string,
        routeId: string,
        reorderedPoints?: RoutePoint[]
    ) => Promise<void>;
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

    const [selectedRouteIdForFetch, setSelectedRouteIdForFetch] = useState<string | null>(null);

    // Pobierz szczegóły trasy
    const { data: selectedRouteData, isLoading: isLoadingRouteDetails } = useRoute(
        selectedRouteIdForFetch || ''
    );

    // Gdy dane trasy są gotowe, otwórz modal z pełnymi danymi
    useEffect(() => {
        if (selectedRouteData && selectedScheduleData && selectedRouteIdForFetch) {
            console.log('📍 Przygotowuję punkty trasy z', selectedRouteData.stops.length, 'istniejących stopów');

            // Konwertuj istniejące stopy trasy na format RoutePoint
            const existingPoints: RoutePoint[] = selectedRouteData.stops
                .filter(stop => !stop.isCancelled) // Pomijamy anulowane stopy
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

            console.log('✅ Istniejące punkty:', existingPoints.length);

            // Dodaj nowe stopy dla wybranego dziecka
            const newPickupPoint: RoutePoint = {
                address: `${selectedScheduleData.pickupAddress.street} ${selectedScheduleData.pickupAddress.houseNumber}${
                    selectedScheduleData.pickupAddress.apartmentNumber
                        ? `/${selectedScheduleData.pickupAddress.apartmentNumber}`
                        : ''
                }, ${selectedScheduleData.pickupAddress.city}`,
                lat: selectedScheduleData.pickupAddress.latitude ?? null,
                lng: selectedScheduleData.pickupAddress.longitude ?? null,
                type: 'pickup',
                childName: `${selectedScheduleData.childFirstName} ${selectedScheduleData.childLastName}`,
                order: existingPoints.length + 1,
                hasCoordinates:
                    selectedScheduleData.pickupAddress.latitude != null &&
                    selectedScheduleData.pickupAddress.longitude != null,
                stopId: `temp-pickup-${selectedScheduleData.scheduleId}`,
                scheduleId: selectedScheduleData.scheduleId,
                isNew: true,
            };

            const newDropoffPoint: RoutePoint = {
                address: `${selectedScheduleData.dropoffAddress.street} ${selectedScheduleData.dropoffAddress.houseNumber}${
                    selectedScheduleData.dropoffAddress.apartmentNumber
                        ? `/${selectedScheduleData.dropoffAddress.apartmentNumber}`
                        : ''
                }, ${selectedScheduleData.dropoffAddress.city}`,
                lat: selectedScheduleData.dropoffAddress.latitude ?? null,
                lng: selectedScheduleData.dropoffAddress.longitude ?? null,
                type: 'dropoff',
                childName: `${selectedScheduleData.childFirstName} ${selectedScheduleData.childLastName}`,
                order: existingPoints.length + 2,
                hasCoordinates:
                    selectedScheduleData.dropoffAddress.latitude != null &&
                    selectedScheduleData.dropoffAddress.longitude != null,
                stopId: `temp-dropoff-${selectedScheduleData.scheduleId}`,
                scheduleId: selectedScheduleData.scheduleId,
                isNew: true,
            };

            const allPoints = [...existingPoints, newPickupPoint, newDropoffPoint];

            console.log('🎯 Wszystkie punkty razem:', allPoints.length);
            console.log('🆕 Nowe punkty:', allPoints.filter(p => p.isNew).length);

            setMapModalState({
                isOpen: true,
                routeId: selectedRouteIdForFetch,
                routeName: selectedRouteData.routeName,
                points: allPoints,
            });

            // Reset ID po otwarciu modala
            setSelectedRouteIdForFetch(null);
        }
    }, [selectedRouteData, selectedScheduleData, selectedRouteIdForFetch]);

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

    const handleOpenMapModal = (route: RouteListItem) => {
        if (!selectedScheduleData) {
            console.error('❌ Brak danych wybranego harmonogramu');
            return;
        }

        console.log('🗺️ Otwieranie mapy dla trasy:', route.id);
        // Ustaw ID trasy do pobrania szczegółów
        setSelectedRouteIdForFetch(route.id);
    };

    const handleSaveOrderFromMap = async (newPoints: RoutePoint[]) => {
        if (!mapModalState.routeId || !selectedScheduleId) {
            console.error('❌ Brak routeId lub scheduleId');
            return;
        }

        console.log('💾 Zapisywanie nowej kolejności:', newPoints.length, 'punktów');

        try {
            await onAssignToRoute(selectedScheduleId, mapModalState.routeId, newPoints);

            setMapModalState({
                isOpen: false,
                routeId: null,
                routeName: null,
                points: [],
            });
        } catch (error) {
            console.error('❌ Błąd podczas przypisywania:', error);
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
                    const isSuggested =
                        selectedMatch && selectedMatch[1].routeId === route.id;
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
                                        onClick={() => handleOpenMapModal(route)}
                                        disabled={isLoadingRouteDetails && selectedRouteIdForFetch === route.id}
                                        isLoading={isLoadingRouteDetails && selectedRouteIdForFetch === route.id}
                                    >
                                        <MapPin size={16} />
                                        {isLoadingRouteDetails && selectedRouteIdForFetch === route.id
                                            ? 'Ładowanie...'
                                            : 'Zobacz na mapie i przypisz'}
                                    </Button>
                                </RouteCardFooter>
                            )}
                        </RouteTimelineCard>
                    );
                })}
            </TimelineContainer>

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