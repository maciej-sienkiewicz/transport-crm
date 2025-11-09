// /routes/components/RouteDetail/hooks/useRouteDetailLogic.ts

import {
    useCallback,
    useMemo,
    useState,
    useRef,
} from 'react';
import {ExecutionStatus, RouteStatus, RouteStop} from "@/features/routes/types.ts";
import {useRoute} from "@/features/routes/hooks/useRoute.ts";

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

export type ActiveTab = 'stops' | 'children' | 'history';

export interface ChildSummaryItem {
    childId: string;
    childName: string;
    scheduleId: string;
    pickupStop: RouteStop | null;
    dropoffStop: RouteStop | null;
}

interface MapPoint {
    address: string;
    lat: number;
    lng: number;
    type: 'pickup' | 'dropoff';
    childName: string;
    order: number;
    hasCoordinates: boolean;
}

const API_KEY = 'AIzaSyAr0qHze3moiMPHo-cwv171b8luH-anyXA'; // Stała dla klucza API Map

export const useRouteDetailLogic = (id: string) => {
    const { data: route, isLoading } = useRoute(id);
    const [activeTab, setActiveTab] = useState<ActiveTab>('stops');
    const [isEditMode, setIsEditMode] = useState(false);
    const [editedStops, setEditedStops] = useState<RouteStop[]>([]);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [hoveredStopId, setHoveredStopId] = useState<string | null>(null);
    const [activeStopId, setActiveStopId] = useState<string | null>(null);
    const stopRefs = useRef<Record<string, HTMLDivElement | null>>({});

    const sortedStops = useMemo(() => {
        if (!route?.stops) return [];
        return [...route.stops].sort((a, b) => a.stopOrder - b.stopOrder);
    }, [route?.stops]);

    const displayStops = isEditMode ? editedStops : sortedStops;

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

    const getMapPoints = useCallback((): MapPoint[] => {
        if (!route?.stops) return [];

        return sortedStops
            .filter(s => s.address.latitude != null && s.address.longitude != null)
            .map(stop => ({
                address: `${stop.address.street} ${stop.address.houseNumber}, ${stop.address.city}`,
                lat: stop.address.latitude!,
                lng: stop.address.longitude!,
                type: stop.stopType === 'PICKUP' ? ('pickup' as const) : ('dropoff' as const),
                childName: `${stop.childFirstName} ${stop.childLastName}`,
                order: stop.stopOrder,
                hasCoordinates: true,
            }));
    }, [route?.stops, sortedStops]);

    const defaultMapCenter = useMemo(() => {
        const points = getMapPoints();
        return points.length > 0
            ? { lat: points[0].lat, lng: points[0].lng }
            : { lat: 52.4064, lng: 16.9252 };
    }, [getMapPoints]);

    // --- Handlery ---
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

    const handleEditModeToggle = () => {
        if (!isEditMode) {
            setEditedStops(sortedStops);
        }
        setIsEditMode(!isEditMode);
    };

    const handleSaveOrder = () => {
        console.log(
            'Saving new order:',
            editedStops.map((s, idx) => ({ ...s, stopOrder: idx + 1 }))
        );
        setIsEditMode(false);
    };

    const handleCancelEdit = () => {
        setEditedStops(sortedStops);
        setIsEditMode(false);
    };

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

    return {
        // Dane
        route,
        isLoading,
        uniqueChildrenCount,
        childrenSummary,
        displayStops,
        defaultMapCenter,
        mapPoints: getMapPoints(),

        // Stany
        activeTab,
        isEditMode,
        hoveredStopId,
        activeStopId,

        // Refy
        stopRefs,

        // Handlery
        setActiveTab,
        handleDriverClick,
        handleVehicleClick,
        handleChildClick,
        handleEditModeToggle,
        handleSaveOrder,
        handleCancelEdit,
        handleStopHover,
        handleStopClick,
        handleMarkerClick,
        setMap,

        // Stałe
        API_KEY
    };
};