// src/features/dashboard/components/AlertsSection/AlertCard.tsx

import React from 'react';
import styled from 'styled-components';
import { Users, Truck, AlertCircle, FileWarning, MapPin } from 'lucide-react';
import { AlertType } from '../../types';
import { ALERT_TYPE_LABELS } from '../../lib/constants';

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
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
    border-color: ${({ theme }) => theme.colors.primary[300]};
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const IconWrapper = styled.div<{ $variant: 'primary' | 'warning' | 'danger' }>`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $variant, theme }) => {
    switch ($variant) {
        case 'primary':
            return theme.colors.primary[100];
        case 'warning':
            return theme.colors.warning[100];
        case 'danger':
            return theme.colors.danger[100];
    }
}};
  color: ${({ $variant, theme }) => {
    switch ($variant) {
        case 'primary':
            return theme.colors.primary[700];
        case 'warning':
            return theme.colors.warning[700];
        case 'danger':
            return theme.colors.danger[700];
    }
}};
`;

const CountBadge = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.slate[900]};
`;

const CardTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.slate[700]};
`;

const CardDescription = styled.p`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.slate[600]};
`;

const ActionButton = styled.button`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: 0.8125rem;
  font-weight: 600;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: none;
  background: ${({ theme }) => theme.gradients.primaryButton};
  color: white;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    transform: translateX(2px);
  }
`;

interface AlertCardProps {
    type: AlertType;
    count: number;
    onActionClick: () => void;
}

export const AlertCard: React.FC<AlertCardProps> = ({ type, count, onActionClick }) => {
    const getIcon = () => {
        switch (type) {
            case 'CHILDREN_NO_ROUTES':
                return <Users size={24} />;
            case 'ROUTES_NO_DRIVERS':
                return <MapPin size={24} />;
            case 'DRIVER_DOCUMENTS':
                return <FileWarning size={24} />;
            case 'VEHICLE_DOCUMENTS':
                return <Truck size={24} />;
            case 'ROUTES_NO_VEHICLES':
                return <AlertCircle size={24} />;
        }
    };

    const getVariant = (): 'primary' | 'warning' | 'danger' => {
        if (count === 0) return 'primary';
        if (count < 5) return 'warning';
        return 'danger';
    };

    const getActionLabel = () => {
        switch (type) {
            case 'CHILDREN_NO_ROUTES':
                return 'Rozwiąż →';
            case 'ROUTES_NO_DRIVERS':
                return 'Przypisz →';
            case 'DRIVER_DOCUMENTS':
            case 'VEHICLE_DOCUMENTS':
                return 'Zobacz →';
            case 'ROUTES_NO_VEHICLES':
                return 'Przypisz →';
        }
    };

    return (
        <Card onClick={onActionClick}>
            <CardHeader>
                <IconWrapper $variant={getVariant()}>{getIcon()}</IconWrapper>
                <CountBadge>{count}</CountBadge>
            </CardHeader>
            <div>
                <CardTitle>{ALERT_TYPE_LABELS[type]}</CardTitle>
                <CardDescription>
                    {count === 0
                        ? 'Wszystko w porządku'
                        : `${count} ${count === 1 ? 'wymaga' : 'wymagają'} uwagi`}
                </CardDescription>
            </div>
            {count > 0 && <ActionButton>{getActionLabel()}</ActionButton>}
        </Card>
    );
};