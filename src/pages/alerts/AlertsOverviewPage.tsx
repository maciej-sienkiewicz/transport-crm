// src/pages/alerts/AlertsOverviewPage.tsx

import React from 'react';
import styled from 'styled-components';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';

const PageContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.slate[50]};
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

export const AlertsOverviewPage: React.FC = () => {
    const handleBack = () => {
        window.location.href = '/dashboard';
    };

    return (
        <PageContainer>
            <PageHeader>
                <BackButton variant="ghost" onClick={handleBack}>
                    <ArrowLeft size={20} />
                    Powrót do Dashboard
                </BackButton>
                <PageTitle>Alerty systemu</PageTitle>
                <PageDescription>
                    Szczegółowy przegląd wszystkich alertów i problemów wymagających uwagi
                </PageDescription>
            </PageHeader>

            <Card>
                <Card.Content>
                    <p style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                        Szczegółowa strona alertów - do zaimplementowania
                    </p>
                </Card.Content>
            </Card>
        </PageContainer>
    );
};