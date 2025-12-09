// src/features/statistics/components/MetricCard/MetricCard.tsx

import React from 'react';
import styled from 'styled-components';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const Card = styled.div`
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.slate[200]};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const IconWrapper = styled.div<{ $color: string }>`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const CardTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.slate[600]};
  text-transform: uppercase;
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wide};
  margin: 0;
`;

const Value = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.slate[900]};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const TrendContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Trend = styled.div<{ $direction: 'up' | 'down' | 'stable' }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ $direction, theme }) => {
    if ($direction === 'up') return theme.colors.success[600];
    if ($direction === 'down') return theme.colors.danger[600];
    return theme.colors.slate[500];
}};
`;

const Subtitle = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.slate[500]};
`;

interface MetricCardProps {
    icon: React.ReactNode;
    iconColor: string;
    title: string;
    value: string | number;
    trend?: {
        direction: 'up' | 'down' | 'stable';
        value: number;
        isPositive?: boolean; // Whether "up" is good or bad
    };
    subtitle?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
                                                          icon,
                                                          iconColor,
                                                          title,
                                                          value,
                                                          trend,
                                                          subtitle,
                                                      }) => {
    const getTrendIcon = (direction: 'up' | 'down' | 'stable') => {
        if (direction === 'up') return <TrendingUp size={14} />;
        if (direction === 'down') return <TrendingDown size={14} />;
        return <Minus size={14} />;
    };

    return (
        <Card>
            <CardHeader>
                <IconWrapper $color={iconColor}>{icon}</IconWrapper>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <Value>{value}</Value>
            {trend && (
                <TrendContainer>
                    <Trend $direction={trend.direction}>
                        {getTrendIcon(trend.direction)}
                        {trend.value}%
                    </Trend>
                    {subtitle && <Subtitle>{subtitle}</Subtitle>}
                </TrendContainer>
            )}
            {!trend && subtitle && <Subtitle>{subtitle}</Subtitle>}
        </Card>
    );
};