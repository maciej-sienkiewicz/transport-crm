import React from 'react';
import styled from 'styled-components';
import { RouteDetail } from '@/features/routes/components/RouteDetail';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/ui/Button';

const PageContainer = styled.div`
    max-width: 1400px;
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

interface RouteDetailPageProps {
    id: string;
}

export const RouteDetailPage: React.FC<RouteDetailPageProps> = ({ id }) => {
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
            </PageHeader>
            <RouteDetail id={id} />
        </PageContainer>
    );
};