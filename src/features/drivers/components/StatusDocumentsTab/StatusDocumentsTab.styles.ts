// src/features/drivers/components/StatusDocumentsTab/StatusDocumentsTab.styles.ts
import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xl};
`;

export const SectionTitle = styled.h3`
    font-size: 1rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[900]};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
`;

export const DocumentsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: ${({ theme }) => theme.spacing.lg};

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        grid-template-columns: 1fr;
    }
`;

export const DocumentCard = styled.div<{ $status: 'valid' | 'expiring' | 'expired' }>`
    padding: ${({ theme }) => theme.spacing.lg};
    background: white;
    border: 1px solid ${({ $status, theme }) => {
    switch ($status) {
        case 'expired':
            return theme.colors.danger[300];
        case 'expiring':
            return theme.colors.warning[300];
        default:
            return theme.colors.slate[200];
    }
}};
    border-left: 4px solid ${({ $status, theme }) => {
    switch ($status) {
        case 'expired':
            return theme.colors.danger[500];
        case 'expiring':
            return theme.colors.warning[500];
        default:
            return theme.colors.success[500];
    }
}};
    border-radius: ${({ theme }) => theme.borderRadius.xl};
    transition: all ${({ theme }) => theme.transitions.normal};

    &:hover {
        box-shadow: ${({ theme }) => theme.shadows.md};
        transform: translateY(-2px);
    }
`;

export const DocumentHeader = styled.div`
    display: flex;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.sm};
    margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const DocumentIcon = styled.div<{ $status: 'valid' | 'expiring' | 'expired' }>`
    width: 40px;
    height: 40px;
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background: ${({ $status, theme }) => {
    switch ($status) {
        case 'expired':
            return theme.colors.danger[50];
        case 'expiring':
            return theme.colors.warning[50];
        default:
            return theme.colors.success[50];
    }
}};
    color: ${({ $status, theme }) => {
    switch ($status) {
        case 'expired':
            return theme.colors.danger[600];
        case 'expiring':
            return theme.colors.warning[600];
        default:
            return theme.colors.success[600];
    }
}};
`;

export const DocumentInfo = styled.div`
    flex: 1;
`;

export const DocumentTitle = styled.div`
    font-size: 1rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[900]};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export const DocumentSubtitle = styled.div`
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.slate[600]};
`;

export const DocumentDetails = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xs};
    margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const DetailRow = styled.div`
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.slate[700]};
`;

export const DocumentActions = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.xs};
    padding-top: ${({ theme }) => theme.spacing.md};
    border-top: 1px solid ${({ theme }) => theme.colors.slate[200]};
`;

export const DocumentsList = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};
`;

export const DocumentListItem = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${({ theme }) => theme.spacing.md};
    background: white;
    border: 1px solid ${({ theme }) => theme.colors.slate[200]};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    transition: all ${({ theme }) => theme.transitions.fast};

    &:hover {
        background: ${({ theme }) => theme.colors.slate[50]};
        border-color: ${({ theme }) => theme.colors.primary[200]};
    }
`;

export const DocumentListInfo = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.md};
    flex: 1;
`;

export const DocumentListIcon = styled.div`
    width: 36px;
    height: 36px;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    background: ${({ theme }) => theme.colors.slate[100]};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.colors.slate[600]};
    flex-shrink: 0;
`;

export const DocumentListDetails = styled.div`
    flex: 1;
    min-width: 0;
`;

export const DocumentListName = styled.div`
    font-size: 0.9375rem;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.slate[900]};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

export const DocumentListMeta = styled.div`
    font-size: 0.8125rem;
    color: ${({ theme }) => theme.colors.slate[600]};
`;

export const DocumentListActions = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.xs};
`;

export const IconButton = styled.button`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    padding: 0;
    background: transparent;
    border: none;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    color: ${({ theme }) => theme.colors.slate[600]};
    cursor: pointer;
    transition: all ${({ theme }) => theme.transitions.fast};

    &:hover {
        background: ${({ theme }) => theme.colors.slate[100]};
        color: ${({ theme }) => theme.colors.slate[900]};
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

export const TimelineContainer = styled.div`
    position: relative;
    padding-left: ${({ theme }) => theme.spacing.xl};

    &::before {
        content: '';
        position: absolute;
        left: 6px;
        top: 0;
        bottom: 0;
        width: 2px;
        background: linear-gradient(
            to bottom,
            ${({ theme }) => theme.colors.slate[200]},
            ${({ theme }) => theme.colors.slate[100]}
        );
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        padding-left: ${({ theme }) => theme.spacing.lg};
    }
`;

export const TimelineItem = styled.div`
    position: relative;
    padding-bottom: ${({ theme }) => theme.spacing.lg};

    &:last-child {
        padding-bottom: 0;
    }
`;

export const TimelineDot = styled.div<{ $status: 'success' | 'warning' | 'danger' }>`
    position: absolute;
    left: -30px;
    top: 4px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: ${({ $status, theme }) => {
    switch ($status) {
        case 'danger':
            return theme.colors.danger[500];
        case 'warning':
            return theme.colors.warning[500];
        default:
            return theme.colors.success[500];
    }
}};
    border: 3px solid white;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.slate[200]};

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        left: -24px;
    }
`;

export const TimelineContent = styled.div`
    padding: ${({ theme }) => theme.spacing.md};
    background: white;
    border: 1px solid ${({ theme }) => theme.colors.slate[200]};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    transition: all ${({ theme }) => theme.transitions.fast};

    &:hover {
        box-shadow: ${({ theme }) => theme.shadows.sm};
    }
`;

export const TimelineHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.md};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export const TimelineTitle = styled.div`
    font-size: 0.9375rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[900]};
`;

export const TimelineTime = styled.div`
    font-size: 0.8125rem;
    color: ${({ theme }) => theme.colors.slate[500]};
    white-space: nowrap;
`;

export const TimelineText = styled.div`
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.slate[600]};
    line-height: 1.5;
`;

export const EmptyState = styled.div`
    padding: ${({ theme }) => theme.spacing['2xl']};
    text-align: center;
    background: ${({ theme }) => theme.colors.slate[50]};
    border-radius: ${({ theme }) => theme.borderRadius.xl};
    border: 1px dashed ${({ theme }) => theme.colors.slate[300]};
`;

export const EmptyIcon = styled.div`
    width: 64px;
    height: 64px;
    margin: 0 auto ${({ theme }) => theme.spacing.md};
    background: linear-gradient(
        to bottom right,
        ${({ theme }) => theme.colors.slate[100]},
        ${({ theme }) => theme.colors.slate[200]}
    );
    border-radius: ${({ theme }) => theme.borderRadius.full};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.colors.slate[500]};
`;

export const EmptyTitle = styled.h3`
    font-size: 1.125rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[900]};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export const EmptyText = styled.p`
    font-size: 0.9375rem;
    color: ${({ theme }) => theme.colors.slate[600]};
`;

export const UploadArea = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${({ theme }) => theme.spacing.lg};
    background: white;
    border: 2px dashed ${({ theme }) => theme.colors.slate[300]};
    border-radius: ${({ theme }) => theme.borderRadius.xl};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    transition: all ${({ theme }) => theme.transitions.normal};

    &:hover {
        border-color: ${({ theme }) => theme.colors.primary[400]};
        background: ${({ theme }) => theme.colors.primary[50]};
    }
`;

export const UploadInfo = styled.div`
    flex: 1;
`;

export const UploadTitle = styled.div`
    font-size: 1rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[900]};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export const UploadText = styled.div`
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.slate[600]};
`;