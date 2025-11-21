// src/features/routes/components/RouteSeriesDetail/SeriesInfoSection.tsx

import React from 'react';
import styled from 'styled-components';
import { User, Truck, Clock } from 'lucide-react';
import { RouteSeriesDetail } from '../../types';
import { SectionCard, SectionHeader, SectionTitle, SectionContent } from './RouteSeriesDetail.styles';

const InfoGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: ${({ theme }) => theme.spacing.lg};
`;

const InfoItem = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xs};
`;

const InfoLabel = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    font-size: 0.75rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[500]};
    text-transform: uppercase;
    letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wide};
`;

const InfoValue = styled.div`
    font-size: 0.9375rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[900]};
`;

interface SeriesInfoSectionProps {
    series: RouteSeriesDetail;
}

export const SeriesInfoSection: React.FC<SeriesInfoSectionProps> = ({ series }) => {
    return (
        <SectionCard>
            <SectionHeader>
                <SectionTitle>Informacje o serii</SectionTitle>
            </SectionHeader>
            <SectionContent>
                <InfoGrid>
                    <InfoItem>
                        <InfoLabel>
                            <User size={14} />
                            Kierowca
                        </InfoLabel>
                        <InfoValue>{series.driverId || 'Nie przypisano'}</InfoValue>
                    </InfoItem>
                    <InfoItem>
                        <InfoLabel>
                            <Truck size={14} />
                            Pojazd
                        </InfoLabel>
                        <InfoValue>{series.vehicleId || 'Nie przypisano'}</InfoValue>
                    </InfoItem>
                    <InfoItem>
                        <InfoLabel>
                            <Clock size={14} />
                            Planowany czas
                        </InfoLabel>
                        <InfoValue>
                            {series.estimatedStartTime} - {series.estimatedEndTime}
                        </InfoValue>
                    </InfoItem>
                </InfoGrid>
            </SectionContent>
        </SectionCard>
    );
};