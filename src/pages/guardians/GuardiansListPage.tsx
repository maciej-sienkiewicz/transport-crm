import React, { useState } from 'react';
import styled from 'styled-components';
import { GuardiansList } from '@/features/guardians/components/GuardiansList';
import { CreateGuardianModal } from '@/features/guardians/components/CreateGuardianModal';
import { useCreateGuardian } from '@/features/guardians/hooks/useCreateGuardian';
import { CreateGuardianRequest } from '@/features/guardians/types';

const PageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;

const PageHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const PageTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.slate[900]};
  margin-bottom: ${({ theme }) => theme.spacing.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 1.5rem;
  }
`;

const PageDescription = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.slate[600]};
`;

export const GuardiansListPage: React.FC = () => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const createGuardian = useCreateGuardian();

    const handleCreate = async (data: CreateGuardianRequest) => {
        await createGuardian.mutateAsync(data);
        setShowCreateModal(false);
    };

    return (
        <PageContainer>
            <PageHeader>
                <PageTitle>Opiekunowie</PageTitle>
                <PageDescription>
                    Zarządzaj opiekunami dzieci korzystających z transportu
                </PageDescription>
            </PageHeader>
            <GuardiansList onCreateClick={() => setShowCreateModal(true)} />

            <CreateGuardianModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSubmit={handleCreate}
                isLoading={createGuardian.isPending}
            />
        </PageContainer>
    );
};