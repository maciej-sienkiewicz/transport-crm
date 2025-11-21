// src/features/children/components/RouteSearchManagement/RouteSearchManagement.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { Search, RefreshCw, TrendingUp, History } from 'lucide-react';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { useChildRoutes } from '../../hooks/useChildRoutes';
import { RouteSearchTable } from './RouteSearchTable';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const SearchSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const SearchHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Title = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.slate[900]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const SearchForm = styled.form`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: flex-end;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchInputWrapper = styled.div`
  flex: 1;
  min-width: 200px;
`;

const QuickFilters = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`;

const QuickFilterButton = styled.button<{ $active?: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: ${({ $active, theme }) =>
    $active ? theme.gradients.primaryButton : 'white'};
  color: ${({ $active }) => ($active ? 'white' : '#64748b')};
  border: 1px solid ${({ $active, theme }) =>
    $active ? 'transparent' : theme.colors.slate[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ $active, theme }) =>
    $active ? theme.gradients.primaryButton : theme.colors.slate[50]};
    border-color: ${({ theme }) => theme.colors.primary[300]};
  }
`;

const TabsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  border-bottom: 2px solid ${({ theme }) => theme.colors.slate[200]};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background: ${({ $active, theme }) =>
    $active ? theme.gradients.primaryButton : 'transparent'};
  color: ${({ $active }) => ($active ? 'white' : '#64748b')};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.lg} ${({ theme }) => theme.borderRadius.lg} 0 0;
  font-weight: 600;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  &:hover {
    background: ${({ $active, theme }) =>
    $active ? theme.gradients.primaryButton : theme.colors.slate[100]};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    font-size: 0.875rem;
  }
`;

const InfoBox = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.primary[50]};
  border-left: 3px solid ${({ theme }) => theme.colors.primary[500]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.slate[700]};
  line-height: 1.5;
`;

const StatsBar = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.gradients.cardHeader};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px solid ${({ theme }) => theme.colors.slate[200]};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const StatLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.slate[600]};
  text-transform: uppercase;
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wide};
`;

const StatValue = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.slate[900]};
`;

interface RouteSearchManagementProps {
    childId: string;
}

type TabType = 'history' | 'upcoming';

export const RouteSearchManagement: React.FC<RouteSearchManagementProps> = ({ childId }) => {
    const [activeTab, setActiveTab] = useState<TabType>('history');
    const [selectedDate, setSelectedDate] = useState('');
    const [dateRange, setDateRange] = useState<{ from: string; to: string } | null>(null);

    const { data, isLoading, refetch } = useChildRoutes(childId, {
        date: selectedDate || undefined,
        from: dateRange?.from,
        to: dateRange?.to,
        type: activeTab,
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        refetch();
    };

    const handleQuickFilter = (days: number) => {
        const today = new Date();
        const targetDate = new Date();

        if (activeTab === 'history') {
            targetDate.setDate(today.getDate() - days);
        } else {
            targetDate.setDate(today.getDate() + days);
        }

        setSelectedDate(targetDate.toISOString().split('T')[0]);
        setDateRange(null);
    };

    const handleClearFilters = () => {
        setSelectedDate('');
        setDateRange(null);
    };

    const getTodayDate = () => {
        return new Date().toISOString().split('T')[0];
    };

    const routes = data?.routes || [];
    const stats = data?.stats;

    return (
        <Container>
            <SearchSection>
                <SearchHeader>
                    <Title>
                        <Search size={20} />
                        Wyszukiwanie tras
                    </Title>
                </SearchHeader>

                <TabsContainer>
                    <Tab $active={activeTab === 'history'} onClick={() => setActiveTab('history')}>
                        <History size={16} />
                        Historia tras
                    </Tab>
                    <Tab $active={activeTab === 'upcoming'} onClick={() => setActiveTab('upcoming')}>
                        <TrendingUp size={16} />
                        Nadchodzące trasy
                    </Tab>
                </TabsContainer>

                <SearchForm onSubmit={handleSearch}>
                    <SearchInputWrapper>
                        <Input
                            type="date"
                            label="Data trasy"
                            value={selectedDate}
                            onChange={(e) => {
                                setSelectedDate(e.target.value);
                                setDateRange(null);
                            }}
                            max={activeTab === 'history' ? getTodayDate() : undefined}
                            min={activeTab === 'upcoming' ? getTodayDate() : undefined}
                        />
                    </SearchInputWrapper>
                    <Button type="submit" disabled={isLoading}>
                        <Search size={16} />
                        Szukaj
                    </Button>
                    <Button type="button" variant="secondary" onClick={handleClearFilters}>
                        <RefreshCw size={16} />
                        Wyczyść
                    </Button>
                </SearchForm>

                <QuickFilters>
                    {activeTab === 'history' ? (
                        <>
                            <QuickFilterButton onClick={() => handleQuickFilter(0)}>
                                Dzisiaj
                            </QuickFilterButton>
                            <QuickFilterButton onClick={() => handleQuickFilter(1)}>
                                Wczoraj
                            </QuickFilterButton>
                            <QuickFilterButton onClick={() => handleQuickFilter(7)}>
                                7 dni temu
                            </QuickFilterButton>
                            <QuickFilterButton onClick={() => handleQuickFilter(30)}>
                                30 dni temu
                            </QuickFilterButton>
                        </>
                    ) : (
                        <>
                            <QuickFilterButton onClick={() => handleQuickFilter(0)}>
                                Dzisiaj
                            </QuickFilterButton>
                            <QuickFilterButton onClick={() => handleQuickFilter(1)}>
                                Jutro
                            </QuickFilterButton>
                            <QuickFilterButton onClick={() => handleQuickFilter(7)}>
                                Za 7 dni
                            </QuickFilterButton>
                            <QuickFilterButton onClick={() => handleQuickFilter(30)}>
                                Za 30 dni
                            </QuickFilterButton>
                        </>
                    )}
                </QuickFilters>
            </SearchSection>

            {stats && (
                <StatsBar>
                    <StatItem>
                        <StatLabel>Znalezione trasy</StatLabel>
                        <StatValue>{stats.totalRoutes}</StatValue>
                    </StatItem>
                    <StatItem>
                        <StatLabel>Łącznie przystanków</StatLabel>
                        <StatValue>{stats.totalStops}</StatValue>
                    </StatItem>
                    {stats.completedRoutes !== undefined && (
                        <StatItem>
                            <StatLabel>Ukończone trasy</StatLabel>
                            <StatValue>{stats.completedRoutes}</StatValue>
                        </StatItem>
                    )}
                </StatsBar>
            )}

            <RouteSearchTable routes={routes} isLoading={isLoading} type={activeTab} />
        </Container>
    );
};