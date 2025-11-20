// src/features/routes/components/RouteMapModal/components/Sidebar/Sidebar.tsx
import React from 'react';
import { RefreshCw } from 'lucide-react';
import {
    SidebarContainer,
    RouteStats,
    StatRow,
    StatLabel,
    StatValue,
    ActionButtons,
    ActionButton,
} from './Sidebar.styles';
import { InfoBanner } from '../Banners/InfoBanner';
import { WarningBanner, ValidationErrors } from '../Banners/WarningBanner';
import { PointCard } from './PointCard';
import { RoutePoint, ValidationResult, RouteStats as StatsType } from '../../utils/types';
import { generatePointLabel } from '../../utils/pointLabels';

interface SidebarProps {
    editedPoints: RoutePoint[];
    stats: StatsType;
    validation: ValidationResult;
    needsRefresh: boolean;
    originalChildIndexMap: Record<string, number>;
    onRefreshMap: () => void;
    onMoveUp: (index: number) => void;
    onMoveDown: (index: number) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
                                                    editedPoints,
                                                    stats,
                                                    validation,
                                                    needsRefresh,
                                                    originalChildIndexMap,
                                                    onRefreshMap,
                                                    onMoveUp,
                                                    onMoveDown,
                                                }) => {
    return (
        <SidebarContainer>
            {stats.newPoints > 0 && <InfoBanner newPointsCount={stats.newPoints} />}

            <WarningBanner missingCount={stats.missingCoordinates} />

            <RouteStats>
                <StatRow>
                    <StatLabel>Wszystkich punktów:</StatLabel>
                    <StatValue>{stats.totalPoints}</StatValue>
                </StatRow>
                <StatRow>
                    <StatLabel>Istniejących:</StatLabel>
                    <StatValue>{stats.existingPoints}</StatValue>
                </StatRow>
                <StatRow>
                    <StatLabel>Nowych:</StatLabel>
                    <StatValue style={{ color: '#8b5cf6' }}>{stats.newPoints}</StatValue>
                </StatRow>
                <StatRow>
                    <StatLabel>Na mapie:</StatLabel>
                    <StatValue>{stats.validPoints}</StatValue>
                </StatRow>
            </RouteStats>

            {needsRefresh && (
                <ActionButtons>
                    <ActionButton
                        $variant="primary"
                        onClick={onRefreshMap}
                        disabled={!validation.isValid}
                    >
                        <RefreshCw size={16} />
                        Odśwież mapę
                    </ActionButton>
                </ActionButtons>
            )}

            <ValidationErrors errors={validation.errors} />

            {editedPoints.map((point, index) => {
                const childIndex = originalChildIndexMap[point.childName] ?? 0;
                const label = generatePointLabel(point.type, childIndex);

                return (
                    <PointCard
                        key={`${point.stopId}-${index}`}
                        point={point}
                        label={label}
                        index={index}
                        totalPoints={editedPoints.length}
                        onMoveUp={onMoveUp}
                        onMoveDown={onMoveDown}
                    />
                );
            })}
        </SidebarContainer>
    );
};