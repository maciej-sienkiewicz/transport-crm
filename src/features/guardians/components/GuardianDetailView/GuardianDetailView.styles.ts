import styled from 'styled-components';

export const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background: ${({ theme }) => theme.colors.slate[50]};
`;

export const DetailHeader = styled.div`
    background: white;
    border-bottom: 1px solid ${({ theme }) => theme.colors.slate[200]};
    box-shadow: ${({ theme }) => theme.shadows.sm};
`;

export const HeaderTop = styled.div`
    padding: ${({ theme }) => theme.spacing.xl};
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.lg};

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        flex-direction: column;
        padding: ${({ theme }) => theme.spacing.lg};
        gap: ${({ theme }) => theme.spacing.md};
    }
`;

export const HeaderLeft = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};
    flex: 1;
`;

export const Breadcrumb = styled.button`
    display: inline-flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    background: transparent;
    border: none;
    color: ${({ theme }) => theme.colors.slate[600]};
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    padding: ${({ theme }) => theme.spacing.xs} 0;
    transition: color ${({ theme }) => theme.transitions.fast};

    &:hover {
        color: ${({ theme }) => theme.colors.primary[600]};
    }
`;

export const GuardianName = styled.h1`
    font-size: 1.875rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.slate[900]};
    letter-spacing: ${({ theme }) => theme.typography.letterSpacing.tight};
    margin: 0;

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        font-size: 1.5rem;
    }
`;

export const HeaderMeta = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: ${({ theme }) => theme.spacing.md};
    align-items: center;
    font-size: 0.9375rem;
    color: ${({ theme }) => theme.colors.slate[600]};

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        gap: ${({ theme }) => theme.spacing.sm};
        font-size: 0.875rem;
    }
`;

export const MetaItem = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
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

export const QuickInfoBar = styled.div`
    padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
    background: ${({ theme }) => theme.gradients.cardHeader};
    border-top: 1px solid ${({ theme }) => theme.colors.slate[200]};
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: ${({ theme }) => theme.spacing.xl};

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        grid-template-columns: 1fr;
        padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
        gap: ${({ theme }) => theme.spacing.md};
    }
`;

export const InfoSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xs};
`;

export const InfoLabel = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    font-size: 0.75rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[600]};
    text-transform: uppercase;
    letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wide};
`;

export const InfoContent = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: ${({ theme }) => theme.spacing.xs};
    align-items: center;
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.slate[700]};
`;

export const ContentWrapper = styled.div`
    display: flex;
    flex: 1;
    overflow: hidden;

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        flex-direction: column;
    }
`;

export const MainContent = styled.div`
    flex: 1;
    overflow-y: auto;
    padding: ${({ theme }) => theme.spacing.xl};

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        padding: ${({ theme }) => theme.spacing.lg};
    }
`;

export const RightSidebar = styled.div`
    width: 340px;
    background: white;
    border-left: 1px solid ${({ theme }) => theme.colors.slate[200]};

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        width: 100%;
        border-left: none;
        border-top: 1px solid ${({ theme }) => theme.colors.slate[200]};
    }
`;

export const SidebarContent = styled.div`
    padding: ${({ theme }) => theme.spacing.xl};
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xl};

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        padding: ${({ theme }) => theme.spacing.lg};
        gap: ${({ theme }) => theme.spacing.lg};
    }
`;

export const SidebarCard = styled.div`
    background: ${({ theme }) => theme.colors.slate[50]};
    border: 1px solid ${({ theme }) => theme.colors.slate[200]};
    border-radius: ${({ theme }) => theme.borderRadius.xl};
    padding: ${({ theme }) => theme.spacing.lg};
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
`;

export const CardTitle = styled.h3`
    font-size: 0.875rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[700]};
    text-transform: uppercase;
    letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wide};
    margin: 0;
`;

export const StatItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${({ theme }) => theme.spacing.sm} 0;
    border-bottom: 1px solid ${({ theme }) => theme.colors.slate[200]};

    &:last-child {
        border-bottom: none;
    }
`;

export const StatLabel = styled.span`
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.slate[600]};
`;

export const StatValue = styled.span`
    font-size: 0.875rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[900]};
`;

export const TabsContainer = styled.div`
    background: white;
    border-radius: ${({ theme }) => theme.borderRadius['2xl']};
    box-shadow: ${({ theme }) => theme.shadows.sm};
    border: 1px solid ${({ theme }) => theme.colors.slate[200]};
    overflow: hidden;
`;

export const TabsHeader = styled.div`
    display: flex;
    background: ${({ theme }) => theme.gradients.cardHeader};
    border-bottom: 2px solid ${({ theme }) => theme.colors.slate[200]};
    overflow-x: auto;

    &::-webkit-scrollbar {
        height: 4px;
    }
`;

export const Tab = styled.button<{ $active: boolean }>`
    padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
    background: ${({ $active, theme }) => ($active ? 'white' : 'transparent')};
    color: ${({ $active, theme }) =>
    $active ? theme.colors.primary[600] : theme.colors.slate[600]};
    border: none;
    border-bottom: 3px solid
        ${({ $active, theme }) => ($active ? theme.colors.primary[600] : 'transparent')};
    font-weight: 600;
    font-size: 0.9375rem;
    cursor: pointer;
    transition: all ${({ theme }) => theme.transitions.fast};
    white-space: nowrap;

    &:hover {
        background: ${({ $active, theme }) => ($active ? 'white' : theme.colors.slate[50])};
        color: ${({ $active, theme }) =>
    $active ? theme.colors.primary[600] : theme.colors.slate[900]};
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
        font-size: 0.875rem;
    }
`;

export const TabContent = styled.div`
    padding: ${({ theme }) => theme.spacing.xl};

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        padding: ${({ theme }) => theme.spacing.lg};
    }
`;