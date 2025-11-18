import React from 'react';
import styled from 'styled-components';
import { Button } from '@/shared/ui/Button';
import { AlertType } from '../../types';
import { ALERT_TYPE_CONFIG } from '../../lib/constants';

const Card = styled.div<{ $hasIssues: boolean }>`
    background: white;
    border-radius: ${({ theme }) => theme.borderRadius.xl};
    box-shadow: ${({ theme }) => theme.shadows.sm};
    border: 1px solid ${({ theme }) => theme.colors.slate[200]};
    padding: ${({ theme }) => theme.spacing.lg};
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
    transition: all ${({ theme }) => theme.transitions.normal};
    cursor: ${({ $hasIssues }) => ($hasIssues ? 'pointer' : 'default')};

    &:hover {
        transform: ${({ $hasIssues }) => ($hasIssues ? 'translateY(-2px)' : 'none')};
        box-shadow: ${({ $hasIssues, theme }) =>
                $hasIssues ? theme.shadows.md : theme.shadows.sm};
        border-color: ${({ $hasIssues, theme }) =>
                $hasIssues ? theme.colors.primary[300] : theme.colors.slate[200]};
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        padding: ${({ theme }) => theme.spacing.md};
    }
`;

const CardHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.md};
`;

const IconWrapper = styled.div`
    width: 48px;
    height: 48px;
    border-radius: ${({ theme }) => theme.borderRadius.xl};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    background: ${({ theme }) => theme.colors.slate[100]};
    flex-shrink: 0;

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        width: 40px;
        height: 40px;
        font-size: 1.25rem;
    }
`;

const CountBadge = styled.div<{ $count: number }>`
    font-size: 2rem;
    font-weight: 700;
    color: ${({ $count, theme }) =>
            $count === 0 ? theme.colors.success[600] : theme.colors.slate[900]};
    line-height: 1;

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        font-size: 1.75rem;
    }
`;

const CardContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xs};
`;

const CardTitle = styled.h4`
    font-size: 0.875rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[700]};
    text-transform: uppercase;
    letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wide};
    margin: 0;

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        font-size: 0.8125rem;
    }
`;

const CardDescription = styled.p`
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.slate[600]};
    line-height: 1.5;
    margin: 0;

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        font-size: 0.8125rem;
    }
`;

const CardAction = styled.div`
    margin-top: ${({ theme }) => theme.spacing.sm};
`;

const EmptyStateIndicator = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.success[600]};
    font-weight: 600;
    margin-top: ${({ theme }) => theme.spacing.xs};
`;

interface AlertCardProps {
    type: AlertType;
    count: number;
}

export const AlertCard: React.FC<AlertCardProps> = ({ type, count }) => {
    const config = ALERT_TYPE_CONFIG[type];
    const hasIssues = count > 0;

    const handleAction = () => {
        if (hasIssues) {
            window.history.pushState({}, '', config.primaryAction.route);
            window.dispatchEvent(new PopStateEvent('popstate'));
        }
    };

    return (
        <Card $hasIssues={hasIssues} onClick={hasIssues ? handleAction : undefined}>
            <CardHeader>
                <IconWrapper>{config.icon}</IconWrapper>
                <CountBadge $count={count}>{count}</CountBadge>
            </CardHeader>
            <CardContent>
                <CardTitle>{config.title}</CardTitle>
                <CardDescription>{config.getDescription(count)}</CardDescription>
                {count === 0 && (
                    <EmptyStateIndicator>
                        ✅ Wszystko w porządku
                    </EmptyStateIndicator>
                )}
            </CardContent>
            {hasIssues && (
                <CardAction>
                    <Button variant="primary" size="sm" fullWidth>
                        {config.primaryAction.label} →
                    </Button>
                </CardAction>
            )}
        </Card>
    );
};