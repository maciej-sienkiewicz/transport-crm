import React, { useState } from 'react';
import { Eye, Edit2, Trash2 } from 'lucide-react';
import styled from 'styled-components';
import { GuardianListItem } from '../../types';
import { useDeleteGuardian } from '../../hooks/useDeleteGuardian';
import { Table } from '@/shared/ui/Table';

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
`;

const ActionsGroup = styled.div`
  display: inline-flex;
  gap: ${({ theme }) => theme.spacing.xs};
`;

interface GuardiansListItemProps {
    guardian: GuardianListItem;
}

export const GuardiansListItem: React.FC<GuardiansListItemProps> = ({ guardian }) => {
    const deleteGuardian = useDeleteGuardian();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (window.confirm(`Czy na pewno chcesz usunąć opiekuna ${guardian.firstName} ${guardian.lastName}?`)) {
            setIsDeleting(true);
            try {
                await deleteGuardian.mutateAsync(guardian.id);
            } finally {
                setIsDeleting(false);
            }
        }
    };

    return (
        <Table.Row>
            <Table.Cell>
                {guardian.firstName} {guardian.lastName}
            </Table.Cell>
            <Table.Cell>{guardian.email}</Table.Cell>
            <Table.Cell>{guardian.phone}</Table.Cell>
            <Table.Cell>{guardian.childrenCount}</Table.Cell>
            <ActionsCell>
                <ActionsGroup>
                    <ActionButton
                        onClick={() => window.location.href = `/guardians/${guardian.id}`}
                        title="Szczegóły"
                    >
                        <Eye size={16} />
                    </ActionButton>
                    <ActionButton
                        onClick={() => window.location.href = `/guardians/${guardian.id}/edit`}
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