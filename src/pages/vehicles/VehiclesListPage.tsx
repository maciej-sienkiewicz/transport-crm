// src/pages/vehicles/VehiclesListPage.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { VehiclesList } from "@/features/vehicles/components/VehiclesList";

import { VehicleForm } from '@/features/vehicles/components/VehicleForm';
import { useCreateVehicle } from '@/features/vehicles/hooks/useCreateVehicle';
import { Card } from '@/shared/ui/Card';
import { CreateVehicleFormData } from '@/features/vehicles/lib/validation';

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

export const VehiclesListPage: React.FC = () => {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const createVehicle = useCreateVehicle();

    const handleCreate = async (data: CreateVehicleFormData) => {
        await createVehicle.mutateAsync(data);
        setShowCreateForm(false);
    };

    if (showCreateForm) {
        return (
            <PageContainer>
                <PageHeader>
                    <PageTitle>Dodaj nowy pojazd</PageTitle>
                    <PageDescription>
                        Wypełnij formularz, aby dodać nowy pojazd do floty
                    </PageDescription>
                </PageHeader>
                <Card>
                    <Card.Content>
                        <VehicleForm
                            mode="create"
                            onSubmit={handleCreate}
                            onCancel={() => setShowCreateForm(false)}
                            isLoading={createVehicle.isPending}
                        />
                    </Card.Content>
                </Card>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <PageHeader>
                <PageTitle>Pojazdy</PageTitle>
                <PageDescription>
                    Zarządzaj flotą pojazdów wykorzystywanych do transportu
                </PageDescription>
            </PageHeader>
            <VehiclesList onCreateClick={() => setShowCreateForm(true)} />
        </PageContainer>
    );
};