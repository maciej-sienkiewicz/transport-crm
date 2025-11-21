// src/features/routes/hooks/useRouteDetailLogic.ts

import {
    useCallback,
    useMemo,
    useState,
    useRef,
    useEffect,
} from 'react';
import toast from 'react-hot-toast';
import { ExecutionStatus, RouteStatus, RouteStop } from '@/features/routes/types';
import { useRoute } from '@/features/routes/hooks/useRoute';
import { useDeleteRoute } from '@/features/routes/hooks/useDeleteRoute';
import { useReorderStops } from '@/features/routes/hooks/useReorderStops';
import { RoutePoint } from '@/features/routes/components/RouteMapModal/utils/types';

export const statusLabels: Record<RouteStatus, string> = {
    PLANNED: 'Zaplanowana',
    IN_PROGRESS: 'W trakcie',
    COMPLETED: 'Zakończona',
    CANCELLED: 'Anulowana',
};

export const statusVariants: Record<
    RouteStatus,
    'default' | 'primary' | 'success' | 'warning' | 'danger'
> = {
    PLANNED: 'primary',
    IN_PROGRESS: 'warning',
    COMPLETED: 'success',
    CANCELLED: 'default',
};

export const executionStatusLabels: Record<ExecutionStatus, string> = {
    COMPLETED: 'Wykonano',
    NO_SHOW: 'Nieobecny',
    REFUSED: 'Odmowa',
};

export type ActiveTab = 'info' | 'children' | 'history' | 'series';

export interface ChildSummaryItem {
    childId: string;
    childName: string;
    scheduleId: string;
    pickupStop: RouteStop | null;
    dropoffStop: RouteStop | null;
}

const API_KEY = 'AIzaSyAr0qHze3moiMPHo-cwv171b8luH-anyXA';

export const useRouteDetailLogic = (id: string) => {
    const { data: route, isLoading, refetch } = useRoute(id);
    const deleteRoute = useDeleteRoute();
    const reorderStops = useReorderStops();

    // Domyślna zakładka: jeśli trasa należy do serii, pokaż zakładkę "series"
    const getInitialTab = (): ActiveTab => {
        if (route?.seriesId) {
            return 'series';
        }
        return 'info';
    };

    const [activeTab, setActiveTab] = useState<ActiveTab>(getInitialTab());
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [hoveredStopId, setHoveredStopId] = useState<string | null>(null);
    const [activeStopId, setActiveStopId] = useState<string | null>(null);
    const [isMapModalOpen, setIsMapModalOpen] = useState(false);
    const stopRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const [isCreateSeriesModalOpen, setIsCreateSeriesModalOpen] = useState(false);

    // Ustaw zakładkę "series" jako domyślną, gdy trasa się załaduje i należy do serii
    useEffect(() => {
        if (route?.seriesId && activeTab === 'info') {
            setActiveTab('series');
        }
    }, [route?.seriesId]);

    const sortedStops = useMemo(() => {
        if (!route?.stops) return [];
        return [...route.stops].sort((a, b) => a.stopOrder - b.stopOrder);
    }, [route?.stops]);

    const displayStops = sortedStops;

    const uniqueChildrenCount = useMemo(() => {
        if (!route?.stops) return 0;
        const uniqueSchedules = new Set(route.stops.map(stop => stop.scheduleId));
        return uniqueSchedules.size;
    }, [route?.stops]);

    const childrenSummary: ChildSummaryItem[] = useMemo(() => {
        if (!route?.stops) return [];

        const childrenMap = new Map<string, ChildSummaryItem>();

        route.stops.forEach(stop => {
            const key = stop.scheduleId;
            if (!childrenMap.has(key)) {
                childrenMap.set(key, {
                    childId: stop.childId,
                    childName: `${stop.childFirstName} ${stop.childLastName}`,
                    scheduleId: stop.scheduleId,
                    pickupStop: null,
                    dropoffStop: null,
                });
            }

            const child = childrenMap.get(key)!;
            if (stop.stopType === 'PICKUP') {
                child.pickupStop = stop;
            } else {
                child.dropoffStop = stop;
            }
        });

        return Array.from(childrenMap.values());
    }, [route?.stops]);

    const getMapPoints = useCallback((): RoutePoint[] => {
        if (!route?.stops) return [];

        return sortedStops.map((stop, index) => {
            const point: RoutePoint = {
                address: `${stop.address.street} ${stop.address.houseNumber}, ${stop.address.city}`,
                lat: stop.address.latitude ?? null,
                lng: stop.address.longitude ?? null,
                type: stop.stopType === 'PICKUP' ? ('pickup' as const) : ('dropoff' as const),
                childName: `${stop.childFirstName} ${stop.childLastName}`,
                order: stop.stopOrder,
                hasCoordinates: stop.address.latitude != null && stop.address.longitude != null,
                stopId: stop.id,
                scheduleId: stop.scheduleId,
                isNew: false,
            };

            return point;
        });
    }, [route?.stops, sortedStops]);

    const defaultMapCenter = useMemo(() => {
        const points = getMapPoints();
        const validPoints = points.filter(p => p.hasCoordinates && p.lat !== null && p.lng !== null);
        return validPoints.length > 0
            ? { lat: validPoints[0].lat!, lng: validPoints[0].lng! }
            : { lat: 52.4064, lng: 16.9252 };
    }, [getMapPoints]);

    const handleDriverClick = () => {
        if (route?.driver.id) {
            window.location.href = `/drivers/${route.driver.id}`;
        }
    };

    const handleVehicleClick = () => {
        if (route?.vehicle.id) {
            window.location.href = `/vehicles/${route.vehicle.id}`;
        }
    };

    const handleChildClick = (childId: string) => {
        window.location.href = `/children/${childId}`;
    };

    const handleOpenMapModal = () => {
        if (route?.stops.length === 0) {
            toast.error('Brak stopów do edycji');
            return;
        }
        setIsMapModalOpen(true);
    };

    const handleCloseMapModal = () => {
        setIsMapModalOpen(false);
    };

    const handleCreateSeries = useCallback(() => {
        if (route?.status !== 'PLANNED') {
            toast.error('Serię można utworzyć tylko z trasy w statusie PLANNED');
            return;
        }
        setIsCreateSeriesModalOpen(true);
    }, [route]);

    const handleCloseCreateSeriesModal = useCallback(() => {
        setIsCreateSeriesModalOpen(false);
    }, []);

    const handleSaveOrderFromMap = useCallback(async (newMapPoints: RoutePoint[]) => {
        if (!route) return;

        try {
            const stopOrders = newMapPoints.map((point, index) => {
                if (!point.stopId) {
                    throw new Error(`Punkt ${point.childName} nie ma stopId`);
                }

                return {
                    stopId: point.stopId,
                    newOrder: index + 1,
                };
            });

            await reorderStops.mutateAsync({
                routeId: route.id,
                stopOrders,
            });

            toast.success('Kolejność stopów została zaktualizowana');
            handleCloseMapModal();
            await refetch();
        } catch (error) {
            console.error('❌ Błąd podczas zapisywania kolejności:', error);
            toast.error('Nie udało się zapisać nowej kolejności');
        }
    }, [route, reorderStops, refetch]);

    const handleStopHover = (stop: RouteStop) => {
        setHoveredStopId(stop.id);
    };

    const handleStopClick = (stop: RouteStop) => {
        if (map && stop.address.latitude && stop.address.longitude) {
            map.panTo({ lat: stop.address.latitude, lng: stop.address.longitude });
            map.setZoom(15);
        }
    };

    const handleMarkerClick = useCallback(
        (stop: RouteStop) => {
            const stopElement = stopRefs.current[stop.id];
            if (stopElement) {
                stopElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                });

                setActiveStopId(stop.id);
                setTimeout(() => setActiveStopId(null), 2000);
            }
        },
        [stopRefs]
    );

    const handleDeleteRoute = useCallback(async () => {
        if (!route) return;

        const confirmDelete = window.confirm(
            `Czy na pewno chcesz usunąć trasę "${route.routeName}"? Ta operacja jest nieodwracalna.`
        );

        if (!confirmDelete) return;

        try {
            await deleteRoute.mutateAsync(route.id);
            toast.success('Trasa została pomyślnie usunięta');

            setTimeout(() => {
                window.location.href = '/routes';
            }, 200);
        } catch (error) {
            console.error('Błąd podczas usuwania trasy:', error);
        }
    }, [route, deleteRoute]);

    return {
        route,
        isLoading,
        uniqueChildrenCount,
        childrenSummary,
        displayStops,
        defaultMapCenter,
        mapPoints: getMapPoints(),
        activeTab,
        isMapModalOpen,
        hoveredStopId,
        activeStopId,
        isDeletingRoute: deleteRoute.isPending,
        isSavingOrder: reorderStops.isPending,
        stopRefs,
        setActiveTab,
        handleDriverClick,
        handleVehicleClick,
        handleChildClick,
        handleOpenMapModal,
        handleCloseMapModal,
        handleSaveOrderFromMap,
        handleStopHover,
        handleStopClick,
        handleMarkerClick,
        handleDeleteRoute,
        isCreateSeriesModalOpen,
        handleCreateSeries,
        handleCloseCreateSeriesModal,
        setMap,
        API_KEY,
    };
};