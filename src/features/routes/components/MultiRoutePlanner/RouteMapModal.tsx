import React, { useState, useEffect, useCallback } from 'react';
import { X, MapPin, Navigation, AlertCircle } from 'lucide-react';
import styled from 'styled-components';
import { APIProvider, Map, useMap } from '@vis.gl/react-google-maps';

interface RoutePoint {
    address: string;
    lat: number | null;
    lng: number | null;
    type: 'pickup' | 'dropoff';
    childName: string;
    order: number;
    hasCoordinates: boolean;
}

interface RouteMapModalProps {
    isOpen: boolean;
    onClose: () => void;
    routeName: string;
    points: RoutePoint[];
    apiKey: string;
}

const Overlay = styled.div<{ $isOpen: boolean }>`
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: ${({ theme }) => theme.spacing.lg};
    animation: fadeIn ${({ theme }) => theme.transitions.normal};

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
`;

const ModalContainer = styled.div`
    background: white;
    border-radius: ${({ theme }) => theme.borderRadius['2xl']};
    box-shadow: ${({ theme }) => theme.shadows.xl};
    width: 100%;
    max-width: 1200px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: slideUp ${({ theme }) => theme.transitions.slow};

    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }
`;

const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${({ theme }) => theme.spacing.lg};
    border-bottom: 1px solid ${({ theme }) => theme.colors.slate[200]};
    background: ${({ theme }) => theme.gradients.cardHeader};
`;

const ModalTitle = styled.h2`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
    font-size: 1.25rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.slate[900]};
`;

const CloseButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    padding: 0;
    background: white;
    border: 1px solid ${({ theme }) => theme.colors.slate[200]};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    color: ${({ theme }) => theme.colors.slate[600]};
    cursor: pointer;
    transition: all ${({ theme }) => theme.transitions.fast};

    &:hover {
        background: ${({ theme }) => theme.colors.slate[50]};
        border-color: ${({ theme }) => theme.colors.slate[300]};
    }
`;

const ModalBody = styled.div`
    flex: 1;
    display: flex;
    gap: ${({ theme }) => theme.spacing.md};
    padding: ${({ theme }) => theme.spacing.lg};
    overflow: hidden;

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        flex-direction: column;
    }
`;

const MapContainer = styled.div`
    flex: 1;
    min-height: 500px;
    border-radius: ${({ theme }) => theme.borderRadius.xl};
    overflow: hidden;
    border: 1px solid ${({ theme }) => theme.colors.slate[200]};

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        min-height: 400px;
    }
`;

const Sidebar = styled.div`
    width: 300px;
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
    overflow-y: auto;

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        width: 100%;
        max-height: 200px;
    }
`;

const PointCard = styled.div<{ $type: 'pickup' | 'dropoff'; $noCoordinates?: boolean }>`
    padding: ${({ theme }) => theme.spacing.md};
    background: ${({ $type, $noCoordinates, theme }) => {
    if ($noCoordinates) return theme.colors.slate[50];
    return $type === 'pickup' ? theme.colors.primary[50] : theme.colors.success[50];
}};
    border: 1px solid
        ${({ $type, $noCoordinates, theme }) => {
    if ($noCoordinates) return theme.colors.slate[200];
    return $type === 'pickup' ? theme.colors.primary[200] : theme.colors.success[200];
}};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    display: flex;
    gap: ${({ theme }) => theme.spacing.sm};
    opacity: ${({ $noCoordinates }) => $noCoordinates ? 0.6 : 1};
`;

const PointOrder = styled.div<{ $type: 'pickup' | 'dropoff'; $noCoordinates?: boolean }>`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: ${({ $type, $noCoordinates, theme }) => {
    if ($noCoordinates) return theme.colors.slate[400];
    return $type === 'pickup' ? theme.colors.primary[600] : theme.colors.success[600];
}};
    color: white;
    border-radius: ${({ theme }) => theme.borderRadius.full};
    font-size: 0.875rem;
    font-weight: 700;
    flex-shrink: 0;
`;

const PointInfo = styled.div`
    flex: 1;
    min-width: 0;
`;

const PointChild = styled.div`
    font-size: 0.875rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[900]};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const PointAddress = styled.div`
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.slate[600]};
    line-height: 1.4;
`;

const PointType = styled.div<{ $type: 'pickup' | 'dropoff' }>`
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 0.6875rem;
    font-weight: 600;
    text-transform: uppercase;
    color: ${({ $type, theme }) =>
    $type === 'pickup' ? theme.colors.primary[700] : theme.colors.success[700]};
    margin-top: ${({ theme }) => theme.spacing.xs};
`;

const NoCoordinatesWarning = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.6875rem;
    color: ${({ theme }) => theme.colors.warning[700]};
    background: ${({ theme }) => theme.colors.warning[100]};
    padding: 3px 6px;
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    margin-top: ${({ theme }) => theme.spacing.xs};
`;

const RouteStats = styled.div`
    padding: ${({ theme }) => theme.spacing.md};
    background: ${({ theme }) => theme.colors.slate[50]};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    border: 1px solid ${({ theme }) => theme.colors.slate[200]};
`;

const StatRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${({ theme }) => theme.spacing.xs} 0;
    font-size: 0.875rem;

    &:not(:last-child) {
        border-bottom: 1px solid ${({ theme }) => theme.colors.slate[200]};
    }
`;

const StatLabel = styled.span`
    color: ${({ theme }) => theme.colors.slate[600]};
`;

const StatValue = styled.span`
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[900]};
`;

const WarningBanner = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
    padding: ${({ theme }) => theme.spacing.md};
    background: ${({ theme }) => theme.colors.warning[50]};
    border: 1px solid ${({ theme }) => theme.colors.warning[200]};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    color: ${({ theme }) => theme.colors.warning[700]};
    font-size: 0.875rem;
`;

// Komponent do rysowania trasy
const DirectionsRenderer: React.FC<{ points: RoutePoint[] }> = ({ points }) => {
    const map = useMap();
    const [, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);
    const [, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null);

    useEffect(() => {
        // Filtruj tylko punkty ze współrzędnymi
        const validPoints = points.filter(p => p.hasCoordinates && p.lat !== null && p.lng !== null);

        if (!map || validPoints.length < 2) return;

        // Utwórz DirectionsService i DirectionsRenderer
        const directionsService = new google.maps.DirectionsService();
        const renderer = new google.maps.DirectionsRenderer({
            map,
            suppressMarkers: false,
            polylineOptions: {
                strokeColor: '#2563eb',
                strokeWeight: 5,
                strokeOpacity: 0.8,
            },
        });

        setDirectionsRenderer(renderer);

        // Przygotuj waypoints (wszystkie punkty poza pierwszym i ostatnim)
        const waypoints = validPoints.slice(1, -1).map((point) => ({
            location: new google.maps.LatLng(point.lat!, point.lng!),
            stopover: true,
        }));

        // Wyznacz trasę
        directionsService.route(
            {
                origin: new google.maps.LatLng(validPoints[0].lat!, validPoints[0].lng!),
                destination: new google.maps.LatLng(
                    validPoints[validPoints.length - 1].lat!,
                    validPoints[validPoints.length - 1].lng!
                ),
                waypoints,
                travelMode: google.maps.TravelMode.DRIVING,
                optimizeWaypoints: false, // Zachowaj kolejność
            },
            (result, status) => {
                if (status === google.maps.DirectionsStatus.OK && result) {
                    renderer.setDirections(result);

                    // Oblicz całkowitą odległość i czas
                    let totalDistance = 0;
                    let totalDuration = 0;

                    result.routes[0].legs.forEach((leg) => {
                        totalDistance += leg.distance?.value || 0;
                        totalDuration += leg.duration?.value || 0;
                    });

                    setRouteInfo({
                        distance: `${(totalDistance / 1000).toFixed(1)} km`,
                        duration: `${Math.round(totalDuration / 60)} min`,
                    });
                } else {
                    console.error('Błąd wyznaczania trasy:', status);
                }
            }
        );

        return () => {
            renderer.setMap(null);
        };
    }, [map, points]);

    return null;
};

export const RouteMapModal: React.FC<RouteMapModalProps> = ({
                                                                isOpen,
                                                                onClose,
                                                                routeName,
                                                                points,
                                                                apiKey,
                                                            }) => {
    const [center, setCenter] = useState({ lat: 52.2297, lng: 21.0122 }); // Domyślnie Warszawa
    const [zoom, setZoom] = useState(12);

    const validPoints = points.filter(p => p.hasCoordinates && p.lat !== null && p.lng !== null);
    const missingCoordinatesCount = points.length - validPoints.length;

    useEffect(() => {
        if (validPoints.length > 0) {
            // Wyśrodkuj mapę na pierwszym punkcie z współrzędnymi
            setCenter({ lat: validPoints[0].lat!, lng: validPoints[0].lng! });

            // Dostosuj zoom w zależności od ilości punktów
            if (validPoints.length > 5) {
                setZoom(11);
            } else {
                setZoom(12);
            }
        }
    }, [validPoints]);

    const handleOverlayClick = useCallback(
        (e: React.MouseEvent) => {
            if (e.target === e.currentTarget) {
                onClose();
            }
        },
        [onClose]
    );

    if (!isOpen) return null;

    return (
        <APIProvider apiKey={apiKey}>
            <Overlay $isOpen={isOpen} onClick={handleOverlayClick}>
                <ModalContainer onClick={(e) => e.stopPropagation()}>
                    <ModalHeader>
                        <ModalTitle>
                            <Navigation size={24} />
                            {routeName}
                        </ModalTitle>
                        <CloseButton onClick={onClose}>
                            <X size={20} />
                        </CloseButton>
                    </ModalHeader>

                    <ModalBody>
                        <MapContainer>
                            {validPoints.length >= 2 ? (
                                <Map
                                    defaultCenter={center}
                                    defaultZoom={zoom}
                                    gestureHandling="greedy"
                                    disableDefaultUI={false}
                                    mapId="route-map"
                                >
                                    <DirectionsRenderer points={points} />
                                </Map>
                            ) : (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '100%',
                                    padding: '2rem',
                                    textAlign: 'center',
                                    color: '#64748b'
                                }}>
                                    <div>
                                        <AlertCircle size={48} style={{ margin: '0 auto 1rem', color: '#f59e0b' }} />
                                        <p style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                                            Nie można wyświetlić trasy
                                        </p>
                                        <p style={{ fontSize: '0.875rem' }}>
                                            Co najmniej 2 punkty muszą mieć współrzędne GPS
                                        </p>
                                    </div>
                                </div>
                            )}
                        </MapContainer>

                        <Sidebar>
                            {missingCoordinatesCount > 0 && (
                                <WarningBanner>
                                    <AlertCircle size={16} />
                                    <div>
                                        {missingCoordinatesCount} {missingCoordinatesCount === 1 ? 'punkt nie ma' : 'punktów nie ma'} współrzędnych GPS i nie {missingCoordinatesCount === 1 ? 'jest wyświetlany' : 'są wyświetlane'} na mapie
                                    </div>
                                </WarningBanner>
                            )}

                            <RouteStats>
                                <StatRow>
                                    <StatLabel>Punktów na trasie:</StatLabel>
                                    <StatValue>{points.length}</StatValue>
                                </StatRow>
                                <StatRow>
                                    <StatLabel>Na mapie:</StatLabel>
                                    <StatValue>{validPoints.length}</StatValue>
                                </StatRow>
                                <StatRow>
                                    <StatLabel>Punktów odbioru:</StatLabel>
                                    <StatValue>
                                        {points.filter((p) => p.type === 'pickup').length}
                                    </StatValue>
                                </StatRow>
                                <StatRow>
                                    <StatLabel>Punktów dowozu:</StatLabel>
                                    <StatValue>
                                        {points.filter((p) => p.type === 'dropoff').length}
                                    </StatValue>
                                </StatRow>
                            </RouteStats>

                            {points.map((point) => (
                                <PointCard
                                    key={`${point.order}-${point.type}`}
                                    $type={point.type}
                                    $noCoordinates={!point.hasCoordinates}
                                >
                                    <PointOrder
                                        $type={point.type}
                                        $noCoordinates={!point.hasCoordinates}
                                    >
                                        {point.order}
                                    </PointOrder>
                                    <PointInfo>
                                        <PointChild>{point.childName}</PointChild>
                                        <PointAddress>{point.address}</PointAddress>
                                        {!point.hasCoordinates && (
                                            <NoCoordinatesWarning>
                                                <AlertCircle size={12} />
                                                Brak współrzędnych GPS
                                            </NoCoordinatesWarning>
                                        )}
                                        <PointType $type={point.type}>
                                            <MapPin size={12} />
                                            {point.type === 'pickup' ? 'Odbiór' : 'Dowóz'}
                                        </PointType>
                                    </PointInfo>
                                </PointCard>
                            ))}
                        </Sidebar>
                    </ModalBody>
                </ModalContainer>
            </Overlay>
        </APIProvider>
    );
};