// src/features/routes/components/SmartAssignmentDashboard/UnassignedSchedulesList.tsx
import React from 'react';
import { Clock, MapPin, AlertCircle, CheckCircle2, Zap } from 'lucide-react';
import { UnassignedScheduleItem, AutoMatchSuggestion } from '../../types';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { Button } from '@/shared/ui/Button';
import {
    SchedulesListContainer,
    ScheduleCard,
    ScheduleHeader,
    ChildInfo,
    ChildName,
    ScheduleName,
    MatchBadge,
    ScheduleBody,
    ScheduleDetail,
    DetailLabel,
    DetailValue,
    AddressInfo,
    ScheduleFooter,
    SuggestionBox,
    SuggestionTitle,
    SuggestionDetails,
    EmptyState,
} from './UnassignedSchedulesList.styles';

interface UnassignedSchedulesListProps {
    schedules: UnassignedScheduleItem[];
    autoMatches: Map<string, AutoMatchSuggestion>;
    selectedScheduleId: string | null;
    onSelectSchedule: (id: string) => void;
    onQuickAssign: (scheduleId: string, routeId: string) => Promise<void>;
    isLoading: boolean;
}

export const UnassignedSchedulesList: React.FC<UnassignedSchedulesListProps> = ({
                                                                                    schedules,
                                                                                    autoMatches,
                                                                                    selectedScheduleId,
                                                                                    onSelectSchedule,
                                                                                    onQuickAssign,
                                                                                    isLoading,
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
                const match = autoMatches.get(schedule.scheduleId);
                const isSelected = selectedScheduleId === schedule.scheduleId;

                return (
                    <ScheduleCard
                        key={schedule.scheduleId}
                        $hasMatch={Boolean(match)}
                        $isSelected={isSelected}
                        onClick={() => onSelectSchedule(schedule.scheduleId)}
                    >
                        <ScheduleHeader>
                            <ChildInfo>
                                <ChildName>
                                    {schedule.childFirstName} {schedule.childLastName}
                                </ChildName>
                                <ScheduleName>{schedule.scheduleName}</ScheduleName>
                            </ChildInfo>
                            {match && (
                                <MatchBadge $confidence={match.confidence}>
                                    {match.confidence === 'high' && <Zap size={14} />}
                                    {match.confidence === 'high' && 'Pewne'}
                                    {match.confidence === 'medium' && 'Średnie'}
                                    {match.confidence === 'low' && 'Słabe'}
                                </MatchBadge>
                            )}
                            {!match && (
                                <MatchBadge $confidence="none">
                                    <AlertCircle size={14} />
                                    Brak dopasowania
                                </MatchBadge>
                            )}
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

                        {match && match.confidence === 'high' && (
                            <ScheduleFooter>
                                <SuggestionBox>
                                    <SuggestionTitle>
                                        <CheckCircle2 size={16} />
                                        Sugerowana trasa
                                    </SuggestionTitle>
                                    <SuggestionDetails>
                                        <strong>{match.routeName}</strong>
                                        <span>
                                            {match.reasons[0]}
                                        </span>
                                    </SuggestionDetails>
                                </SuggestionBox>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onQuickAssign(schedule.scheduleId, match.routeId);
                                    }}
                                >
                                    Akceptuj
                                </Button>
                            </ScheduleFooter>
                        )}
                    </ScheduleCard>
                );
            })}
        </SchedulesListContainer>
    );
};