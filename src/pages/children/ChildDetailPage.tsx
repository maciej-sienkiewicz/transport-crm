import React, { useState } from 'react';
import styled from 'styled-components';
import { ChildDetail } from '@/features/children/components/ChildDetail';
import { ChildForm } from '@/features/children/components/ChildForm';
import { useChild } from '@/features/children/hooks/useChild';
import { useUpdateChild } from '@/features/children/hooks/useUpdateChild';
import { Card } from '@/shared/ui/Card';
import { UpdateChildFormData } from '@/features/children/lib/validation';

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

interface ChildDetailPageProps {
    id: string;
}

export const ChildDetailPage: React.FC<ChildDetailPageProps> = ({ id }) => {
    const [isEditing, setIsEditing] = useState(false);
    const { data: child } = useChild(id);
    const updateChild = useUpdateChild(id);

    const handleUpdate = async (data: UpdateChildFormData) => {
        await updateChild.mutateAsync(data);
        setIsEditing(false);
    };

    const handleBack = () => {
        window.location.href = '/children';
    };

    if (isEditing && child) {
        return (
            <PageContainer>
                <PageHeader>
                    <PageTitle>Edytuj dziecko</PageTitle>
                    <PageDescription>
                        Zaktualizuj dane dziecka {child.firstName} {child.lastName}
                    </PageDescription>
                </PageHeader>
                <Card>
                    <Card.Content>
                        <ChildForm
                            mode="edit"
                            initialData={child}
                            onSubmit={handleUpdate}
                            onCancel={() => setIsEditing(false)}
                            isLoading={updateChild.isPending}
                        />
                    </Card.Content>
                </Card>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <ChildDetail id={id} onEdit={() => setIsEditing(true)} onBack={handleBack} />
        </PageContainer>
    );
};