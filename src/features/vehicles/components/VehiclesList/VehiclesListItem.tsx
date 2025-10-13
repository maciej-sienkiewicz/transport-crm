// src/features/vehicles/components/VehiclesList/VehiclesListItem.tsx
import React, { useState } from 'react';
import { Eye, Edit2, Trash2, AlertTriangle } from 'lucide-react';
import styled from 'styled-components';
import { VehicleListItem } from '../../types';
import { useDeleteVehicle } from '../../hooks/useDeleteVehicle';
import { Table } from '@/shared/ui/Table';
import { Badge } from '@/shared/ui/Badge';
import { vehicleStatusLabels, vehicleTypeLabels } from '../../lib/constants';
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

interface VehiclesListItemProps {
    vehicle: VehicleListItem;
}

export const VehiclesListItem: React.FC<VehiclesListItemProps> = ({ vehicle }) => {
    const deleteVehicle = useDeleteVehicle();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (window.confirm(`Czy na pewno chcesz usunąć pojazd ${vehicle.registrationNumber}?`)) {
            setIsDeleting(true);
            try {
                await deleteVehicle.mutateAsync(vehicle.id);
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'AVAILABLE':
                return 'success';
            case 'IN_ROUTE':
                return 'primary';
            case 'MAINTENANCE':
                return 'warning';
            case 'OUT_OF_SERVICE':
                return 'danger';
            default:
                return 'default';
        }
    };

    const hasWarning =
        isExpired(vehicle.insurance.validUntil) ||
        isExpired(vehicle.technicalInspection.validUntil) ||
        isExpiringWithin30Days(vehicle.insurance.validUntil) ||
        isExpiringWithin30Days(vehicle.technicalInspection.validUntil);

    return (
        <Table.Row>
            <Table.Cell>
                <WarningWrapper>
                    {vehicle.registrationNumber}
                    {hasWarning && (
                        <AlertTriangle size={16} color="#f59e0b" />
                    )}
                </WarningWrapper>
            </Table.Cell>
            <Table.Cell>
                {vehicle.make} {vehicle.model}
            </Table.Cell>
            <Table.Cell>{vehicle.year}</Table.Cell>
            <Table.Cell>{vehicleTypeLabels[vehicle.vehicleType]}</Table.Cell>
            <Table.Cell>
                {vehicle.capacity.totalSeats} (W: {vehicle.capacity.wheelchairSpaces})
            </Table.Cell>
            <Table.Cell>
                <Badge variant={getStatusVariant(vehicle.status)}>
                    {vehicleStatusLabels[vehicle.status]}
                </Badge>
            </Table.Cell>
            <ActionsCell>
                <ActionsGroup>
                    <ActionButton
                        onClick={() => window.location.href = `/vehicles/${vehicle.id}`}
                        title="Szczegóły"
                    >
                        <Eye size={16} />
                    </ActionButton>
                    <ActionButton
                        onClick={() => window.location.href = `/vehicles/${vehicle.id}/edit`}
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