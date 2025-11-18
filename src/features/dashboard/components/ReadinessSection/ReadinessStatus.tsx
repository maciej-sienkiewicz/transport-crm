// src/features/dashboard/components/ReadinessSection/ReadinessStatus.tsx

import React from 'react';
import styled from 'styled-components';
import { ReadinessStatus as ReadinessStatusType } from '../../types';
import { READINESS_STATUS_LABELS, READINESS_STATUS_COLORS } from '../../lib/constants';

const StatusBanner = styled.div<{ $status: ReadinessStatusType }>`
  padding: ${({ theme }) => theme.spacing.lg};
  border: 2px solid;
  border-color: ${({ $status }) => READINESS_STATUS_COLORS[$status]};
  background: ${({ $status }) => {
    const color = READINESS_STATUS_COLORS[$status];
    return `${color}15`;
}};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  text-align: center;
`;

const StatusIcon = styled.div<{ $status: ReadinessStatusType }>`
  width: 48px;
  height: 48px;
  margin: 0 auto ${({ theme }) => theme.spacing.md};
  background: ${({ $status }) => READINESS_STATUS_COLORS[$status]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
`;

const StatusText = styled.div<{ $status: ReadinessStatusType }>`
  font-size: 1rem;
  font-weight: 700;
  color: ${({ $status }) => READINESS_STATUS_COLORS[$status]};
  text-transform: uppercase;
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wide};
`;

interface ReadinessStatusProps {
    status: ReadinessStatusType;
}

export const ReadinessStatus: React.FC<ReadinessStatusProps> = ({ status }) => {
    const getEmoji = () => {
        switch (status) {
            case 'READY':
                return '🟢';
            case 'WARNING':
                return '🟡';
            case 'CRITICAL':
                return '🔴';
        }
    };

    return (
        <StatusBanner $status={status}>
            <StatusIcon $status={status}>{getEmoji()}</StatusIcon>
            <StatusText $status={status}>{READINESS_STATUS_LABELS[status]}</StatusText>
        </StatusBanner>
    );
};