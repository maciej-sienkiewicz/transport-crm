import styled from 'styled-components';

export const PlannerContainer = styled.div`
    display: grid;
    grid-template-columns: 350px 1fr;
    gap: ${({ theme }) => theme.spacing.xl};
    height: calc(100vh - 200px);

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        grid-template-columns: 1fr;
        height: auto;
    }
`;

export const LeftPanel = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.lg};
    overflow-y: auto;

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        max-height: 500px;
    }
`;

export const RightPanel = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.lg};
    overflow-y: auto;
`;

export const SectionTitle = styled.h3`
    font-size: 0.875rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[700]};
    text-transform: uppercase;
    letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wide};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

export const ChildrenList = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};
`;

export const ChildCard = styled.div<{ $isDragging?: boolean }>`
    padding: ${({ theme }) => theme.spacing.md};
    background: white;
    border: 1px solid ${({ theme }) => theme.colors.slate[200]};
    border-radius: ${({ theme }) => theme.borderRadius.xl};
    cursor: grab;
    transition: all ${({ theme }) => theme.transitions.normal};
    opacity: ${({ $isDragging }) => ($isDragging ? 0.5 : 1)};

    &:hover {
        transform: translateY(-2px);
        box-shadow: ${({ theme }) => theme.shadows.md};
        border-color: ${({ theme }) => theme.colors.primary[300]};
    }

    &:active {
        cursor: grabbing;
    }
`;

export const ChildName = styled.div`
    font-size: 0.9375rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[900]};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export const ChildInfo = styled.div`
    font-size: 0.8125rem;
    color: ${({ theme }) => theme.colors.slate[600]};
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export const NeedsIndicators = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.xs};
    margin-top: ${({ theme }) => theme.spacing.sm};
`;

export const NeedBadge = styled.span<{ $variant: 'wheelchair' | 'seat' | 'belt' }>`
    display: inline-flex;
    align-items: center;
    gap: 2px;
    padding: 2px ${({ theme }) => theme.spacing.xs};
    font-size: 0.6875rem;
    font-weight: 600;
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    background: ${({ $variant, theme }) => {
    switch ($variant) {
        case 'wheelchair':
            return theme.colors.warning[100];
        case 'seat':
            return theme.colors.primary[100];
        case 'belt':
            return theme.colors.success[100];
    }
}};
    color: ${({ $variant, theme }) => {
    switch ($variant) {
        case 'wheelchair':
            return theme.colors.warning[700];
        case 'seat':
            return theme.colors.primary[700];
        case 'belt':
            return theme.colors.success[700];
    }
}};
`;

export const RouteBuilderContainer = styled.div`
    background: white;
    border: 2px dashed ${({ theme }) => theme.colors.slate[300]};
    border-radius: ${({ theme }) => theme.borderRadius['2xl']};
    padding: ${({ theme }) => theme.spacing.xl};
    min-height: 400px;
`;

export const RouteBuilderHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: ${({ theme }) => theme.spacing.xl};
    padding-bottom: ${({ theme }) => theme.spacing.lg};
    border-bottom: 1px solid ${({ theme }) => theme.colors.slate[200]};
`;

export const RouteInfo = styled.div`
    flex: 1;
`;

export const RouteTitle = styled.h2`
    font-size: 1.25rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.slate[900]};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

export const RouteMetadata = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.lg};
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.slate[600]};
`;

export const MetadataItem = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
`;

export const CapacityIndicator = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: ${({ theme }) => theme.spacing.xs};
`;

export const CapacityBar = styled.div<{ $percentage: number; $overCapacity: boolean }>`
    width: 120px;
    height: 8px;
    background: ${({ theme }) => theme.colors.slate[200]};
    border-radius: ${({ theme }) => theme.borderRadius.full};
    overflow: hidden;
    position: relative;

    &::after {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: ${({ $percentage }) => Math.min($percentage, 100)}%;
        background: ${({ $overCapacity, theme }) =>
    $overCapacity ? theme.colors.danger[500] : theme.colors.success[500]};
        transition: width ${({ theme }) => theme.transitions.normal};
    }
`;

export const CapacityText = styled.div<{ $warning: boolean }>`
    font-size: 0.875rem;
    font-weight: 600;
    color: ${({ $warning, theme }) =>
    $warning ? theme.colors.danger[600] : theme.colors.slate[700]};
`;

export const DropZone = styled.div<{ $isDragOver: boolean; $isEmpty: boolean }>`
    min-height: ${({ $isEmpty }) => ($isEmpty ? '300px' : 'auto')};
    border: 2px dashed
        ${({ $isDragOver, theme }) =>
    $isDragOver ? theme.colors.primary[500] : theme.colors.slate[300]};
    border-radius: ${({ theme }) => theme.borderRadius.xl};
    padding: ${({ theme }) => theme.spacing.lg};
    background: ${({ $isDragOver, theme }) =>
    $isDragOver ? theme.colors.primary[50] : 'transparent'};
    transition: all ${({ theme }) => theme.transitions.normal};
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
`;

export const EmptyDropZone = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: ${({ theme }) => theme.colors.slate[400]};
    text-align: center;
    padding: ${({ theme }) => theme.spacing.xl};
`;

export const EmptyDropZoneIcon = styled.div`
    width: 64px;
    height: 64px;
    margin-bottom: ${({ theme }) => theme.spacing.md};
    background: ${({ theme }) => theme.colors.slate[100]};
    border-radius: ${({ theme }) => theme.borderRadius.full};
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const RouteChildCard = styled.div`
    padding: ${({ theme }) => theme.spacing.lg};
    background: ${({ theme }) => theme.gradients.cardHeader};
    border: 1px solid ${({ theme }) => theme.colors.slate[200]};
    border-radius: ${({ theme }) => theme.borderRadius.xl};
    display: flex;
    gap: ${({ theme }) => theme.spacing.md};
    align-items: flex-start;
    position: relative;
    cursor: move;
`;

export const OrderBadge = styled.div`
    min-width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${({ theme }) => theme.gradients.primaryButton};
    color: white;
    border-radius: ${({ theme }) => theme.borderRadius.full};
    font-size: 0.875rem;
    font-weight: 700;
`;

export const RouteChildInfo = styled.div`
    flex: 1;
`;

export const RouteChildName = styled.div`
    font-size: 1rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[900]};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export const RouteChildDetails = styled.div`
    font-size: 0.8125rem;
    color: ${({ theme }) => theme.colors.slate[600]};
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xs};
`;

export const RouteChildActions = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.xs};
`;

export const RemoveButton = styled.button`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    padding: 0;
    background: white;
    border: 1px solid ${({ theme }) => theme.colors.slate[200]};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    color: ${({ theme }) => theme.colors.danger[600]};
    cursor: pointer;
    transition: all ${({ theme }) => theme.transitions.fast};

    &:hover {
        background: ${({ theme }) => theme.colors.danger[50]};
        border-color: ${({ theme }) => theme.colors.danger[300]};
    }
`;

export const SaveButton = styled.button`
    margin-top: ${({ theme }) => theme.spacing.xl};
    padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
    background: ${({ theme }) => theme.gradients.primaryButton};
    color: white;
    border: none;
    border-radius: ${({ theme }) => theme.borderRadius.xl};
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all ${({ theme }) => theme.transitions.normal};
    box-shadow: ${({ theme }) => theme.shadows.primaryGlow};

    &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 20px 40px -5px rgba(37, 99, 235, 0.4);
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

export const ValidationWarning = styled.div`
    padding: ${({ theme }) => theme.spacing.md};
    background: ${({ theme }) => theme.colors.warning[50]};
    border: 1px solid ${({ theme }) => theme.colors.warning[200]};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    color: ${({ theme }) => theme.colors.warning[700]};
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
    margin-top: ${({ theme }) => theme.spacing.md};
`;