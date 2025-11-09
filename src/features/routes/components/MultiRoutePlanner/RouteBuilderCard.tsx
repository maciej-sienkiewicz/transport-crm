// src/features/routes/components/MultiRoutePlanner/RouteBuilderCard.tsx

import React, { useState, useCallback, useMemo } from 'react';
import { X, Trash2, AlertTriangle, User, Truck, Users, MapPin, Clock, Map as MapIcon, ArrowUp, ArrowDown, GripVertical } from 'lucide-react';
import toast from 'react-hot-toast';
import { Input } from '@/shared/ui/Input';
import { Select } from '@/shared/ui/Select';
import { Button } from '@/shared/ui/Button';
import { AvailableChild, ChildSchedule, LocalRouteStop } from '../../types';
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
    draggedStop: { routeId: string; stop: LocalRouteStop } | null;
    onUpdate: (routeId: string, updates: Partial<RouteBuilder>) => void;
    onRemove: (routeId: string) => void;
    onAddStops: (routeId: string, child: AvailableChild, schedule: ChildSchedule) => boolean;
    onRemoveStop: (routeId: string, stopId: string) => void;
    onReorderStops: (routeId: string, stops: LocalRouteStop[]) => void;
    onMoveStopBetweenRoutes: (fromRouteId: string, toRouteId: string, stopId: string) => void;
    onDragStartStop: (routeId: string, stop: LocalRouteStop) => void;
    onDragEnd: () => void;
}

const GOOGLE_MAPS_API_KEY = 'AIzaSyAr0qHze3moiMPHo-cwv171b8luH-anyXA';

const isSameAddress = (addr1: LocalRouteStop['address'], addr2: LocalRouteStop['address']): boolean => {
    return (
        addr1.street === addr2.street &&
        addr1.houseNumber === addr2.houseNumber &&
        addr1.apartmentNumber === addr2.apartmentNumber &&
        addr1.postalCode === addr2.postalCode &&
        addr1.city === addr2.city
    );
};

const wouldViolatePickupDropoffOrder = (stops: LocalRouteStop[], sourceIndex: number, targetIndex: number): boolean => {
    const stopToMove = stops[sourceIndex];
    const newStops = [...stops];
    newStops.splice(sourceIndex, 1);
    newStops.splice(targetIndex, 0, stopToMove);

    const scheduleMap = new Map<string, { pickupOrder: number; dropoffOrder: number }>();

    newStops.forEach((stop, index) => {
        if (!scheduleMap.has(stop.scheduleId)) {
            scheduleMap.set(stop.scheduleId, { pickupOrder: -1, dropoffOrder: -1 });
        }
        const orders = scheduleMap.get(stop.scheduleId)!;
        if (stop.type === 'PICKUP') {
            orders.pickupOrder = index;
        } else {
            orders.dropoffOrder = index;
        }
    });

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
                                                                      draggedStop,
                                                                      onUpdate,
                                                                      onRemove,
                                                                      onAddStops,
                                                                      onRemoveStop,
                                                                      onReorderStops,
                                                                      onMoveStopBetweenRoutes,
                                                                      onDragStartStop,
                                                                      onDragEnd,
                                                                  }) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const [isMapModalOpen, setIsMapModalOpen] = useState(false);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

    const selectedVehicle = vehicles.find(v => v.id === route.vehicleId);
    const selectedDriver = drivers.find(d => d.id === route.driverId);

    const calculateCapacity = useCallback(() => {
        if (!selectedVehicle) return { used: 0, total: 0, percentage: 0, overCapacity: false };

        const sortedStops = [...route.stops].sort((a, b) => a.order - b.order);
        let maxSeats = 0;
        const inVehicle = new Map<string, { wheelchair: boolean }>();

        sortedStops.forEach(stop => {
            if (stop.type === 'PICKUP') {
                inVehicle.set(stop.scheduleId, { wheelchair: stop.transportNeeds.wheelchair });
            } else {
                inVehicle.delete(stop.scheduleId);
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
    }, [selectedVehicle, route.stops]);

    const validateRoute = useCallback(() => {
        const warnings: string[] = [];

        if (!selectedVehicle) return warnings;

        const wheelchairSchedules = new Set<string>();
        route.stops.forEach(stop => {
            if (stop.transportNeeds.wheelchair) {
                wheelchairSchedules.add(stop.scheduleId);
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
        route.stops.forEach(stop => {
            if (!scheduleOrders.has(stop.scheduleId)) {
                scheduleOrders.set(stop.scheduleId, { pickupOrder: -1, dropoffOrder: -1 });
            }
            const orders = scheduleOrders.get(stop.scheduleId)!;
            if (stop.type === 'PICKUP') {
                orders.pickupOrder = stop.order;
            } else {
                orders.dropoffOrder = stop.order;
            }
        });

        scheduleOrders.forEach((orders, scheduleId) => {
            if (orders.pickupOrder > orders.dropoffOrder) {
                const stop = route.stops.find(s => s.scheduleId === scheduleId);
                warnings.push(`${stop?.childName}: Dowóz przed odbiorem!`);
            }
        });

        return warnings;
    }, [selectedVehicle, route.stops, calculateCapacity]);

    const adjacentAddressGroups = useMemo(() => {
        const sortedStops = [...route.stops].sort((a, b) => a.order - b.order);
        const groups = new Map<string, number>();
        let currentGroup = 0;

        for (let i = 0; i < sortedStops.length; i++) {
            const current = sortedStops[i];
            const prev = i > 0 ? sortedStops[i - 1] : null;

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
    }, [route.stops]);

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

        const sortedStops = [...route.stops].sort((a, b) => a.order - b.order);

        sortedStops.forEach((stop) => {
            const lat = stop.address.latitude;
            const lng = stop.address.longitude;
            const hasCoordinates = lat != null && lng != null;

            points.push({
                address: `${stop.address.street} ${stop.address.houseNumber}, ${stop.address.city}`,
                lat: hasCoordinates ? lat : null,
                lng: hasCoordinates ? lng : null,
                type: stop.type === 'PICKUP' ? 'pickup' : 'dropoff',
                childName: stop.childName,
                order: stop.order,
                hasCoordinates,
            });
        });

        return points;
    }, [route.stops]);

    const convertMapPointsToRouteStops = useCallback((mapPoints: Array<{
        address: string;
        lat: number | null;
        lng: number | null;
        type: 'pickup' | 'dropoff';
        childName: string;
        order: number;
        hasCoordinates: boolean;
    }>): LocalRouteStop[] => {
        const originalStopsMap = new Map<string, LocalRouteStop[]>();
        route.stops.forEach(stop => {
            const key = `${stop.childName}-${stop.type}`;
            if (!originalStopsMap.has(key)) {
                originalStopsMap.set(key, []);
            }
            originalStopsMap.get(key)!.push(stop);
        });

        return mapPoints.map((mapPoint, index) => {
            const key = `${mapPoint.childName}-${mapPoint.type.toUpperCase()}`;
            const originalStops = originalStopsMap.get(key) || [];
            const originalStop = originalStops[0];

            if (!originalStop) {
                console.error('Nie znaleziono oryginalnego stopu dla:', mapPoint);
                throw new Error('Błąd konwersji stopów');
            }

            return {
                ...originalStop,
                order: index + 1,
            };
        });
    }, [route.stops]);

    const handleSaveOrderFromMap = useCallback((newMapPoints: Array<{
        address: string;
        lat: number | null;
        lng: number | null;
        type: 'pickup' | 'dropoff';
        childName: string;
        order: number;
        hasCoordinates: boolean;
    }>) => {
        try {
            const newRouteStops = convertMapPointsToRouteStops(newMapPoints);
            onReorderStops(route.id, newRouteStops);
            toast.success('Kolejność stopów została zaktualizowana');
        } catch (error) {
            console.error('Błąd podczas zapisu kolejności:', error);
            toast.error('Nie udało się zapisać nowej kolejności');
        }
    }, [route.id, convertMapPointsToRouteStops, onReorderStops]);

    const handleShowMap = useCallback(() => {
        if (route.stops.length === 0) {
            toast.error('Dodaj stopy do trasy, aby zobaczyć mapę');
            return;
        }

        const stopsWithCoords = route.stops.filter(s =>
            s.address.latitude != null && s.address.longitude != null
        );

        if (stopsWithCoords.length < 2) {
            toast.error('Co najmniej 2 stopy muszą mieć współrzędne GPS, aby wyświetlić trasę na mapie');
            return;
        }

        if (!GOOGLE_MAPS_API_KEY) {
            toast.error('Brak klucza API Google Maps');
            return;
        }
        setIsMapModalOpen(true);
    }, [route.stops]);

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
            onAddStops(route.id, draggedItem.child, draggedItem.schedule);
        } else if (draggedStop && draggedStop.routeId !== route.id) {
            onMoveStopBetweenRoutes(draggedStop.routeId, route.id, draggedStop.stop.id);
        }
    }, [route.id, draggedItem, draggedStop, onAddStops, onMoveStopBetweenRoutes]);

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
            onAddStops(route.id, draggedItem.child, draggedItem.schedule);
        }
    }, [route.id, draggedItem, onAddStops]);

    const handleStopDragOver = (e: React.DragEvent, targetIndex: number) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOverIndex(targetIndex);
    };

    const handleStopDrop = (e: React.DragEvent, targetIndex: number) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOverIndex(null);

        if (draggedStop && draggedStop.routeId === route.id) {
            const sourceIndex = route.stops.findIndex(s => s.id === draggedStop.stop.id);
            if (sourceIndex === targetIndex) return;

            if (wouldViolatePickupDropoffOrder(route.stops, sourceIndex, targetIndex)) {
                toast.error('Nie można przesunąć: dowóz nie może być przed odbiorem tego samego dziecka!');
                return;
            }

            const newStops = [...route.stops];
            const [removed] = newStops.splice(sourceIndex, 1);
            newStops.splice(targetIndex, 0, removed);

            onReorderStops(route.id, newStops);
        } else if (draggedStop && draggedStop.routeId !== route.id) {
            onMoveStopBetweenRoutes(draggedStop.routeId, route.id, draggedStop.stop.id);
        }
    };

    const handleMoveStopUp = (stopId: string) => {
        const currentIndex = route.stops.findIndex(s => s.id === stopId);
        if (currentIndex <= 0) return;

        if (wouldViolatePickupDropoffOrder(route.stops, currentIndex, currentIndex - 1)) {
            toast.error('Nie można przesunąć: dowóz nie może być przed odbiorem tego samego dziecka!');
            return;
        }

        const newStops = [...route.stops];
        [newStops[currentIndex - 1], newStops[currentIndex]] = [newStops[currentIndex], newStops[currentIndex - 1]];
        onReorderStops(route.id, newStops);
    };

    const handleMoveStopDown = (stopId: string) => {
        const currentIndex = route.stops.findIndex(s => s.id === stopId);
        if (currentIndex >= route.stops.length - 1) return;

        if (wouldViolatePickupDropoffOrder(route.stops, currentIndex, currentIndex + 1)) {
            toast.error('Nie można przesunąć: dowóz nie może być przed odbiorem tego samego dziecka!');
            return;
        }

        const newStops = [...route.stops];
        [newStops[currentIndex], newStops[currentIndex + 1]] = [newStops[currentIndex + 1], newStops[currentIndex]];
        onReorderStops(route.id, newStops);
    };

    const capacity = calculateCapacity();
    const warnings = validateRoute();
    const sortedStops = [...route.stops].sort((a, b) => a.order - b.order);
    const uniqueChildren = new Set(route.stops.map(s => s.scheduleId)).size;

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
                            disabled={route.stops.length === 0}
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
                                    {route.stops.length} {route.stops.length === 1 ? 'stop' : 'stopów'}
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
                            Stopy trasy ({route.stops.length})
                        </SectionTitle>
                        <DropZone
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            $isDragOver={isDragOver}
                            $isEmpty={route.stops.length === 0}
                            style={{
                                backgroundColor: isDragOver ? '#eff6ff' : undefined,
                                minHeight: route.stops.length === 0 ? '120px' : 'auto',
                            }}
                        >
                            {route.stops.length === 0 ? (
                                <EmptyDropZone>
                                    <Users size={28} />
                                    <div>
                                        {!route.vehicleId
                                            ? 'Najpierw wybierz pojazd'
                                            : 'Przeciągnij dzieci tutaj'}
                                    </div>
                                </EmptyDropZone>
                            ) : (
                                sortedStops.map((stop, idx) => {
                                    const adjacentGroup = adjacentAddressGroups.get(stop.id);
                                    const hasAdjacentAddress = adjacentGroup !== undefined;

                                    return (
                                        <RouteChildCard
                                            key={stop.id}
                                            draggable
                                            onDragStart={(e) => {
                                                e.stopPropagation();
                                                onDragStartStop(route.id, stop);
                                            }}
                                            onDragEnd={onDragEnd}
                                            onDragOver={(e) => {
                                                handleStopDragOver(e, idx);
                                                handleChildCardDragOver(e);
                                            }}
                                            onDrop={(e) => {
                                                handleStopDrop(e, idx);
                                                handleChildCardDrop(e);
                                            }}
                                            style={{
                                                borderTop: dragOverIndex === idx ? '2px solid #3b82f6' : undefined,
                                                borderLeft: hasAdjacentAddress ? '3px solid #8b5cf6' : undefined,
                                                backgroundColor: hasAdjacentAddress ? '#faf5ff' : undefined,
                                            }}
                                        >
                                            <OrderBadge>{stop.order}</OrderBadge>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#64748b' }}>
                                                <GripVertical size={16} />
                                            </div>
                                            <ChildInfo>
                                                <ChildName>
                                                    {stop.type === 'PICKUP' ? '📍 Odbiór' : '🏁 Dowóz'}: {stop.childName}
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
                                                        {stop.estimatedTime}
                                                    </div>
                                                    <div>
                                                        <MapPin size={11} style={{ display: 'inline', marginRight: 4 }} />
                                                        {stop.address.label} - {stop.address.street} {stop.address.houseNumber}
                                                        {stop.address.apartmentNumber && `/${stop.address.apartmentNumber}`}
                                                        , {stop.address.postalCode} {stop.address.city}
                                                    </div>
                                                    {(stop.transportNeeds.wheelchair || stop.transportNeeds.specialSeat) && (
                                                        <div style={{ display: 'flex', gap: '3px', marginTop: '3px' }}>
                                                            {stop.transportNeeds.wheelchair && (
                                                                <NeedBadge $variant="wheelchair">
                                                                    Wózek (2 miejsca)
                                                                </NeedBadge>
                                                            )}
                                                            {stop.transportNeeds.specialSeat && (
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
                                                        handleMoveStopUp(stop.id);
                                                    }}
                                                    disabled={idx === 0}
                                                    title="Przesuń w górę"
                                                >
                                                    <ArrowUp size={14} />
                                                </RemoveChildButton>
                                                <RemoveChildButton
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleMoveStopDown(stop.id);
                                                    }}
                                                    disabled={idx === sortedStops.length - 1}
                                                    title="Przesuń w dół"
                                                >
                                                    <ArrowDown size={14} />
                                                </RemoveChildButton>
                                                <RemoveChildButton
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onRemoveStop(route.id, stop.id);
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
                onSaveOrder={handleSaveOrderFromMap}
            />
        </>
    );
};