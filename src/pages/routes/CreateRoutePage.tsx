import React from 'react';
import styled from 'styled-components';
import { MultiRoutePlanner } from '@/features/routes/components/MultiRoutePlanner';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/ui/Button';

const PageContainer = styled.div`
    width: 100%;
    padding: ${({ theme }) => theme.spacing.md};

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        padding: ${({ theme }) => theme.spacing.sm};
    }
`;

const PageHeader = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.md};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const BackButton = styled(Button)`
    flex-shrink: 0;
`;

const PageTitle = styled.h1`
    font-size: 1.25rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[900]};

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        font-size: 1.125rem;
    }
`;

export const CreateRoutePage: React.FC = () => {
    const handleBack = () => {
        window.location.href = '/routes';
    };

    return (
        <PageContainer>
            <PageHeader>
                <BackButton variant="ghost" size="sm" onClick={handleBack}>
                    <ArrowLeft size={18} />
                    Powrót
                </BackButton>
                <PageTitle>Planowanie tras</PageTitle>
            </PageHeader>
            <MultiRoutePlanner />
        </PageContainer>
    );
};