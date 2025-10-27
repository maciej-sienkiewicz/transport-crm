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
import { AvailableChild } from '../../types';
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
    children: Array<AvailableChild & { pickupOrder: number }>;
}

export const MultiRoutePlanner: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<string>(
        new Date().toISOString().split('T')[0]
    );
    const [routes, setRoutes] = useState<RouteBuilder[]>([]);
    const [draggedChild, setDraggedChild] = useState<AvailableChild | null>(null);
    const [draggedFromRoute, setDraggedFromRoute] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const { data: availableChildren, isLoading: isLoadingChildren } = useAvailableChildren(
        selectedDate,
        !!selectedDate
    );
    const { data: driversData, isLoading: isLoadingDrivers } = useAvailableDrivers();
    const { data: vehiclesData, isLoading: isLoadingVehicles } = useAvailableVehicles();

    // Calculate which children are not assigned to any route
    const unassignedChildren = useMemo(() => {
        if (!availableChildren) return [];
        const assignedIds = new Set(
            routes.flatMap(route => route.children.map(c => c.id))
        );
        return availableChildren.filter(child => !assignedIds.has(child.id));
    }, [availableChildren, routes]);

    const handleAddRoute = useCallback(() => {
        const newRoute: RouteBuilder = {
            id: `route-${Date.now()}`,
            routeName: '',
            vehicleId: '',
            driverId: '',
            children: [],
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

    const handleAddChildToRoute = useCallback((routeId: string, child: AvailableChild) => {
        setRoutes(prev =>
            prev.map(route => {
                if (route.id !== routeId) return route;

                // Check if child is already in this route
                if (route.children.find(c => c.id === child.id)) return route;

                const newChild = {
                    ...child,
                    pickupOrder: route.children.length + 1,
                };

                return {
                    ...route,
                    children: [...route.children, newChild],
                };
            })
        );
    }, []);

    const handleRemoveChildFromRoute = useCallback((routeId: string, childId: string) => {
        setRoutes(prev =>
            prev.map(route => {
                if (route.id !== routeId) return route;

                const updatedChildren = route.children
                    .filter(c => c.id !== childId)
                    .map((c, index) => ({ ...c, pickupOrder: index + 1 }));

                return { ...route, children: updatedChildren };
            })
        );
    }, []);

    const handleMoveChildBetweenRoutes = useCallback(
        (fromRouteId: string, toRouteId: string, childId: string) => {
            const fromRoute = routes.find(r => r.id === fromRouteId);
            const child = fromRoute?.children.find(c => c.id === childId);

            if (!child) return;

            // Remove from source route
            handleRemoveChildFromRoute(fromRouteId, childId);

            // Add to target route
            handleAddChildToRoute(toRouteId, child);
        },
        [routes, handleRemoveChildFromRoute, handleAddChildToRoute]
    );

    const handleDragStart = useCallback((child: AvailableChild, fromRouteId?: string) => {
        setDraggedChild(child);
        setDraggedFromRoute(fromRouteId || null);
    }, []);

    const handleDragEnd = useCallback(() => {
        setDraggedChild(null);
        setDraggedFromRoute(null);
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
            if (route.children.length === 0) {
                errors.push(`Trasa ${index + 1}: Brak przypisanych dzieci`);
            }

            // Check vehicle capacity
            if (route.vehicleId && vehiclesData) {
                const vehicle = vehiclesData.content.find(v => v.id === route.vehicleId);
                if (vehicle) {
                    const usedSeats = route.children.reduce((sum, child) => {
                        return sum + (child.transportNeeds.wheelchair ? 2 : 1);
                    }, 0);

                    if (usedSeats > vehicle.capacity.totalSeats) {
                        errors.push(`Trasa ${index + 1}: Przekroczono pojemność pojazdu`);
                    }

                    const wheelchairCount = route.children.filter(
                        c => c.transportNeeds.wheelchair
                    ).length;

                    if (wheelchairCount > vehicle.capacity.wheelchairSpaces) {
                        errors.push(
                            `Trasa ${index + 1}: Za dużo dzieci wymagających wózków (${wheelchairCount}/${vehicle.capacity.wheelchairSpaces})`
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
            // Import the hook inline to avoid circular dependencies
            const { routesApi } = await import('../../api/routesApi');

            const savePromises = routes.map(async (route) => {
                const earliestPickup = route.children.reduce((earliest, child) => {
                    return child.schedule.pickupTime < earliest
                        ? child.schedule.pickupTime
                        : earliest;
                }, route.children[0].schedule.pickupTime);

                const latestDropoff = route.children.reduce((latest, child) => {
                    return child.schedule.dropoffTime > latest
                        ? child.schedule.dropoffTime
                        : latest;
                }, route.children[0].schedule.dropoffTime);

                return routesApi.create({
                    routeName: route.routeName.trim(),
                    date: selectedDate,
                    driverId: route.driverId,
                    vehicleId: route.vehicleId,
                    estimatedStartTime: earliestPickup,
                    estimatedEndTime: latestDropoff,
                    children: route.children.map(child => ({
                        childId: child.id,
                        scheduleId: child.schedule.id,
                        pickupOrder: child.pickupOrder,
                        estimatedPickupTime: child.schedule.pickupTime,
                        estimatedDropoffTime: child.schedule.dropoffTime,
                    })),
                });
            });

            await Promise.all(savePromises);

            toast.success(`Pomyślnie utworzono ${routes.length} ${routes.length === 1 ? 'trasę' : 'tras'}`);

            // Reset state
            setRoutes([]);

            // Redirect after short delay
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
        const totalChildren = routes.reduce((sum, route) => sum + route.children.length, 0);
        const totalRoutes = routes.length;
        const unassigned = unassignedChildren.length;

        return { totalChildren, totalRoutes, unassigned };
    }, [routes, unassignedChildren]);

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
                                setRoutes([]); // Clear routes when date changes
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
                                <StatLabel>Przypisanych</StatLabel>
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
                        children={unassignedChildren}
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
                                    draggedChild={draggedChild}
                                    draggedFromRoute={draggedFromRoute}
                                    onUpdate={handleUpdateRoute}
                                    onRemove={handleRemoveRoute}
                                    onAddChild={handleAddChildToRoute}
                                    onRemoveChild={handleRemoveChildFromRoute}
                                    onMoveChildBetweenRoutes={handleMoveChildBetweenRoutes}
                                    onDragStart={handleDragStart}
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