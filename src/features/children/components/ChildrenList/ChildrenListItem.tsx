import React, { useState } from 'react';
import { Eye, Edit2, Trash2 } from 'lucide-react';
import styled from 'styled-components';
import { ChildListItem } from '../../types';
import { useDeleteChild } from '../../hooks/useDeleteChild';
import { Table } from '@/shared/ui/Table';
import { Badge } from '@/shared/ui/Badge';
import { statusLabels } from '../../lib/constants';
import { formatDisabilities } from '../../lib/utils';

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

interface ChildrenListItemProps {
    child: ChildListItem;
}

export const ChildrenListItem: React.FC<ChildrenListItemProps> = ({ child }) => {
    const deleteChild = useDeleteChild();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (window.confirm(`Czy na pewno chcesz usunąć dziecko ${child.firstName} ${child.lastName}?`)) {
            setIsDeleting(true);
            try {
                await deleteChild.mutateAsync(child.id);
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
            case 'TEMPORARY_INACTIVE':
                return 'warning';
            default:
                return 'default';
        }
    };

    return (
        <Table.Row>
            <Table.Cell>
                {child.firstName} {child.lastName}
            </Table.Cell>
            <Table.Cell>{child.age} lat</Table.Cell>
            <Table.Cell>
                <Badge variant={getStatusVariant(child.status)}>
                    {statusLabels[child.status]}
                </Badge>
            </Table.Cell>
            <Table.Cell>{formatDisabilities(child.disability)}</Table.Cell>
            <Table.Cell>{child.guardiansCount}</Table.Cell>
            <ActionsCell>
                <ActionsGroup>
                    <ActionButton
                        onClick={() => window.location.href = `/children/${child.id}`}
                        title="Szczegóły"
                    >
                        <Eye size={16} />
                    </ActionButton>
                    <ActionButton
                        onClick={() => window.location.href = `/children/${child.id}/edit`}
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