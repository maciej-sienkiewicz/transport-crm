import React, { useState } from 'react';
import styled from 'styled-components';
import { GuardiansList } from '@/features/guardians/components/GuardiansList';
import { useCreateGuardian } from '@/features/guardians/hooks/useCreateGuardian';
import { Card } from '@/shared/ui/Card';
import { GuardianFormData } from '@/features/guardians/lib/validation';
import { GuardianForm } from '@/features/guardians/components/GuardianForm';


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
    const [showCreateForm, setShowCreateForm] = useState(false);
    const createGuardian = useCreateGuardian();

    const handleCreate = async (data: GuardianFormData) => {
        await createGuardian.mutateAsync(data);
        setShowCreateForm(false);
    };

    if (showCreateForm) {
        return (
            <PageContainer>
                <PageHeader>
                    <PageTitle>Dodaj nowego opiekuna</PageTitle>
                    <PageDescription>
                        Wypełnij formularz, aby dodać nowego opiekuna do systemu
                    </PageDescription>
                </PageHeader>
                <Card>
                    <Card.Content>
                        <GuardianForm
                            onSubmit={handleCreate}
                            onCancel={() => setShowCreateForm(false)}
                            isLoading={createGuardian.isPending}
                        />
                    </Card.Content>
                </Card>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <PageHeader>
                <PageTitle>Opiekunowie</PageTitle>
                <PageDescription>
                    Zarządzaj opiekunami dzieci korzystających z transportu
                </PageDescription>
            </PageHeader>
            <GuardiansList onCreateClick={() => setShowCreateForm(true)} />
        </PageContainer>
    );
};