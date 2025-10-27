import React, { useState, useCallback } from 'react';
import { X, Trash2, AlertTriangle, User, Truck, Users, MapPin, Clock } from 'lucide-react';
import { Input } from '@/shared/ui/Input';
import { Select } from '@/shared/ui/Select';
import { Badge } from '@/shared/ui/Badge';
import { AvailableChild } from '../../types';
import { RouteBuilder } from './MultiRoutePlanner';
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
    draggedChild: AvailableChild | null;
    draggedFromRoute: string | null;
    onUpdate: (routeId: string, updates: Partial<RouteBuilder>) => void;
    onRemove: (routeId: string) => void;
    onAddChild: (routeId: string, child: AvailableChild) => void;
    onRemoveChild: (routeId: string, childId: string) => void;
    onMoveChildBetweenRoutes: (fromRouteId: string, toRouteId: string, childId: string) => void;
    onDragStart: (child: AvailableChild, fromRouteId?: string) => void;
    onDragEnd: () => void;
}

export const RouteBuilderCard: React.FC<RouteBuilderCardProps> = ({
                                                                      route,
                                                                      index,
                                                                      drivers,
                                                                      vehicles,
                                                                      draggedChild,
                                                                      draggedFromRoute,
                                                                      onUpdate,
                                                                      onRemove,
                                                                      onAddChild,
                                                                      onRemoveChild,
                                                                      onMoveChildBetweenRoutes,
                                                                      onDragStart,
                                                                      onDragEnd,
                                                                  }) => {
    const [isDragOver, setIsDragOver] = useState(false);

    const selectedVehicle = vehicles.find(v => v.id === route.vehicleId);
    const selectedDriver = drivers.find(d => d.id === route.driverId);

    const calculateCapacity = useCallback(() => {
        if (!selectedVehicle) return { used: 0, total: 0, percentage: 0, overCapacity: false };

        const used = route.children.reduce((sum, child) => {
            return sum + (child.transportNeeds.wheelchair ? 2 : 1);
        }, 0);

        const total = selectedVehicle.capacity.totalSeats;
        const percentage = (used / total) * 100;
        const overCapacity = used > total;

        return { used, total, percentage, overCapacity };
    }, [selectedVehicle, route.children]);

    const validateRoute = useCallback(() => {
        const warnings: string[] = [];

        if (!selectedVehicle) return warnings;

        const wheelchairCount = route.children.filter(
            c => c.transportNeeds.wheelchair
        ).length;

        if (wheelchairCount > selectedVehicle.capacity.wheelchairSpaces) {
            warnings.push(
                `Pojazd ma tylko ${selectedVehicle.capacity.wheelchairSpaces} miejsc na wózki, a potrzeba ${wheelchairCount}`
            );
        }

        const capacity = calculateCapacity();
        if (capacity.overCapacity) {
            warnings.push('Przekroczono pojemność pojazdu!');
        }

        return warnings;
    }, [selectedVehicle, route.children, calculateCapacity]);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        if (e.currentTarget === e.target) {
            setIsDragOver(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);

        if (!draggedChild) return;

        // Check if dropping from another route
        if (draggedFromRoute && draggedFromRoute !== route.id) {
            // Moving between routes
            onMoveChildBetweenRoutes(draggedFromRoute, route.id, draggedChild.id);
        } else if (!draggedFromRoute) {
            // Adding from pool
            const capacity = calculateCapacity();
            const additionalSeats = draggedChild.transportNeeds.wheelchair ? 2 : 1;

            if (selectedVehicle && capacity.used + additionalSeats > selectedVehicle.capacity.totalSeats) {
                // Validation will show error
                return;
            }

            onAddChild(route.id, draggedChild);
        }
    };

    const capacity = calculateCapacity();
    const warnings = validateRoute();

    return (
        <RouteCard>
            <RouteCardHeader>
                <RouteCardHeaderLeft>
                    <RouteCardNumber>#{index + 1}</RouteCardNumber>
                    <RouteCardTitle>
                        {route.routeName || `Trasa ${index + 1}`}
                    </RouteCardTitle>
                </RouteCardHeaderLeft>
                <RouteCardHeaderRight>
                    <RemoveRouteButton
                        onClick={() => {
                            if (window.confirm('Czy na pewno chcesz usunąć tę trasę?')) {
                                onRemove(route.id);
                            }
                        }}
                        title="Usuń trasę"
                    >
                        <Trash2 size={18} />
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

                {selectedVehicle && (
                    <>
                        <MetadataBar>
                            {selectedDriver && (
                                <MetadataItem>
                                    <User size={14} />
                                    {selectedDriver.firstName} {selectedDriver.lastName}
                                </MetadataItem>
                            )}
                            {selectedVehicle && (
                                <MetadataItem>
                                    <Truck size={14} />
                                    {selectedVehicle.registrationNumber}
                                </MetadataItem>
                            )}
                            <MetadataItem>
                                <Users size={14} />
                                {route.children.length} {route.children.length === 1 ? 'dziecko' : 'dzieci'}
                            </MetadataItem>
                        </MetadataBar>

                        <CapacitySection>
                            <CapacityLabel $warning={capacity.overCapacity}>
                                Wykorzystanie miejsc: {capacity.used} / {capacity.total}
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
                        Dzieci na trasie ({route.children.length})
                    </SectionTitle>
                    <DropZone
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        $isDragOver={isDragOver}
                        $isEmpty={route.children.length === 0}
                    >
                        {route.children.length === 0 ? (
                            <EmptyDropZone>
                                <Users size={32} />
                                <div>Przeciągnij dzieci tutaj</div>
                            </EmptyDropZone>
                        ) : (
                            route.children.map((child) => (
                                <RouteChildCard
                                    key={child.id}
                                    draggable
                                    onDragStart={() => onDragStart(child, route.id)}
                                    onDragEnd={onDragEnd}
                                >
                                    <OrderBadge>{child.pickupOrder}</OrderBadge>
                                    <ChildInfo>
                                        <ChildName>
                                            {child.firstName} {child.lastName}
                                        </ChildName>
                                        <ChildDetails>
                                            <div>
                                                <Clock size={12} style={{ display: 'inline', marginRight: 4 }} />
                                                {child.schedule.pickupTime} - {child.schedule.dropoffTime}
                                            </div>
                                            <div>
                                                <MapPin size={12} style={{ display: 'inline', marginRight: 4 }} />
                                                {child.schedule.pickupAddress.label} → {child.schedule.dropoffAddress.label}
                                            </div>
                                            {(child.transportNeeds.wheelchair ||
                                                child.transportNeeds.specialSeat) && (
                                                <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                                                    {child.transportNeeds.wheelchair && (
                                                        <NeedBadge $variant="wheelchair">
                                                            Wózek (2 miejsca)
                                                        </NeedBadge>
                                                    )}
                                                    {child.transportNeeds.specialSeat && (
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
                                                onRemoveChild(route.id, child.id);
                                            }}
                                            title="Usuń z trasy"
                                        >
                                            <X size={16} />
                                        </RemoveChildButton>
                                    </ChildActions>
                                </RouteChildCard>
                            ))
                        )}
                    </DropZone>
                </ChildrenSection>

                {warnings.length > 0 && (
                    <ValidationWarnings>
                        {warnings.map((warning, idx) => (
                            <WarningItem key={idx}>
                                <AlertTriangle size={16} />
                                {warning}
                            </WarningItem>
                        ))}
                    </ValidationWarnings>
                )}
            </RouteCardBody>
        </RouteCard>
    );
};