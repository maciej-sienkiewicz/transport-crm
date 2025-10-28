import React from 'react';
import { Users, Clock, MapPin } from 'lucide-react';
import { AvailableChild, ChildSchedule } from '../../types';
import {
    PoolContainer,
    PoolHeader,
    PoolTitle,
    PoolCount,
    PoolContent,
    ChildrenGrid,
    ChildCard,
    ChildCardContent,
    ChildName,
    ChildAge,
    ChildSchedule as ChildScheduleStyle,
    ScheduleItem,
    NeedsRow,
    NeedBadge,
    EmptyPool,
    EmptyIcon,
    EmptyText,
} from './ChildrenPool.styles';

interface ChildrenPoolProps {
    items: Array<{ child: AvailableChild; schedule: ChildSchedule }>;
    onDragStart: (child: AvailableChild, schedule: ChildSchedule) => void;
    onDragEnd: () => void;
}

export const ChildrenPool: React.FC<ChildrenPoolProps> = ({
                                                              items,
                                                              onDragStart,
                                                              onDragEnd,
                                                          }) => {
    if (items.length === 0) {
        return (
            <PoolContainer>
                <PoolHeader>
                    <PoolTitle>
                        <Users size={16} />
                        Dostępne harmonogramy
                    </PoolTitle>
                    <PoolCount $isEmpty>0</PoolCount>
                </PoolHeader>
                <PoolContent>
                    <EmptyPool>
                        <EmptyIcon>
                            <Users size={24} />
                        </EmptyIcon>
                        <EmptyText>
                            Wszystkie harmonogramy zostały już przypisane do tras
                        </EmptyText>
                    </EmptyPool>
                </PoolContent>
            </PoolContainer>
        );
    }

    return (
        <PoolContainer>
            <PoolHeader>
                <PoolTitle>
                    <Users size={16} />
                    Dostępne harmonogramy
                </PoolTitle>
                <PoolCount>{items.length}</PoolCount>
            </PoolHeader>
            <PoolContent>
                <ChildrenGrid>
                    {items.map(({ child, schedule }, idx) => (
                        <ChildCard
                            key={`${child.id}-${schedule.id}-${idx}`}
                            draggable
                            onDragStart={() => onDragStart(child, schedule)}
                            onDragEnd={onDragEnd}
                            title="Przeciągnij do trasy"
                        >
                            <ChildCardContent>
                                <ChildName>
                                    {child.firstName} {child.lastName}
                                </ChildName>
                                <ChildAge>{child.age} lat</ChildAge>
                                <div style={{
                                    fontSize: '0.6875rem',
                                    fontWeight: 600,
                                    color: '#7c3aed',
                                    marginTop: '0.25rem',
                                    marginBottom: '0.25rem'
                                }}>
                                    📅 {schedule.name}
                                </div>
                                <ChildScheduleStyle>
                                    <ScheduleItem>
                                        <Clock size={11} />
                                        {schedule.pickupTime} - {schedule.dropoffTime}
                                    </ScheduleItem>
                                    <ScheduleItem>
                                        <MapPin size={11} />
                                        {schedule.pickupAddress.label}
                                    </ScheduleItem>
                                    <ScheduleItem>
                                        <MapPin size={11} />
                                        → {schedule.dropoffAddress.label}
                                    </ScheduleItem>
                                </ChildScheduleStyle>
                                {(child.transportNeeds.wheelchair ||
                                    child.transportNeeds.specialSeat ||
                                    child.transportNeeds.safetyBelt) && (
                                    <NeedsRow>
                                        {child.transportNeeds.wheelchair && (
                                            <NeedBadge $variant="wheelchair">
                                                Wózek
                                            </NeedBadge>
                                        )}
                                        {child.transportNeeds.specialSeat && (
                                            <NeedBadge $variant="seat">Fotelik</NeedBadge>
                                        )}
                                        {child.transportNeeds.safetyBelt && (
                                            <NeedBadge $variant="belt">Pas</NeedBadge>
                                        )}
                                    </NeedsRow>
                                )}
                            </ChildCardContent>
                        </ChildCard>
                    ))}
                </ChildrenGrid>
            </PoolContent>
        </PoolContainer>
    );
};