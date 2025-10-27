// src/widgets/Sidebar/Sidebar.styles.ts
import styled, { css } from 'styled-components';

interface SidebarContainerProps {
    $isCollapsed: boolean;
}

export const SidebarContainer = styled.aside<SidebarContainerProps>`
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: ${({ $isCollapsed }) => ($isCollapsed ? '80px' : '280px')};
  background: white;
  border-right: 1px solid ${({ theme }) => theme.colors.slate[200]};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  transition: width ${({ theme }) => theme.transitions.normal};
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    transform: ${({ $isCollapsed }) =>
    $isCollapsed ? 'translateX(-100%)' : 'translateX(0)'};
    width: 280px;
    transition: transform ${({ theme }) => theme.transitions.normal};
  }
`;

export const SidebarHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  border-bottom: 1px solid ${({ theme }) => theme.colors.slate[200]};
  background: ${({ theme }) => theme.gradients.cardHeader};
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 80px;
  flex-shrink: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;

export const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  flex: 1;
  min-width: 0;
`;

export const LogoIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  background: ${({ theme }) => theme.gradients.primaryButton};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: ${({ theme }) => theme.shadows.primaryGlow};
  flex-shrink: 0;
`;

export const LogoText = styled.div<{ $isCollapsed: boolean }>`
  display: flex;
  flex-direction: column;
  opacity: ${({ $isCollapsed }) => ($isCollapsed ? 0 : 1)};
  visibility: ${({ $isCollapsed }) => ($isCollapsed ? 'hidden' : 'visible')};
  transition: opacity ${({ theme }) => theme.transitions.normal},
              visibility ${({ theme }) => theme.transitions.normal};
  min-width: 0;
  flex: 1;
`;

export const LogoTitle = styled.h1`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.slate[900]};
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.tight};
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const LogoSubtitle = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.slate[600]};
  text-transform: uppercase;
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wide};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const CollapseButton = styled.button`
  width: 36px;
  height: 36px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.slate[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  color: ${({ theme }) => theme.colors.slate[600]};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  flex-shrink: 0;

  &:hover {
    background: ${({ theme }) => theme.colors.slate[50]};
    border-color: ${({ theme }) => theme.colors.slate[300]};
    color: ${({ theme }) => theme.colors.slate[900]};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`;

export const SidebarNav = styled.nav`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.lg} 0;
  overflow-y: auto;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.slate[300]};
    border-radius: ${({ theme }) => theme.borderRadius.sm};

    &:hover {
      background: ${({ theme }) => theme.colors.slate[400]};
    }
  }
`;

export const NavSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  &:last-child {
    margin-bottom: 0;
  }
`;

export const NavSectionTitle = styled.h3<{ $isCollapsed: boolean }>`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.xl}`};
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.slate[500]};
  text-transform: uppercase;
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wide};
  opacity: ${({ $isCollapsed }) => ($isCollapsed ? 0 : 1)};
  visibility: ${({ $isCollapsed }) => ($isCollapsed ? 'hidden' : 'visible')};
  transition: opacity ${({ theme }) => theme.transitions.normal},
              visibility ${({ theme }) => theme.transitions.normal};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  }
`;

interface NavItemProps {
    $isActive: boolean;
    $isCollapsed: boolean;
}

export const NavItem = styled.button<NavItemProps>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.xl}`};
  background: transparent;
  border: none;
  color: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.primary[700] : theme.colors.slate[700]};
  font-size: 0.9375rem;
  font-weight: ${({ $isActive }) => ($isActive ? 600 : 500)};
  text-align: left;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  position: relative;
  justify-content: ${({ $isCollapsed }) => ($isCollapsed ? 'center' : 'flex-start')};

  ${({ $isActive, theme }) =>
    $isActive &&
    css`
      background: ${theme.gradients.hoverOverlay};

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 4px;
        background: ${theme.gradients.primaryButton};
        border-radius: 0 ${theme.borderRadius.sm} ${theme.borderRadius.sm} 0;
      }
    `}

  &:hover {
    background: ${({ theme }) => theme.colors.slate[50]};
    color: ${({ theme }) => theme.colors.slate[900]};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  }
`;

export const NavItemIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
`;

export const NavItemText = styled.span<{ $isCollapsed: boolean }>`
  opacity: ${({ $isCollapsed }) => ($isCollapsed ? 0 : 1)};
  visibility: ${({ $isCollapsed }) => ($isCollapsed ? 'hidden' : 'visible')};
  transition: opacity ${({ theme }) => theme.transitions.normal},
              visibility ${({ theme }) => theme.transitions.normal};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  min-width: 0;
`;

export const SidebarFooter = styled.div`
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
  border-top: 1px solid ${({ theme }) => theme.colors.slate[200]};
  background: ${({ theme }) => theme.colors.slate[50]};
  flex-shrink: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  }
`;

export const FooterButton = styled.button<{ $isCollapsed: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.slate[200]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  color: ${({ theme }) => theme.colors.slate[700]};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  justify-content: ${({ $isCollapsed }) => ($isCollapsed ? 'center' : 'flex-start')};

  &:hover {
    background: ${({ theme }) => theme.colors.slate[50]};
    border-color: ${({ theme }) => theme.colors.slate[300]};
    color: ${({ theme }) => theme.colors.slate[900]};
  }
`;

export const MobileOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  z-index: 999;
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
  animation: fadeIn 200ms ease-out;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export const ToggleSidebarButton = styled.button`
    position: fixed;
    top: ${({ theme }) => theme.spacing.lg};
    left: ${({ theme }) => theme.spacing.lg};
    width: 44px;
    height: 44px;
    padding: 0;
    display: none;
    align-items: center;
    justify-content: center;
    background: white;
    border: 1px solid ${({ theme }) => theme.colors.slate[200]};
    border-radius: ${({ theme }) => theme.borderRadius.xl};
    box-shadow: ${({ theme }) => theme.shadows.lg};
    color: ${({ theme }) => theme.colors.slate[700]};
    cursor: pointer;
    transition: all ${({ theme }) => theme.transitions.fast};
    z-index: 998;

    &:hover {
        background: ${({ theme }) => theme.colors.slate[50]};
        border-color: ${({ theme }) => theme.colors.slate[300]};
        color: ${({ theme }) => theme.colors.slate[900]};
        transform: scale(1.05);
    }

    &:active {
        transform: scale(0.95);
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        display: flex;
    }
`;