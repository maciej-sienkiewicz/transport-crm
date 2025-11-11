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

export const ChildName = styled.h1`
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
  grid-template-columns: repeat(3, 1fr);
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

export const CheckItem = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.8125rem;
`;

export const NotesText = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.slate[700]};
  line-height: 1.5;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
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

export const GuardianCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const GuardianName = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.slate[900]};
`;

export const GuardianRole = styled.div`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.slate[600]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

export const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const ContactItem = styled.a`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.slate[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.slate[700]};
  text-decoration: none;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.slate[50]};
    border-color: ${({ theme }) => theme.colors.primary[300]};
    color: ${({ theme }) => theme.colors.primary[600]};
  }
`;

export const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

export const TimelineList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const TimelineItem = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  position: relative;
  padding-left: ${({ theme }) => theme.spacing.lg};

  &::before {
    content: '';
    position: absolute;
    left: 5px;
    top: 24px;
    bottom: -12px;
    width: 1px;
    background: ${({ theme }) => theme.colors.slate[200]};
  }

  &:last-child::before {
    display: none;
  }
`;

export const TimelineDot = styled.div<{ $color: string }>`
  position: absolute;
  left: 0;
  top: 4px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  border: 2px solid white;
  box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.slate[200]};
  flex-shrink: 0;
`;

export const TimelineContent = styled.div`
  flex: 1;
`;

export const TimelineText = styled.div`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.slate[700]};
  line-height: 1.5;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export const TimelineTime = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.slate[500]};
`;

export const ViewAllButton = styled.button`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.slate[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  color: ${({ theme }) => theme.colors.primary[600]};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  margin-top: ${({ theme }) => theme.spacing.sm};

  &:hover {
    background: ${({ theme }) => theme.colors.primary[50]};
    border-color: ${({ theme }) => theme.colors.primary[300]};
  }
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
  background: ${({ $active, theme }) =>
    $active ? 'white' : 'transparent'};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.primary[600] : theme.colors.slate[600]};
  border: none;
  border-bottom: 3px solid ${({ $active, theme }) =>
    $active ? theme.colors.primary[600] : 'transparent'};
  font-weight: 600;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  white-space: nowrap;
  position: relative;

  &:hover {
    background: ${({ $active, theme }) =>
    $active ? 'white' : theme.colors.slate[50]};
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