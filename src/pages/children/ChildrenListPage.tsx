import React, { useState } from 'react';
import styled from 'styled-components';
import { ChildrenList } from '@/features/children/components/ChildrenList';
import { ChildForm } from '@/features/children/components/ChildForm';
import { useCreateChild } from '@/features/children/hooks/useCreateChild';
import { useGuardians } from '@/features/guardians/hooks/useGuardians';
import { Card } from '@/shared/ui/Card';
import { CreateChildFormData } from '@/features/children/lib/validation';

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

export const ChildrenListPage: React.FC = () => {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const createChild = useCreateChild();
    const { data: guardiansData } = useGuardians({ page: 0, size: 100 });

    const guardianOptions = guardiansData?.content.map((g) => ({
        value: g.id,
        label: `${g.firstName} ${g.lastName}`,
    })) || [];

    const handleCreate = async (data: CreateChildFormData) => {
        await createChild.mutateAsync(data);
        setShowCreateForm(false);
    };

    if (showCreateForm) {
        return (
            <PageContainer>
                <PageHeader>
                    <PageTitle>Dodaj nowe dziecko</PageTitle>
                    <PageDescription>
                        Wypełnij formularz, aby dodać nowe dziecko do systemu
                    </PageDescription>
                </PageHeader>
                <Card>
                    <Card.Content>
                        <ChildForm
                            mode="create"
                            guardianOptions={guardianOptions}
                            onSubmit={handleCreate}
                            onCancel={() => setShowCreateForm(false)}
                            isLoading={createChild.isPending}
                        />
                    </Card.Content>
                </Card>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <PageHeader>
                <PageTitle>Dzieci</PageTitle>
                <PageDescription>
                    Zarządzaj dziećmi korzystającymi z transportu
                </PageDescription>
            </PageHeader>
            <ChildrenList onCreateClick={() => {
                setShowCreateForm(true);
            }} />
        </PageContainer>
    );
};