// src/pages/routes/RouteSeriesDetailPage.tsx

import React from 'react';
import styled from 'styled-components';
import { RouteSeriesDetail } from '@/features/routes/components/RouteSeriesDetail';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/ui/Button';

const PageContainer = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
`;

const PageHeader = styled.div`
    padding: ${({ theme }) => theme.spacing.xl};
    padding-bottom: 0;
`;

const BackButton = styled(Button)``;

const DetailWrapper = styled.div`
    flex: 1;
    min-height: 0;
`;

interface RouteSeriesDetailPageProps {
    id: string;
}

export const RouteSeriesDetailPage: React.FC<RouteSeriesDetailPageProps> = ({ id }) => {
    const handleBack = () => {
        window.location.href = '/routes/series';
    };

    return (
        <PageContainer>
            <PageHeader>
                <BackButton variant="ghost" onClick={handleBack}>
                    <ArrowLeft size={20} />
                    Powrót do serii tras
                </BackButton>
            </PageHeader>
            <DetailWrapper>
                <RouteSeriesDetail id={id} />
            </DetailWrapper>
        </PageContainer>
    );
};