// src/features/routes/components/SmartAssignmentDashboard/RouteSuggestionsModal.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { X, MapPin, Clock, User, Car, Loader } from 'lucide-react';
import { APIProvider, Map as MapUI, useMap } from '@vis.gl/react-google-maps';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { RouteDetail, RouteStop } from '../../types';
import { useRouteSuggestions } from '../../hooks/useRouteSuggestions';

const ModalOverlay = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9998;
    padding: ${({ theme }) => theme.spacing.lg};
    overflow-y: auto;
`;

const ModalContainer = styled.div`
    background: white;
    border-radius: ${({ theme }) => theme.borderRadius['2xl']};
    max-width: 900px;
    width: 100%;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    box-shadow: ${({ theme }) => theme.shadows['2xl']};
`;

const ModalHeader = styled.div`
    padding: ${({ theme }) => theme.spacing.xl};
    border-bottom: 1px solid ${({ theme }) => theme.colors.slate[200]};
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.md};
`;

const ModalTitle = styled.h2`
    font-size: 1.5rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.slate[900]};
    margin: 0;
`;

const CloseButton = styled.button`
    width: 40px;
    height: 40px;
    border-radius: ${({ theme }) => theme.borderRadius.full};
    border: none;
    background: ${({ theme }) => theme.colors.slate[100]};
    color: ${({ theme }) => theme.colors.slate[600]};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all ${({ theme }) => theme.transitions.fast};

    &:hover {
        background: ${({ theme }) => theme.colors.slate[200]};
        color: ${({ theme }) => theme.colors.slate[900]};
    }
`;

const ModalBody = styled.div`
    padding: ${({ theme }) => theme.spacing.xl};
    overflow-y: auto;
    flex: 1;
`;

const SuggestionsGrid = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.lg};
`;

const SuggestionCard = styled.div`
    border: 2px solid ${({ theme }) => theme.colors.slate[200]};
    border-radius: ${({ theme }) => theme.borderRadius.xl};
    overflow: hidden;
    transition: all ${({ theme }) => theme.transitions.normal};

    &:hover {
        border-color: ${({ theme }) => theme.colors.primary[400]};
        box-shadow: ${({ theme }) => theme.shadows.lg};
    }
`;

const SuggestionHeader = styled.div`
    padding: ${({ theme }) => theme.spacing.lg};
    background: ${({ theme }) => theme.gradients.cardHeader};
    border-bottom: 1px solid ${({ theme }) => theme.colors.slate[200]};
`;

const RouteTitle = styled.h3`
    font-size: 1.125rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[900]};
    margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
`;

const RouteMetadata = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: ${({ theme }) => theme.spacing.md};
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.slate[600]};
`;

const MetadataItem = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
`;

const SuggestionBody = styled.div`
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 0;

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        grid-template-columns: 1fr;
    }
`;

const RouteInfo = styled.div`
    padding: ${({ theme }) => theme.spacing.lg};
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
`;

const InfoRow = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
    font-size: 0.9375rem;
    color: ${({ theme }) => theme.colors.slate[700]};

    strong {
        color: ${({ theme }) => theme.colors.slate[900]};
    }
`;

const StopsInfo = styled.div`
    padding: ${({ theme }) => theme.spacing.md};
    background: ${({ theme }) => theme.colors.slate[50]};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
`;

const StopsLabel = styled.div`
    font-size: 0.75rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[600]};
    text-transform: uppercase;
    margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const StopsValue = styled.div`
    font-size: 1.125rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.slate[900]};
`;

const MapContainer = styled.div`
    height: 250px;
    border-left: 1px solid ${({ theme }) => theme.colors.slate[200]};
    position: relative;

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        border-left: none;
        border-top: 1px solid ${({ theme }) => theme.colors.slate[200]};
    }
`;

const MapLegend = styled.div`
    position: absolute;
    bottom: ${({ theme }) => theme.spacing.sm};
    left: ${({ theme }) => theme.spacing.sm};
    background: white;
    padding: ${({ theme }) => theme.spacing.sm};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    box-shadow: ${({ theme }) => theme.shadows.md};
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xs};
    font-size: 0.75rem;
`;

const LegendItem = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
`;

const LegendDot = styled.div<{ $color: string }>`
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${({ $color }) => $color};
    border: 2px solid white;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
`;

const SuggestionFooter = styled.div`
    padding: ${({ theme }) => theme.spacing.lg};
    border-top: 1px solid ${({ theme }) => theme.colors.slate[200]};
    background: ${({ theme }) => theme.colors.slate[50]};
`;

const LoadingContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: ${({ theme }) => theme.spacing['2xl']};
    gap: ${({ theme }) => theme.spacing.md};
    color: ${({ theme }) => theme.colors.slate[600]};
`;

const EmptyState = styled.div`
    text-align: center;
    padding: ${({ theme }) => theme.spacing['2xl']};
    color: ${({ theme }) => theme.colors.slate[600]};

    h3 {
        font-size: 1.125rem;
        font-weight: 600;
        color: ${({ theme }) => theme.colors.slate[900]};
        margin: ${({ theme }) => theme.spacing.md} 0 ${({ theme }) => theme.spacing.sm} 0;
    }
`;

interface RouteSuggestionsModalProps {
    isOpen: boolean;
    scheduleId: string;
    date: string;
    childName: string;
    schedulePickupAddress: {
        latitude?: number | null;
        longitude?: number | null;
        street: string;
        houseNumber: string;
    };
    scheduleDropoffAddress: {
        latitude?: number | null;
        longitude?: number | null;
        street: string;
        houseNumber: string;
    };
    onClose: () => void;
    onSelectRoute: (routeId: string) => Promise<void>;
    apiKey: string;
}

// Komponent renderujący trasę na mini-mapie Z PODŚWIETLENIEM NOWYCH PUNKTÓW
const RouteRenderer: React.FC<{
    displayStops: RouteStop[];
    newPickupLat?: number | null;
    newPickupLng?: number | null;
    newDropoffLat?: number | null;
    newDropoffLng?: number | null;
}> = ({ displayStops, newPickupLat, newPickupLng, newDropoffLat, newDropoffLng }) => {
    const map = useMap();

    useEffect(() => {
        if (!map || !window.google) return;

        const validStops = displayStops.filter(
            (s) => s.address.latitude != null && s.address.longitude != null
        );

        if (validStops.length < 2) return;

        const directionsService = new google.maps.DirectionsService();
        const markers: google.maps.Marker[] = [];
        let polyline: google.maps.Polyline | null = null;

        const waypoints = validStops.slice(1, -1).map((stop) => ({
            location: new google.maps.LatLng(stop.address.latitude!, stop.address.longitude!),
            stopover: true,
        }));

        directionsService.route(
            {
                origin: new google.maps.LatLng(
                    validStops[0].address.latitude!,
                    validStops[0].address.longitude!
                ),
                destination: new google.maps.LatLng(
                    validStops[validStops.length - 1].address.latitude!,
                    validStops[validStops.length - 1].address.longitude!
                ),
                waypoints,
                travelMode: google.maps.TravelMode.DRIVING,
                optimizeWaypoints: false,
            },
            (result, status) => {
                if (status === google.maps.DirectionsStatus.OK && result) {
                    const path = result.routes[0].overview_path;
                    polyline = new google.maps.Polyline({
                        path: path,
                        geodesic: true,
                        strokeColor: '#2563eb',
                        strokeOpacity: 0.8,
                        strokeWeight: 4,
                        map: map,
                    });

                    // Renderuj istniejące stopy
                    displayStops.forEach((stop, index) => {
                        if (stop.address.latitude == null || stop.address.longitude == null) {
                            return;
                        }

                        const isPickup = stop.stopType === 'PICKUP';
                        const markerColor = isPickup ? '#2563eb' : '#10b981';
                        const size = 32;

                        const svgMarker = {
                            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                                <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
                                    <circle cx="${size / 2}" cy="${size / 2}" r="${
                                size / 2 - 2
                            }" fill="${markerColor}" stroke="white" stroke-width="2"/>
                                    <text x="${size / 2}" y="${
                                size / 2
                            }" font-family="Arial, sans-serif" font-size="12" font-weight="bold" 
                                          fill="white" text-anchor="middle" dominant-baseline="central">${
                                stop.stopOrder
                            }</text>
                                </svg>
                            `)}`,
                            scaledSize: new google.maps.Size(size, size),
                            anchor: new google.maps.Point(size / 2, size / 2),
                        };

                        const marker = new google.maps.Marker({
                            position: {
                                lat: stop.address.latitude,
                                lng: stop.address.longitude,
                            },
                            map: map,
                            icon: svgMarker,
                            title: `${stop.childFirstName} ${stop.childLastName} - ${
                                isPickup ? 'Odbiór' : 'Dowóz'
                            }`,
                            zIndex: 1000 + index,
                        });

                        markers.push(marker);
                    });

                    // Renderuj NOWE punkty (fioletowe) - Pickup
                    if (newPickupLat != null && newPickupLng != null) {
                        const size = 36; // Trochę większy marker dla nowych punktów
                        const newPickupMarker = {
                            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                                <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
                                    <circle cx="${size / 2}" cy="${size / 2}" r="${
                                size / 2 - 2
                            }" fill="#9333ea" stroke="white" stroke-width="3"/>
                                    <text x="${size / 2}" y="${
                                size / 2
                            }" font-family="Arial, sans-serif" font-size="16" font-weight="bold" 
                                          fill="white" text-anchor="middle" dominant-baseline="central">+</text>
                                </svg>
                            `)}`,
                            scaledSize: new google.maps.Size(size, size),
                            anchor: new google.maps.Point(size / 2, size / 2),
                        };

                        const marker = new google.maps.Marker({
                            position: {
                                lat: newPickupLat,
                                lng: newPickupLng,
                            },
                            map: map,
                            icon: newPickupMarker,
                            title: 'Nowy punkt odbioru',
                            zIndex: 2000, // Wyższy z-index
                            animation: google.maps.Animation.DROP,
                        });

                        markers.push(marker);
                    }

                    // Renderuj NOWE punkty (fioletowe) - Dropoff
                    if (newDropoffLat != null && newDropoffLng != null) {
                        const size = 36;
                        const newDropoffMarker = {
                            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                                <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
                                    <circle cx="${size / 2}" cy="${size / 2}" r="${
                                size / 2 - 2
                            }" fill="#9333ea" stroke="white" stroke-width="3"/>
                                    <text x="${size / 2}" y="${
                                size / 2
                            }" font-family="Arial, sans-serif" font-size="16" font-weight="bold" 
                                          fill="white" text-anchor="middle" dominant-baseline="central">+</text>
                                </svg>
                            `)}`,
                            scaledSize: new google.maps.Size(size, size),
                            anchor: new google.maps.Point(size / 2, size / 2),
                        };

                        const marker = new google.maps.Marker({
                            position: {
                                lat: newDropoffLat,
                                lng: newDropoffLng,
                            },
                            map: map,
                            icon: newDropoffMarker,
                            title: 'Nowy punkt dowozu',
                            zIndex: 2001,
                            animation: google.maps.Animation.DROP,
                        });

                        markers.push(marker);
                    }
                }
            }
        );

        return () => {
            if (polyline) polyline.setMap(null);
            markers.forEach((marker) => marker.setMap(null));
        };
    }, [map, displayStops, newPickupLat, newPickupLng, newDropoffLat, newDropoffLng]);

    return null;
};

// Komponent mini-mapy dla sugestii
const SuggestionMiniMap: React.FC<{
    route: RouteDetail;
    apiKey: string;
    newPickupLat?: number | null;
    newPickupLng?: number | null;
    newDropoffLat?: number | null;
    newDropoffLng?: number | null;
}> = ({ route, apiKey, newPickupLat, newPickupLng, newDropoffLat, newDropoffLng }) => {
    const validStops = route.stops.filter(
        (s) => !s.isCancelled && s.address.latitude && s.address.longitude
    );

    if (validStops.length === 0) {
        return (
            <MapContainer>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        color: '#94a3b8',
                        fontSize: '0.875rem',
                    }}
                >
                    Brak współrzędnych
                </div>
            </MapContainer>
        );
    }

    const center = {
        lat: validStops[0].address.latitude!,
        lng: validStops[0].address.longitude!,
    };

    const hasNewPoints =
        (newPickupLat != null && newPickupLng != null) ||
        (newDropoffLat != null && newDropoffLng != null);

    return (
        <MapContainer>
            <APIProvider apiKey={apiKey}>
                <MapUI
                    defaultCenter={center}
                    defaultZoom={12}
                    mapId={`suggestion-map-${route.id}`}
                    style={{ width: '100%', height: '100%' }}
                    gestureHandling="greedy"
                    disableDefaultUI={false}
                    zoomControl={true}
                    mapTypeControl={false}
                    streetViewControl={false}
                    fullscreenControl={false}
                >
                    <RouteRenderer
                        displayStops={validStops}
                        newPickupLat={newPickupLat}
                        newPickupLng={newPickupLng}
                        newDropoffLat={newDropoffLat}
                        newDropoffLng={newDropoffLng}
                    />
                </MapUI>
            </APIProvider>
            {hasNewPoints && (
                <MapLegend>
                    <LegendItem>
                        <LegendDot $color="#2563eb" />
                        <span>Odbiór</span>
                    </LegendItem>
                    <LegendItem>
                        <LegendDot $color="#10b981" />
                        <span>Dowóz</span>
                    </LegendItem>
                    <LegendItem>
                        <LegendDot $color="#9333ea" />
                        <span>Nowe punkty</span>
                    </LegendItem>
                </MapLegend>
            )}
        </MapContainer>
    );
};

export const RouteSuggestionsModal: React.FC<RouteSuggestionsModalProps> = ({
                                                                                isOpen,
                                                                                scheduleId,
                                                                                date,
                                                                                childName,
                                                                                schedulePickupAddress,
                                                                                scheduleDropoffAddress,
                                                                                onClose,
                                                                                onSelectRoute,
                                                                                apiKey,
                                                                            }) => {
    const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
    const { data: suggestions, isLoading } = useRouteSuggestions(
        { scheduleId, date, maxResults: 3 },
        isOpen
    );

    if (!isOpen) return null;

    const handleSelectRoute = async (routeId: string) => {
        setSelectedRouteId(routeId);
        try {
            await onSelectRoute(routeId);
            onClose();
        } catch (error) {
            console.error('Błąd przypisywania:', error);
        } finally {
            setSelectedRouteId(null);
        }
    };

    return (
        <ModalOverlay onClick={onClose}>
            <ModalContainer onClick={(e) => e.stopPropagation()}>
                <ModalHeader>
                    <ModalTitle>Sugestie tras dla {childName}</ModalTitle>
                    <CloseButton onClick={onClose}>
                        <X size={20} />
                    </CloseButton>
                </ModalHeader>

                <ModalBody>
                    {isLoading && (
                        <LoadingContainer>
                            <Loader size={40} className="animate-spin" />
                            <p>Szukam najlepszych tras...</p>
                        </LoadingContainer>
                    )}

                    {!isLoading && (!suggestions || suggestions.length === 0) && (
                        <EmptyState>
                            <MapPin size={48} color="#cbd5e1" />
                            <h3>Brak sugestii</h3>
                            <p>
                                Nie znaleziono tras pasujących do tego harmonogramu.
                                <br />
                                Spróbuj przypisać dziecko ręcznie do wybranej trasy.
                            </p>
                        </EmptyState>
                    )}

                    {!isLoading && suggestions && suggestions.length > 0 && (
                        <SuggestionsGrid>
                            {suggestions.map((route) => (
                                <SuggestionCard key={route.id}>
                                    <SuggestionHeader>
                                        <RouteTitle>{route.routeName}</RouteTitle>
                                        <RouteMetadata>
                                            <MetadataItem>
                                                <User size={14} />
                                                {route.driver.firstName} {route.driver.lastName}
                                            </MetadataItem>
                                            <MetadataItem>
                                                <Car size={14} />
                                                {route.vehicle.registrationNumber}
                                            </MetadataItem>
                                            <Badge variant="primary">
                                                {route.stops.length} stopów
                                            </Badge>
                                        </RouteMetadata>
                                    </SuggestionHeader>

                                    <SuggestionBody>
                                        <RouteInfo>
                                            <InfoRow>
                                                <Clock size={16} />
                                                <div>
                                                    <strong>Start:</strong> {route.estimatedStartTime}
                                                </div>
                                            </InfoRow>
                                            <InfoRow>
                                                <Clock size={16} />
                                                <div>
                                                    <strong>Koniec:</strong> {route.estimatedEndTime}
                                                </div>
                                            </InfoRow>
                                            <StopsInfo>
                                                <StopsLabel>Liczba dzieci w trasie</StopsLabel>
                                                <StopsValue>
                                                    {Math.ceil(route.stops.length / 2)} dzieci
                                                </StopsValue>
                                            </StopsInfo>
                                        </RouteInfo>

                                        <SuggestionMiniMap
                                            route={route}
                                            apiKey={apiKey}
                                            newPickupLat={schedulePickupAddress.latitude}
                                            newPickupLng={schedulePickupAddress.longitude}
                                            newDropoffLat={scheduleDropoffAddress.latitude}
                                            newDropoffLng={scheduleDropoffAddress.longitude}
                                        />
                                    </SuggestionBody>

                                    <SuggestionFooter>
                                        <Button
                                            variant="primary"
                                            fullWidth
                                            onClick={() => handleSelectRoute(route.id)}
                                            isLoading={selectedRouteId === route.id}
                                            disabled={!!selectedRouteId}
                                        >
                                            <MapPin size={16} />
                                            Wybierz tę trasę
                                        </Button>
                                    </SuggestionFooter>
                                </SuggestionCard>
                            ))}
                        </SuggestionsGrid>
                    )}
                </ModalBody>
            </ModalContainer>
        </ModalOverlay>
    );
};