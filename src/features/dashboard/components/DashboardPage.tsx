// src/features/dashboard/components/DashboardPage.tsx

import React, { useState } from 'react';
import styled from 'styled-components';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { useDashboardSummary } from '../hooks/useDashboardSummary';
import { ReadinessSection } from './ReadinessSection';
import { AlertsSection } from './AlertsSection';
import { TrendsSection } from './TrendsSection';
import { DayColumnData } from '../types';
import {
    getTodayISO,
    getTomorrowISO,
    formatDate,
    formatRelativeTime
} from '../lib/utils';
import { filterChecks } from '../lib/checkConfig';

// ============================================
// STYLED COMPONENTS
// ============================================

const PageContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.slate[50]};
  padding: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.lg};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.md};
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

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.md};
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
  margin: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 1.5rem;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 1.25rem;
  }
`;

const PageDescription = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.slate[600]};
  margin: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 0.9375rem;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 0.875rem;
  }
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
    justify-content: space-between;
  }
`;

const LastUpdate = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.slate[500]};
  white-space: nowrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 0.8125rem;
  }
`;

const ContentGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    gap: ${({ theme }) => theme.spacing.lg};
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.slate[200]};
  margin: ${({ theme }) => theme.spacing.lg} 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin: ${({ theme }) => theme.spacing.md} 0;
  }
`;

const SectionHeader = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.slate[900]};
  text-transform: uppercase;
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wide};
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 0.9375rem;
  }
`;

const ErrorContainer = styled.div`
  padding: ${({ theme }) => theme.spacing['2xl']};
  text-align: center;
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  border: 1px solid ${({ theme }) => theme.colors.slate[200]};
  box-shadow: ${({ theme }) => theme.shadows.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.xl};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;

const ErrorIcon = styled.div`
  font-size: 3rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 2.5rem;
  }
`;

const ErrorTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.slate[900]};
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 1rem;
  }
`;

const ErrorText = styled.p`
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.slate[600]};
  margin: 0 0 ${({ theme }) => theme.spacing.lg} 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 0.875rem;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  border: 1px solid ${({ theme }) => theme.colors.slate[200]};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

// ============================================
// COMPONENT
// ============================================

export const DashboardPage: React.FC = () => {
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

    // Pobierz daty ISO dla dzisiaj i jutro
    const todayISO = getTodayISO();
    const tomorrowISO = getTomorrowISO();

    // Równoległe fetche dla dzisiaj i jutro
    const {
        data: todayData,
        isLoading: todayLoading,
        error: todayError,
        refetch: refetchToday
    } = useDashboardSummary(todayISO);

    const {
        data: tomorrowData,
        isLoading: tomorrowLoading,
        error: tomorrowError,
        refetch: refetchTomorrow
    } = useDashboardSummary(tomorrowISO);

    // Aggregate loading i error states
    const isLoading = todayLoading || tomorrowLoading;
    const hasError = todayError || tomorrowError;

    // Handler dla przycisku odświeżania
    const handleRefresh = async () => {
        await Promise.all([refetchToday(), refetchTomorrow()]);
        setLastUpdate(new Date());
    };

    // Przygotuj dane dla DayColumn components
    const prepareDayColumnData = (): {
        todayData: DayColumnData;
        tomorrowData: DayColumnData;
    } | null => {
        if (!todayData || !tomorrowData) return null;

        return {
            todayData: {
                label: 'Dzisiaj',
                date: formatDate(todayISO),
                dateISO: todayISO,
                routesCount: todayData.readiness.routesCount,
                childrenCount: todayData.readiness.childrenCount,
                checks: filterChecks(todayData.readiness.checks)
            },
            tomorrowData: {
                label: 'Jutro',
                date: formatDate(tomorrowISO),
                dateISO: tomorrowISO,
                routesCount: tomorrowData.readiness.routesCount,
                childrenCount: tomorrowData.readiness.childrenCount,
                checks: filterChecks(tomorrowData.readiness.checks)
            }
        };
    };

    const columnData = prepareDayColumnData();

    // ============================================
    // LOADING STATE
    // ============================================

    if (isLoading) {
        return (
            <PageContainer>
                <PageHeader>
                    <HeaderLeft>
                        <PageTitle>🏠 Dashboard</PageTitle>
                        <PageDescription>
                            Przegląd kluczowych wskaźników i alertów systemu
                        </PageDescription>
                    </HeaderLeft>
                </PageHeader>
                <LoadingContainer>
                    <LoadingSpinner />
                </LoadingContainer>
            </PageContainer>
        );
    }

    // ============================================
    // ERROR STATE
    // ============================================

    if (hasError || !columnData) {
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
                        <Button variant="secondary" size="sm" onClick={handleRefresh}>
                            <RefreshCw size={16} />
                            Odśwież
                        </Button>
                    </HeaderRight>
                </PageHeader>
                <ErrorContainer>
                    <ErrorIcon>⚠️</ErrorIcon>
                    <ErrorTitle>Nie udało się załadować danych</ErrorTitle>
                    <ErrorText>
                        Sprawdź połączenie internetowe i spróbuj ponownie
                    </ErrorText>
                    <Button variant="primary" onClick={handleRefresh}>
                        Spróbuj ponownie
                    </Button>
                </ErrorContainer>
            </PageContainer>
        );
    }

    // ============================================
    // SUCCESS STATE
    // ============================================

    return (
        <PageContainer>
            {/* Header */}
            <PageHeader>
                <HeaderLeft>
                    <PageTitle>🏠 Dashboard</PageTitle>
                    <PageDescription>
                        Przegląd kluczowych wskaźników i alertów systemu
                    </PageDescription>
                </HeaderLeft>
                <HeaderRight>
                    <LastUpdate>{formatRelativeTime(lastUpdate)}</LastUpdate>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleRefresh}
                    >
                        <RefreshCw size={16} />
                        Odśwież
                    </Button>
                </HeaderRight>
            </PageHeader>

            <ContentGrid>
                {/* Sekcja 1: Gotowość operacyjna - Dzisiaj vs Jutro */}
                <ReadinessSection
                    todayData={columnData.todayData}
                    tomorrowData={columnData.tomorrowData}
                />

                <Divider />

                {/* Sekcja 2: Alerty wymagające uwagi */}
                <div>
                    <SectionHeader>🚨 Wymagają natychmiastowej uwagi</SectionHeader>
                    <AlertsSection />
                </div>

                <Divider />

                {/* Sekcja 3: Trendy tygodniowe */}
                <div>
                    <SectionHeader>📈 Trendy</SectionHeader>
                    <TrendsSection />
                </div>
            </ContentGrid>
        </PageContainer>
    );
};