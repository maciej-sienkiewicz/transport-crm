import React from 'react';
import styled from 'styled-components';
import { RoutePlanner } from '@/features/routes/components/RoutePlanner';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/ui/Button';

const PageContainer = styled.div`
    max-width: 1600px;
    margin: 0 auto;
    padding: ${({ theme }) => theme.spacing.xl};

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        padding: ${({ theme }) => theme.spacing.lg};
    }
`;

const PageHeader = styled.div`
    margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const BackButton = styled(Button)`
    margin-bottom: ${({ theme }) => theme.spacing.md};
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

export const CreateRoutePage: React.FC = () => {
    const handleBack = () => {
        window.location.href = '/routes';
    };

    return (
        <PageContainer>
            <PageHeader>
                <BackButton variant="ghost" onClick={handleBack}>
                    <ArrowLeft size={20} />
                    Powrót do listy tras
                </BackButton>
                <PageTitle>Zaplanuj nową trasę</PageTitle>
                <PageDescription>
                    Wybierz datę, pojazd i kierowcę, a następnie dodaj dzieci do trasy przeciągając je z listy dostępnych
                </PageDescription>
            </PageHeader>
            <RoutePlanner />
        </PageContainer>
    );
};