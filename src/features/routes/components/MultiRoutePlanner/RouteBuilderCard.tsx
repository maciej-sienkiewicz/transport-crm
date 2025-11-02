import React, { useState, useCallback, useMemo } from 'react';
import { X, Trash2, AlertTriangle, User, Truck, Users, MapPin, Clock, Map as MapIcon, ArrowUp, ArrowDown, GripVertical } from 'lucide-react';
import toast from 'react-hot-toast';
import { Input } from '@/shared/ui/Input';
import { Select } from '@/shared/ui/Select';
import { Button } from '@/shared/ui/Button';
import { AvailableChild, ChildSchedule, RoutePoint } from '../../types';
import { RouteBuilder } from './MultiRoutePlanner';
import { RouteMapModal } from './RouteMapModal';
import {
    RouteCard,
    RouteCardHeader,
    RouteCardHeaderLeft,
    RouteCardNumber,
    RouteCardTitle,
    RouteCardHeaderRight,
    RemoveRouteButton,
    RouteCardBody,
    FormSection,
    MetadataBar,
    MetadataItem,
    CapacitySection,
    CapacityLabel,
    CapacityBar,
    CapacityFill,
    CapacityText,
    ChildrenSection,
    SectionTitle,
    DropZone,
    EmptyDropZone,
    RouteChildCard,
    OrderBadge,
    ChildInfo,
    ChildName,
    ChildDetails,
    ChildActions,
    RemoveChildButton,
    ValidationWarnings,
    WarningItem,
    NeedBadge,
} from './RouteBuilderCard.styles';

interface Driver {
    id: string;
    firstName: string;
    lastName: string;
}

interface Vehicle {
    id: string;
    registrationNumber: string;
    make: string;
    model: string;
    capacity: {
        totalSeats: number;
        wheelchairSpaces: number;
    };
}

interface RouteBuilderCardProps {
    route: RouteBuilder;
    index: number;
    drivers: Driver[];
    vehicles: Vehicle[];
    draggedItem: { child: AvailableChild; schedule: ChildSchedule } | null;
    draggedPoint: { routeId: string; point: RoutePoint } | null;
    onUpdate: (routeId: string, updates: Partial<RouteBuilder>) => void;
    onRemove: (routeId: string) => void;
    onAddPoints: (routeId: string, child: AvailableChild, schedule: ChildSchedule) => boolean;
    onRemovePoint: (routeId: string, pointId: string) => void;
    onReorderPoints: (routeId: string, points: RoutePoint[]) => void;
    onMovePointBetweenRoutes: (fromRouteId: string, toRouteId: string, pointId: string) => void;
    onDragStartPoint: (routeId: string, point: RoutePoint) => void;
    onDragEnd: () => void;
}

const GOOGLE_MAPS_API_KEY = 'AIzaSyAr0qHze3moiMPHo-cwv171b8luH-anyXA';

// Helper function to check if two addresses are the same
const isSameAddress = (addr1: RoutePoint['address'], addr2: RoutePoint['address']): boolean => {
    return (
        addr1.street === addr2.street &&
        addr1.houseNumber === addr2.houseNumber &&
        addr1.apartmentNumber === addr2.apartmentNumber &&
        addr1.postalCode === addr2.postalCode &&
        addr1.city === addr2.city
    );
};

// Helper function to check if reorder would violate PICKUP before DROPOFF rule
const wouldViolatePickupDropoffOrder = (points: RoutePoint[], sourceIndex: number, targetIndex: number): boolean => {
    const pointToMove = points[sourceIndex];
    const newPoints = [...points];
    newPoints.splice(sourceIndex, 1);
    newPoints.splice(targetIndex, 0, pointToMove);

    // Check each schedule
    const scheduleMap = new Map<string, { pickupOrder: number; dropoffOrder: number }>();

    newPoints.forEach((point, index) => {
        if (!scheduleMap.has(point.scheduleId)) {
            scheduleMap.set(point.scheduleId, { pickupOrder: -1, dropoffOrder: -1 });
        }
        const orders = scheduleMap.get(point.scheduleId)!;
        if (point.type === 'PICKUP') {
            orders.pickupOrder = index;
        } else {
            orders.dropoffOrder = index;
        }
    });

    // Check if any DROPOFF comes before PICKUP
    for (const [, orders] of scheduleMap) {
        if (orders.pickupOrder !== -1 && orders.dropoffOrder !== -1) {
            if (orders.dropoffOrder < orders.pickupOrder) {
                return true;
            }
        }
    }

    return false;
};

export const RouteBuilderCard: React.FC<RouteBuilderCardProps> = ({
                                                                      route,
                                                                      index,
                                                                      drivers,
                                                                      vehicles,
                                                                      draggedItem,
                                                                      draggedPoint,
                                                                      onUpdate,
                                                                      onRemove,
                                                                      onAddPoints,
                                                                      onRemovePoint,
                                                                      onReorderPoints,
                                                                      onMovePointBetweenRoutes,
                                                                      onDragStartPoint,
                                                                      onDragEnd,
                                                                  }) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const [isMapModalOpen, setIsMapModalOpen] = useState(false);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

    const selectedVehicle = vehicles.find(v => v.id === route.vehicleId);
    const selectedDriver = drivers.find(d => d.id === route.driverId);

    const calculateCapacity = useCallback(() => {
        if (!selectedVehicle) return { used: 0, total: 0, percentage: 0, overCapacity: false };

        const sortedPoints = [...route.points].sort((a, b) => a.order - b.order);
        let maxSeats = 0;
        const inVehicle = new Map<string, { wheelchair: boolean }>();

        sortedPoints.forEach(point => {
            if (point.type === 'PICKUP') {
                inVehicle.set(point.scheduleId, { wheelchair: point.transportNeeds.wheelchair });
            } else {
                inVehicle.delete(point.scheduleId);
            }

            let currentSeats = 0;
            inVehicle.forEach(({ wheelchair }) => {
                currentSeats += wheelchair ? 2 : 1;
            });
            maxSeats = Math.max(maxSeats, currentSeats);
        });

        const total = selectedVehicle.capacity.totalSeats;
        const percentage = (maxSeats / total) * 100;
        const overCapacity = maxSeats > total;

        return { used: maxSeats, total, percentage, overCapacity };
    }, [selectedVehicle, route.points]);

    const validateRoute = useCallback(() => {
        const warnings: string[] = [];

        if (!selectedVehicle) return warnings;

        const wheelchairSchedules = new Set<string>();
        route.points.forEach(point => {
            if (point.transportNeeds.wheelchair) {
                wheelchairSchedules.add(point.scheduleId);
            }
        });

        if (wheelchairSchedules.size > selectedVehicle.capacity.wheelchairSpaces) {
            warnings.push(
                `Pojazd ma tylko ${selectedVehicle.capacity.wheelchairSpaces} miejsc na wózki, a potrzeba ${wheelchairSchedules.size}`
            );
        }

        const capacity = calculateCapacity();
        if (capacity.overCapacity) {
            warnings.push('Przekroczono pojemność pojazdu!');
        }

        const scheduleOrders = new Map<string, { pickupOrder: number; dropoffOrder: number }>();
        route.points.forEach(point => {
            if (!scheduleOrders.has(point.scheduleId)) {
                scheduleOrders.set(point.scheduleId, { pickupOrder: -1, dropoffOrder: -1 });
            }
            const orders = scheduleOrders.get(point.scheduleId)!;
            if (point.type === 'PICKUP') {
                orders.pickupOrder = point.order;
            } else {
                orders.dropoffOrder = point.order;
            }
        });

        scheduleOrders.forEach((orders, scheduleId) => {
            if (orders.pickupOrder > orders.dropoffOrder) {
                const point = route.points.find(p => p.scheduleId === scheduleId);
                warnings.push(`${point?.childName}: Dowóz przed odbiorem!`);
            }
        });

        return warnings;
    }, [selectedVehicle, route.points, calculateCapacity]);

    // Identify adjacent points with same address
    const adjacentAddressGroups = useMemo(() => {
        const sortedPoints = [...route.points].sort((a, b) => a.order - b.order);
        const groups = new Map<string, number>();
        let currentGroup = 0;

        for (let i = 0; i < sortedPoints.length; i++) {
            const current = sortedPoints[i];
            const prev = i > 0 ? sortedPoints[i - 1] : null;

            if (prev && isSameAddress(current.address, prev.address)) {
                const prevGroupId = groups.get(prev.id);
                if (prevGroupId !== undefined) {
                    groups.set(current.id, prevGroupId);
                } else {
                    groups.set(prev.id, currentGroup);
                    groups.set(current.id, currentGroup);
                    currentGroup++;
                }
            }
        }

        return groups;
    }, [route.points]);

    const getRoutePoints = useCallback(() => {
        const points: Array<{
            address: string;
            lat: number | null;
            lng: number | null;
            type: 'pickup' | 'dropoff';
            childName: string;
            order: number;
            hasCoordinates: boolean;
        }> = [];

        const sortedPoints = [...route.points].sort((a, b) => a.order - b.order);

        sortedPoints.forEach((point) => {
            const lat = point.address.latitude;
            const lng = point.address.longitude;
            const hasCoordinates = lat != null && lng != null;

            points.push({
                address: `${point.address.street} ${point.address.houseNumber}, ${point.address.city}`,
                lat: hasCoordinates ? lat : null,
                lng: hasCoordinates ? lng : null,
                type: point.type === 'PICKUP' ? 'pickup' : 'dropoff',
                childName: point.childName,
                order: point.order,
                hasCoordinates,
            });
        });

        return points;
    }, [route.points]);

    const handleShowMap = useCallback(() => {
        if (route.points.length === 0) {
            toast.error('Dodaj punkty do trasy, aby zobaczyć mapę');
            return;
        }

        const pointsWithCoords = route.points.filter(p =>
            p.address.latitude != null && p.address.longitude != null
        );

        if (pointsWithCoords.length < 2) {
            toast.error('Co najmniej 2 punkty muszą mieć współrzędne GPS, aby wyświetlić trasę na mapie');
            return;
        }

        if (!GOOGLE_MAPS_API_KEY) {
            toast.error('Brak klucza API Google Maps. Skonfiguruj REACT_APP_GOOGLE_MAPS_API_KEY');
            return;
        }
        setIsMapModalOpen(true);
    }, [route.points]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX;
        const y = e.clientY;

        if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
            setIsDragOver(false);
            setDragOverIndex(null);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setIsDragOver(false);
        setDragOverIndex(null);

        if (draggedItem) {
            onAddPoints(route.id, draggedItem.child, draggedItem.schedule);
        } else if (draggedPoint && draggedPoint.routeId !== route.id) {
            onMovePointBetweenRoutes(draggedPoint.routeId, route.id, draggedPoint.point.id);
        }
    }, [route.id, draggedItem, draggedPoint, onAddPoints, onMovePointBetweenRoutes]);

    const handleChildCardDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    }, []);

    const handleChildCardDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setIsDragOver(false);

        if (draggedItem) {
            onAddPoints(route.id, draggedItem.child, draggedItem.schedule);
        }
    }, [route.id, draggedItem, onAddPoints]);

    const handlePointDragOver = (e: React.DragEvent, targetIndex: number) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOverIndex(targetIndex);
    };

    const handlePointDrop = (e: React.DragEvent, targetIndex: number) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOverIndex(null);

        if (draggedPoint && draggedPoint.routeId === route.id) {
            const sourceIndex = route.points.findIndex(p => p.id === draggedPoint.point.id);
            if (sourceIndex === targetIndex) return;

            // Validate that reorder won't violate PICKUP before DROPOFF rule
            if (wouldViolatePickupDropoffOrder(route.points, sourceIndex, targetIndex)) {
                toast.error('Nie można przesunąć: dowóz nie może być przed odbiorem tego samego dziecka!');
                return;
            }

            const newPoints = [...route.points];
            const [removed] = newPoints.splice(sourceIndex, 1);
            newPoints.splice(targetIndex, 0, removed);

            onReorderPoints(route.id, newPoints);
        } else if (draggedPoint && draggedPoint.routeId !== route.id) {
            onMovePointBetweenRoutes(draggedPoint.routeId, route.id, draggedPoint.point.id);
        }
    };

    const handleMovePointUp = (pointId: string) => {
        const currentIndex = route.points.findIndex(p => p.id === pointId);
        if (currentIndex <= 0) return;

        // Validate before moving
        if (wouldViolatePickupDropoffOrder(route.points, currentIndex, currentIndex - 1)) {
            toast.error('Nie można przesunąć: dowóz nie może być przed odbiorem tego samego dziecka!');
            return;
        }

        const newPoints = [...route.points];
        [newPoints[currentIndex - 1], newPoints[currentIndex]] = [newPoints[currentIndex], newPoints[currentIndex - 1]];
        onReorderPoints(route.id, newPoints);
    };

    const handleMovePointDown = (pointId: string) => {
        const currentIndex = route.points.findIndex(p => p.id === pointId);
        if (currentIndex >= route.points.length - 1) return;

        // Validate before moving
        if (wouldViolatePickupDropoffOrder(route.points, currentIndex, currentIndex + 1)) {
            toast.error('Nie można przesunąć: dowóz nie może być przed odbiorem tego samego dziecka!');
            return;
        }

        const newPoints = [...route.points];
        [newPoints[currentIndex], newPoints[currentIndex + 1]] = [newPoints[currentIndex + 1], newPoints[currentIndex]];
        onReorderPoints(route.id, newPoints);
    };

    const capacity = calculateCapacity();
    const warnings = validateRoute();
    const sortedPoints = [...route.points].sort((a, b) => a.order - b.order);
    const uniqueChildren = new Set(route.points.map(p => p.scheduleId)).size;

    return (
        <>
            <RouteCard>
                <RouteCardHeader>
                    <RouteCardHeaderLeft>
                        <RouteCardNumber>#{index + 1}</RouteCardNumber>
                        <RouteCardTitle>
                            {route.routeName || `Trasa ${index + 1}`}
                        </RouteCardTitle>
                    </RouteCardHeaderLeft>
                    <RouteCardHeaderRight>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleShowMap}
                            disabled={route.points.length === 0}
                            title="Pokaż trasę na mapie"
                        >
                            <MapIcon size={16} />
                        </Button>
                        <RemoveRouteButton
                            onClick={() => {
                                if (window.confirm('Czy na pewno chcesz usunąć tę trasę?')) {
                                    onRemove(route.id);
                                }
                            }}
                            title="Usuń trasę"
                        >
                            <Trash2 size={16} />
                        </RemoveRouteButton>
                    </RouteCardHeaderRight>
                </RouteCardHeader>

                <RouteCardBody>
                    <FormSection>
                        <Input
                            label="Nazwa trasy"
                            value={route.routeName}
                            onChange={(e) => onUpdate(route.id, { routeName: e.target.value })}
                            placeholder={`Trasa ${index + 1}`}
                            required
                        />
                        <Select
                            label="Pojazd"
                            value={route.vehicleId}
                            onChange={(e) => {
                                onUpdate(route.id, { vehicleId: e.target.value });
                            }}
                            options={vehicles.map(v => ({
                                value: v.id,
                                label: `${v.registrationNumber} - ${v.make} ${v.model} (${v.capacity.totalSeats} miejsc)`,
                            }))}
                            required
                        />
                        <Select
                            label="Kierowca"
                            value={route.driverId}
                            onChange={(e) => onUpdate(route.id, { driverId: e.target.value })}
                            options={drivers.map(d => ({
                                value: d.id,
                                label: `${d.firstName} ${d.lastName}`,
                            }))}
                            required
                        />
                    </FormSection>

                    {!route.vehicleId && (
                        <div style={{
                            padding: '0.75rem',
                            background: '#fef3c7',
                            border: '1px solid #fbbf24',
                            borderRadius: '0.75rem',
                            color: '#92400e',
                            fontSize: '0.875rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <AlertTriangle size={16} />
                            Wybierz pojazd, aby móc przypisywać dzieci
                        </div>
                    )}

                    {selectedVehicle && (
                        <>
                            <MetadataBar>
                                {selectedDriver && (
                                    <MetadataItem>
                                        <User size={13} />
                                        {selectedDriver.firstName} {selectedDriver.lastName}
                                    </MetadataItem>
                                )}
                                {selectedVehicle && (
                                    <MetadataItem>
                                        <Truck size={13} />
                                        {selectedVehicle.registrationNumber}
                                    </MetadataItem>
                                )}
                                <MetadataItem>
                                    <Users size={13} />
                                    {uniqueChildren} {uniqueChildren === 1 ? 'dziecko' : 'dzieci'}
                                </MetadataItem>
                                <MetadataItem>
                                    <MapPin size={13} />
                                    {route.points.length} {route.points.length === 1 ? 'punkt' : 'punktów'}
                                </MetadataItem>
                            </MetadataBar>

                            <CapacitySection>
                                <CapacityLabel $warning={capacity.overCapacity}>
                                    Miejsca (max jednocześnie): {capacity.used} / {capacity.total}
                                    {capacity.overCapacity && ' ⚠️'}
                                </CapacityLabel>
                                <CapacityBar>
                                    <CapacityFill
                                        $percentage={Math.min(capacity.percentage, 100)}
                                        $overCapacity={capacity.overCapacity}
                                    />
                                    <CapacityText>{Math.round(capacity.percentage)}%</CapacityText>
                                </CapacityBar>
                            </CapacitySection>
                        </>
                    )}

                    <ChildrenSection>
                        <SectionTitle>
                            Punkty trasy ({route.points.length})
                        </SectionTitle>
                        <DropZone
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            $isDragOver={isDragOver}
                            $isEmpty={route.points.length === 0}
                            style={{
                                backgroundColor: isDragOver ? '#eff6ff' : undefined,
                                minHeight: route.points.length === 0 ? '120px' : 'auto',
                            }}
                        >
                            {route.points.length === 0 ? (
                                <EmptyDropZone>
                                    <Users size={28} />
                                    <div>
                                        {!route.vehicleId
                                            ? 'Najpierw wybierz pojazd'
                                            : 'Przeciągnij dzieci tutaj'}
                                    </div>
                                </EmptyDropZone>
                            ) : (
                                sortedPoints.map((point, idx) => {
                                    const adjacentGroup = adjacentAddressGroups.get(point.id);
                                    const hasAdjacentAddress = adjacentGroup !== undefined;

                                    return (
                                        <RouteChildCard
                                            key={point.id}
                                            draggable
                                            onDragStart={(e) => {
                                                e.stopPropagation();
                                                onDragStartPoint(route.id, point);
                                            }}
                                            onDragEnd={onDragEnd}
                                            onDragOver={(e) => {
                                                handlePointDragOver(e, idx);
                                                handleChildCardDragOver(e);
                                            }}
                                            onDrop={(e) => {
                                                handlePointDrop(e, idx);
                                                handleChildCardDrop(e);
                                            }}
                                            style={{
                                                borderTop: dragOverIndex === idx ? '2px solid #3b82f6' : undefined,
                                                borderLeft: hasAdjacentAddress ? '3px solid #8b5cf6' : undefined,
                                                backgroundColor: hasAdjacentAddress ? '#faf5ff' : undefined,
                                            }}
                                        >
                                            <OrderBadge>{point.order}</OrderBadge>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#64748b' }}>
                                                <GripVertical size={16} />
                                            </div>
                                            <ChildInfo>
                                                <ChildName>
                                                    {point.type === 'PICKUP' ? '📍 Odbiór' : '🏁 Dowóz'}: {point.childName}
                                                    {hasAdjacentAddress && (
                                                        <span style={{
                                                            marginLeft: '0.5rem',
                                                            fontSize: '0.75rem',
                                                            color: '#8b5cf6',
                                                            fontWeight: 600
                                                        }}>
                                                            ● Ten sam adres
                                                        </span>
                                                    )}
                                                </ChildName>
                                                <ChildDetails>
                                                    <div>
                                                        <Clock size={11} style={{ display: 'inline', marginRight: 4 }} />
                                                        {point.estimatedTime}
                                                    </div>
                                                    <div>
                                                        <MapPin size={11} style={{ display: 'inline', marginRight: 4 }} />
                                                        {point.address.label} - {point.address.street} {point.address.houseNumber}
                                                        {point.address.apartmentNumber && `/${point.address.apartmentNumber}`}
                                                    </div>
                                                    {(point.transportNeeds.wheelchair || point.transportNeeds.specialSeat) && (
                                                        <div style={{ display: 'flex', gap: '3px', marginTop: '3px' }}>
                                                            {point.transportNeeds.wheelchair && (
                                                                <NeedBadge $variant="wheelchair">
                                                                    Wózek (2 miejsca)
                                                                </NeedBadge>
                                                            )}
                                                            {point.transportNeeds.specialSeat && (
                                                                <NeedBadge $variant="seat">Fotelik</NeedBadge>
                                                            )}
                                                        </div>
                                                    )}
                                                </ChildDetails>
                                            </ChildInfo>
                                            <ChildActions>
                                                <RemoveChildButton
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleMovePointUp(point.id);
                                                    }}
                                                    disabled={idx === 0}
                                                    title="Przesuń w górę"
                                                >
                                                    <ArrowUp size={14} />
                                                </RemoveChildButton>
                                                <RemoveChildButton
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleMovePointDown(point.id);
                                                    }}
                                                    disabled={idx === sortedPoints.length - 1}
                                                    title="Przesuń w dół"
                                                >
                                                    <ArrowDown size={14} />
                                                </RemoveChildButton>
                                                <RemoveChildButton
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onRemovePoint(route.id, point.id);
                                                    }}
                                                    title="Usuń z trasy"
                                                >
                                                    <X size={14} />
                                                </RemoveChildButton>
                                            </ChildActions>
                                        </RouteChildCard>
                                    );
                                })
                            )}
                        </DropZone>
                    </ChildrenSection>

                    {warnings.length > 0 && (
                        <ValidationWarnings>
                            {warnings.map((warning, idx) => (
                                <WarningItem key={idx}>
                                    <AlertTriangle size={14} />
                                    {warning}
                                </WarningItem>
                            ))}
                        </ValidationWarnings>
                    )}
                </RouteCardBody>
            </RouteCard>

            <RouteMapModal
                isOpen={isMapModalOpen}
                onClose={() => setIsMapModalOpen(false)}
                routeName={route.routeName || `Trasa ${index + 1}`}
                points={getRoutePoints()}
                apiKey={GOOGLE_MAPS_API_KEY}
            />
        </>
    );
};