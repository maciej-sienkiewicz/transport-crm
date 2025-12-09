// src/features/statistics/components/DateRangePicker/DateRangePicker.tsx

import React from 'react';
import styled from 'styled-components';
import { Calendar } from 'lucide-react';
import {DateRange} from "@/features/statistics/api/types.ts";
import {formatDateRangeDisplay, getPresetLabel} from "@/features/statistics/lib/dateRangeHelpers.ts";

const PickerContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const PickerLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.slate[700]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.slate[300]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.slate[900]};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[400]};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
`;

const DateDisplay = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.slate[600]};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.slate[50]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

interface DateRangePickerProps {
    dateRange: DateRange;
    onPresetChange: (preset: '7days' | '30days' | '90days' | '180days') => void;
    currentPreset?: '7days' | '30days' | '90days' | '180days';
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
                                                                    dateRange,
                                                                    onPresetChange,
                                                                    currentPreset = '7days',
                                                                }) => {
    return (
        <PickerContainer>
            <PickerLabel>
                <Calendar size={16} />
                Zakres dat:
            </PickerLabel>
            <Select
                value={currentPreset}
                onChange={(e) =>
                    onPresetChange(e.target.value as '7days' | '30days' | '90days' | '180days')
                }
            >
                <option value="7days">{getPresetLabel('7days')}</option>
                <option value="30days">{getPresetLabel('30days')}</option>
                <option value="90days">{getPresetLabel('90days')}</option>
                <option value="180days">{getPresetLabel('180days')}</option>
            </Select>
            <DateDisplay>{formatDateRangeDisplay(dateRange)}</DateDisplay>
        </PickerContainer>
    );
};