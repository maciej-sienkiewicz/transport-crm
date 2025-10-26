import React from 'react';
import styled from 'styled-components';
import { RoutesList } from '@/features/routes/components/RoutesList';
import { Button } from '@/shared/ui/Button';
import { Plus } from 'lucide-react';

const PageContainer = styled.div`
    max-width: 1400px;
    margin: 0 auto;
    padding: ${({ theme }) => theme.spacing.xl};

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

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        font-size: 1.5rem;
    }
`;

const PageDescription = styled.p`
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.slate[600]};
`;

export const RoutesListPage: React.FC = () => {
    const handleCreateRoute = () => {
        window.location.href = '/routes/create';
    };

    return (
        <PageContainer>
            <PageHeader>
                <HeaderText>
                    <PageTitle>Trasy</PageTitle>
                    <PageDescription>
                        Zarządzaj trasami transportu dzieci
                    </PageDescription>
                </HeaderText>
                <Button onClick={handleCreateRoute} size="lg">
                    <Plus size={20} />
                    Zaplanuj trasę
                </Button>
            </PageHeader>
            <RoutesList />
        </PageContainer>
    );
};