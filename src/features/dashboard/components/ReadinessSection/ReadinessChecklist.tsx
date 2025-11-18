// src/features/dashboard/components/ReadinessSection/ReadinessChecklist.tsx

import React from 'react';
import styled from 'styled-components';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { ReadinessCheck } from '../../types';

const ChecklistContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const CheckItem = styled.div<{ $status: 'OK' | 'WARNING' | 'ERROR' }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  font-size: 0.875rem;
  color: ${({ $status, theme }) => {
    switch ($status) {
        case 'OK':
            return theme.colors.success[700];
        case 'WARNING':
            return theme.colors.warning[700];
        case 'ERROR':
            return theme.colors.danger[700];
    }
}};
`;

const IconWrapper = styled.div`
  flex-shrink: 0;
`;

interface ReadinessChecklistProps {
    checks: ReadinessCheck[];
}

export const ReadinessChecklist: React.FC<ReadinessChecklistProps> = ({ checks }) => {
    const getIcon = (status: ReadinessCheck['status']) => {
        switch (status) {
            case 'OK':
                return <CheckCircle size={18} />;
            case 'WARNING':
                return <AlertTriangle size={18} />;
            case 'ERROR':
                return <XCircle size={18} />;
        }
    };

    return (
        <ChecklistContainer>
            {checks.map((check, index) => (
                <CheckItem key={index} $status={check.status}>
                    <IconWrapper>{getIcon(check.status)}</IconWrapper>
                    <span>{check.message}</span>
                    {check.count !== undefined && check.totalCount !== undefined && (
                        <span>
              ({check.count}/{check.totalCount})
            </span>
                    )}
                </CheckItem>
            ))}
        </ChecklistContainer>
    );
};