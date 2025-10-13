// src/features/children/components/GuardianAssignmentManagement/GuardianAssignmentManagement.tsx
import React, { useState } from 'react';
import { Plus, Trash2, User } from 'lucide-react';
import styled from 'styled-components';
import { ChildGuardian, GuardianRelationship } from '../../types';
import { useAssignGuardian } from '../../hooks/useAssignGuardian';
import { useUnassignGuardian } from '../../hooks/useUnassignGuardian';
import { useGuardians } from '@/features/guardians/hooks/useGuardians';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { Modal } from '@/shared/ui/Modal';
import { Select } from '@/shared/ui/Select';
import { Checkbox } from '@/shared/ui/Checkbox';
import { relationshipLabels, relationshipOptions } from '../../lib/constants';

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SectionTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.slate[900]};
`;

const GuardiansGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const GuardianCard = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.slate[200]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const GuardianHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  gap: ${({ theme }) => theme.spacing.sm};
`;

const GuardianInfo = styled.div`
  flex: 1;
  cursor: pointer;
`;

const GuardianName = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.slate[900]};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const GuardianDetail = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.slate[600]};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const IconButton = styled.button`
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
    background: ${({ theme }) => theme.colors.danger[50]};
    color: ${({ theme }) => theme.colors.danger[600]};
  }
`;

const GuardianBadges = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const EmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  color: ${({ theme }) => theme.colors.slate[500]};
  background: ${({ theme }) => theme.colors.slate[50]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px dashed ${({ theme }) => theme.colors.slate[300]};
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column-reverse;

    button {
      width: 100%;
    }
  }
`;

interface GuardianAssignmentManagementProps {
    childId: string;
    guardians: ChildGuardian[];
}

export const GuardianAssignmentManagement: React.FC<
    GuardianAssignmentManagementProps
> = ({ childId, guardians }) => {
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedGuardianId, setSelectedGuardianId] = useState('');
    const [relationship, setRelationship] = useState<GuardianRelationship | ''>('');
    const [isPrimary, setIsPrimary] = useState(false);
    const [canPickup, setCanPickup] = useState(true);
    const [canAuthorize, setCanAuthorize] = useState(true);

    const { data: availableGuardians } = useGuardians({ page: 0, size: 100 });
    const assignGuardian = useAssignGuardian(childId);
    const unassignGuardian = useUnassignGuardian(childId);

    const assignedGuardianIds = guardians.map((g) => g.id);
    const unassignedGuardians =
        availableGuardians?.content.filter((g) => !assignedGuardianIds.includes(g.id)) || [];

    const guardianOptions = unassignedGuardians.map((g) => ({
        value: g.id,
        label: `${g.firstName} ${g.lastName}`,
    }));

    const handleAssign = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedGuardianId || !relationship) return;

        await assignGuardian.mutateAsync({
            guardianId: selectedGuardianId,
            data: {
                relationship: relationship as GuardianRelationship,
                isPrimary,
                canPickup,
                canAuthorize,
            },
        });

        setShowAssignModal(false);
        setSelectedGuardianId('');
        setRelationship('');
        setIsPrimary(false);
        setCanPickup(true);
        setCanAuthorize(true);
    };

    const handleUnassign = async (guardianId: string, guardianName: string) => {
        if (
            window.confirm(`Czy na pewno chcesz odłączyć opiekuna ${guardianName} od tego dziecka?`)
        ) {
            await unassignGuardian.mutateAsync(guardianId);
        }
    };

    return (
        <>
            <SectionHeader>
                <SectionTitle>Opiekunowie ({guardians.length})</SectionTitle>
                <Button
                    size="sm"
                    onClick={() => setShowAssignModal(true)}
                    disabled={unassignedGuardians.length === 0}
                >
                    <Plus size={16} />
                    Przypisz opiekuna
                </Button>
            </SectionHeader>

            {guardians.length === 0 ? (
                <EmptyState>
                    <User size={32} style={{ margin: '0 auto 1rem' }} />
                    <p>Brak przypisanych opiekunów</p>
                    <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                        Przypisz opiekuna, aby mógł odbierać dziecko i otrzymywać powiadomienia
                    </p>
                </EmptyState>
            ) : (
                <GuardiansGrid>
                    {guardians.map((guardian) => (
                        <GuardianCard key={guardian.id}>
                            <GuardianHeader>
                                <GuardianInfo
                                    onClick={() => (window.location.href = `/guardians/${guardian.id}`)}
                                >
                                    <GuardianName>
                                        {guardian.firstName} {guardian.lastName}
                                    </GuardianName>
                                    <GuardianDetail>{guardian.email}</GuardianDetail>
                                    <GuardianDetail>{guardian.phone}</GuardianDetail>
                                    <GuardianDetail>
                                        {relationshipLabels[guardian.relationship]}
                                    </GuardianDetail>
                                </GuardianInfo>
                                <IconButton
                                    onClick={() =>
                                        handleUnassign(
                                            guardian.id,
                                            `${guardian.firstName} ${guardian.lastName}`
                                        )
                                    }
                                    title="Odłącz opiekuna"
                                >
                                    <Trash2 size={16} />
                                </IconButton>
                            </GuardianHeader>
                            <GuardianBadges>
                                {guardian.isPrimary && <Badge variant="success">Opiekun główny</Badge>}
                                {guardian.canPickup && <Badge variant="primary">Może odbierać</Badge>}
                                {guardian.canAuthorize && <Badge variant="primary">Może autoryzować</Badge>}
                            </GuardianBadges>
                        </GuardianCard>
                    ))}
                </GuardiansGrid>
            )}

            <Modal
                isOpen={showAssignModal}
                onClose={() => setShowAssignModal(false)}
                title="Przypisz opiekuna"
            >
                <FormContainer onSubmit={handleAssign}>
                    <Select
                        label="Opiekun"
                        value={selectedGuardianId}
                        onChange={(e) => setSelectedGuardianId(e.target.value)}
                        options={guardianOptions}
                        required
                    />

                    <Select
                        label="Relacja"
                        value={relationship}
                        onChange={(e) => setRelationship(e.target.value as GuardianRelationship)}
                        options={relationshipOptions}
                        required
                    />

                    <Checkbox
                        label="Opiekun główny"
                        checked={isPrimary}
                        onChange={(e) => setIsPrimary(e.target.checked)}
                    />

                    <Checkbox
                        label="Może odbierać dziecko"
                        checked={canPickup}
                        onChange={(e) => setCanPickup(e.target.checked)}
                    />

                    <Checkbox
                        label="Może autoryzować zmiany"
                        checked={canAuthorize}
                        onChange={(e) => setCanAuthorize(e.target.checked)}
                    />

                    <FormActions>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setShowAssignModal(false)}
                            disabled={assignGuardian.isPending}
                        >
                            Anuluj
                        </Button>
                        <Button type="submit" isLoading={assignGuardian.isPending}>
                            Przypisz
                        </Button>
                    </FormActions>
                </FormContainer>
            </Modal>
        </>
    );
};