// src/features/vehicles/components/VehicleDetail/VehicleDetail.styles.ts
import styled from 'styled-components';

export const DetailContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xl};
`;

export const DetailHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.md};
    padding-bottom: ${({ theme }) => theme.spacing.lg};
    border-bottom: 1px solid ${({ theme }) => theme.colors.slate[200]};

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        flex-direction: column;
    }
`;

export const HeaderInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};
`;

export const VehicleName = styled.h1`
    font-size: 1.75rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.slate[900]};
    letter-spacing: ${({ theme }) => theme.typography.letterSpacing.tight};

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        font-size: 1.5rem;
    }
`;

export const VehicleSubtitle = styled.p`
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.slate[600]};
`;

export const HeaderActions = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.sm};

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        width: 100%;

        button {
            flex: 1;
        }
    }
`;

export const InfoGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: ${({ theme }) => theme.spacing.lg};
`;

export const InfoItem = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xs};
`;

export const InfoLabel = styled.span`
    font-size: 0.875rem;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.slate[500]};
    text-transform: uppercase;
    letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wide};
`;

export const InfoValue = styled.span`
    font-size: 0.9375rem;
    color: ${({ theme }) => theme.colors.slate[900]};
`;

export const WarningBadge = styled.div<{ $variant: 'warning' | 'danger' }>`
    display: inline-flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    background: ${({ $variant, theme }) =>
    $variant === 'danger' ? theme.colors.danger[50] : theme.colors.warning[50]};
    color: ${({ $variant, theme }) =>
    $variant === 'danger' ? theme.colors.danger[700] : theme.colors.warning[700]};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    font-size: 0.875rem;
    font-weight: 500;
`;

export const EquipmentList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xs};
`;

export const EquipmentItem = styled.li`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    padding: ${({ theme }) => theme.spacing.sm};
    background: ${({ theme }) => theme.colors.slate[50]};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    font-size: 0.9375rem;
    color: ${({ theme }) => theme.colors.slate[700]};
`;