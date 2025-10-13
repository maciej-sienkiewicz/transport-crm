// src/pages/drivers/DriversListPage.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { DriversList } from '@/features/drivers/components/DriversList';
import { DriverForm } from '@/features/drivers/components/DriverForm';
import { useCreateDriver } from '@/features/drivers/hooks/useCreateDriver';
import { Card } from '@/shared/ui/Card';
import { CreateDriverFormData } from '@/features/drivers/lib/validation';

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

export const DriversListPage: React.FC = () => {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const createDriver = useCreateDriver();

    const handleCreate = async (data: CreateDriverFormData) => {
        await createDriver.mutateAsync(data);
        setShowCreateForm(false);
    };

    if (showCreateForm) {
        return (
            <PageContainer>
                <PageHeader>
                    <PageTitle>Dodaj nowego kierowcę</PageTitle>
                    <PageDescription>
                        Wypełnij formularz, aby dodać nowego kierowcę do systemu
                    </PageDescription>
                </PageHeader>
                <Card>
                    <Card.Content>
                        <DriverForm
                            mode="create"
                            onSubmit={handleCreate}
                            onCancel={() => setShowCreateForm(false)}
                            isLoading={createDriver.isPending}
                        />
                    </Card.Content>
                </Card>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <PageHeader>
                <PageTitle>Kierowcy</PageTitle>
                <PageDescription>
                    Zarządzaj kierowcami wykonującymi transport dzieci
                </PageDescription>
            </PageHeader>
            <DriversList onCreateClick={() => setShowCreateForm(true)} />
        </PageContainer>
    );
};