import React from 'react';
import styled from 'styled-components';
import { MultiRoutePlanner } from '@/features/routes/components/MultiRoutePlanner';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/ui/Button';

const PageContainer = styled.div`
    max-width: 1800px;
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
    line-height: 1.5;
`;

const FeatureHighlight = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: ${({ theme }) => theme.spacing.md};
    margin-top: ${({ theme }) => theme.spacing.md};
`;

const Feature = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
    background: ${({ theme }) => theme.colors.primary[50]};
    border-radius: ${({ theme }) => theme.borderRadius.full};
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.primary[700]};
    font-weight: 500;

    &::before {
        content: '✓';
        display: flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 16px;
        background: ${({ theme }) => theme.colors.primary[600]};
        color: white;
        border-radius: 50%;
        font-size: 0.75rem;
        font-weight: 700;
    }
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
                <PageTitle>Zaplanuj trasy na dzień</PageTitle>
                <PageDescription>
                    Nowy zaawansowany system planowania tras umożliwia tworzenie wielu tras jednocześnie.
                    Przeciągaj dzieci z puli do poszczególnych tras i optymalizuj wykorzystanie pojazdów.
                </PageDescription>
                <FeatureHighlight>
                    <Feature>Wiele tras jednocześnie</Feature>
                    <Feature>Drag & drop między trasami</Feature>
                    <Feature>Automatyczna walidacja pojemności</Feature>
                    <Feature>Zapis wszystkich tras na raz</Feature>
                </FeatureHighlight>
            </PageHeader>
            <MultiRoutePlanner />
        </PageContainer>
    );
};