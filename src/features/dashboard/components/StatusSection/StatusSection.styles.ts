// src/features/dashboard/components/StatusSection/StatusSection.styles.ts

import styled from 'styled-components';
import { ReadinessStatus } from '../../types';

export const SectionContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
`;

export const StatusBanner = styled.div<{ $status: ReadinessStatus }>`
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing['2xl']};
  background: ${({ $status }) => {
    switch ($status) {
        case 'READY':
            return '#ecfdf5';
        case 'WARNING':
            return '#fffbeb';
        case 'CRITICAL':
            return '#fef2f2';
    }
}};
  border: 3px solid ${({ $status }) => {
    switch ($status) {
        case 'READY':
            return '#10b981';
        case 'WARNING':
            return '#f59e0b';
        case 'CRITICAL':
            return '#ef4444';
    }
}};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  text-align: center;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.xl};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  }
`;

export const StatusEmoji = styled.div`
    font-size: 4rem;
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    animation: pulse 2s ease-in-out infinite;

    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        font-size: 3rem;
        margin-bottom: ${({ theme }) => theme.spacing.md};
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        font-size: 2.5rem;
    }
`;

export const StatusLabel = styled.h2<{ $status: ReadinessStatus }>`
    font-size: 1.75rem;
    font-weight: 700;
    color: ${({ $status }) => {
        switch ($status) {
            case 'READY':
                return '#047857';
            case 'WARNING':
                return '#92400e';
            case 'CRITICAL':
                return '#991b1b';
        }
    }};
    text-transform: uppercase;
    letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wide};
    margin: 0 0 ${({ theme }) => theme.spacing.lg} 0;
    line-height: 1.2;

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        font-size: 1.5rem;
        margin-bottom: ${({ theme }) => theme.spacing.md};
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        font-size: 1.25rem;
        letter-spacing: ${({ theme }) => theme.typography.letterSpacing.normal};
    }
`;

export const StatusDate = styled.div`
    font-size: 1.25rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[700]};
    margin-bottom: ${({ theme }) => theme.spacing.md};

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        font-size: 1.125rem;
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        font-size: 1rem;
    }
`;

export const StatusMeta = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.lg};
    font-size: 1.125rem;
    color: ${({ theme }) => theme.colors.slate[600]};
    flex-wrap: wrap;
    margin-bottom: ${({ theme }) => theme.spacing.lg};

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        font-size: 1rem;
        gap: ${({ theme }) => theme.spacing.md};
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        font-size: 0.9375rem;
        gap: ${({ theme }) => theme.spacing.sm};
        flex-direction: column;
    }
`;

export const MetaItem = styled.span`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    white-space: nowrap;
`;

export const MetaSeparator = styled.span`
    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        display: none;
    }
`;

export const ActionButton = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing.md};

  button {
    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
      width: 100%;
    }
  }
`;

export const ContextInfo = styled.div`
  margin-top: ${({ theme }) => theme.spacing.sm};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.slate[500]};
  font-style: italic;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 0.8125rem;
  }
`;