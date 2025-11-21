// /routes/components/RouteDetail/RouteDetailTabs/RouteTimeline/RouteTimeline.styles.ts

import styled, { css, keyframes } from 'styled-components';
import {ExecutionStatus, StopType} from "@/features/routes/types.ts";

export const RouteTimelineContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0 ${({ theme }) => theme.spacing.sm};
`;

interface TimelineStopProps {
    $isCancelled?: boolean;
    $isExecuted?: boolean;
    $isCurrent?: boolean;
    $isActive?: boolean;
}

export const TimelineStop = styled.div<TimelineStopProps>`
    position: relative;
    display: grid;
    grid-template-columns: 48px 1fr;
    gap: ${({ theme }) => theme.spacing.sm};
    padding-bottom: ${({ theme }) => theme.spacing.xl};
    cursor: pointer;
    background: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.primary[50] : 'transparent'};
    transition: background 0.2s ease-in-out;

    &:hover {
        background: ${({ theme }) => theme.colors.slate[50]};
    }
`;

export const TimelineTrack = styled.div`
    position: absolute;
    width: 2px;
    background: ${({ theme }) => theme.colors.slate[200]};
    left: 23px;
    top: 0;
    bottom: 0;
    z-index: 1;

    ${TimelineStop}:first-child & {
        top: 20px;
    }

    ${TimelineStop}:last-child & {
        bottom: auto;
        height: 20px;
    }
`;

const pulseAnimation = keyframes`
    0% { box-shadow: 0 0 0 0px rgba(59, 130, 246, 0.4); }
    70% { box-shadow: 0 0 0 8px rgba(59, 130, 246, 0); }
    100% { box-shadow: 0 0 0 0px rgba(59, 130, 246, 0); }
`;

export const TimelineDot = styled.div<TimelineStopProps>`
    position: relative;
    top: 20px;
    left: 16px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: white;
    border: 2px solid;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease-in-out;

    border-color: ${({ theme }) => theme.colors.slate[400]};

    ${({ $isCancelled, theme }) =>
    $isCancelled &&
    css`
            border-color: ${theme.colors.danger[600]};
            background: ${theme.colors.danger[100]};
        `}

    ${({ $isExecuted, theme }) =>
    $isExecuted &&
    css`
            border-color: ${theme.colors.success[600]};
            background: ${theme.colors.success[600]};
        `}

    ${({ $isCurrent, theme }) =>
    $isCurrent &&
    css`
            width: 24px;
            height: 24px;
            left: 12px;
            top: 16px;
            border-color: ${theme.colors.primary[600]};
            background: ${theme.colors.primary[100]};
            animation: ${pulseAnimation} 2s infinite;
        `}
`;

export const TimelineContent = styled.div<{ $isCancelled?: boolean }>`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};
    position: relative;
    transition: opacity 0.2s ease-in-out;

    ${({ $isCancelled }) =>
    $isCancelled &&
    css`
            opacity: 0.5;
            text-decoration: line-through;
        `}
`;

export const DragHandle = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.colors.slate[400]};
    cursor: grab;
    padding: ${({ theme }) => theme.spacing.xs};
    z-index: 3;

    &:active {
        cursor: grabbing;
    }

    &:hover {
        color: ${({ theme }) => theme.colors.slate[600]};
    }
`;

export const StopTypeBadge = styled.span<{ $type: StopType }>`
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    background: ${({ theme, $type }) =>
    $type === 'PICKUP' ? theme.colors.primary[100] : theme.colors.success[100]};
    color: ${({ theme, $type }) =>
    $type === 'PICKUP' ? theme.colors.primary[700] : theme.colors.success[700]};
`;

export const ChildName = styled.button`
    font-size: 1rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.primary[700]};
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    text-align: left;
    transition: color ${({ theme }) => theme.transitions.fast};

    &:hover {
        color: ${({ theme }) => theme.colors.primary[800]};
        text-decoration: underline;
    }
`;

export const AddressRow = styled.div`
    display: flex;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.xs};
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.slate[600]};
    line-height: 1.5;
`;

export const AddressLabel = styled.span`
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[700]};
`;

export const TimeRow = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: ${({ theme }) => theme.spacing.md};
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.slate[600]};
`;

export const TimeItem = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
`;

export const CancellationSection = styled.div`
    padding: ${({ theme }) => theme.spacing.sm};
    background: ${({ theme }) => theme.colors.danger[50]};
    border: 1px solid ${({ theme }) => theme.colors.danger[200]};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    margin-top: ${({ theme }) => theme.spacing.sm};
`;

export const CancellationHeader = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
    color: ${({ theme }) => theme.colors.danger[700]};
    font-weight: 600;
    font-size: 0.8125rem;
    margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export const CancellationDetails = styled.div`
    font-size: 0.8125rem;
    color: ${({ theme }) => theme.colors.danger[600]};
    line-height: 1.5;
`;

export const ExecutionSection = styled.div<{ $status: ExecutionStatus }>`
    padding: ${({ theme }) => theme.spacing.sm};
    background: ${({ theme, $status }) => {
    switch ($status) {
        case 'COMPLETED':
            return theme.colors.success[50];
        case 'NO_SHOW':
            return theme.colors.warning[50];
        case 'REFUSED':
            return theme.colors.danger[50];
        default:
            return 'transparent';
    }
}};
    border: 1px solid ${({ theme, $status }) => {
    switch ($status) {
        case 'COMPLETED':
            return theme.colors.success[200];
        case 'NO_SHOW':
            return theme.colors.warning[200];
        case 'REFUSED':
            return theme.colors.danger[200];
        default:
            return 'transparent';
    }
}};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    margin-top: ${({ theme }) => theme.spacing.sm};
`;

export const ExecutionHeader = styled.div<{ $status: ExecutionStatus }>`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
    color: ${({ theme, $status }) => {
    switch ($status) {
        case 'COMPLETED':
            return theme.colors.success[700];
        case 'NO_SHOW':
            return theme.colors.warning[700];
        case 'REFUSED':
            return theme.colors.danger[700];
        default:
            return theme.colors.slate[700];
    }
}};
    font-weight: 600;
    font-size: 0.8125rem;
    margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export const ExecutionDetails = styled.div<{ $status: ExecutionStatus }>`
    font-size: 0.8125rem;
    color: ${({ theme, $status }) => {
    switch ($status) {
        case 'COMPLETED':
            return theme.colors.success[600];
        case 'NO_SHOW':
            return theme.colors.warning[600];
        case 'REFUSED':
            return theme.colors.danger[600];
        default:
            return theme.colors.slate[600];
    }
}};
    line-height: 1.5;
`;