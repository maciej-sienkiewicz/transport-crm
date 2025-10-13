// src/features/drivers/components/DriversList/DriversListItem.tsx
import React, { useState } from 'react';
import { Eye, Edit2, Trash2, AlertTriangle } from 'lucide-react';
import styled from 'styled-components';
import { DriverListItem } from '../../types';
import { useDeleteDriver } from '../../hooks/useDeleteDriver';
import { Table } from '@/shared/ui/Table';
import { Badge } from '@/shared/ui/Badge';
import { driverStatusLabels } from '../../lib/constants';
import { isExpiringWithin30Days, isExpired } from '../../lib/utils';

const ActionsCell = styled(Table.Cell)`
    text-align: right;
`;

const ActionButton = styled.button`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    padding: 0;
    background: transparent;
    border: none;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    color: ${({ theme }) => theme.colors.slate[600]};
    cursor: pointer;
    transition: all ${({ theme }) => theme.transitions.fast};

    &:hover {
        background: ${({ theme }) => theme.colors.slate[100]};
        color: ${({ theme }) => theme.colors.slate[900]};
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const ActionsGroup = styled.div`
    display: inline-flex;
    gap: ${({ theme }) => theme.spacing.xs};
`;

const WarningWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
`;

const CategoriesList = styled.span`
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.slate[600]};
`;

interface DriversListItemProps {
    driver: DriverListItem;
}

export const DriversListItem: React.FC<DriversListItemProps> = ({ driver }) => {
    const deleteDriver = useDeleteDriver();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (window.confirm(`Czy na pewno chcesz usunąć kierowcę ${driver.firstName} ${driver.lastName}?`)) {
            setIsDeleting(true);
            try {
                await deleteDriver.mutateAsync(driver.id);
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return 'success';
            case 'INACTIVE':
                return 'danger';
            case 'ON_LEAVE':
                return 'warning';
            default:
                return 'default';
        }
    };

    const hasWarning =
        isExpired(driver.drivingLicense.validUntil) ||
        isExpired(driver.medicalCertificate.validUntil) ||
        isExpiringWithin30Days(driver.drivingLicense.validUntil) ||
        isExpiringWithin30Days(driver.medicalCertificate.validUntil);

    return (
        <Table.Row>
            <Table.Cell>
                <WarningWrapper>
                    {driver.firstName} {driver.lastName}
                    {hasWarning && (
                        <AlertTriangle size={16} color="#f59e0b" />
                    )}
                </WarningWrapper>
            </Table.Cell>
            <Table.Cell>{driver.email}</Table.Cell>
            <Table.Cell>{driver.phone}</Table.Cell>
            <Table.Cell>
                <CategoriesList>
                    {driver.drivingLicense.categories.join(', ')}
                </CategoriesList>
            </Table.Cell>
            <Table.Cell>
                <Badge variant={getStatusVariant(driver.status)}>
                    {driverStatusLabels[driver.status]}
                </Badge>
            </Table.Cell>
            <Table.Cell>{driver.todayRoutesCount}</Table.Cell>
            <ActionsCell>
                <ActionsGroup>
                    <ActionButton
                        onClick={() => window.location.href = `/drivers/${driver.id}`}
                        title="Szczegóły"
                    >
                        <Eye size={16} />
                    </ActionButton>
                    <ActionButton
                        onClick={() => window.location.href = `/drivers/${driver.id}/edit`}
                        title="Edytuj"
                    >
                        <Edit2 size={16} />
                    </ActionButton>
                    <ActionButton
                        onClick={handleDelete}
                        disabled={isDeleting}
                        title="Usuń"
                    >
                        <Trash2 size={16} />
                    </ActionButton>
                </ActionsGroup>
            </ActionsCell>
        </Table.Row>
    );
};