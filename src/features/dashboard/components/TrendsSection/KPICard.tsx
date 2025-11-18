import React from 'react';
import styled from 'styled-components';
import { TrendDirection } from '../../types';

const Card = styled.div`
    background: white;
    border-radius: ${({ theme }) => theme.borderRadius.xl};
    box-shadow: ${({ theme }) => theme.shadows.sm};
    border: 1px solid ${({ theme }) => theme.colors.slate[200]};
    padding: ${({ theme }) => theme.spacing.lg};
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
    transition: all ${({ theme }) => theme.transitions.normal};

    &:hover {
        transform: translateY(-2px);
        box-shadow: ${({ theme }) => theme.shadows.md};
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        padding: ${({ theme }) => theme.spacing.md};
    }
`;

const CardHeader = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
`;

const Icon = styled.div`
    font-size: 1.5rem;
`;

const Label = styled.div`
    font-size: 0.875rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[700]};
    text-transform: uppercase;
    letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wide};
`;

const Value = styled.div`
    font-size: 2.5rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.slate[900]};
    line-height: 1;

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        font-size: 2rem;
    }
`;

const ChangeIndicator = styled.div<{ $direction: TrendDirection }>`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    font-size: 1rem;
    font-weight: 600;
    color: ${({ $direction, theme }) => {
        switch ($direction) {
            case 'UP':
                return theme.colors.success[600];
            case 'DOWN':
                return theme.colors.danger[600];
            case 'NEUTRAL':
                return theme.colors.slate[600];
        }
    }};

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        font-size: 0.9375rem;
    }
`;

interface KPICardProps {
    icon: string;
    label: string;
    value: number;
    change: {
        value: number;
        percentage: number;
        direction: TrendDirection;
    };
}

export const KPICard: React.FC<KPICardProps> = ({ icon, label, value, change }) => {
    const getChangeEmoji = () => {
        switch (change.direction) {
            case 'UP':
                return '📈';
            case 'DOWN':
                return '📉';
            case 'NEUTRAL':
                return '➡️';
        }
    };

    const formatChange = () => {
        const sign = change.value > 0 ? '+' : '';
        return `${sign}${change.percentage.toFixed(1)}%`;
    };

    return (
        <Card>
            <CardHeader>
                <Icon>{icon}</Icon>
                <Label>{label}</Label>
            </CardHeader>
            <Value>{value}</Value>
            <ChangeIndicator $direction={change.direction}>
                {getChangeEmoji()} {formatChange()}
            </ChangeIndicator>
        </Card>
    );
};