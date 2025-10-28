import React, { useState, useCallback, useMemo } from 'react';
import { Plus, Save, Calendar, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAvailableChildren } from '../../hooks/useAvailableChildren';
import { useAvailableDrivers } from '../../hooks/useAvailableDrivers';
import { useAvailableVehicles } from '../../hooks/useAvailableVehicles';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { AvailableChild, ChildSchedule, RoutePoint } from '../../types';
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
    points: RoutePoint[];
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
    const [draggedPoint, setDraggedPoint] = useState<{ routeId: string; point: RoutePoint } | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const { data: availableChildren, isLoading: isLoadingChildren } = useAvailableChildren(
        selectedDate,
        !!selectedDate
    );
    const { data: driversData, isLoading: isLoadingDrivers } = useAvailableDrivers();
    const { data: vehiclesData, isLoading: isLoadingVehicles } = useAvailableVehicles();

    // Backend już zwraca płaską strukturę: każdy element = para (child, schedule)
    const childScheduleItems = useMemo<ChildScheduleItem[]>(() => {
        if (!availableChildren) return [];

        return availableChildren.map(item => ({
            child: item,
            schedule: item.schedule // schedule to już pojedynczy obiekt
        }));
    }, [availableChildren]);

    // Calculate which child-schedule combinations are not assigned
    const unassignedItems = useMemo(() => {
        const assignedScheduleIds = new Set(
            routes.flatMap(route => route.points.map(p => p.scheduleId))
        );
        return childScheduleItems.filter(item => !assignedScheduleIds.has(item.schedule.id));
    }, [childScheduleItems, routes]);

    const handleAddRoute = useCallback(() => {
        const newRoute: RouteBuilder = {
            id: `route-${Date.now()}`,
            routeName: '',
            vehicleId: '',
            driverId: '',
            points: [],
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

    const handleAddPointsToRoute = useCallback((routeId: string, child: AvailableChild, schedule: ChildSchedule) => {
        setRoutes(prev =>
            prev.map(route => {
                if (route.id !== routeId) return route;

                // Check if this schedule is already in this route
                if (route.points.find(p => p.scheduleId === schedule.id)) return route;

                const currentMaxOrder = route.points.length > 0
                    ? Math.max(...route.points.map(p => p.order))
                    : 0;

                const pickupPoint: RoutePoint = {
                    id: `point-${Date.now()}-pickup`,
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

                const dropoffPoint: RoutePoint = {
                    id: `point-${Date.now()}-dropoff`,
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
                    ...route,
                    points: [...route.points, pickupPoint, dropoffPoint],
                };
            })
        );
    }, []);

    const handleRemovePointFromRoute = useCallback((routeId: string, pointId: string) => {
        setRoutes(prev =>
            prev.map(route => {
                if (route.id !== routeId) return route;

                const pointToRemove = route.points.find(p => p.id === pointId);
                if (!pointToRemove) return route;

                // Remove both pickup and dropoff points for this schedule
                const updatedPoints = route.points
                    .filter(p => p.scheduleId !== pointToRemove.scheduleId)
                    .map((p, index) => ({ ...p, order: index + 1 }));

                return { ...route, points: updatedPoints };
            })
        );
    }, []);

    const handleReorderPoints = useCallback((routeId: string, points: RoutePoint[]) => {
        setRoutes(prev =>
            prev.map(route => {
                if (route.id !== routeId) return route;
                return { ...route, points: points.map((p, index) => ({ ...p, order: index + 1 })) };
            })
        );
    }, []);

    const handleMovePointBetweenRoutes = useCallback(
        (fromRouteId: string, toRouteId: string, pointId: string) => {
            const fromRoute = routes.find(r => r.id === fromRouteId);
            const pointToMove = fromRoute?.points.find(p => p.id === pointId);

            if (!pointToMove) return;

            // Get both points for this schedule
            const schedulePoints = fromRoute!.points.filter(p => p.scheduleId === pointToMove.scheduleId);

            // Remove from source route
            setRoutes(prev =>
                prev.map(route => {
                    if (route.id === fromRouteId) {
                        const updatedPoints = route.points
                            .filter(p => p.scheduleId !== pointToMove.scheduleId)
                            .map((p, index) => ({ ...p, order: index + 1 }));
                        return { ...route, points: updatedPoints };
                    }
                    if (route.id === toRouteId) {
                        const currentMaxOrder = route.points.length > 0
                            ? Math.max(...route.points.map(p => p.order))
                            : 0;
                        const newPoints = schedulePoints.map((p, index) => ({
                            ...p,
                            id: `point-${Date.now()}-${p.type.toLowerCase()}-${index}`,
                            order: currentMaxOrder + index + 1,
                        }));
                        return { ...route, points: [...route.points, ...newPoints] };
                    }
                    return route;
                })
            );
        },
        [routes]
    );

    const handleDragStart = useCallback((child: AvailableChild, schedule: ChildSchedule) => {
        setDraggedItem({ child, schedule });
    }, []);

    const handleDragStartPoint = useCallback((routeId: string, point: RoutePoint) => {
        setDraggedPoint({ routeId, point });
    }, []);

    const handleDragEnd = useCallback(() => {
        setDraggedItem(null);
        setDraggedPoint(null);
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
            if (route.points.length === 0) {
                errors.push(`Trasa ${index + 1}: Brak przypisanych punktów`);
            }

            // Check vehicle capacity
            if (route.vehicleId && vehiclesData) {
                const vehicle = vehiclesData.content.find(v => v.id === route.vehicleId);
                if (vehicle) {
                    // Calculate max concurrent children
                    let maxConcurrent = 0;
                    const sortedPoints = [...route.points].sort((a, b) => a.order - b.order);
                    let currentInVehicle = 0;
                    const inVehicleSchedules = new Set<string>();

                    sortedPoints.forEach(point => {
                        if (point.type === 'PICKUP') {
                            inVehicleSchedules.add(point.scheduleId);
                        } else {
                            inVehicleSchedules.delete(point.scheduleId);
                        }
                        currentInVehicle = inVehicleSchedules.size;
                        maxConcurrent = Math.max(maxConcurrent, currentInVehicle);
                    });

                    // Calculate seats needed considering wheelchairs
                    let maxSeatsNeeded = 0;
                    const scheduleSeats = new Map<string, number>();

                    route.points.forEach(point => {
                        if (!scheduleSeats.has(point.scheduleId)) {
                            const seats = point.transportNeeds.wheelchair ? 2 : 1;
                            scheduleSeats.set(point.scheduleId, seats);
                        }
                    });

                    inVehicleSchedules.clear();
                    sortedPoints.forEach(point => {
                        if (point.type === 'PICKUP') {
                            inVehicleSchedules.add(point.scheduleId);
                        } else {
                            inVehicleSchedules.delete(point.scheduleId);
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

                    // Check wheelchair spaces
                    const wheelchairPoints = route.points.filter(p => p.transportNeeds.wheelchair);
                    const uniqueWheelchairSchedules = new Set(wheelchairPoints.map(p => p.scheduleId));

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
                const sortedPoints = [...route.points].sort((a, b) => a.order - b.order);
                const earliestTime = sortedPoints[0]?.estimatedTime || '08:00';
                const latestTime = sortedPoints[sortedPoints.length - 1]?.estimatedTime || '16:00';

                return routesApi.create({
                    routeName: route.routeName.trim(),
                    date: selectedDate,
                    driverId: route.driverId,
                    vehicleId: route.vehicleId,
                    estimatedStartTime: earliestTime,
                    estimatedEndTime: latestTime,
                    points: route.points.map(point => ({
                        type: point.type,
                        childId: point.childId,
                        scheduleId: point.scheduleId,
                        order: point.order,
                        estimatedTime: point.estimatedTime,
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
            console.error('Błąd podczas zapisywania tras:', error);
            toast.error('Wystąpił błąd podczas zapisywania tras');
        } finally {
            setIsSaving(false);
        }
    };

    const stats = useMemo(() => {
        const uniqueSchedules = new Set(routes.flatMap(route => route.points.map(p => p.scheduleId)));
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
                    <ChildrenPool
                        items={unassignedItems}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    />
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
                                    draggedPoint={draggedPoint}
                                    onUpdate={handleUpdateRoute}
                                    onRemove={handleRemoveRoute}
                                    onAddPoints={handleAddPointsToRoute}
                                    onRemovePoint={handleRemovePointFromRoute}
                                    onReorderPoints={handleReorderPoints}
                                    onMovePointBetweenRoutes={handleMovePointBetweenRoutes}
                                    onDragStartPoint={handleDragStartPoint}
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