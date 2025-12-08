import React from 'react';
import styled from 'styled-components';
import { AlertTriangle, Clock } from 'lucide-react';
import { StopDelayInfo, DelayDetectionType } from '../../types';

const BadgeContainer = styled.div<{ $type: DelayDetectionType }>`
    display: inline-flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
    background: ${({ theme, $type }) =>
    $type === 'RETROSPECTIVE'
        ? theme.colors.red[50]
        : theme.colors.orange[50]};
    color: ${({ theme, $type }) =>
    $type === 'RETROSPECTIVE'
        ? theme.colors.red[700]
        : theme.colors.orange[700]};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    font-size: 0.75rem;
    font-weight: 600;
    border: 1px solid ${({ theme, $type }) =>
    $type === 'RETROSPECTIVE'
        ? theme.colors.red[200]
        : theme.colors.orange[200]};
`;

const DelayText = styled.span`
    white-space: nowrap;
`;

interface DelayBadgeProps {
    delayInfo: StopDelayInfo;
    showType?: boolean;
}

export const DelayBadge: React.FC<DelayBadgeProps> = ({ delayInfo, showType = false }) => {
    const Icon = delayInfo.delayType === 'RETROSPECTIVE' ? AlertTriangle : Clock;

    return (
        <BadgeContainer $type={delayInfo.delayType}>
            <Icon size={12} />
            <DelayText>
                Opóźnienie: {delayInfo.delayMinutes} min
                {showType && (
                    <> ({delayInfo.delayType === 'RETROSPECTIVE' ? 'Wykonany' : 'Oczekiwany'})</>
                )}
            </DelayText>
        </BadgeContainer>
    );
};