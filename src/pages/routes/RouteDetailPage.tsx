import React from 'react';
import styled from 'styled-components';
import { RouteDetail } from '@/features/routes/components/RouteDetail';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/ui/Button';

const PageContainer = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
`;

const PageHeader = styled.div`
    /* Dodajemy padding tutaj, zamiast w PageContainer */
    padding: ${({ theme }) => theme.spacing.xl};
    padding-bottom: 0;
`;

const BackButton = styled(Button)`
    /* Usunięto margin-bottom, aby polegać na paddingu CockpitContainer */
`;

// Wrapper, który zajmie pozostałą dostępną wysokość
const DetailWrapper = styled.div`
    flex: 1;
    min-height: 0; // Zapobiega problemom z flex overflow
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
            <DetailWrapper>
                <RouteDetail id={id} />
            </DetailWrapper>
        </PageContainer>
    );
};