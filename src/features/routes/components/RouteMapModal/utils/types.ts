export interface RoutePoint {
    address: string;
    lat: number | null;
    lng: number | null;
    type: 'pickup' | 'dropoff';
    childName: string;
    order: number;
    hasCoordinates: boolean;
    stopId: string;
    scheduleId: string;
    isNew?: boolean;
}

export interface RouteMapModalProps {
    isOpen: boolean;
    onClose: () => void;
    routeName: string;
    points: RoutePoint[];
    apiKey: string;
    onSaveOrder?: (newPoints: RoutePoint[]) => void;
}

export interface ValidationResult {
    isValid: boolean;
    errors: string[];
}

export interface RouteStats {
    totalPoints: number;
    existingPoints: number;
    newPoints: number;
    validPoints: number;
    missingCoordinates: number;
}

export interface StopNumberEditorState {
    isOpen: boolean;
    point: RoutePoint | null;
    currentOrder: number;
    newOrder: string;
    position: { x: number; y: number } | null;
}