import React, { RefObject } from 'react';
import { Check, MapPin, Phone, Ban, CheckCircle, XCircle, AlertCircle, Clock, MoreVertical } from 'lucide-react';
import { RouteStop } from '../../types';
import { executionStatusLabels } from '../../hooks/useRouteDetailLogic';
import { DelayBadge } from '../DelayBadge';
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
import styled from 'styled-components';

const StopActions = styled.button`
    position: absolute;
    top: ${({ theme }) => theme.spacing.xs};
    right: ${({ theme }) => theme.spacing.xs};
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    border: none;
    background: transparent;
    color: ${({ theme }) => theme.colors.slate[400]};
    cursor: pointer;
    transition: all ${({ theme }) => theme.transitions.fast};
    z-index: 10;
    opacity: 0;
    pointer-events: none;

    &:hover {
        background: ${({ theme }) => theme.colors.slate[100]};
        color: ${({ theme }) => theme.colors.slate[600]};
    }

    &:active {
        background: ${({ theme }) => theme.colors.slate[200]};
        transform: scale(0.95);
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        opacity: 1;
        pointer-events: auto;
    }
`;

const TimelineStopWrapper = styled.div`
    &:hover ${StopActions} {
        opacity: 1;
        pointer-events: auto;
    }
`;

const DelaySection = styled.div`
    margin-top: ${({ theme }) => theme.spacing.sm};
    padding: ${({ theme }) => theme.spacing.sm};
    background: ${({ theme }) => theme.colors.orange[50]};
    border-left: 3px solid ${({ theme }) => theme.colors.orange[500]};
    border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const DelayHeader = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    font-size: 0.875rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.orange[900]};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const DelayDetails = styled.div`
    font-size: 0.8125rem;
    color: ${({ theme }) => theme.colors.slate[700]};
    line-height: 1.5;

    strong {
        font-weight: 600;
        color: ${({ theme }) => theme.colors.slate[900]};
    }
`;

const StopHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.sm};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const StopHeaderLeft = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xs};
    flex: 1;
`;

const StopHeaderRight = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: ${({ theme }) => theme.spacing.xs};
`;

interface RouteTimelineProps {
    displayStops: RouteStop[];
    isEditMode: boolean;
    stopRefs: RefObject<Record<string, HTMLDivElement | null>>;
    activeStopId: string | null;
    handleChildClick: (id: string) => void;
    handleStopHover: (stop: RouteStop) => void;
    handleStopClick: (stop: RouteStop) => void;
    handleStopContextMenu?: (e: React.MouseEvent, stop: RouteStop) => void;
    canEditStops?: boolean;
}

export const RouteTimeline: React.FC<RouteTimelineProps> = ({
                                                                displayStops,
                                                                stopRefs,
                                                                activeStopId,
                                                                handleChildClick,
                                                                handleStopHover,
                                                                handleStopClick,
                                                                handleStopContextMenu,
                                                                canEditStops = false,
                                                            }) => {
    const formatTime = (isoString: string): string => {
        const date = new Date(isoString);
        return date.toLocaleTimeString('pl-PL', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getDelayTypeLabel = (type: string): string => {
        return type === 'RETROSPECTIVE'
            ? 'Wykonany po czasie'
            : 'Przekroczony czas planowany';
    };

    return (
        <RouteTimelineContainer>
            {displayStops.map((stop) => {
                const isCancelled = !!stop.isCancelled;
                const isExecuted = !!stop.executionStatus;
                const isCurrent = false;
                const canEdit = canEditStops && !isCancelled && !isExecuted;
                const hasDelay = !!stop.delayInfo;

                return (
                    <TimelineStopWrapper key={stop.id}>
                        <TimelineStop
                            ref={(el) => {
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
                                {isExecuted && <Check size={10} color="white" />}
                            </TimelineDot>

                            <TimelineContent $isCancelled={isCancelled}>
                                {canEdit && handleStopContextMenu && (
                                    <StopActions
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleStopContextMenu(e, stop);
                                        }}
                                        title="Więcej opcji"
                                    >
                                        <MoreVertical size={16} />
                                    </StopActions>
                                )}

                                <StopHeader>
                                    <StopHeaderLeft>
                                        <StopTypeBadge $type={stop.stopType}>
                                            {stop.stopType === 'PICKUP' ? '🚪 Odbiór' : '🏠 Dowóz'}
                                        </StopTypeBadge>
                                        <ChildName
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleChildClick(stop.childId);
                                            }}
                                        >
                                            {stop.childFirstName} {stop.childLastName}
                                        </ChildName>
                                    </StopHeaderLeft>

                                    <StopHeaderRight>
                                        {hasDelay && <DelayBadge delayInfo={stop.delayInfo!} />}
                                    </StopHeaderRight>
                                </StopHeader>

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
                                            <AddressLabel>{stop.address.label} - </AddressLabel>
                                        )}
                                        {stop.address.street} {stop.address.houseNumber}
                                        {stop.address.apartmentNumber &&
                                            `/${stop.address.apartmentNumber}`}
                                        , {stop.address.postalCode} {stop.address.city}
                                    </div>
                                </AddressRow>

                                <TimeRow>
                                    <TimeItem>
                                        <Clock size={14} />
                                        <strong>Planowany:</strong> {stop.estimatedTime}
                                    </TimeItem>
                                    {stop.actualTime && (
                                        <TimeItem>
                                            <Clock size={14} />
                                            <strong>Rzeczywisty:</strong> {formatTime(stop.actualTime)}
                                        </TimeItem>
                                    )}
                                    <TimeItem>
                                        <Phone size={14} />
                                        <strong>Opiekun:</strong> {stop.guardian.phone}
                                    </TimeItem>
                                </TimeRow>

                                {hasDelay && (
                                    <DelaySection>
                                        <DelayHeader>
                                            <AlertCircle size={16} />
                                            Szczegóły opóźnienia
                                        </DelayHeader>
                                        <DelayDetails>
                                            <div>
                                                <strong>Typ:</strong> {getDelayTypeLabel(stop.delayInfo!.delayType)}
                                            </div>
                                            <div>
                                                <strong>Wykryto:</strong>{' '}
                                                {new Date(stop.delayInfo!.detectedAt).toLocaleString('pl-PL', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </div>
                                        </DelayDetails>
                                    </DelaySection>
                                )}

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
                                                    {new Date(stop.cancelledAt).toLocaleString('pl-PL')}
                                                </div>
                                            )}
                                            {stop.cancellationReason && (
                                                <div
                                                    style={{
                                                        marginTop: '4px',
                                                    }}
                                                >
                                                    <strong>Powód:</strong> {stop.cancellationReason}
                                                </div>
                                            )}
                                        </CancellationDetails>
                                    </CancellationSection>
                                )}

                                {!stop.isCancelled && stop.executionStatus && (
                                    <ExecutionSection $status={stop.executionStatus}>
                                        <ExecutionHeader $status={stop.executionStatus}>
                                            {stop.executionStatus === 'COMPLETED' && (
                                                <CheckCircle size={16} />
                                            )}
                                            {stop.executionStatus === 'NO_SHOW' && (
                                                <AlertCircle size={16} />
                                            )}
                                            {stop.executionStatus === 'REFUSED' && (
                                                <XCircle size={16} />
                                            )}
                                            Wykonanie stopu
                                        </ExecutionHeader>
                                        <ExecutionDetails $status={stop.executionStatus}>
                                            <div>
                                                <strong>Status:</strong>{' '}
                                                {executionStatusLabels[stop.executionStatus]}
                                            </div>
                                            {stop.executedByName && (
                                                <div>
                                                    <strong>Wykonawca:</strong> {stop.executedByName}
                                                </div>
                                            )}
                                            {stop.executionNotes && (
                                                <div style={{ marginTop: '4px' }}>
                                                    <strong>Notatki:</strong> {stop.executionNotes}
                                                </div>
                                            )}
                                        </ExecutionDetails>
                                    </ExecutionSection>
                                )}
                            </TimelineContent>
                        </TimelineStop>
                    </TimelineStopWrapper>
                );
            })}
        </RouteTimelineContainer>
    );
};