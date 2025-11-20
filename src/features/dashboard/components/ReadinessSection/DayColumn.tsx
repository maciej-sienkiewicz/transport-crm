// src/features/dashboard/components/ReadinessSection/DayColumn.tsx
import React from 'react';
import { DayColumnData } from '../../types';
import { CheckItem } from './CheckItem';
import {
    DayColumnContainer,
    DayColumnHeader,
    HeaderTop,
    HeaderIcon,
    HeaderLabel,
    HeaderDate,
    DayColumnMeta,
    MetaItem,
    MetaSeparator,
    ChecksList
} from './ReadinessSection.styles';

interface DayColumnProps {
    data: DayColumnData;
}

export const DayColumn: React.FC<DayColumnProps> = ({ data }) => {
    return (
        <DayColumnContainer>
            <DayColumnHeader $label={data.label}>
                <HeaderTop>
                    <HeaderIcon>📅</HeaderIcon>
                    <HeaderLabel $label={data.label}>{data.label}</HeaderLabel>
                </HeaderTop>
                <HeaderDate>{data.date}</HeaderDate>
            </DayColumnHeader>

            <DayColumnMeta>
                <MetaItem>
                    <strong>{data.routesCount}</strong>
                    {data.routesCount === 1 ? 'trasa' : 'tras'}
                </MetaItem>
                <MetaSeparator>•</MetaSeparator>
                <MetaItem>
                    <strong>{data.childrenCount}</strong>
                    {data.childrenCount === 1 ? 'dziecko' : 'dzieci'}
                </MetaItem>
            </DayColumnMeta>

            <ChecksList>
                {data.checks.map((check, index) => (
                    <CheckItem
                        key={`${check.type}-${index}`}
                        check={check}
                        dateISO={data.dateISO} // Przekaż datę ISO
                    />
                ))}
            </ChecksList>
        </DayColumnContainer>
    );
};