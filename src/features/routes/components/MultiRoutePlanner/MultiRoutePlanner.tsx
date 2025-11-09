// src/features/routes/components/MultiRoutePlanner/MultiRoutePlanner.tsx

import React, { useState, useCallback, useMemo } from 'react';
import { Plus, Save, Calendar, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAvailableChildren } from '../../hooks/useAvailableChildren';
import { useAvailableDrivers } from '../../hooks/useAvailableDrivers';
import { useAvailableVehicles } from '../../hooks/useAvailableVehicles';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { AvailableChild, ChildSchedule, LocalRouteStop } from '../../types';
import { RouteBuilderCard } from './RouteBuilderCard';
import { ChildrenPool } from './ChildrenPool';
import {
    PlannerContainer,
    TopSection,
    GlobalControls,
    DateSection,
    DateLabel,
    DateInfo,
    ActionsSection,
    ChildrenPoolSection,
    RoutesSection,
    RoutesGrid,
    AddRouteCard,
    AddRouteButton,
    AddRouteText,
    EmptyState,
    EmptyIcon,
    EmptyText,
    BulkActions,
    SaveAllButton,
    StatsBar,
    StatItem,
    StatValue,
    StatLabel,
} from './MultiRoutePlanner.styles';

export interface RouteBuilder {
    id: string;
    routeName: string;
    vehicleId: string;
    driverId: string;
    stops: LocalRouteStop[];
}

interface ChildScheduleItem {
    child: AvailableChild;
    schedule: ChildSchedule;
}

export const MultiRoutePlanner: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<string>(
        new Date().toISOString().split('T')[0]
    );
    const [routes, setRoutes] = useState<RouteBuilder[]>([]);
    const [draggedItem, setDraggedItem] = useState<{ child: AvailableChild; schedule: ChildSchedule } | null>(null);
    const [draggedStop, setDraggedStop] = useState<{ routeId: string; stop: LocalRouteStop } | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isPoolCollapsed, setIsPoolCollapsed] = useState(false);

    const { data: availableChildren, isLoading: isLoadingChildren } = useAvailableChildren(
        selectedDate,
        !!selectedDate
    );
    const { data: driversData, isLoading: isLoadingDrivers } = useAvailableDrivers();
    const { data: vehiclesData, isLoading: isLoadingVehicles } = useAvailableVehicles();

    const childScheduleItems = useMemo<ChildScheduleItem[]>(() => {
        if (!availableChildren) return [];
        return availableChildren.map(item => ({
            child: item,
            schedule: item.schedule
        }));
    }, [availableChildren]);

    const unassignedItems = useMemo(() => {
        const assignedScheduleIds = new Set(
            routes.flatMap(route => route.stops.map(s => s.scheduleId))
        );
        return childScheduleItems.filter(item => !assignedScheduleIds.has(item.schedule.id));
    }, [childScheduleItems, routes]);

    const handleAddRoute = useCallback(() => {
        const newRoute: RouteBuilder = {
            id: `route-${Date.now()}`,
            routeName: '',
            vehicleId: '',
            driverId: '',
            stops: [],
        };
        setRoutes(prev => [...prev, newRoute]);
    }, []);

    const handleRemoveRoute = useCallback((routeId: string) => {
        setRoutes(prev => prev.filter(r => r.id !== routeId));
    }, []);

    const handleUpdateRoute = useCallback((routeId: string, updates: Partial<RouteBuilder>) => {
        setRoutes(prev =>
            prev.map(route =>
                route.id === routeId ? { ...route, ...updates } : route
            )
        );
    }, []);

    const handleAddStopsToRoute = useCallback((routeId: string, child: AvailableChild, schedule: ChildSchedule) => {
        const route = routes.find(r => r.id === routeId);
        if (!route) {
            toast.error('Nie znaleziono trasy');
            return false;
        }

        if (!route.vehicleId) {
            toast.error('Najpierw wybierz pojazd dla tej trasy');
            return false;
        }

        const alreadyInRoute = route.stops.find(s => s.scheduleId === schedule.id);
        if (alreadyInRoute) {
            toast.error(`${child.firstName} ${child.lastName} jest już w tej trasie`);
            return false;
        }

        if (vehiclesData) {
            const vehicle = vehiclesData.content.find(v => v.id === route.vehicleId);
            if (vehicle) {
                const sortedStops = [...route.stops].sort((a, b) => a.order - b.order);
                const inVehicleSchedules = new Map<string, { wheelchair: boolean }>();
                let maxSeatsNeeded = 0;

                sortedStops.forEach(stop => {
                    if (stop.type === 'PICKUP') {
                        inVehicleSchedules.set(stop.scheduleId, { wheelchair: stop.transportNeeds.wheelchair });
                    } else {
                        inVehicleSchedules.delete(stop.scheduleId);
                    }

                    let currentSeats = 0;
                    inVehicleSchedules.forEach(({ wheelchair }) => {
                        currentSeats += wheelchair ? 2 : 1;
                    });
                    maxSeatsNeeded = Math.max(maxSeatsNeeded, currentSeats);
                });

                const additionalSeats = child.transportNeeds.wheelchair ? 2 : 1;
                const newMaxSeats = maxSeatsNeeded + additionalSeats;

                if (newMaxSeats > vehicle.capacity.totalSeats) {
                    toast.error(`Przekroczono pojemność pojazdu! (${newMaxSeats}/${vehicle.capacity.totalSeats} miejsc)`);
                    return false;
                }

                const wheelchairCount = Array.from(inVehicleSchedules.values()).filter(v => v.wheelchair).length;
                if (child.transportNeeds.wheelchair && wheelchairCount >= vehicle.capacity.wheelchairSpaces) {
                    toast.error(`Brak miejsc na wózki! (${wheelchairCount}/${vehicle.capacity.wheelchairSpaces})`);
                    return false;
                }
            }
        }

        setRoutes(prev =>
            prev.map(r => {
                if (r.id !== routeId) return r;

                const currentMaxOrder = r.stops.length > 0
                    ? Math.max(...r.stops.map(s => s.order))
                    : 0;

                const pickupStop: LocalRouteStop = {
                    id: `stop-${Date.now()}-pickup`,
                    type: 'PICKUP',
                    childId: child.id,
                    scheduleId: schedule.id,
                    order: currentMaxOrder + 1,
                    address: schedule.pickupAddress,
                    estimatedTime: schedule.pickupTime,
                    childName: `${child.firstName} ${child.lastName}`,
                    childAge: child.age,
                    guardianName: `${child.guardian.firstName} ${child.guardian.lastName}`,
                    guardianPhone: child.guardian.phone,
                    transportNeeds: child.transportNeeds,
                };

                const dropoffStop: LocalRouteStop = {
                    id: `stop-${Date.now()}-dropoff`,
                    type: 'DROPOFF',
                    childId: child.id,
                    scheduleId: schedule.id,
                    order: currentMaxOrder + 2,
                    address: schedule.dropoffAddress,
                    estimatedTime: schedule.dropoffTime,
                    childName: `${child.firstName} ${child.lastName}`,
                    childAge: child.age,
                    guardianName: `${child.guardian.firstName} ${child.guardian.lastName}`,
                    guardianPhone: child.guardian.phone,
                    transportNeeds: child.transportNeeds,
                };

                return {
                    ...r,
                    stops: [...r.stops, pickupStop, dropoffStop],
                };
            })
        );

        toast.success(`Dodano ${child.firstName} ${child.lastName} do trasy`);
        return true;
    }, [routes, vehiclesData]);

    const handleRemoveStopFromRoute = useCallback((routeId: string, stopId: string) => {
        setRoutes(prev =>
            prev.map(route => {
                if (route.id !== routeId) return route;

                const stopToRemove = route.stops.find(s => s.id === stopId);
                if (!stopToRemove) return route;

                const updatedStops = route.stops
                    .filter(s => s.scheduleId !== stopToRemove.scheduleId)
                    .map((s, index) => ({ ...s, order: index + 1 }));

                return { ...route, stops: updatedStops };
            })
        );
    }, []);

    const handleReorderStops = useCallback((routeId: string, stops: LocalRouteStop[]) => {
        setRoutes(prev =>
            prev.map(route => {
                if (route.id !== routeId) return route;
                return { ...route, stops: stops.map((s, index) => ({ ...s, order: index + 1 })) };
            })
        );
    }, []);

    const handleMoveStopBetweenRoutes = useCallback(
        (fromRouteId: string, toRouteId: string, stopId: string) => {
            const fromRoute = routes.find(r => r.id === fromRouteId);
            const stopToMove = fromRoute?.stops.find(s => s.id === stopId);

            if (!stopToMove) return;

            const scheduleStops = fromRoute!.stops.filter(s => s.scheduleId === stopToMove.scheduleId);

            const toRoute = routes.find(r => r.id === toRouteId);
            if (toRoute && toRoute.vehicleId && vehiclesData) {
                const vehicle = vehiclesData.content.find(v => v.id === toRoute.vehicleId);
                if (vehicle) {
                    const sortedStops = [...toRoute.stops].sort((a, b) => a.order - b.order);
                    const inVehicleSchedules = new Map<string, { wheelchair: boolean }>();
                    let maxSeatsNeeded = 0;

                    sortedStops.forEach(stop => {
                        if (stop.type === 'PICKUP') {
                            inVehicleSchedules.set(stop.scheduleId, { wheelchair: stop.transportNeeds.wheelchair });
                        } else {
                            inVehicleSchedules.delete(stop.scheduleId);
                        }

                        let currentSeats = 0;
                        inVehicleSchedules.forEach(({ wheelchair }) => {
                            currentSeats += wheelchair ? 2 : 1;
                        });
                        maxSeatsNeeded = Math.max(maxSeatsNeeded, currentSeats);
                    });

                    const additionalSeats = stopToMove.transportNeeds.wheelchair ? 2 : 1;
                    if (maxSeatsNeeded + additionalSeats > vehicle.capacity.totalSeats) {
                        toast.error(`Nie można przenieść - przekroczono pojemność pojazdu docelowego!`);
                        return;
                    }
                }
            }

            setRoutes(prev =>
                prev.map(route => {
                    if (route.id === fromRouteId) {
                        const updatedStops = route.stops
                            .filter(s => s.scheduleId !== stopToMove.scheduleId)
                            .map((s, index) => ({ ...s, order: index + 1 }));
                        return { ...route, stops: updatedStops };
                    }
                    if (route.id === toRouteId) {
                        const currentMaxOrder = route.stops.length > 0
                            ? Math.max(...route.stops.map(s => s.order))
                            : 0;
                        const newStops = scheduleStops.map((s, index) => ({
                            ...s,
                            id: `stop-${Date.now()}-${s.type.toLowerCase()}-${index}`,
                            order: currentMaxOrder + index + 1,
                        }));
                        toast.success(`Przeniesiono ${stopToMove.childName} do innej trasy`);
                        return { ...route, stops: [...route.stops, ...newStops] };
                    }
                    return route;
                })
            );
        },
        [routes, vehiclesData]
    );

    const handleDragStart = useCallback((child: AvailableChild, schedule: ChildSchedule) => {
        setDraggedItem({ child, schedule });
    }, []);

    const handleDragStartStop = useCallback((routeId: string, stop: LocalRouteStop) => {
        setDraggedStop({ routeId, stop });
    }, []);

    const handleDragEnd = useCallback(() => {
        setDraggedItem(null);
        setDraggedStop(null);
    }, []);

    const validateRoutes = useCallback(() => {
        const errors: string[] = [];

        routes.forEach((route, index) => {
            if (!route.routeName.trim()) {
                errors.push(`Trasa ${index + 1}: Brak nazwy trasy`);
            }
            if (!route.vehicleId) {
                errors.push(`Trasa ${index + 1}: Nie wybrano pojazdu`);
            }
            if (!route.driverId) {
                errors.push(`Trasa ${index + 1}: Nie wybrano kierowcy`);
            }
            if (route.stops.length === 0) {
                errors.push(`Trasa ${index + 1}: Brak przypisanych stopów`);
            }

            if (route.vehicleId && vehiclesData) {
                const vehicle = vehiclesData.content.find(v => v.id === route.vehicleId);
                if (vehicle) {
                    let maxConcurrent = 0;
                    const sortedStops = [...route.stops].sort((a, b) => a.order - b.order);
                    let currentInVehicle = 0;
                    const inVehicleSchedules = new Set<string>();

                    sortedStops.forEach(stop => {
                        if (stop.type === 'PICKUP') {
                            inVehicleSchedules.add(stop.scheduleId);
                        } else {
                            inVehicleSchedules.delete(stop.scheduleId);
                        }
                        currentInVehicle = inVehicleSchedules.size;
                        maxConcurrent = Math.max(maxConcurrent, currentInVehicle);
                    });

                    let maxSeatsNeeded = 0;
                    const scheduleSeats = new Map<string, number>();

                    route.stops.forEach(stop => {
                        if (!scheduleSeats.has(stop.scheduleId)) {
                            const seats = stop.transportNeeds.wheelchair ? 2 : 1;
                            scheduleSeats.set(stop.scheduleId, seats);
                        }
                    });

                    inVehicleSchedules.clear();
                    sortedStops.forEach(stop => {
                        if (stop.type === 'PICKUP') {
                            inVehicleSchedules.add(stop.scheduleId);
                        } else {
                            inVehicleSchedules.delete(stop.scheduleId);
                        }

                        let currentSeats = 0;
                        inVehicleSchedules.forEach(schedId => {
                            currentSeats += scheduleSeats.get(schedId) || 1;
                        });
                        maxSeatsNeeded = Math.max(maxSeatsNeeded, currentSeats);
                    });

                    if (maxSeatsNeeded > vehicle.capacity.totalSeats) {
                        errors.push(`Trasa ${index + 1}: Przekroczono pojemność pojazdu (${maxSeatsNeeded}/${vehicle.capacity.totalSeats} miejsc)`);
                    }

                    const wheelchairStops = route.stops.filter(s => s.transportNeeds.wheelchair);
                    const uniqueWheelchairSchedules = new Set(wheelchairStops.map(s => s.scheduleId));

                    if (uniqueWheelchairSchedules.size > vehicle.capacity.wheelchairSpaces) {
                        errors.push(
                            `Trasa ${index + 1}: Za dużo dzieci wymagających wózków (${uniqueWheelchairSchedules.size}/${vehicle.capacity.wheelchairSpaces})`
                        );
                    }
                }
            }
        });

        return errors;
    }, [routes, vehiclesData]);

    const handleSaveAll = async () => {
        const errors = validateRoutes();

        if (errors.length > 0) {
            errors.forEach(error => toast.error(error));
            return;
        }

        if (routes.length === 0) {
            toast.error('Nie ma tras do zapisania');
            return;
        }

        setIsSaving(true);

        try {
            const { routesApi } = await import('../../api/routesApi');

            const savePromises = routes.map(async (route) => {
                const sortedStops = [...route.stops].sort((a, b) => a.order - b.order);
                const earliestTime = sortedStops[0]?.estimatedTime || '08:00';
                const latestTime = sortedStops[sortedStops.length - 1]?.estimatedTime || '16:00';

                return routesApi.create({
                    routeName: route.routeName.trim(),
                    date: selectedDate,
                    driverId: route.driverId,
                    vehicleId: route.vehicleId,
                    estimatedStartTime: earliestTime,
                    estimatedEndTime: latestTime,
                    stops: sortedStops.map(stop => ({
                        stopOrder: stop.order,
                        stopType: stop.type,
                        childId: stop.childId,
                        scheduleId: stop.scheduleId,
                        estimatedTime: stop.estimatedTime,
                        address: stop.address,
                    })),
                });
            });

            await Promise.all(savePromises);

            toast.success(`Pomyślnie utworzono ${routes.length} ${routes.length === 1 ? 'trasę' : 'tras'}`);

            setRoutes([]);

            setTimeout(() => {
                window.location.href = '/routes';
            }, 1500);
        } catch (error) {
            toast.error('Wystąpił błąd podczas zapisywania tras');
        } finally {
            setIsSaving(false);
        }
    };

    const stats = useMemo(() => {
        const uniqueSchedules = new Set(routes.flatMap(route => route.stops.map(s => s.scheduleId)));
        const totalChildren = uniqueSchedules.size;
        const totalRoutes = routes.length;
        const unassigned = unassignedItems.length;

        return { totalChildren, totalRoutes, unassigned };
    }, [routes, unassignedItems]);

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
                            Nie można zaplanować tras
                        </p>
                        <p>
                            {hasNoDrivers && 'Brak dostępnych kierowców. '}
                            {hasNoVehicles && 'Brak dostępnych pojazdów. '}
                        </p>
                    </div>
                </Card.Content>
            </Card>
        );
    }

    return (
        <PlannerContainer>
            <TopSection>
                <GlobalControls>
                    <DateSection>
                        <DateLabel>
                            <Calendar size={16} />
                            Data
                        </DateLabel>
                        <Input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => {
                                setSelectedDate(e.target.value);
                                setRoutes([]);
                            }}
                            min={new Date().toISOString().split('T')[0]}
                        />
                        <DateInfo>
                            {new Date(selectedDate).toLocaleDateString('pl-PL', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                            })}
                        </DateInfo>
                    </DateSection>

                    <ActionsSection>
                        <StatsBar>
                            <StatItem>
                                <StatValue>{stats.totalRoutes}</StatValue>
                                <StatLabel>Tras</StatLabel>
                            </StatItem>
                            <StatItem>
                                <StatValue>{stats.totalChildren}</StatValue>
                                <StatLabel>Dzieci</StatLabel>
                            </StatItem>
                            <StatItem $warning={stats.unassigned > 0}>
                                <StatValue>{stats.unassigned}</StatValue>
                                <StatLabel>Wolnych</StatLabel>
                            </StatItem>
                        </StatsBar>
                    </ActionsSection>
                </GlobalControls>

                <ChildrenPoolSection>
                    <div style={{
                        position: 'sticky',
                        top: '0',
                        zIndex: 10,
                        background: '#f8fafc',
                        paddingBottom: '1rem'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '0.5rem'
                        }}>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsPoolCollapsed(!isPoolCollapsed)}
                                style={{ gap: '0.5rem' }}
                            >
                                {isPoolCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                                {isPoolCollapsed ? 'Pokaż' : 'Ukryj'} pulę dzieci
                            </Button>
                        </div>
                        {!isPoolCollapsed && (
                            <ChildrenPool
                                items={unassignedItems}
                                onDragStart={handleDragStart}
                                onDragEnd={handleDragEnd}
                            />
                        )}
                    </div>
                </ChildrenPoolSection>
            </TopSection>

            <RoutesSection>
                {routes.length === 0 ? (
                    <EmptyState>
                        <EmptyIcon>
                            <Plus size={40} />
                        </EmptyIcon>
                        <EmptyText>
                            Zacznij od dodania pierwszej trasy
                        </EmptyText>
                        <Button size="md" onClick={handleAddRoute}>
                            <Plus size={18} />
                            Dodaj pierwszą trasę
                        </Button>
                    </EmptyState>
                ) : (
                    <>
                        <RoutesGrid>
                            {routes.map((route, index) => (
                                <RouteBuilderCard
                                    key={route.id}
                                    route={route}
                                    index={index}
                                    drivers={driversData?.content || []}
                                    vehicles={vehiclesData?.content || []}
                                    draggedItem={draggedItem}
                                    draggedStop={draggedStop}
                                    onUpdate={handleUpdateRoute}
                                    onRemove={handleRemoveRoute}
                                    onAddStops={handleAddStopsToRoute}
                                    onRemoveStop={handleRemoveStopFromRoute}
                                    onReorderStops={handleReorderStops}
                                    onMoveStopBetweenRoutes={handleMoveStopBetweenRoutes}
                                    onDragStartStop={handleDragStartStop}
                                    onDragEnd={handleDragEnd}
                                />
                            ))}

                            <AddRouteCard>
                                <AddRouteButton onClick={handleAddRoute}>
                                    <Plus size={28} />
                                    <AddRouteText>Dodaj kolejną trasę</AddRouteText>
                                </AddRouteButton>
                            </AddRouteCard>
                        </RoutesGrid>
                    </>
                )}
            </RoutesSection>

            {routes.length > 0 && (
                <BulkActions>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                            if (window.confirm('Czy na pewno chcesz anulować? Wszystkie niezapisane zmiany zostaną utracone.')) {
                                window.location.href = '/routes';
                            }
                        }}
                    >
                        Anuluj
                    </Button>
                    <SaveAllButton
                        size="sm"
                        onClick={handleSaveAll}
                        disabled={isSaving || routes.length === 0}
                        isLoading={isSaving}
                    >
                        <Save size={16} />
                        {isSaving ? 'Zapisywanie...' : `Zapisz (${routes.length})`}
                    </SaveAllButton>
                </BulkActions>
            )}
        </PlannerContainer>
    );
};