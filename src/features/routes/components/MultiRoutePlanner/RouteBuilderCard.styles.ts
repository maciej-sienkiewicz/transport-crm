import styled from 'styled-components';

export const RouteCard = styled.div`
    background: white;
    border-radius: ${({ theme }) => theme.borderRadius.xl};
    box-shadow: ${({ theme }) => theme.shadows.md};
    border: 2px solid ${({ theme }) => theme.colors.slate[200]};
    overflow: hidden;
    transition: all ${({ theme }) => theme.transitions.normal};
    display: flex;
    flex-direction: column;
    height: fit-content;

    &:hover {
        box-shadow: ${({ theme }) => theme.shadows.lg};
        border-color: ${({ theme }) => theme.colors.primary[300]};
    }
`;

export const RouteCardHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    background: ${({ theme }) => theme.gradients.cardHeader};
    border-bottom: 1px solid ${({ theme }) => theme.colors.slate[200]};
`;

export const RouteCardHeaderLeft = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
    flex: 1;
`;

export const RouteCardNumber = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    background: ${({ theme }) => theme.gradients.primaryButton};
    color: white;
    border-radius: ${({ theme }) => theme.borderRadius.full};
    font-size: 0.8125rem;
    font-weight: 700;
    flex-shrink: 0;
`;

export const RouteCardTitle = styled.h3`
    font-size: 0.9375rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[900]};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

export const RouteCardHeaderRight = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.xs};
`;

export const RemoveRouteButton = styled.button`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
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

export const RouteCardBody = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
    padding: ${({ theme }) => theme.spacing.md};
`;

export const FormSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};
`;

export const MetadataBar = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: ${({ theme }) => theme.spacing.sm};
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
    background: ${({ theme }) => theme.colors.slate[50]};
    border-radius: ${({ theme }) => theme.borderRadius.md};
`;

export const MetadataItem = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.slate[600]};
`;

export const CapacitySection = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xs};
`;

export const CapacityLabel = styled.div<{ $warning?: boolean }>`
    font-size: 0.8125rem;
    font-weight: 600;
    color: ${({ $warning, theme }) =>
            $warning ? theme.colors.danger[600] : theme.colors.slate[700]};
`;

export const CapacityBar = styled.div`
    position: relative;
    height: 20px;
    background: ${({ theme }) => theme.colors.slate[200]};
    border-radius: ${({ theme }) => theme.borderRadius.full};
    overflow: hidden;
`;

export const CapacityFill = styled.div<{ $percentage: number; $overCapacity: boolean }>`
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: ${({ $percentage }) => $percentage}%;
    background: ${({ $overCapacity, theme }) =>
            $overCapacity
                    ? `linear-gradient(to right, ${theme.colors.danger[500]}, ${theme.colors.danger[600]})`
                    : `linear-gradient(to right, ${theme.colors.success[500]}, ${theme.colors.success[600]})`};
    transition: width ${({ theme }) => theme.transitions.normal};
`;

export const CapacityText = styled.div`
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 0.6875rem;
    font-weight: 700;
    color: white;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    z-index: 1;
`;

export const ChildrenSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};
`;

export const SectionTitle = styled.h4`
    font-size: 0.8125rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[700]};
    text-transform: uppercase;
    letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wide};
`;

export const DropZone = styled.div<{ $isDragOver: boolean; $isEmpty: boolean }>`
    min-height: ${({ $isEmpty }) => ($isEmpty ? '120px' : 'auto')};
    border: 2px dashed
    ${({ $isDragOver, theme }) =>
            $isDragOver ? theme.colors.primary[500] : theme.colors.slate[300]};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    padding: ${({ theme }) => theme.spacing.sm};
    background: ${({ $isDragOver, theme }) =>
            $isDragOver ? theme.colors.primary[50] : 'transparent'};
    transition: all ${({ theme }) => theme.transitions.normal};
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xs};
`;

export const EmptyDropZone = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: ${({ theme }) => theme.colors.slate[400]};
    text-align: center;
    gap: ${({ theme }) => theme.spacing.xs};
    font-size: 0.8125rem;
`;

export const RouteChildCard = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.xs};
    align-items: center;
    padding: ${({ theme }) => theme.spacing.sm};
    background: ${({ theme }) => theme.colors.slate[50]};
    border: 1px solid ${({ theme }) => theme.colors.slate[200]};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    cursor: move;
    transition: all ${({ theme }) => theme.transitions.fast};

    &:hover {
        background: white;
        box-shadow: ${({ theme }) => theme.shadows.sm};
        transform: translateY(-1px);
    }
`;

export const OrderBadge = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 24px;
    height: 24px;
    background: ${({ theme }) => theme.gradients.primaryButton};
    color: white;
    border-radius: ${({ theme }) => theme.borderRadius.full};
    font-size: 0.6875rem;
    font-weight: 700;
    flex-shrink: 0;
`;

export const ChildInfo = styled.div`
    flex: 1;
    min-width: 0;
`;

export const ChildName = styled.div`
    font-size: 0.8125rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[900]};
    margin-bottom: 2px;
`;

export const ChildDetails = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
    font-size: 0.6875rem;
    color: ${({ theme }) => theme.colors.slate[600]};
`;

export const ChildActions = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.xs};
`;

export const RemoveChildButton = styled.button`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    padding: 0;
    background: white;
    border: 1px solid ${({ theme }) => theme.colors.slate[200]};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    color: ${({ theme }) => theme.colors.danger[600]};
    cursor: pointer;
    transition: all ${({ theme }) => theme.transitions.fast};

    &:hover {
        background: ${({ theme }) => theme.colors.danger[50]};
        border-color: ${({ theme }) => theme.colors.danger[300]};
    }
`;

export const ValidationWarnings = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xs};
`;

export const WarningItem = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
    background: ${({ theme }) => theme.colors.warning[50]};
    border: 1px solid ${({ theme }) => theme.colors.warning[200]};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    color: ${({ theme }) => theme.colors.warning[700]};
    font-size: 0.75rem;
    font-weight: 500;
`;

export const NeedBadge = styled.span<{ $variant: 'wheelchair' | 'seat' }>`
    display: inline-flex;
    align-items: center;
    padding: 2px 4px;
    font-size: 0.625rem;
    font-weight: 600;
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    background: ${({ $variant, theme }) =>
            $variant === 'wheelchair' ? theme.colors.warning[100] : theme.colors.primary[100]};
    color: ${({ $variant, theme }) =>
            $variant === 'wheelchair' ? theme.colors.warning[700] : theme.colors.primary[700]};
`;