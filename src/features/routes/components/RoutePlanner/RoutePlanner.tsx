import React, { useState, useCallback, useMemo } from 'react';
import { Users, Truck, User, Clock, MapPin, X, AlertTriangle, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
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

    const { data: availableChildren, isLoading: isLoadingChildren, error: childrenError } = useAvailableChildren(
        selectedDate,
        !!selectedDate
    );
    const { data: driversData, isLoading: isLoadingDrivers, error: driversError } = useAvailableDrivers();
    const { data: vehiclesData, isLoading: isLoadingVehicles, error: vehiclesError } = useAvailableVehicles();
    const createRoute = useCreateRoute();

    const selectedVehicle = useMemo(
        () => vehiclesData?.content.find((v) => v.id === selectedVehicleId),
        [vehiclesData, selectedVehicleId]
    );

    const selectedDriver = useMemo(
        () => driversData?.content.find((d) => d.id === selectedDriverId),
        [driversData, selectedDriverId]
    );

    const availableChildrenFiltered = useMemo(
        () => availableChildren?.filter((child) => !routeChildren.find((rc) => rc.id === child.id)),
        [availableChildren, routeChildren]
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
        setIsDragOver(false);
    };

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

        if (draggedChild && !routeChildren.find((c) => c.id === draggedChild.id)) {
            const capacity = calculateCapacity();
            const additionalSeats = draggedChild.transportNeeds.wheelchair ? 2 : 1;

            if (selectedVehicle && capacity.used + additionalSeats > selectedVehicle.capacity.totalSeats) {
                toast.error('Przekroczono pojemność pojazdu!');
                setDraggedChild(null);
                return;
            }

            const newChild: RouteBuilderChild = {
                ...draggedChild,
                pickupOrder: routeChildren.length + 1,
                estimatedPickupTime: draggedChild.schedule.pickupTime,
                estimatedDropoffTime: draggedChild.schedule.dropoffTime,
            };
            setRouteChildren([...routeChildren, newChild]);
            toast.success(`Dodano ${draggedChild.firstName} ${draggedChild.lastName} do trasy`);
        }
        setDraggedChild(null);
    };

    const handleRemoveChild = (childId: string) => {
        const child = routeChildren.find((c) => c.id === childId);
        const updatedChildren = routeChildren
            .filter((c) => c.id !== childId)
            .map((c, index) => ({ ...c, pickupOrder: index + 1 }));
        setRouteChildren(updatedChildren);
        if (child) {
            toast.success(`Usunięto ${child.firstName} ${child.lastName} z trasy`);
        }
    };

    const handleSaveRoute = async () => {
        if (!routeName.trim()) {
            toast.error('Wprowadź nazwę trasy');
            return;
        }

        if (!selectedVehicleId) {
            toast.error('Wybierz pojazd');
            return;
        }

        if (!selectedDriverId) {
            toast.error('Wybierz kierowcę');
            return;
        }

        if (routeChildren.length === 0) {
            toast.error('Dodaj co najmniej jedno dziecko do trasy');
            return;
        }

        const capacity = calculateCapacity();
        if (capacity.overCapacity) {
            toast.error('Przekroczono pojemność pojazdu!');
            return;
        }

        const warnings = validateVehicleNeeds();
        if (warnings.length > 0) {
            toast.error(warnings[0]);
            return;
        }

        const earliestPickup = routeChildren.reduce((earliest, child) => {
            return child.estimatedPickupTime < earliest ? child.estimatedPickupTime : earliest;
        }, routeChildren[0].estimatedPickupTime);

        const latestDropoff = routeChildren.reduce((latest, child) => {
            return child.estimatedDropoffTime > latest ? child.estimatedDropoffTime : latest;
        }, routeChildren[0].estimatedDropoffTime);

        try {
            await createRoute.mutateAsync({
                routeName: routeName.trim(),
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

            setTimeout(() => {
                window.location.href = '/routes';
            }, 1500);
        } catch (error) {
            console.error('Błąd podczas tworzenia trasy:', error);
        }
    };

    const capacity = calculateCapacity();
    const warnings = validateVehicleNeeds();
    const canSave =
        routeName.trim() &&
        selectedVehicleId &&
        selectedDriverId &&
        routeChildren.length > 0 &&
        !capacity.overCapacity &&
        warnings.length === 0;

    if (childrenError || driversError || vehiclesError) {
        return (
            <Card>
                <Card.Content>
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>
                        <AlertTriangle size={48} style={{ margin: '0 auto 1rem' }} />
                        <p>Wystąpił błąd podczas ładowania danych.</p>
                        <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                            Odśwież stronę lub skontaktuj się z administratorem.
                        </p>
                    </div>
                </Card.Content>
            </Card>
        );
    }

    if (isLoadingChildren || isLoadingDrivers || isLoadingVehicles) {
        return <LoadingSpinner />;
    }

    const hasNoDrivers = !driversData?.content.length;
    const hasNoVehicles = !vehiclesData?.content.length;

    if (hasNoDrivers || hasNoVehicles) {
        return (
            <Card>
                <Card.Content>
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                        <AlertTriangle size={48} style={{ margin: '0 auto 1rem', color: '#f59e0b' }} />
                        <p style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                            Nie można zaplanować trasy
                        </p>
                        <p>
                            {hasNoDrivers && 'Brak dostępnych kierowców. '}
                            {hasNoVehicles && 'Brak dostępnych pojazdów. '}
                        </p>
                        <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                            Dodaj {hasNoDrivers ? 'kierowców' : ''}{hasNoDrivers && hasNoVehicles ? ' i ' : ''}{hasNoVehicles ? 'pojazdy' : ''} przed zaplanowaniem trasy.
                        </p>
                    </div>
                </Card.Content>
            </Card>
        );
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
                                onChange={(e) => {
                                    setSelectedDate(e.target.value);
                                    setRouteChildren([]);
                                }}
                                required
                                min={new Date().toISOString().split('T')[0]}
                            />
                            <Input
                                label="Nazwa trasy"
                                value={routeName}
                                onChange={(e) => setRouteName(e.target.value)}
                                placeholder="np. Trasa Mokotów A"
                                required
                                maxLength={255}
                            />
                            <Select
                                label="Pojazd"
                                value={selectedVehicleId}
                                onChange={(e) => {
                                    setSelectedVehicleId(e.target.value);
                                    setRouteChildren([]);
                                }}
                                options={
                                    vehiclesData?.content.map((v) => ({
                                        value: v.id,
                                        label: `${v.registrationNumber} - ${v.make} ${v.model} (${v.capacity.totalSeats} miejsc, ${v.capacity.wheelchairSpaces} na wózki)`,
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
                        <Card.Title>
                            Dostępne dzieci ({availableChildrenFiltered?.length || 0})
                        </Card.Title>
                    </Card.Header>
                    <Card.Content>
                        <SectionTitle>
                            <Calendar size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
                            Dzieci z harmonogramem na {new Date(selectedDate).toLocaleDateString('pl-PL', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                        })}
                        </SectionTitle>
                        {!availableChildrenFiltered?.length ? (
                            <div
                                style={{
                                    padding: '2rem',
                                    textAlign: 'center',
                                    color: '#64748b',
                                }}
                            >
                                <Users size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                                <p style={{ fontWeight: 500 }}>Brak dzieci z harmonogramem</p>
                                <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                                    {routeChildren.length > 0
                                        ? 'Wszystkie dostępne dzieci zostały już dodane do trasy'
                                        : 'Wybierz inną datę lub dodaj harmonogramy dla dzieci'}
                                </p>
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
                                        title="Przeciągnij do trasy"
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
                                                <NeedBadge $variant="wheelchair" title="Wymaga wózka inwalidzkiego (zajmuje 2 miejsca)">
                                                    Wózek (2 miejsca)
                                                </NeedBadge>
                                            )}
                                            {child.transportNeeds.specialSeat && (
                                                <NeedBadge $variant="seat" title="Wymaga specjalnego fotelika">
                                                    Fotelik
                                                </NeedBadge>
                                            )}
                                            {child.transportNeeds.safetyBelt && (
                                                <NeedBadge $variant="belt" title="Wymaga pasa bezpieczeństwa">
                                                    Pas
                                                </NeedBadge>
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
                                {selectedDate && `- ${new Date(selectedDate).toLocaleDateString('pl-PL', {
                                    weekday: 'short',
                                    day: 'numeric',
                                    month: 'long',
                                })}`}
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
                                    {routeChildren.length} {routeChildren.length === 1 ? 'dziecko' : 'dzieci'}
                                </MetadataItem>
                            </RouteMetadata>
                        </RouteInfo>
                        {selectedVehicle && (
                            <CapacityIndicator>
                                <CapacityText $warning={capacity.overCapacity}>
                                    {capacity.used} / {capacity.total} miejsc
                                    {capacity.overCapacity && ' ⚠'}
                                </CapacityText>
                                <CapacityBar
                                    $percentage={capacity.percentage}
                                    $overCapacity={capacity.overCapacity}
                                    title={`Wykorzystano ${capacity.used} z ${capacity.total} miejsc (${Math.round(capacity.percentage)}%)`}
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
                                <div style={{ fontSize: '1rem', fontWeight: 500, marginBottom: '0.25rem' }}>
                                    Przeciągnij dzieci tutaj
                                </div>
                                <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                                    Dodaj dzieci z listy po lewej stronie, aby utworzyć trasę
                                </div>
                            </EmptyDropZone>
                        ) : (
                            routeChildren.map((child) => (
                                <RouteChildCard key={child.id}>
                                    <OrderBadge title={`Kolejność odbioru: ${child.pickupOrder}`}>
                                        {child.pickupOrder}
                                    </OrderBadge>
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
                                                <div style={{ color: '#d97706', fontWeight: 500, fontSize: '0.8125rem' }}>
                                                    <AlertTriangle size={12} style={{ display: 'inline', marginRight: 4 }} />
                                                    Wymaga wózka inwalidzkiego (zajmuje 2 miejsca)
                                                </div>
                                            )}
                                        </RouteChildDetails>
                                    </RouteChildInfo>
                                    <RouteChildActions>
                                        <RemoveButton
                                            onClick={() => handleRemoveChild(child.id)}
                                            title="Usuń z trasy"
                                            aria-label={`Usuń ${child.firstName} ${child.lastName} z trasy`}
                                        >
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

                    <SaveButton
                        onClick={handleSaveRoute}
                        disabled={!canSave || createRoute.isPending}
                        title={!canSave ? 'Uzupełnij wszystkie wymagane pola' : 'Zapisz trasę'}
                    >
                        {createRoute.isPending ? 'Zapisywanie...' : 'Zapisz trasę'}
                    </SaveButton>
                </RouteBuilderContainer>
            </RightPanel>
        </PlannerContainer>
    );
};