// src/features/routes/components/SmartAssignmentDashboard/RoutesTimeline.tsx
import React, { useState } from 'react';
import { Clock, MapPin, Users, Car, User, AlertCircle, AlertTriangle } from 'lucide-react';
import { RouteListItem, UnassignedScheduleItem } from '../../types';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import {
    TimelineContainer,
    RouteTimelineCard,
    RouteCardHeader,
    RouteInfo,
    RouteName,
    RouteMetadata,
    MetadataItem,
    RouteCardBody,
    TimeSlot,
    TimeLabel,
    CapacityBar,
    CapacityFill,
    CapacityLabel,
    RouteCardFooter,
    EmptyRoutes,
} from './RoutesTimeline.styles';

interface RoutesTimelineProps {
    routes: RouteListItem[];
    selectedScheduleId: string | null;
    selectedScheduleData: UnassignedScheduleItem | null;
    onAssignToRoute: (scheduleId: string, routeId: string) => Promise<void>;
    onDrop: (routeId: string) => Promise<void>;
    isLoading: boolean;
}

const MAX_CAPACITY = 10;

export const RoutesTimeline: React.FC<RoutesTimelineProps> = ({
                                                                  routes,
                                                                  selectedScheduleId,
                                                                  selectedScheduleData,
                                                                  onAssignToRoute,
                                                                  onDrop,
                                                                  isLoading,
                                                              }) => {
    const [dragOverRouteId, setDragOverRouteId] = useState<string | null>(null);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (routes.length === 0) {
        return (
            <EmptyRoutes>
                <AlertCircle size={64} />
                <h3>Brak tras</h3>
                <p>
                    {selectedScheduleId
                        ? 'Brak kompatybilnych tras dla wybranego harmonogramu.'
                        : 'Nie znaleziono zaplanowanych tras na wybrany dzień.'}
                </p>
            </EmptyRoutes>
        );
    }

    const handleAssignClick = async (route: RouteListItem) => {
        if (!selectedScheduleData || !selectedScheduleId) {
            console.error('❌ Brak danych wybranego harmonogramu');
            return;
        }

        console.log('🎯 Przypisuję dziecko do trasy:', route.id);

        try {
            await onAssignToRoute(selectedScheduleId, route.id);
        } catch (error) {
            console.error('❌ Błąd podczas przypisywania:', error);
        }
    };

    const handleDragOver = (e: React.DragEvent, routeId: string) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        setDragOverRouteId(routeId);
    };

    const handleDragLeave = () => {
        setDragOverRouteId(null);
    };

    const handleDrop = async (e: React.DragEvent, routeId: string) => {
        e.preventDefault();
        setDragOverRouteId(null);
        console.log('🎯 Upuszczono na trasę:', routeId);
        await onDrop(routeId);
    };

    return (
        <TimelineContainer>
            {routes.map((route) => {
                const capacityUsed = route.stopsCount / 2;
                const capacityPercent = (capacityUsed / MAX_CAPACITY) * 100;
                const isFull = capacityUsed >= MAX_CAPACITY;
                const isDraggedOver = dragOverRouteId === route.id;

                return (
                    <RouteTimelineCard
                        key={route.id}
                        $isSuggested={false}
                        $hasSelectedSchedule={Boolean(selectedScheduleId)}
                        onDragOver={(e) => !isFull && handleDragOver(e, route.id)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => !isFull && handleDrop(e, route.id)}
                        style={{
                            border: isDraggedOver && !isFull ? '2px dashed #2563eb' : undefined,
                            background: isDraggedOver && !isFull ? '#eff6ff' : undefined,
                        }}
                    >
                        <RouteCardHeader>
                            <RouteInfo>
                                <RouteName>{route.routeName}</RouteName>
                                <RouteMetadata>
                                    <MetadataItem>
                                        <User size={14} />
                                        {route.driver.firstName} {route.driver.lastName}
                                    </MetadataItem>
                                    <MetadataItem>
                                        <Car size={14} />
                                        {route.vehicle.registrationNumber}
                                    </MetadataItem>
                                </RouteMetadata>
                            </RouteInfo>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <Badge variant="primary">{route.stopsCount} stopów</Badge>
                                {isFull && <Badge variant="danger">Pełna</Badge>}
                            </div>
                        </RouteCardHeader>

                        <RouteCardBody>
                            <TimeSlot>
                                <Clock size={16} />
                                <div>
                                    <TimeLabel>Start trasy</TimeLabel>
                                    <strong>{route.estimatedStartTime}</strong>
                                </div>
                            </TimeSlot>

                            <TimeSlot>
                                <Clock size={16} />
                                <div>
                                    <TimeLabel>Koniec trasy</TimeLabel>
                                    <strong>{route.estimatedEndTime}</strong>
                                </div>
                            </TimeSlot>

                            <CapacityBar>
                                <CapacityLabel>
                                    <Users size={14} />
                                    Pojemność: {capacityUsed} / {MAX_CAPACITY}
                                    {isFull && ' (PEŁNA)'}
                                </CapacityLabel>
                                <div
                                    style={{
                                        position: 'relative',
                                        height: '8px',
                                        background: '#e2e8f0',
                                        borderRadius: '4px',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <CapacityFill
                                        $percent={capacityPercent}
                                        $isOverCapacity={isFull}
                                    />
                                </div>
                            </CapacityBar>

                            {isDraggedOver && !isFull && (
                                <div
                                    style={{
                                        padding: '0.75rem',
                                        background: '#dbeafe',
                                        borderRadius: '0.5rem',
                                        textAlign: 'center',
                                        color: '#1e40af',
                                        fontWeight: 600,
                                        fontSize: '0.875rem',
                                        marginTop: '0.5rem',
                                    }}
                                >
                                    👆 Upuść tutaj aby przypisać
                                </div>
                            )}
                        </RouteCardBody>

                        {selectedScheduleId && (
                            <RouteCardFooter>
                                {isFull ? (
                                    <Button variant="danger" fullWidth disabled>
                                        <AlertTriangle size={16} />
                                        Trasa pełna
                                    </Button>
                                ) : (
                                    <Button
                                        variant="secondary"
                                        fullWidth
                                        onClick={() => handleAssignClick(route)}
                                    >
                                        <MapPin size={16} />
                                        Przypisz do trasy
                                    </Button>
                                )}
                            </RouteCardFooter>
                        )}
                    </RouteTimelineCard>
                );
            })}
        </TimelineContainer>
    );
};