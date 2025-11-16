// src/pages/drivers/DriverDetailPage.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { DriverDetailView } from '@/features/drivers/components/DriverDetailView';
import { DriverForm } from '@/features/drivers/components/DriverForm';
import { useDriver } from '@/features/drivers/hooks/useDriver';
import { useUpdateDriver } from '@/features/drivers/hooks/useUpdateDriver';
import { Card } from '@/shared/ui/Card';
import { UpdateDriverFormData } from '@/features/drivers/lib/validation';

const PageContainer = styled.div`
    min-height: 100vh;
    background: ${({ theme }) => theme.colors.slate[50]};
`;

const FormContainer = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: ${({ theme }) => theme.spacing.xl};

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        padding: ${({ theme }) => theme.spacing.lg};
    }
`;

const PageHeader = styled.div`
    margin-bottom: ${({ theme }) => theme.spacing.xl};
    padding: ${({ theme }) => theme.spacing.xl};
    background: white;
    border-radius: ${({ theme }) => theme.borderRadius['2xl']};
    box-shadow: ${({ theme }) => theme.shadows.sm};
    border: 1px solid ${({ theme }) => theme.colors.slate[200]};
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

interface DriverDetailPageProps {
    id: string;
}

export const DriverDetailPage: React.FC<DriverDetailPageProps> = ({ id }) => {
    const [isEditing, setIsEditing] = useState(false);
    const { data: driver } = useDriver(id);
    const updateDriver = useUpdateDriver(id);

    const handleUpdate = async (data: UpdateDriverFormData) => {
        await updateDriver.mutateAsync(data);
        setIsEditing(false);
    };

    const handleBack = () => {
        window.location.href = '/drivers';
    };

    if (isEditing && driver) {
        return (
            <PageContainer>
                <FormContainer>
                    <PageHeader>
                        <PageTitle>Edytuj kierowcę</PageTitle>
                        <PageDescription>
                            Zaktualizuj dane kierowcy {driver.firstName} {driver.lastName}
                        </PageDescription>
                    </PageHeader>
                    <Card>
                        <Card.Content>
                            <DriverForm
                                mode="edit"
                                initialData={driver}
                                onSubmit={handleUpdate}
                                onCancel={() => setIsEditing(false)}
                                isLoading={updateDriver.isPending}
                            />
                        </Card.Content>
                    </Card>
                </FormContainer>
            </PageContainer>
        );
    }

    return (
        <DriverDetailView
            id={id}
            onEdit={() => setIsEditing(true)}
            onBack={handleBack}
        />
    );
};