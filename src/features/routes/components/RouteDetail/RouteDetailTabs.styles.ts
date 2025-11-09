// /routes/components/RouteDetail/RouteDetailTabs/RouteDetailTabs.styles.ts

import styled, { css } from 'styled-components';

export const TabbedSection = styled.div`
    background: white;
    border-radius: ${({ theme }) => theme.borderRadius['2xl']};
    border: 1px solid ${({ theme }) => theme.colors.slate[200]};
    box-shadow: ${({ theme }) => theme.shadows.sm};
    overflow: hidden;
`;

export const TabsHeader = styled.div`
    display: flex;
    border-bottom: 1px solid ${({ theme }) => theme.colors.slate[200]};
    background: ${({ theme }) => theme.colors.slate[50]};
    overflow-x: auto;

    &::-webkit-scrollbar {
        height: 4px;
    }

    &::-webkit-scrollbar-track {
        background: ${({ theme }) => theme.colors.slate[100]};
    }

    &::-webkit-scrollbar-thumb {
        background: ${({ theme }) => theme.colors.slate[300]};
        border-radius: ${({ theme }) => theme.borderRadius.sm};
    }
`;

export const Tab = styled.button<{ $active: boolean }>`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
    padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
    font-size: 0.9375rem;
    font-weight: 600;
    color: ${({ theme, $active }) =>
    $active ? theme.colors.primary[700] : theme.colors.slate[600]};
    background: ${({ $active }) => ($active ? 'white' : 'transparent')};
    border: none;
    border-bottom: 2px solid ${({ theme, $active }) =>
    $active ? theme.colors.primary[600] : 'transparent'};
    cursor: pointer;
    transition: all ${({ theme }) => theme.transitions.fast};
    white-space: nowrap;

    &:hover {
        color: ${({ theme }) => theme.colors.primary[700]};
        background: ${({ theme }) => theme.colors.slate[50]};
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
        font-size: 0.875rem;
    }
`;

export const TabContent = styled.div`
    padding: ${({ theme }) => theme.spacing.xl};

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        padding: ${({ theme }) => theme.spacing.lg};
    }
`;

export const EmptyState = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: ${({ theme }) => theme.spacing['2xl']};
    text-align: center;
    color: ${({ theme }) => theme.colors.slate[500]};
`;

export const EmptyIcon = styled.div`
    width: 64px;
    height: 64px;
    margin-bottom: ${({ theme }) => theme.spacing.md};
    background: ${({ theme }) => theme.colors.slate[100]};
    border-radius: ${({ theme }) => theme.borderRadius.full};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.colors.slate[400]};
`;

export const EmptyText = styled.p`
    font-size: 0.9375rem;
    color: ${({ theme }) => theme.colors.slate[600]};
`;

// Style dla sekcji Dzieci (ChildrenTabContent)

export const ChildStatusList = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xs};
`;

export const ChildStatusItem = styled.button`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.md};
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.xs};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    background: none;
    border: none;
    width: 100%;
    text-align: left;
    cursor: pointer;
    transition: background ${({ theme }) => theme.transitions.fast};

    &:hover {
        background: ${({ theme }) => theme.colors.slate[50]};
    }
`;

export const ChildAvatar = styled.div`
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${({ theme }) => theme.gradients.avatar};
    color: white;
    border-radius: ${({ theme }) => theme.borderRadius.full};
    font-weight: 700;
    font-size: 1.125rem;
    flex-shrink: 0;
`;

export const ChildSummaryInfo = styled.div`
    flex: 1;
    min-width: 0;
`;

export const ChildSummaryName = styled.div`
    font-size: 1rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[900]};
    margin-bottom: 2px;
`;

// Style dla sekcji Historii (HistoryTabContent)

export const NotesSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
`;

export const NoteCard = styled.div`
    padding: ${({ theme }) => theme.spacing.md};
    background: ${({ theme }) => theme.colors.slate[50]};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    border: 1px solid ${({ theme }) => theme.colors.slate[200]};
`;

export const NoteHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${({ theme }) => theme.spacing.xs};
    flex-wrap: wrap;
    gap: ${({ theme }) => theme.spacing.xs};
`;

export const NoteAuthor = styled.span`
    font-weight: 600;
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.slate[700]};
`;

export const NoteTime = styled.span`
    font-size: 0.8125rem;
    color: ${({ theme }) => theme.colors.slate[500]};
`;

export const NoteContent = styled.p`
    font-size: 0.9375rem;
    color: ${({ theme }) => theme.colors.slate[700]};
    line-height: 1.5;
    margin: 0;
`;