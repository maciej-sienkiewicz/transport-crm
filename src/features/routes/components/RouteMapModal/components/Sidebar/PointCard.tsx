// src/features/routes/components/RouteMapModal/components/Sidebar/PointCard.tsx
import React from 'react';
import { MapPin, AlertCircle, ChevronUp, ChevronDown, Sparkles } from 'lucide-react';
import {
    PointCardContainer,
    NewPointBadge,
    PointOrder,
    PointInfo,
    PointChild,
    PointAddress,
    PointType,
    NoCoordinatesWarning,
    MoveButtons,
    MoveButton,
} from './PointCard.styles';
import { RoutePoint } from '../../utils/types';

interface PointCardProps {
    point: RoutePoint;
    label: string;
    index: number;
    totalPoints: number;
    onMoveUp: (index: number) => void;
    onMoveDown: (index: number) => void;
}

export const PointCard: React.FC<PointCardProps> = ({
                                                        point,
                                                        label,
                                                        index,
                                                        totalPoints,
                                                        onMoveUp,
                                                        onMoveDown,
                                                    }) => {
    return (
        <PointCardContainer
            $type={point.type}
            $noCoordinates={!point.hasCoordinates}
            $isNew={point.isNew}
        >
            {point.isNew && (
                <NewPointBadge>
                    <Sparkles size={10} />
                    Nowy
                </NewPointBadge>
            )}

            <PointOrder
                $type={point.type}
                $noCoordinates={!point.hasCoordinates}
                $isNew={point.isNew}
            >
                {label}
            </PointOrder>

            <PointInfo>
                <PointChild>{point.childName}</PointChild>
                <PointAddress>{point.address}</PointAddress>

                {!point.hasCoordinates && (
                    <NoCoordinatesWarning>
                        <AlertCircle size={12} />
                        Brak współrzędnych GPS
                    </NoCoordinatesWarning>
                )}

                <PointType $type={point.type}>
                    <MapPin size={12} />
                    {point.type === 'pickup' ? 'Odbiór' : 'Dowóz'}
                </PointType>
            </PointInfo>

            <MoveButtons>
                <MoveButton
                    onClick={() => onMoveUp(index)}
                    disabled={index === 0}
                    title="Przesuń w górę"
                >
                    <ChevronUp size={16} />
                </MoveButton>
                <MoveButton
                    onClick={() => onMoveDown(index)}
                    disabled={index === totalPoints - 1}
                    title="Przesuń w dół"
                >
                    <ChevronDown size={16} />
                </MoveButton>
            </MoveButtons>
        </PointCardContainer>
    );
};