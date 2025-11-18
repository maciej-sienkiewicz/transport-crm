// src/features/dashboard/components/TrendsSection/TrendItem.tsx

import React from 'react';
import styled from 'styled-components';
import { Users, Calendar, XCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const ItemContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.slate[50]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
`;

const IconWrapper = styled.div`
  flex-shrink: 0;
`;

const ItemContent = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const ItemLabel = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.slate[700]};
  min-width: 100px;
`;

const ValuesRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  font-size: 0.875rem;
`;

const Value = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.slate[900]};
`;

const Arrow = styled.span`
  color: ${({ theme }) => theme.colors.slate[400]};
`;

const ChangeIndicator = styled.div<{ $direction: 'UP' | 'DOWN' | 'NEUTRAL' }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.8125rem;
  font-weight: 600;
  background: ${({ $direction, theme }) => {
    switch ($direction) {
        case 'UP':
            return theme.colors.success[100];
        case 'DOWN':
            return theme.colors.danger[100];
        case 'NEUTRAL':
            return theme.colors.slate[100];
    }
}};
  color: ${({ $direction, theme }) => {
    switch ($direction) {
        case 'UP':
            return theme.colors.success[700];
        case 'DOWN':
            return theme.colors.danger[700];
        case 'NEUTRAL':
            return theme.colors.slate[700];
    }
}};
`;

const InfoTooltip = styled.span`
  cursor: help;
  color: ${({ theme }) => theme.colors.slate[400]};
  font-size: 0.75rem;
`;

interface TrendItemProps {
    icon: 'children' | 'routes' | 'cancellations';
    label: string;
    previousValue: number;
    currentValue: number;
    change: {
        value: number;
        percentage: number;
        direction: 'UP' | 'DOWN' | 'NEUTRAL';
    };
    showInfo?: boolean;
    infoText?: string;
}

export const TrendItem: React.FC<TrendItemProps> = ({
                                                        icon,
                                                        label,
                                                        previousValue,
                                                        currentValue,
                                                        change,
                                                        showInfo,
                                                        infoText,
                                                    }) => {
    const getIcon = () => {
        switch (icon) {
            case 'children':
                return <Users size={20} color="#64748b" />;
            case 'routes':
                return <Calendar size={20} color="#64748b" />;
            case 'cancellations':
                return <XCircle size={20} color="#64748b" />;
        }
    };

    const getChangeIcon = () => {
        switch (change.direction) {
            case 'UP':
                return <TrendingUp size={14} />;
            case 'DOWN':
                return <TrendingDown size={14} />;
            case 'NEUTRAL':
                return <Minus size={14} />;
        }
    };

    const formatChange = () => {
        const sign = change.value > 0 ? '+' : '';
        return `${sign}${change.value} (${sign}${change.percentage.toFixed(1)}%)`;
    };

    return (
        <ItemContainer>
            <IconWrapper>{getIcon()}</IconWrapper>
            <ItemContent>
                <ItemLabel>{label}</ItemLabel>
                <ValuesRow>
                    <Value>{previousValue}</Value>
                    <Arrow>→</Arrow>
                    <Value>{currentValue}</Value>
                </ValuesRow>
                <ChangeIndicator $direction={change.direction}>
                    {getChangeIcon()}
                    {formatChange()}
                    {showInfo && infoText && (
                        <InfoTooltip title={infoText}>ⓘ</InfoTooltip>
                    )}
                </ChangeIndicator>
            </ItemContent>
        </ItemContainer>
    );
};