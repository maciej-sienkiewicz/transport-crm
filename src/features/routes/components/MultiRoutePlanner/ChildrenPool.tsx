import React from 'react';
import { Users, Clock, MapPin } from 'lucide-react';
import { AvailableChild } from '../../types';
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
    ChildSchedule,
    ScheduleItem,
    NeedsRow,
    NeedBadge,
    EmptyPool,
    EmptyIcon,
    EmptyText,
} from './ChildrenPool.styles';

interface ChildrenPoolProps {
    children: AvailableChild[];
    onDragStart: (child: AvailableChild) => void;
    onDragEnd: () => void;
}

export const ChildrenPool: React.FC<ChildrenPoolProps> = ({
                                                              children,
                                                              onDragStart,
                                                              onDragEnd,
                                                          }) => {
    if (children.length === 0) {
        return (
            <PoolContainer>
                <PoolHeader>
                    <PoolTitle>
                        <Users size={16} />
                        Dostępne dzieci
                    </PoolTitle>
                    <PoolCount $isEmpty>0</PoolCount>
                </PoolHeader>
                <PoolContent>
                    <EmptyPool>
                        <EmptyIcon>
                            <Users size={24} />
                        </EmptyIcon>
                        <EmptyText>
                            Wszystkie dzieci zostały już przypisane do tras
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
                    Dostępne dzieci
                </PoolTitle>
                <PoolCount>{children.length}</PoolCount>
            </PoolHeader>
            <PoolContent>
                <ChildrenGrid>
                    {children.map((child) => (
                        <ChildCard
                            key={child.id}
                            draggable
                            onDragStart={() => onDragStart(child)}
                            onDragEnd={onDragEnd}
                            title="Przeciągnij do trasy"
                        >
                            <ChildCardContent>
                                <ChildName>
                                    {child.firstName} {child.lastName}
                                </ChildName>
                                <ChildAge>{child.age} lat</ChildAge>
                                <ChildSchedule>
                                    <ScheduleItem>
                                        <Clock size={11} />
                                        {child.schedule.pickupTime} - {child.schedule.dropoffTime}
                                    </ScheduleItem>
                                    <ScheduleItem>
                                        <MapPin size={11} />
                                        {child.schedule.pickupAddress.label}
                                    </ScheduleItem>
                                </ChildSchedule>
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