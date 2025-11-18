// src/features/dashboard/components/ReadinessSection/ReadinessSection.styles.ts

import styled from 'styled-components';
import { CheckStatus, DayLabel } from '../../types';

// ============================================
// CONTAINER
// ============================================

export const SectionContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: ${({ theme }) => theme.spacing.lg};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.lg};
  }
`;

// ============================================
// DAY COLUMN
// ============================================

export const DayColumnContainer = styled.div`
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.slate[200]};
  overflow: hidden;
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

// ============================================
// HEADER
// ============================================

export const DayColumnHeader = styled.div<{ $label: DayLabel }>`
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
  background: ${({ $label, theme }) =>
    $label === 'Dzisiaj' ? theme.colors.primary[50] : theme.colors.slate[50]};
  border-bottom: 2px solid ${({ $label, theme }) =>
    $label === 'Dzisiaj' ? theme.colors.primary[200] : theme.colors.slate[200]};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  }
`;

export const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export const HeaderIcon = styled.span`
  font-size: 1.25rem;
`;

export const HeaderLabel = styled.h3<{ $label: DayLabel }>`
  font-size: 1rem;
  font-weight: 700;
  color: ${({ $label, theme }) =>
    $label === 'Dzisiaj' ? theme.colors.primary[700] : theme.colors.slate[700]};
  text-transform: uppercase;
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wide};
  margin: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 0.9375rem;
  }
`;

export const HeaderDate = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.slate[600]};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 0.8125rem;
  }
`;

// ============================================
// META
// ============================================

export const DayColumnMeta = styled.div`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.slate[50]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.slate[200]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.slate[600]};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
    font-size: 0.8125rem;
  }
`;

export const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  
  strong {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[900]};
  }
`;

export const MetaSeparator = styled.span`
  color: ${({ theme }) => theme.colors.slate[400]};
`;

// ============================================
// CHECKS LIST
// ============================================

export const ChecksList = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;

// ============================================
// CHECK ITEM
// ============================================

export const CheckItemContainer = styled.div<{ $status: CheckStatus }>`
    display: flex;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.md};
    padding: ${({ theme }) => theme.spacing.md};
    border-left: 3px solid ${({ $status, theme }) => {
        switch ($status) {
            case 'OK':
                return theme.colors.success[500];
            case 'WARNING':
                return theme.colors.warning[500];
            case 'ERROR':
                return theme.colors.danger[500];
        }
    }};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    background: ${({ $status, theme }) => {
        switch ($status) {
            case 'OK':
                return 'transparent';
            case 'WARNING':
                return theme.colors.warning[50];
            case 'ERROR':
                return theme.colors.danger[50];
        }
    }};
    transition: all ${({ theme }) => theme.transitions.fast};

    &:hover {
        background: ${({ $status, theme }) => {
            switch ($status) {
                case 'OK':
                    return theme.colors.slate[50];
                case 'WARNING':
                    return theme.colors.warning[100];
                case 'ERROR':
                    return theme.colors.danger[100];
            }
        }};
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        padding: ${({ theme }) => theme.spacing.sm};
    }
`;

export const StatusDot = styled.div<{ $status: CheckStatus }>`
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${({ $status, theme }) => {
        switch ($status) {
            case 'OK':
                return theme.colors.success[500];
            case 'WARNING':
                return theme.colors.warning[500];
            case 'ERROR':
                return theme.colors.danger[500];
        }
    }};
    flex-shrink: 0;
    margin-top: 4px;
    box-shadow: 0 0 0 2px ${({ $status, theme }) => {
        switch ($status) {
            case 'OK':
                return theme.colors.success[100];
            case 'WARNING':
                return theme.colors.warning[100];
            case 'ERROR':
                return theme.colors.danger[100];
        }
    }};
`;

export const CheckContent = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};
    min-width: 0;
`;

export const CheckHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const CheckMessage = styled.div`
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.slate[900]};
  line-height: 1.5;
  font-weight: 500;
  flex: 1;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 0.875rem;
  }
`;

export const CheckCount = styled.div<{ $status: CheckStatus }>`
  font-size: 0.875rem;
  font-weight: 700;
  color: ${({ $status, theme }) => {
    switch ($status) {
        case 'OK':
            return theme.colors.success[700];
        case 'WARNING':
            return theme.colors.warning[700];
        case 'ERROR':
            return theme.colors.danger[700];
    }
}};
  background: ${({ $status, theme }) => {
    switch ($status) {
        case 'OK':
            return theme.colors.success[100];
        case 'WARNING':
            return theme.colors.warning[100];
        case 'ERROR':
            return theme.colors.danger[100];
    }
}};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  white-space: nowrap;
  font-variant-numeric: tabular-nums;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 0.8125rem;
    padding: ${({ theme }) => theme.spacing['2xs']} ${({ theme }) => theme.spacing.xs};
  }
`;

export const CheckAction = styled.div`
    margin-top: ${({ theme }) => theme.spacing.xs};
`;