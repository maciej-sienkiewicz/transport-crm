// src/features/routes/components/SmartAssignmentDashboard/UnassignedSchedulesList.tsx
import React from 'react';
import { Clock, MapPin, Sparkles } from 'lucide-react';
import { UnassignedScheduleItem } from '../../types';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { Button } from '@/shared/ui/Button';
import {
    SchedulesListContainer,
    ScheduleCard,
    ScheduleHeader,
    ChildInfo,
    ChildName,
    ScheduleName,
    ScheduleBody,
    ScheduleDetail,
    DetailLabel,
    DetailValue,
    AddressInfo,
    ScheduleFooter,
    EmptyState,
} from './UnassignedSchedulesList.styles';
import { CheckCircle2 } from 'lucide-react';

interface UnassignedSchedulesListProps {
    schedules: UnassignedScheduleItem[];
    selectedScheduleId: string | null;
    onSelectSchedule: (id: string) => void;
    onShowSuggestions: (schedule: UnassignedScheduleItem) => void;
    onDragStart: (scheduleId: string) => void;
    onDragEnd: () => void;
    isLoading: boolean;
    hasAnyRoutes: boolean;
}

export const UnassignedSchedulesList: React.FC<UnassignedSchedulesListProps> = ({
                                                                                    schedules,
                                                                                    selectedScheduleId,
                                                                                    onSelectSchedule,
                                                                                    onShowSuggestions,
                                                                                    onDragStart,
                                                                                    onDragEnd,
                                                                                    isLoading,
                                                                                    hasAnyRoutes,
                                                                                }) => {
    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (schedules.length === 0) {
        return (
            <EmptyState>
                <CheckCircle2 size={64} />
                <h3>Wszystko przypisane!</h3>
                <p>Nie ma nieprzypisanych harmonogramów na wybrany dzień.</p>
            </EmptyState>
        );
    }

    return (
        <SchedulesListContainer>
            {schedules.map((schedule) => {
                const isSelected = selectedScheduleId === schedule.scheduleId;

                return (
                    <ScheduleCard
                        key={schedule.scheduleId}
                        $hasMatch={false}
                        $isSelected={isSelected}
                        draggable
                        onDragStart={() => onDragStart(schedule.scheduleId)}
                        onDragEnd={onDragEnd}
                        onClick={() => onSelectSchedule(schedule.scheduleId)}
                        style={{ cursor: 'grab' }}
                        onDragOver={(e) => e.preventDefault()}
                    >
                        <ScheduleHeader>
                            <ChildInfo>
                                <ChildName>
                                    {schedule.childFirstName} {schedule.childLastName}
                                </ChildName>
                                <ScheduleName>{schedule.scheduleName}</ScheduleName>
                            </ChildInfo>
                        </ScheduleHeader>

                        <ScheduleBody>
                            <ScheduleDetail>
                                <Clock size={16} />
                                <div>
                                    <DetailLabel>Odbiór</DetailLabel>
                                    <DetailValue>{schedule.pickupTime}</DetailValue>
                                </div>
                            </ScheduleDetail>

                            <AddressInfo>
                                <MapPin size={14} />
                                <span>
                                    {schedule.pickupAddress.label ||
                                        `${schedule.pickupAddress.street} ${schedule.pickupAddress.houseNumber}`}
                                </span>
                            </AddressInfo>

                            <ScheduleDetail>
                                <Clock size={16} />
                                <div>
                                    <DetailLabel>Dowóz</DetailLabel>
                                    <DetailValue>{schedule.dropoffTime}</DetailValue>
                                </div>
                            </ScheduleDetail>

                            <AddressInfo>
                                <MapPin size={14} />
                                <span>
                                    {schedule.dropoffAddress.label ||
                                        `${schedule.dropoffAddress.street} ${schedule.dropoffAddress.houseNumber}`}
                                </span>
                            </AddressInfo>
                        </ScheduleBody>

                        {hasAnyRoutes && (
                            <ScheduleFooter>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    fullWidth
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onShowSuggestions(schedule);
                                    }}
                                >
                                    <Sparkles size={16} />
                                    Pokaż sugestie
                                </Button>
                            </ScheduleFooter>
                        )}
                    </ScheduleCard>
                );
            })}
        </SchedulesListContainer>
    );
};