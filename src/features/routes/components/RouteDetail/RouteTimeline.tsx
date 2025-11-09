// src/features/routes/components/RouteDetail/RouteTimeline.tsx

import React, { RefObject } from 'react';
import { GripVertical, Check, MapPin, Phone, Ban, CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';
import { RouteStop } from '../../types';
import { executionStatusLabels } from '../../hooks/useRouteDetailLogic';
import {
    RouteTimelineContainer,
    TimelineStop,
    TimelineTrack,
    TimelineDot,
    TimelineContent,
    StopTypeBadge,
    ChildName,
    AddressRow,
    AddressLabel,
    TimeRow,
    TimeItem,
    CancellationSection,
    CancellationHeader,
    CancellationDetails,
    ExecutionSection,
    ExecutionHeader,
    ExecutionDetails,
} from './RouteTimeline.styles';

interface RouteTimelineProps {
    displayStops: RouteStop[];
    isEditMode: boolean;
    stopRefs: RefObject<Record<string, HTMLDivElement | null>>;
    activeStopId: string | null;
    handleChildClick: (id: string) => void;
    handleStopHover: (stop: RouteStop) => void;
    handleStopClick: (stop: RouteStop) => void;
}

export const RouteTimeline: React.FC<RouteTimelineProps> = ({
                                                                displayStops,
                                                                stopRefs,
                                                                activeStopId,
                                                                handleChildClick,
                                                                handleStopHover,
                                                                handleStopClick,
                                                            }) => {
    return (
        <RouteTimelineContainer>
            {displayStops.map((stop, index) => {
                const isCancelled = !!stop.isCancelled;
                const isExecuted = !!stop.executionStatus;
                const isCurrent = false;

                return (
                    <TimelineStop
                        key={stop.id}
                        ref={el => {
                            if (stopRefs && stopRefs.current) {
                                stopRefs.current[stop.id] = el;
                            }
                        }}
                        $isCancelled={isCancelled}
                        $isExecuted={isExecuted}
                        $isCurrent={isCurrent}
                        $isActive={activeStopId === stop.id}
                        onMouseEnter={() => handleStopHover(stop)}
                        onMouseLeave={() => handleStopHover(stop)}
                        onClick={() => handleStopClick(stop)}
                    >
                        <TimelineTrack />
                        <TimelineDot
                            $isCancelled={isCancelled}
                            $isExecuted={isExecuted}
                            $isCurrent={isCurrent}
                        >
                            {isExecuted && (
                                <Check size={10} color="white" />
                            )}
                        </TimelineDot>

                        <TimelineContent $isCancelled={isCancelled}>
                            <StopTypeBadge $type={stop.stopType}>
                                {stop.stopType === 'PICKUP'
                                    ? '📍 Odbiór'
                                    : '🏁 Dowóz'}
                            </StopTypeBadge>
                            <ChildName
                                onClick={e => {
                                    e.stopPropagation();
                                    handleChildClick(stop.childId);
                                }}
                            >
                                {stop.childFirstName} {stop.childLastName}
                            </ChildName>
                            <AddressRow>
                                <MapPin
                                    size={14}
                                    style={{
                                        flexShrink: 0,
                                        marginTop: '2px',
                                    }}
                                />
                                <div>
                                    {stop.address.label && (
                                        <AddressLabel>
                                            {stop.address.label} -{' '}
                                        </AddressLabel>
                                    )}
                                    {stop.address.street}{' '}
                                    {stop.address.houseNumber}
                                    {stop.address.apartmentNumber &&
                                        `/${stop.address.apartmentNumber}`}
                                    , {stop.address.postalCode}{' '}
                                    {stop.address.city}
                                </div>
                            </AddressRow>
                            <TimeRow>
                                <TimeItem>
                                    <Clock size={14} />
                                    <strong>Planowany:</strong>{' '}
                                    {stop.estimatedTime}
                                </TimeItem>
                                <TimeItem>
                                    <Phone size={14} />
                                    <strong>Opiekun:</strong>{' '}
                                    {stop.guardian.phone}
                                </TimeItem>
                            </TimeRow>
                            {stop.isCancelled && (
                                <CancellationSection>
                                    <CancellationHeader>
                                        <Ban size={16} />
                                        Stop anulowany
                                    </CancellationHeader>
                                    <CancellationDetails>
                                        {stop.cancelledAt && (
                                            <div>
                                                <strong>Data:</strong>{' '}
                                                {new Date(
                                                    stop.cancelledAt
                                                ).toLocaleString('pl-PL')}
                                            </div>
                                        )}
                                        {stop.cancellationReason && (
                                            <div
                                                style={{
                                                    marginTop: '4px',
                                                }}
                                            >
                                                <strong>Powód:</strong>{' '}
                                                {
                                                    stop.cancellationReason
                                                }
                                            </div>
                                        )}
                                    </CancellationDetails>
                                </CancellationSection>
                            )}
                            {!stop.isCancelled &&
                                stop.executionStatus && (
                                    <ExecutionSection
                                        $status={stop.executionStatus}
                                    >
                                        <ExecutionHeader
                                            $status={
                                                stop.executionStatus
                                            }
                                        >
                                            {stop.executionStatus ===
                                                'COMPLETED' && (
                                                    <CheckCircle size={16} />
                                                )}
                                            {stop.executionStatus ===
                                                'NO_SHOW' && (
                                                    <AlertCircle size={16} />
                                                )}
                                            {stop.executionStatus ===
                                                'REFUSED' && (
                                                    <XCircle size={16} />
                                                )}
                                            Wykonanie stopu
                                        </ExecutionHeader>
                                        <ExecutionDetails
                                            $status={
                                                stop.executionStatus
                                            }
                                        >
                                            <div>
                                                <strong>Status:</strong>{' '}
                                                {
                                                    executionStatusLabels[
                                                        stop.executionStatus
                                                        ]
                                                }
                                            </div>
                                        </ExecutionDetails>
                                    </ExecutionSection>
                                )}
                        </TimelineContent>
                    </TimelineStop>
                );
            })}
        </RouteTimelineContainer>
    );
};