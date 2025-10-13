import React, { useState, useCallback } from 'react';
import { Users, Truck, User, Clock, MapPin, X, AlertTriangle } from 'lucide-react';
import { useAvailableChildren } from '../../hooks/useAvailableChildren';
import { useAvailableDrivers } from '../../hooks/useAvailableDrivers';
import { useAvailableVehicles } from '../../hooks/useAvailableVehicles';
import { useCreateRoute } from '../../hooks/useCreateRoute';
import { Input } from '@/shared/ui/Input';
import { Select } from '@/shared/ui/Select';
import { Card } from '@/shared/ui/Card';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { AvailableChild, RouteBuilderChild } from '../../types';
import {
    PlannerContainer,
    LeftPanel,
    RightPanel,
    SectionTitle,
    ChildrenList,
    ChildCard,
    ChildName,
    ChildInfo,
    NeedsIndicators,
    NeedBadge,
    RouteBuilderContainer,
    RouteBuilderHeader,
    RouteInfo,
    RouteTitle,
    RouteMetadata,
    MetadataItem,
    CapacityIndicator,
    CapacityBar,
    CapacityText,
    DropZone,
    EmptyDropZone,
    EmptyDropZoneIcon,
    RouteChildCard,
    OrderBadge,
    RouteChildInfo,
    RouteChildName,
    RouteChildDetails,
    RouteChildActions,
    RemoveButton,
    SaveButton,
    ValidationWarning,
} from './RoutePlanner.styles';

export const RoutePlanner: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<string>(
        new Date().toISOString().split('T')[0]
    );
    const [routeName, setRouteName] = useState('');
    const [selectedVehicleId, setSelectedVehicleId] = useState('');
    const [selectedDriverId, setSelectedDriverId] = useState('');
    const [routeChildren, setRouteChildren] = useState<RouteBuilderChild[]>([]);
    const [draggedChild, setDraggedChild] = useState<AvailableChild | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);

    const { data: availableChildren, isLoading: isLoadingChildren } = useAvailableChildren(
        selectedDate,
        !!selectedDate
    );
    const { data: driversData, isLoading: isLoadingDrivers } = useAvailableDrivers();
    const { data: vehiclesData, isLoading: isLoadingVehicles } = useAvailableVehicles();
    const createRoute = useCreateRoute();

    const selectedVehicle = vehiclesData?.content.find((v) => v.id === selectedVehicleId);
    const selectedDriver = driversData?.content.find((d) => d.id === selectedDriverId);

    const availableChildrenFiltered = availableChildren?.filter(
        (child) => !routeChildren.find((rc) => rc.id === child.id)
    );

    const calculateCapacity = useCallback(() => {
        if (!selectedVehicle) return { used: 0, total: 0, percentage: 0, overCapacity: false };

        let used = 0;
        routeChildren.forEach((child) => {
            if (child.transportNeeds.wheelchair) {
                used += 2;
            } else {
                used += 1;
            }
        });

        const total = selectedVehicle.capacity.totalSeats;
        const percentage = (used / total) * 100;
        const overCapacity = used > total;

        return { used, total, percentage, overCapacity };
    }, [selectedVehicle, routeChildren]);

    const validateVehicleNeeds = useCallback(() => {
        if (!selectedVehicle) return [];

        const warnings: string[] = [];
        const wheelchairCount = routeChildren.filter(
            (c) => c.transportNeeds.wheelchair
        ).length;

        if (wheelchairCount > selectedVehicle.capacity.wheelchairSpaces) {
            warnings.push(
                `Pojazd ma tylko ${selectedVehicle.capacity.wheelchairSpaces} miejsc na wózki, a potrzeba ${wheelchairCount}`
            );
        }

        return warnings;
    }, [selectedVehicle, routeChildren]);

    const handleDragStart = (child: AvailableChild) => {
        setDraggedChild(child);
    };

    const handleDragEnd = () => {
        setDraggedChild(null);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);

        if (draggedChild && !routeChildren.find((c) => c.id === draggedChild.id)) {
            const newChild: RouteBuilderChild = {
                ...draggedChild,
                pickupOrder: routeChildren.length + 1,
                estimatedPickupTime: draggedChild.schedule.pickupTime,
                estimatedDropoffTime: draggedChild.schedule.dropoffTime,
            };
            setRouteChildren([...routeChildren, newChild]);
        }
        setDraggedChild(null);
    };

    const handleRemoveChild = (childId: string) => {
        const updatedChildren = routeChildren
            .filter((c) => c.id !== childId)
            .map((c, index) => ({ ...c, pickupOrder: index + 1 }));
        setRouteChildren(updatedChildren);
    };

    const handleSaveRoute = async () => {
        if (!routeName || !selectedVehicleId || !selectedDriverId || routeChildren.length === 0) {
            return;
        }

        const capacity = calculateCapacity();
        if (capacity.overCapacity) {
            return;
        }

        const warnings = validateVehicleNeeds();
        if (warnings.length > 0) {
            return;
        }

        const earliestPickup = routeChildren.reduce((earliest, child) => {
            return child.estimatedPickupTime < earliest ? child.estimatedPickupTime : earliest;
        }, routeChildren[0].estimatedPickupTime);

        const latestDropoff = routeChildren.reduce((latest, child) => {
            return child.estimatedDropoffTime > latest ? child.estimatedDropoffTime : latest;
        }, routeChildren[0].estimatedDropoffTime);

        await createRoute.mutateAsync({
            routeName,
            date: selectedDate,
            driverId: selectedDriverId,
            vehicleId: selectedVehicleId,
            estimatedStartTime: earliestPickup,
            estimatedEndTime: latestDropoff,
            children: routeChildren.map((child) => ({
                childId: child.id,
                scheduleId: child.schedule.id,
                pickupOrder: child.pickupOrder,
                estimatedPickupTime: child.estimatedPickupTime,
                estimatedDropoffTime: child.estimatedDropoffTime,
            })),
        });

        setRouteName('');
        setSelectedVehicleId('');
        setSelectedDriverId('');
        setRouteChildren([]);
    };

    const capacity = calculateCapacity();
    const warnings = validateVehicleNeeds();
    const canSave =
        routeName &&
        selectedVehicleId &&
        selectedDriverId &&
        routeChildren.length > 0 &&
        !capacity.overCapacity &&
        warnings.length === 0;

    if (isLoadingChildren || isLoadingDrivers || isLoadingVehicles) {
        return <LoadingSpinner />;
    }

    return (
        <PlannerContainer>
            <LeftPanel>
                <Card>
                    <Card.Header>
                        <Card.Title>Parametry trasy</Card.Title>
                    </Card.Header>
                    <Card.Content>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <Input
                                label="Data"
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                required
                            />
                            <Input
                                label="Nazwa trasy"
                                value={routeName}
                                onChange={(e) => setRouteName(e.target.value)}
                                placeholder="np. Trasa Mokotów A"
                                required
                            />
                            <Select
                                label="Pojazd"
                                value={selectedVehicleId}
                                onChange={(e) => setSelectedVehicleId(e.target.value)}
                                options={
                                    vehiclesData?.content.map((v) => ({
                                        value: v.id,
                                        label: `${v.registrationNumber} - ${v.make} ${v.model} (${v.capacity.totalSeats} miejsc)`,
                                    })) || []
                                }
                                required
                            />
                            <Select
                                label="Kierowca"
                                value={selectedDriverId}
                                onChange={(e) => setSelectedDriverId(e.target.value)}
                                options={
                                    driversData?.content.map((d) => ({
                                        value: d.id,
                                        label: `${d.firstName} ${d.lastName}`,
                                    })) || []
                                }
                                required
                            />
                        </div>
                    </Card.Content>
                </Card>

                <Card>
                    <Card.Header>
                        <Card.Title>Dostępne dzieci ({availableChildrenFiltered?.length || 0})</Card.Title>
                    </Card.Header>
                    <Card.Content>
                        <SectionTitle>
                            Dzieci z harmonogramem na {new Date(selectedDate).toLocaleDateString('pl-PL')}
                        </SectionTitle>
                        {!availableChildrenFiltered?.length ? (
                            <div
                                style={{
                                    padding: '2rem',
                                    textAlign: 'center',
                                    color: '#64748b',
                                }}
                            >
                                Brak dzieci z harmonogramem na wybrany dzień
                            </div>
                        ) : (
                            <ChildrenList>
                                {availableChildrenFiltered.map((child) => (
                                    <ChildCard
                                        key={child.id}
                                        draggable
                                        onDragStart={() => handleDragStart(child)}
                                        onDragEnd={handleDragEnd}
                                        $isDragging={draggedChild?.id === child.id}
                                    >
                                        <ChildName>
                                            {child.firstName} {child.lastName}, {child.age} lat
                                        </ChildName>
                                        <ChildInfo>
                                            <Clock size={14} />
                                            {child.schedule.pickupTime} - {child.schedule.dropoffTime}
                                        </ChildInfo>
                                        <ChildInfo>
                                            <MapPin size={14} />
                                            {child.schedule.pickupAddress.label} →{' '}
                                            {child.schedule.dropoffAddress.label}
                                        </ChildInfo>
                                        <NeedsIndicators>
                                            {child.transportNeeds.wheelchair && (
                                                <NeedBadge $variant="wheelchair">Wózek</NeedBadge>
                                            )}
                                            {child.transportNeeds.specialSeat && (
                                                <NeedBadge $variant="seat">Fotelik</NeedBadge>
                                            )}
                                            {child.transportNeeds.safetyBelt && (
                                                <NeedBadge $variant="belt">Pas</NeedBadge>
                                            )}
                                        </NeedsIndicators>
                                    </ChildCard>
                                ))}
                            </ChildrenList>
                        )}
                    </Card.Content>
                </Card>
            </LeftPanel>

            <RightPanel>
                <RouteBuilderContainer>
                    <RouteBuilderHeader>
                        <RouteInfo>
                            <RouteTitle>
                                {routeName || 'Nowa trasa'}{' '}
                                {selectedDate && `- ${new Date(selectedDate).toLocaleDateString('pl-PL')}`}
                            </RouteTitle>
                            <RouteMetadata>
                                {selectedDriver && (
                                    <MetadataItem>
                                        <User size={16} />
                                        {selectedDriver.firstName} {selectedDriver.lastName}
                                    </MetadataItem>
                                )}
                                {selectedVehicle && (
                                    <MetadataItem>
                                        <Truck size={16} />
                                        {selectedVehicle.registrationNumber}
                                    </MetadataItem>
                                )}
                                <MetadataItem>
                                    <Users size={16} />
                                    {routeChildren.length} dzieci
                                </MetadataItem>
                            </RouteMetadata>
                        </RouteInfo>
                        {selectedVehicle && (
                            <CapacityIndicator>
                                <CapacityText $warning={capacity.overCapacity}>
                                    {capacity.used} / {capacity.total} miejsc
                                </CapacityText>
                                <CapacityBar
                                    $percentage={capacity.percentage}
                                    $overCapacity={capacity.overCapacity}
                                />
                            </CapacityIndicator>
                        )}
                    </RouteBuilderHeader>

                    <DropZone
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        $isDragOver={isDragOver}
                        $isEmpty={routeChildren.length === 0}
                    >
                        {routeChildren.length === 0 ? (
                            <EmptyDropZone>
                                <EmptyDropZoneIcon>
                                    <Users size={32} />
                                </EmptyDropZoneIcon>
                                <div>Przeciągnij dzieci tutaj, aby dodać do trasy</div>
                            </EmptyDropZone>
                        ) : (
                            routeChildren.map((child) => (
                                <RouteChildCard key={child.id}>
                                    <OrderBadge>{child.pickupOrder}</OrderBadge>
                                    <RouteChildInfo>
                                        <RouteChildName>
                                            {child.firstName} {child.lastName}
                                        </RouteChildName>
                                        <RouteChildDetails>
                                            <div>
                                                <Clock size={12} style={{ display: 'inline', marginRight: 4 }} />
                                                Odbiór: {child.estimatedPickupTime} - Dowóz:{' '}
                                                {child.estimatedDropoffTime}
                                            </div>
                                            <div>
                                                <MapPin size={12} style={{ display: 'inline', marginRight: 4 }} />
                                                {child.schedule.pickupAddress.label} →{' '}
                                                {child.schedule.dropoffAddress.label}
                                            </div>
                                            {child.transportNeeds.wheelchair && (
                                                <div style={{ color: '#d97706', fontWeight: 500 }}>
                                                    ⚠ Wymaga wózka inwalidzkiego
                                                </div>
                                            )}
                                        </RouteChildDetails>
                                    </RouteChildInfo>
                                    <RouteChildActions>
                                        <RemoveButton onClick={() => handleRemoveChild(child.id)}>
                                            <X size={16} />
                                        </RemoveButton>
                                    </RouteChildActions>
                                </RouteChildCard>
                            ))
                        )}
                    </DropZone>

                    {warnings.length > 0 && (
                        <ValidationWarning>
                            <AlertTriangle size={16} />
                            <div>
                                {warnings.map((warning, index) => (
                                    <div key={index}>{warning}</div>
                                ))}
                            </div>
                        </ValidationWarning>
                    )}

                    {capacity.overCapacity && (
                        <ValidationWarning>
                            <AlertTriangle size={16} />
                            Przekroczono pojemność pojazdu! Usuń część dzieci lub wybierz większy pojazd.
                        </ValidationWarning>
                    )}

                    <SaveButton onClick={handleSaveRoute} disabled={!canSave || createRoute.isPending}>
                        {createRoute.isPending ? 'Zapisywanie...' : 'Zapisz trasę'}
                    </SaveButton>
                </RouteBuilderContainer>
            </RightPanel>
        </PlannerContainer>
    );
};