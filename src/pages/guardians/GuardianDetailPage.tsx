import React, { useState } from 'react';
import styled from 'styled-components';
import { GuardianDetail } from '@/features/guardians/components/GuardianDetail';
import { GuardianForm } from '@/features/guardians/components/GuardianForm';
import { useUpdateGuardian } from '@/features/guardians/hooks/useUpdateGuardian';
import { Card } from '@/shared/ui/Card';
import { GuardianFormData } from '@/features/guardians/lib/validation';
import {useGuardian} from "@/features/guardians/hooks/useGuardian.ts";

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

interface GuardianDetailPageProps {
    id: string;
}

export const GuardianDetailPage: React.FC<GuardianDetailPageProps> = ({ id }) => {
    const [isEditing, setIsEditing] = useState(false);
    const { data: guardian } = useGuardian(id);
    const updateGuardian = useUpdateGuardian(id);

    const handleUpdate = async (data: GuardianFormData) => {
        await updateGuardian.mutateAsync(data);
        setIsEditing(false);
    };

    const handleBack = () => {
        window.location.href = '/guardians';
    };

    if (isEditing && guardian) {
        return (
            <PageContainer>
                <PageHeader>
                    <PageTitle>Edytuj opiekuna</PageTitle>
                    <PageDescription>
                        Zaktualizuj dane opiekuna {guardian.firstName} {guardian.lastName}
                    </PageDescription>
                </PageHeader>
                <Card>
                    <Card.Content>
                        <GuardianForm
                            initialData={guardian}
                            onSubmit={handleUpdate}
                            onCancel={() => setIsEditing(false)}
                            isLoading={updateGuardian.isPending}
                        />
                    </Card.Content>
                </Card>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <GuardianDetail id={id} onEdit={() => setIsEditing(true)} onBack={handleBack} />
        </PageContainer>
    );
};