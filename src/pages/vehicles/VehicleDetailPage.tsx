// src/pages/vehicles/VehicleDetailPage.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { VehicleDetail } from '@/features/vehicles/components/VehicleDetail';
import { VehicleForm } from '@/features/vehicles/components/VehicleForm';
import { useVehicle } from '@/features/vehicles/hooks/useVehicle';
import { useUpdateVehicle } from '@/features/vehicles/hooks/useUpdateVehicle';
import { Card } from '@/shared/ui/Card';
import { UpdateVehicleFormData } from '@/features/vehicles/lib/validation';

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

interface VehicleDetailPageProps {
    id: string;
}

export const VehicleDetailPage: React.FC<VehicleDetailPageProps> = ({ id }) => {
    const [isEditing, setIsEditing] = useState(false);
    const { data: vehicle } = useVehicle(id);
    const updateVehicle = useUpdateVehicle(id);

    const handleUpdate = async (data: UpdateVehicleFormData) => {
        await updateVehicle.mutateAsync(data);
        setIsEditing(false);
    };

    const handleBack = () => {
        window.location.href = '/vehicles';
    };

    if (isEditing && vehicle) {
        return (
            <PageContainer>
                <PageHeader>
                    <PageTitle>Edytuj pojazd</PageTitle>
                    <PageDescription>
                        Zaktualizuj dane pojazdu {vehicle.registrationNumber}
                    </PageDescription>
                </PageHeader>
                <Card>
                    <Card.Content>
                        <VehicleForm
                            mode="edit"
                            initialData={vehicle}
                            onSubmit={handleUpdate}
                            onCancel={() => setIsEditing(false)}
                            isLoading={updateVehicle.isPending}
                        />
                    </Card.Content>
                </Card>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <VehicleDetail id={id} onEdit={() => setIsEditing(true)} onBack={handleBack} />
        </PageContainer>
    );
};