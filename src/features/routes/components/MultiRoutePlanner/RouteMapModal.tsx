import React, { useState, useEffect, useCallback } from 'react';
import { X, MapPin, Navigation, AlertCircle, RefreshCw, Save, ChevronUp, ChevronDown } from 'lucide-react';
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
    onSaveOrder?: (newPoints: RoutePoint[]) => void; // Callback do zapisu nowej kolejności
}

// Funkcja do generowania oznaczeń typu A(1), A(2), B(1), B(2)
const generatePointLabel = (type: 'pickup' | 'dropoff', childIndex: number): string => {
    const letter = String.fromCharCode(65 + childIndex);
    const number = type === 'pickup' ? '1' : '2';
    return `${letter}(${number})`;
};

// Funkcja pomocnicza do mapowania dzieci na indeksy
const getChildIndexMap = (points: RoutePoint[]): Record<string, number> => {
    const uniqueChildren = [...new Set(points.map(p => p.childName))];
    const childIndexMap: Record<string, number> = {};
    uniqueChildren.forEach((child, index) => {
        childIndexMap[child] = index;
    });
    return childIndexMap;
};

// Walidacja kolejności - sprawdza czy dowóz nie jest przed odbiorem dla danego dziecka
const validatePointsOrder = (points: RoutePoint[]): { isValid: boolean; errors: string[] } => {
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
        errors
    };
};

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

const PointOrder = styled.div<{ $type: 'pickup' | 'dropoff'; $noCoordinates?: boolean }>`
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 46px;
    height: 32px;
    padding: 0 8px;
    background: ${({ $type, $noCoordinates, theme }) => {
        if ($noCoordinates) return theme.colors.slate[400];
        return $type === 'pickup' ? theme.colors.primary[600] : theme.colors.success[600];
    }};
    color: white;
    border-radius: ${({ theme }) => theme.borderRadius.full};
    font-size: 0.8125rem;
    font-weight: 700;
    flex-shrink: 0;
    white-space: nowrap;
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

const WarningBanner = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.sm};
    padding: ${({ theme }) => theme.spacing.md};
    background: ${({ theme }) => theme.colors.warning[50]};
    border: 1px solid ${({ theme }) => theme.colors.warning[200]};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    color: ${({ theme }) => theme.colors.warning[800]};
    font-size: 0.75rem;
    line-height: 1.5;
`;

const RouteStats = styled.div`
    padding: ${({ theme }) => theme.spacing.md};
    background: ${({ theme }) => theme.colors.slate[50]};
    border: 1px solid ${({ theme }) => theme.colors.slate[200]};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xs};
`;

const StatRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.75rem;
`;

const StatLabel = styled.div`
    color: ${({ theme }) => theme.colors.slate[600]};
`;

const StatValue = styled.div`
    color: ${({ theme }) => theme.colors.slate[900]};
    font-weight: 600;
`;

const MoveButtons = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin-left: auto;
`;

const MoveButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    padding: 0;
    background: white;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    color: #64748b;
    cursor: pointer;
    transition: all 0.15s;
    
    &:hover:not(:disabled) {
        background: #f1f5f9;
        border-color: #94a3b8;
        color: #475569;
    }
    
    &:disabled {
        opacity: 0.3;
        cursor: not-allowed;
    }
    
    &:active:not(:disabled) {
        transform: scale(0.95);
    }
`;

const PointCardWithControls = styled.div<{ $type: 'pickup' | 'dropoff'; $noCoordinates?: boolean }>`
    padding: ${({ theme }) => theme.spacing.md};
    background: ${({ $type, $noCoordinates, theme }) => {
    if ($noCoordinates) return theme.colors.slate[50];
    return $type === 'pickup' ? theme.colors.primary[50] : theme.colors.success[50];
}};
    border: 1px solid ${({ $type, $noCoordinates, theme }) => {
    if ($noCoordinates) return theme.colors.slate[200];
    return $type === 'pickup' ? theme.colors.primary[200] : theme.colors.success[200];
}};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    display: flex;
    gap: ${({ theme }) => theme.spacing.sm};
    align-items: center;
    opacity: ${({ $noCoordinates }) => $noCoordinates ? 0.6 : 1};
    transition: box-shadow 0.2s;
    
    &:hover {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }
`;

const ActionButtons = styled.div`
    display: flex;
    gap: 12px;
    margin-top: 16px;
`;

const ActionButton = styled.button<{ $variant?: 'primary' | 'secondary' | 'success' }>`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px 16px;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
    border: none;

    ${({ $variant }) => {
        if ($variant === 'primary') {
            return `
                background: #2563eb;
                color: white;
                &:hover:not(:disabled) {
                    background: #1d4ed8;
                }
            `;
        }
        if ($variant === 'success') {
            return `
                background: #10b981;
                color: white;
                &:hover:not(:disabled) {
                    background: #059669;
                }
            `;
        }
        return `
            background: #f1f5f9;
            color: #475569;
            &:hover:not(:disabled) {
                background: #e2e8f0;
            }
        `;
    }}

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const ValidationError = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 8px;
    color: #dc2626;
    font-size: 0.75rem;
    margin-top: 8px;
`;

const ModalFooter = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 20px;
    border-top: 1px solid #e2e8f0;
    background: #f8fafc;
`;

const FooterButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 24px;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
    border: none;
    
    ${({ $variant }) => {
    if ($variant === 'primary') {
        return `
                background: #2563eb;
                color: white;
                &:hover {
                    background: #1d4ed8;
                }
            `;
    }
    return `
            background: white;
            color: #475569;
            border: 1px solid #cbd5e1;
            &:hover {
                background: #f8fafc;
            }
        `;
}}
`;

// NOWA WERSJA: Używamy tylko Polyline i własnych Markerów
const RouteRenderer: React.FC<{ points: RoutePoint[] }> = ({ points }) => {
    const map = useMap();

    useEffect(() => {
        if (!map || !window.google) return;

        const validPoints = points.filter(
            (p) => p.hasCoordinates && p.lat !== null && p.lng !== null
        );

        if (validPoints.length < 2) return;

        // Mapa dzieci na indeksy dla etykiet
        const uniqueChildren = [...new Set(points.map(p => p.childName))];
        const childIndexMap: Record<string, number> = {};
        uniqueChildren.forEach((child, index) => {
            childIndexMap[child] = index;
        });

        const directionsService = new google.maps.DirectionsService();

        // Przygotuj waypoints
        const waypoints = validPoints.slice(1, -1).map((point) => ({
            location: new google.maps.LatLng(point.lat!, point.lng!),
            stopover: true,
        }));

        // Tablica do przechowywania elementów do wyczyszczenia
        const markers: google.maps.Marker[] = [];
        let polyline: google.maps.Polyline | null = null;

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
                optimizeWaypoints: false,
            },
            (result, status) => {
                if (status === google.maps.DirectionsStatus.OK && result) {
                    // Narysuj linię trasy RĘCZNIE
                    const path = result.routes[0].overview_path;
                    polyline = new google.maps.Polyline({
                        path: path,
                        geodesic: true,
                        strokeColor: '#2563eb',
                        strokeOpacity: 0.8,
                        strokeWeight: 5,
                        map: map,
                    });

                    // Teraz dodaj własne markery
                    points.forEach((point) => {
                        if (!point.hasCoordinates || point.lat === null || point.lng === null) {
                            return;
                        }

                        const childIndex = childIndexMap[point.childName] ?? 0;
                        const letter = String.fromCharCode(65 + childIndex);
                        const number = point.type === 'pickup' ? '1' : '2';
                        const label = `${letter}(${number})`;
                        const markerColor = point.type === 'pickup' ? '#2563eb' : '#10b981';

                        // Tworzymy SVG marker jako data URL
                        const svgMarker = {
                            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
                                    <circle cx="20" cy="20" r="18" fill="${markerColor}" stroke="white" stroke-width="3"/>
                                    <text x="20" y="20" font-family="Arial, sans-serif" font-size="12" font-weight="bold" 
                                          fill="white" text-anchor="middle" dominant-baseline="central">${label}</text>
                                </svg>
                            `)}`,
                            scaledSize: new google.maps.Size(40, 40),
                            anchor: new google.maps.Point(20, 20),
                        };

                        const marker = new google.maps.Marker({
                            position: { lat: point.lat, lng: point.lng },
                            map: map,
                            icon: svgMarker,
                            title: `${point.childName} - ${point.type === 'pickup' ? 'Odbiór' : 'Dowóz'}`,
                            zIndex: 1000,
                        });

                        markers.push(marker);
                    });

                    // Oblicz statystyki
                    let totalDistance = 0;
                    let totalDuration = 0;
                    result.routes[0].legs.forEach((leg) => {
                        totalDistance += leg.distance?.value || 0;
                        totalDuration += leg.duration?.value || 0;
                    });

                    console.log(`Trasa: ${(totalDistance / 1000).toFixed(1)} km, ${Math.round(totalDuration / 60)} min`);
                    console.log(`Utworzono ${markers.length} własnych markerów`);
                } else {
                    console.error('Błąd wyznaczania trasy:', status);
                }
            }
        );

        return () => {
            // Cleanup
            if (polyline) polyline.setMap(null);
            markers.forEach(marker => marker.setMap(null));
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
                                                                onSaveOrder,
                                                            }) => {
    const [center, setCenter] = useState({ lat: 52.2297, lng: 21.0122 });
    const [zoom, setZoom] = useState(12);

    // Stan dla edycji kolejności
    const [editedPoints, setEditedPoints] = useState<RoutePoint[]>(points);
    const [displayedPoints, setDisplayedPoints] = useState<RoutePoint[]>(points); // Punkty wyświetlane na mapie
    const [hasChanges, setHasChanges] = useState(false);
    const [needsRefresh, setNeedsRefresh] = useState(false);

    // Walidacja
    const validation = validatePointsOrder(editedPoints);

    // Resetuj stan przy otwarciu modala
    useEffect(() => {
        if (isOpen) {
            setEditedPoints(points);
            setDisplayedPoints(points);
            setHasChanges(false);
            setNeedsRefresh(false);
        }
    }, [isOpen, points]);

    const childIndexMap = getChildIndexMap(displayedPoints);
    const validPoints = displayedPoints.filter(p => p.hasCoordinates && p.lat !== null && p.lng !== null);
    const missingCoordinatesCount = displayedPoints.length - validPoints.length;

    useEffect(() => {
        if (validPoints.length > 0) {
            setCenter({ lat: validPoints[0].lat!, lng: validPoints[0].lng! });
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

    // Przesuń punkt w górę
    const handleMoveUp = (index: number) => {
        if (index === 0) return;

        const newPoints = [...editedPoints];
        [newPoints[index - 1], newPoints[index]] = [newPoints[index], newPoints[index - 1]];

        // Aktualizuj order
        newPoints.forEach((point, idx) => {
            point.order = idx + 1;
        });

        console.log('Przesunięto w górę, hasChanges będzie true');
        setEditedPoints(newPoints);
        setHasChanges(true);
        setNeedsRefresh(true);
    };

    // Przesuń punkt w dół
    const handleMoveDown = (index: number) => {
        if (index === editedPoints.length - 1) return;

        const newPoints = [...editedPoints];
        [newPoints[index], newPoints[index + 1]] = [newPoints[index + 1], newPoints[index]];

        // Aktualizuj order
        newPoints.forEach((point, idx) => {
            point.order = idx + 1;
        });

        console.log('Przesunięto w dół, hasChanges będzie true');
        setEditedPoints(newPoints);
        setHasChanges(true);
        setNeedsRefresh(true);
    };

    // Odśwież mapę
    const handleRefreshMap = () => {
        if (validation.isValid) {
            setDisplayedPoints([...editedPoints]);
            setNeedsRefresh(false);
        }
    };

    // Zapisz zmiany
    const handleSave = () => {
        console.log('handleSave wywołane');
        console.log('validation.isValid:', validation.isValid);
        console.log('onSaveOrder:', onSaveOrder);
        console.log('hasChanges:', hasChanges);

        if (!validation.isValid) {
            console.log('Walidacja nie przeszła');
            return;
        }

        if (onSaveOrder) {
            console.log('Zapisuję nową kolejność:', editedPoints);
            onSaveOrder(editedPoints);
            setHasChanges(false);
            setNeedsRefresh(false);
            onClose();
        } else {
            console.log('Brak callbacka onSaveOrder - tylko zamykam modal');
            setHasChanges(false);
            setNeedsRefresh(false);
            onClose();
        }
    };

    // Anuluj zmiany
    const handleCancel = () => {
        setEditedPoints(points);
        setDisplayedPoints(points);
        setHasChanges(false);
        setNeedsRefresh(false);
        onClose();
    };

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
                        <CloseButton onClick={handleCancel}>
                            <X size={20} />
                        </CloseButton>
                    </ModalHeader>

                    <ModalBody>
                        <MapContainer>
                            {validPoints.length >= 2 ? (
                                <Map
                                    key={displayedPoints.map(p => p.order).join('-')} // Force re-render on points change
                                    defaultCenter={center}
                                    defaultZoom={zoom}
                                    gestureHandling="greedy"
                                    disableDefaultUI={false}
                                    mapId="route-map"
                                >
                                    <RouteRenderer points={displayedPoints} />
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
                                    <StatValue>{editedPoints.length}</StatValue>
                                </StatRow>
                                <StatRow>
                                    <StatLabel>Na mapie:</StatLabel>
                                    <StatValue>{validPoints.length}</StatValue>
                                </StatRow>
                                <StatRow>
                                    <StatLabel>Punktów odbioru:</StatLabel>
                                    <StatValue>
                                        {editedPoints.filter((p) => p.type === 'pickup').length}
                                    </StatValue>
                                </StatRow>
                                <StatRow>
                                    <StatLabel>Punktów dowozu:</StatLabel>
                                    <StatValue>
                                        {editedPoints.filter((p) => p.type === 'dropoff').length}
                                    </StatValue>
                                </StatRow>
                            </RouteStats>

                            {/* Przycisk odświeżania mapy */}
                            {needsRefresh && (
                                <ActionButtons>
                                    <ActionButton
                                        $variant="primary"
                                        onClick={handleRefreshMap}
                                        disabled={!validation.isValid}
                                    >
                                        <RefreshCw size={16} />
                                        Odśwież mapę
                                    </ActionButton>
                                </ActionButtons>
                            )}

                            {/* Błędy walidacji */}
                            {!validation.isValid && validation.errors.map((error, idx) => (
                                <ValidationError key={idx}>
                                    <AlertCircle size={14} />
                                    {error}
                                </ValidationError>
                            ))}

                            {/* Lista punktów z przyciskami strzałek */}
                            {editedPoints.map((point, index) => {
                                const childIndex = childIndexMap[point.childName] ?? 0;
                                const label = generatePointLabel(point.type, childIndex);

                                return (
                                    <PointCardWithControls
                                        key={`${point.order}-${point.type}-${index}`}
                                        $type={point.type}
                                        $noCoordinates={!point.hasCoordinates}
                                    >
                                        <PointOrder
                                            $type={point.type}
                                            $noCoordinates={!point.hasCoordinates}
                                        >
                                            {label}
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
                                        <MoveButtons>
                                            <MoveButton
                                                onClick={() => handleMoveUp(index)}
                                                disabled={index === 0}
                                                title="Przesuń w górę"
                                            >
                                                <ChevronUp size={16} />
                                            </MoveButton>
                                            <MoveButton
                                                onClick={() => handleMoveDown(index)}
                                                disabled={index === editedPoints.length - 1}
                                                title="Przesuń w dół"
                                            >
                                                <ChevronDown size={16} />
                                            </MoveButton>
                                        </MoveButtons>
                                    </PointCardWithControls>
                                );
                            })}
                        </Sidebar>
                    </ModalBody>

                    {/* Footer z przyciskami Zapisz/Anuluj */}
                    <ModalFooter>
                        <FooterButton onClick={handleCancel}>
                            <X size={16} />
                            Anuluj
                        </FooterButton>
                        <FooterButton
                            $variant="primary"
                            onClick={() => {
                                console.log('Kliknięto Zapisz, hasChanges:', hasChanges, 'validation.isValid:', validation.isValid);
                                handleSave();
                            }}
                            disabled={!hasChanges || !validation.isValid}
                            title={`hasChanges: ${hasChanges}, valid: ${validation.isValid}`}
                        >
                            <Save size={16} />
                            Zapisz {!hasChanges && '(brak zmian)'} {!validation.isValid && '(błąd walidacji)'}
                        </FooterButton>
                    </ModalFooter>
                </ModalContainer>
            </Overlay>
        </APIProvider>
    );
};