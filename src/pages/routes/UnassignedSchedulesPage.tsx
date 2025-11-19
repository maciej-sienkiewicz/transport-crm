// src/pages/routes/UnassignedSchedulesPage.tsx
import React from 'react';
import styled from 'styled-components';
import { SmartAssignmentDashboard } from '@/features/routes/components/SmartAssignmentDashboard';

const PageContainer = styled.div`
    min-height: 100vh;
    background: ${({ theme }) => theme.colors.slate[50]};
`;

export const UnassignedSchedulesPage: React.FC = () => {
    return (
        <PageContainer>
            <SmartAssignmentDashboard />
        </PageContainer>
    );
};