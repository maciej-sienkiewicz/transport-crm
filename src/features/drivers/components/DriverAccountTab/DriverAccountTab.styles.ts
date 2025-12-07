import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xl};
`;

export const StatusCard = styled.div<{ $status: 'success' | 'warning' | 'danger' | 'neutral' }>`
    padding: ${({ theme }) => theme.spacing.xl};
    background: ${({ $status, theme }) => {
    switch ($status) {
        case 'success':
            return theme.colors.success[50];
        case 'warning':
            return theme.colors.warning[50];
        case 'danger':
            return theme.colors.danger[50];
        default:
            return theme.colors.slate[50];
    }
}};
    border: 2px solid ${({ $status, theme }) => {
    switch ($status) {
        case 'success':
            return theme.colors.success[200];
        case 'warning':
            return theme.colors.warning[200];
        case 'danger':
            return theme.colors.danger[200];
        default:
            return theme.colors.slate[200];
    }
}};
    border-left: 6px solid ${({ $status, theme }) => {
    switch ($status) {
        case 'success':
            return theme.colors.success[500];
        case 'warning':
            return theme.colors.warning[500];
        case 'danger':
            return theme.colors.danger[500];
        default:
            return theme.colors.slate[500];
    }
}};
    border-radius: ${({ theme }) => theme.borderRadius.xl};
`;

export const StatusHeader = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.md};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const StatusIcon = styled.div<{ $status: 'success' | 'warning' | 'danger' | 'neutral' }>`
    width: 48px;
    height: 48px;
    border-radius: ${({ theme }) => theme.borderRadius.full};
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${({ $status, theme }) => {
    switch ($status) {
        case 'success':
            return theme.colors.success[100];
        case 'warning':
            return theme.colors.warning[100];
        case 'danger':
            return theme.colors.danger[100];
        default:
            return theme.colors.slate[100];
    }
}};
    color: ${({ $status, theme }) => {
    switch ($status) {
        case 'success':
            return theme.colors.success[700];
        case 'warning':
            return theme.colors.warning[700];
        case 'danger':
            return theme.colors.danger[700];
        default:
            return theme.colors.slate[700];
    }
}};
`;

export const StatusInfo = styled.div`
    flex: 1;
`;

export const StatusTitle = styled.h3`
    font-size: 1.25rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.slate[900]};
    margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
`;

export const StatusSubtitle = styled.p`
    font-size: 0.9375rem;
    color: ${({ theme }) => theme.colors.slate[600]};
    margin: 0;
`;

export const StatusDetails = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: ${({ theme }) => theme.spacing.lg};
    margin-top: ${({ theme }) => theme.spacing.lg};
    padding-top: ${({ theme }) => theme.spacing.lg};
    border-top: 1px solid ${({ theme }) => theme.colors.slate[200]};
`;

export const DetailItem = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xs};
`;

export const DetailLabel = styled.span`
    font-size: 0.75rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[500]};
    text-transform: uppercase;
    letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wide};
`;

export const DetailValue = styled.span`
    font-size: 0.9375rem;
    color: ${({ theme }) => theme.colors.slate[900]};
    font-weight: 500;
`;

export const ActionsContainer = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.sm};
    margin-top: ${({ theme }) => theme.spacing.lg};

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        flex-direction: column;
    }
`;

export const InfoSection = styled.div`
    background: white;
    border: 1px solid ${({ theme }) => theme.colors.slate[200]};
    border-radius: ${({ theme }) => theme.borderRadius.xl};
    padding: ${({ theme }) => theme.spacing.xl};
`;

export const SectionTitle = styled.h4`
    font-size: 1rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[900]};
    margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
`;

export const InfoGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: ${({ theme }) => theme.spacing.lg};
`;

export const InfoBox = styled.div`
    padding: ${({ theme }) => theme.spacing.md};
    background: ${({ theme }) => theme.colors.slate[50]};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    border: 1px solid ${({ theme }) => theme.colors.slate[200]};
`;

export const InfoBoxLabel = styled.div`
    font-size: 0.75rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[500]};
    text-transform: uppercase;
    letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wide};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export const InfoBoxValue = styled.div`
    font-size: 1rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[900]};
`;

export const TimelineContainer = styled.div`
    background: white;
    border: 1px solid ${({ theme }) => theme.colors.slate[200]};
    border-radius: ${({ theme }) => theme.borderRadius.xl};
    padding: ${({ theme }) => theme.spacing.xl};
`;

export const TimelineList = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.lg};
`;

export const TimelineItem = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.md};
    position: relative;
    padding-left: ${({ theme }) => theme.spacing.xl};

    &::before {
        content: '';
        position: absolute;
        left: 11px;
        top: 32px;
        bottom: -${({ theme }) => theme.spacing.lg};
        width: 2px;
        background: ${({ theme }) => theme.colors.slate[200]};
    }

    &:last-child::before {
        display: none;
    }
`;

export const TimelineDot = styled.div<{ $color: string }>`
    position: absolute;
    left: 0;
    top: 6px;
    width: 24px;
    height: 24px;
    border-radius: ${({ theme }) => theme.borderRadius.full};
    background: ${({ $color }) => $color};
    border: 3px solid white;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.slate[200]};
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 10px;
`;

export const TimelineContent = styled.div`
    flex: 1;
`;

export const TimelineTitle = styled.div`
    font-size: 0.9375rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[900]};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export const TimelineText = styled.div`
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.slate[600]};
    line-height: 1.5;
`;

export const TimelineTime = styled.div`
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.slate[500]};
    margin-top: ${({ theme }) => theme.spacing.xs};
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
`;

export const EmptyState = styled.div`
    padding: ${({ theme }) => theme.spacing['2xl']};
    text-align: center;
    color: ${({ theme }) => theme.colors.slate[500]};
`;

export const PinDisplay = styled.div`
    background: ${({ theme }) => theme.colors.slate[900]};
    color: white;
    padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    text-align: center;
    margin-top: ${({ theme }) => theme.spacing.md};
`;

export const PinLabel = styled.div`
    font-size: 0.875rem;
    opacity: 0.8;
    margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export const PinValue = styled.div`
    font-size: 2rem;
    font-weight: 700;
    letter-spacing: 0.5rem;
    font-family: 'Courier New', monospace;
`;

export const WarningBox = styled.div`
    padding: ${({ theme }) => theme.spacing.md};
    background: ${({ theme }) => theme.colors.warning[50]};
    border: 1px solid ${({ theme }) => theme.colors.warning[200]};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    display: flex;
    gap: ${({ theme }) => theme.spacing.sm};
    align-items: flex-start;
    margin-top: ${({ theme }) => theme.spacing.md};
`;

export const WarningIcon = styled.div`
    color: ${({ theme }) => theme.colors.warning[600]};
    flex-shrink: 0;
`;

export const WarningText = styled.div`
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.warning[900]};
    line-height: 1.5;
`;