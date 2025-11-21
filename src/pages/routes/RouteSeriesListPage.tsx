// src/pages/routes/RouteSeriesListPage.tsx

import React from 'react';
import styled from 'styled-components';
import { RouteSeriesList } from '@/features/routes/components/RouteSeriesList';
import { Repeat } from 'lucide-react';

const PageContainer = styled.div`
    max-width: 1400px;
    margin: 0 auto;
    padding: ${({ theme }) => theme.spacing.xl
};

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        padding: ${({ theme }) => theme.spacing.lg};
    }
`;

const PageHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: ${({ theme }) => theme.spacing.xl};
    gap: ${({ theme }) => theme.spacing.md};

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        flex-direction: column;
    }
`;

const HeaderText = styled.div`
    flex: 1;
`;

const PageTitle = styled.h1`
    font-size: 1.875rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.slate[900]};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        font-size: 1.5rem;
    }
`;

const PageDescription = styled.p`
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.slate[600]};
`;

const QuickLink = styled.a`
    display: inline-flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    background: ${({ theme }) => theme.colors.primary[50]};
    color: ${({ theme }) => theme.colors.primary[700]};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    font-size: 0.875rem;
    font-weight: 600;
    text-decoration: none;
    transition: all ${({ theme }) => theme.transitions.fast};

    &:hover {
        background: ${({ theme }) => theme.colors.primary[100]};
        transform: translateX(2px);
    }
`;

export const RouteSeriesListPage: React.FC = () => {
    return (
        <PageContainer>
            <PageHeader>
                <HeaderText>
                    <PageTitle>
                        <Repeat size={32} />
                        Serie cyklicznych tras
                    </PageTitle>
                    <PageDescription>
                        Zarządzaj cyklicznymi trasami, które powtarzają się co tydzień lub w regularnych
                        interwałach
                    </PageDescription>
                </HeaderText>
                <QuickLink href="/routes">
                    Zobacz wszystkie trasy →
                </QuickLink>
            </PageHeader>
            <RouteSeriesList />
        </PageContainer>
    );
};
