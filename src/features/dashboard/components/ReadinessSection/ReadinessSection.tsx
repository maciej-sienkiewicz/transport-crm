// src/features/dashboard/components/ReadinessSection/ReadinessSection.tsx

import React from 'react';
import { DayColumn } from './DayColumn';
import { DayColumnData } from '../../types';
import { SectionContainer } from './ReadinessSection.styles';

interface ReadinessSectionProps {
    todayData: DayColumnData;
    tomorrowData: DayColumnData;
}

export const ReadinessSection: React.FC<ReadinessSectionProps> = ({
                                                                      todayData,
                                                                      tomorrowData
                                                                  }) => {
    return (
        <SectionContainer>
            <DayColumn data={todayData} />
            <DayColumn data={tomorrowData} />
        </SectionContainer>
    );
};