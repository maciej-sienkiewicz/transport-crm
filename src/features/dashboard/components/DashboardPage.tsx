// src/features/dashboard/components/DashboardPage.tsx

import React, { useState } from 'react';
import styled from 'styled-components';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { ReadinessSection } from './ReadinessSection/ReadinessSection';
import { AlertsSection } from './AlertsSection/AlertsSection';
import { TrendsSection } from './TrendsSection/TrendsSection';

const PageContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.slate[50]};
  padding: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.slate[200]};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.md};
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const PageTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.slate[900]};
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.tight};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 1.5rem;
  }
`;

const PageDescription = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.slate[600]};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 0.9375rem;
  }
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const LastUpdate = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.slate[500]};
`;

const ContentGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.slate[200]};
  margin: ${({ theme }) => theme.spacing.lg} 0;
`;

const SectionHeader = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.slate[900]};
  text-transform: uppercase;
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wide};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const DashboardPage: React.FC = () => {
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Data na jutro (domyślnie)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowISO = tomorrow.toISOString().split('T')[0];

    const handleRefresh = async () => {
        setIsRefreshing(true);
        // Symulacja odświeżania - w rzeczywistości React Query automatycznie refetch'uje
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setLastUpdate(new Date());
        setIsRefreshing(false);
    };

    const formatLastUpdate = () => {
        const now = new Date();
        const diff = Math.floor((now.getTime() - lastUpdate.getTime()) / 60000);

        if (diff < 1) return 'Przed chwilą';
        if (diff === 1) return 'Przed 1 min';
        if (diff < 60) return `Przed ${diff} min`;

        const hours = Math.floor(diff / 60);
        if (hours === 1) return 'Przed 1 godz';
        return `Przed ${hours} godz`;
    };

    return (
        <PageContainer>
            <PageHeader>
                <HeaderLeft>
                    <PageTitle>🏠 Dashboard</PageTitle>
                    <PageDescription>
                        Przegląd kluczowych wskaźników i alertów systemu
                    </PageDescription>
                </HeaderLeft>
                <HeaderRight>
                    <LastUpdate>{formatLastUpdate()}</LastUpdate>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleRefresh}
                        isLoading={isRefreshing}
                    >
                        <RefreshCw size={16} />
                        Odśwież
                    </Button>
                </HeaderRight>
            </PageHeader>

            <ContentGrid>
                {/* Sekcja 1: Gotowość Operacyjna */}
                <ReadinessSection date={tomorrowISO} />

                <Divider />

                {/* Sekcja 2: Alerty */}
                <div>
                    <SectionHeader>🚨 WYMAGAJĄ NATYCHMIASTOWEJ UWAGI</SectionHeader>
                    <AlertsSection />
                </div>

                <Divider />

                {/* Sekcja 3: Trendy */}
                <div>
                    <SectionHeader>📈 TRENDY</SectionHeader>
                    <TrendsSection />
                </div>
            </ContentGrid>
        </PageContainer>
    );
};