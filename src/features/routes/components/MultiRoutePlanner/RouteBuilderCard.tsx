import React, { useState, useCallback } from 'react';
import { X, Trash2, AlertTriangle, User, Truck, Users, MapPin, Clock, Map as MapIcon } from 'lucide-react';
import { Input } from '@/shared/ui/Input';
import { Select } from '@/shared/ui/Select';
import { Button } from '@/shared/ui/Button';
import { AvailableChild } from '../../types';
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

// Klucz API Google Maps - przenieś to do zmiennych środowiskowych
const GOOGLE_MAPS_API_KEY = '';

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
    const [isMapModalOpen, setIsMapModalOpen] = useState(false);

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

    // Przygotuj punkty trasy dla mapy
    const getRoutePoints = useCallback(() => {
        const points: Array<{
            address: string;
            lat: number;
            lng: number;
            type: 'pickup' | 'dropoff';
            childName: string;
            order: number;
        }> = [];

        route.children.forEach((child) => {
            // Punkt odbioru
            points.push({
                address: `${child.schedule.pickupAddress.street} ${child.schedule.pickupAddress.houseNumber}, ${child.schedule.pickupAddress.city}`,
                lat: 52.2297 + Math.random() * 0.1, // TODO: Zamień na rzeczywiste współrzędne z API
                lng: 21.0122 + Math.random() * 0.1,
                type: 'pickup',
                childName: `${child.firstName} ${child.lastName}`,
                order: child.pickupOrder * 2 - 1,
            });

            // Punkt dowozu
            points.push({
                address: `${child.schedule.dropoffAddress.street} ${child.schedule.dropoffAddress.houseNumber}, ${child.schedule.dropoffAddress.city}`,
                lat: 52.2297 + Math.random() * 0.1, // TODO: Zamień na rzeczywiste współrzędne z API
                lng: 21.0122 + Math.random() * 0.1,
                type: 'dropoff',
                childName: `${child.firstName} ${child.lastName}`,
                order: child.pickupOrder * 2,
            });
        });

        // Sortuj punkty po kolejności
        return points.sort((a, b) => a.order - b.order);
    }, [route.children]);

    const handleShowMap = useCallback(() => {
        if (route.children.length === 0) {
            alert('Dodaj dzieci do trasy, aby zobaczyć mapę');
            return;
        }
        if (!GOOGLE_MAPS_API_KEY) {
            alert('Brak klucza API Google Maps. Skonfiguruj REACT_APP_GOOGLE_MAPS_API_KEY');
            return;
        }
        setIsMapModalOpen(true);
    }, [route.children.length]);

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

        if (draggedFromRoute && draggedFromRoute !== route.id) {
            onMoveChildBetweenRoutes(draggedFromRoute, route.id, draggedChild.id);
        } else if (!draggedFromRoute) {
            const capacity = calculateCapacity();
            const additionalSeats = draggedChild.transportNeeds.wheelchair ? 2 : 1;

            if (selectedVehicle && capacity.used + additionalSeats > selectedVehicle.capacity.totalSeats) {
                return;
            }

            onAddChild(route.id, draggedChild);
        }
    };

    const capacity = calculateCapacity();
    const warnings = validateRoute();

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
                            disabled={route.children.length === 0}
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
                                    {route.children.length} {route.children.length === 1 ? 'dziecko' : 'dzieci'}
                                </MetadataItem>
                            </MetadataBar>

                            <CapacitySection>
                                <CapacityLabel $warning={capacity.overCapacity}>
                                    Miejsca: {capacity.used} / {capacity.total}
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
                            Dzieci ({route.children.length})
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
                                    <Users size={28} />
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
                                                    <Clock size={11} style={{ display: 'inline', marginRight: 4 }} />
                                                    {child.schedule.pickupTime} - {child.schedule.dropoffTime}
                                                </div>
                                                <div>
                                                    <MapPin size={11} style={{ display: 'inline', marginRight: 4 }} />
                                                    {child.schedule.pickupAddress.label} → {child.schedule.dropoffAddress.label}
                                                </div>
                                                {(child.transportNeeds.wheelchair ||
                                                    child.transportNeeds.specialSeat) && (
                                                    <div style={{ display: 'flex', gap: '3px', marginTop: '3px' }}>
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
                                                <X size={14} />
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