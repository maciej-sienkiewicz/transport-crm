// src/widgets/Sidebar/Sidebar.tsx - WERSJA Z SUBMENU DLA STATYSTYK

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
    Users,
    Baby,
    Car,
    UserCircle,
    Route,
    Menu,
    X,
    ChevronLeft,
    ChevronRight,
    Home,
    AlertTriangle,
    Repeat,
    BarChart3,
    ChevronDown,
    Truck,
    Package,
    Activity,
    Clock,
} from 'lucide-react';
import {
    SidebarContainer,
    SidebarHeader,
    Logo,
    LogoIcon,
    LogoText,
    LogoTitle,
    LogoSubtitle,
    CollapseButton,
    SidebarNav,
    NavSection,
    NavSectionTitle,
    NavItem,
    NavItemIcon,
    NavItemText,
    SidebarFooter,
    FooterButton,
    MobileOverlay,
    ToggleSidebarButton,
} from './Sidebar.styles';

// Dodatkowe style dla submenu
const SubmenuContainer = styled.div<{ $isOpen: boolean; $isCollapsed: boolean }>`
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
  padding-left: ${({ $isCollapsed }) => ($isCollapsed ? '0' : '2.5rem')};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const SubmenuItem = styled.div<{ $isActive: boolean; $isCollapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.primary[600] : theme.colors.slate[600]};
  background: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.primary[50] : 'transparent'};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: ${({ $isActive }) => ($isActive ? 600 : 500)};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.slate[100]};
    color: ${({ theme }) => theme.colors.slate[900]};
  }

  ${({ $isCollapsed }) =>
    $isCollapsed &&
    `
    justify-content: center;
    padding-left: 0;
    padding-right: 0;
  `}
`;

const ChevronIcon = styled.div<{ $isOpen: boolean }>`
  margin-left: auto;
  transition: transform 200ms ease;
  transform: ${({ $isOpen }) => ($isOpen ? 'rotate(180deg)' : 'rotate(0)')};
`;

interface NavItemConfig {
    id: string;
    label: string;
    icon: React.ComponentType<{ size?: number }>;
    path: string;
    submenu?: Array<{
        id: string;
        label: string;
        icon: React.ComponentType<{ size?: number }>;
        path: string;
    }>;
}

const navigationItems: NavItemConfig[] = [
    {
        id: 'dashboard',
        icon: Home,
        label: 'Dashboard',
        path: '/dashboard',
    },
    {
        id: 'guardians',
        label: 'Opiekunowie',
        icon: Users,
        path: '/guardians',
    },
    {
        id: 'children',
        label: 'Dzieci',
        icon: Baby,
        path: '/children',
    },
    {
        id: 'vehicles',
        label: 'Pojazdy',
        icon: Car,
        path: '/vehicles',
    },
    {
        id: 'drivers',
        label: 'Kierowcy',
        icon: UserCircle,
        path: '/drivers',
    },
    {
        id: 'routes',
        label: 'Trasy',
        icon: Route,
        path: '/routes',
    },
    {
        id: 'route-series',
        label: 'Serie tras',
        icon: Repeat,
        path: '/routes/series',
    },
    {
        id: 'unassigned',
        label: 'Nieprzypisane',
        icon: AlertTriangle,
        path: '/routes/unassigned',
    },
    // ← NOWE: Statystyki z submenu
    {
        id: 'statistics',
        label: 'Statystyki',
        icon: BarChart3,
        path: '/statistics/drivers',
        submenu: [
            {
                id: 'statistics-drivers',
                label: 'Kierowcy',
                icon: Users,
                path: '/statistics/drivers',
            },
            {
                id: 'statistics-fleet',
                label: 'Flota',
                icon: Truck,
                path: '/statistics/fleet',
            },
            {
                id: 'statistics-workload',
                label: 'Obciążenie',
                icon: Activity,
                path: '/statistics/workload',
            },
            {
                id: 'statistics-service',
                label: 'Jakość',
                icon: Clock,
                path: '/statistics/service-quality',
            },
        ],
    },
];

export const Sidebar: React.FC = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [currentPath, setCurrentPath] = useState(window.location.pathname);
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(
        currentPath.startsWith('/statistics') ? 'statistics' : null
    );

    useEffect(() => {
        const handlePopState = () => {
            setCurrentPath(window.location.pathname);
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsMobileOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const event = new CustomEvent('sidebar-collapse', {
            detail: { isCollapsed }
        });
        window.dispatchEvent(event);
    }, [isCollapsed]);

    const handleNavigate = (path: string) => {
        console.log('📍 Sidebar: Navigating to:', path);
        window.history.pushState({}, '', path);
        window.dispatchEvent(new PopStateEvent('popstate'));
        setCurrentPath(path);
        setIsMobileOpen(false);
    };

    const isActive = (path: string): boolean => {
        if (path === '/routes/unassigned') {
            return currentPath === '/routes/unassigned';
        }

        if (path === '/routes/create') {
            return currentPath === '/routes/create';
        }

        if (path === '/routes/series') {
            return currentPath === '/routes/series' || currentPath.startsWith('/routes/series/');
        }

        if (path === '/dashboard') {
            return currentPath === '/dashboard' || currentPath === '/';
        }

        // Statystyki - parent active jeśli którykolwiek submenu jest aktywne
        if (path === '/statistics/drivers') {
            return currentPath.startsWith('/statistics');
        }

        if (path === '/routes') {
            return currentPath === '/routes';
        }

        if (path === '/guardians') {
            return currentPath === '/guardians' ||
                (currentPath.startsWith('/guardians/') && currentPath !== '/guardians');
        }

        if (path === '/children' || path === '/vehicles' || path === '/drivers') {
            return currentPath === path || currentPath.startsWith(path + '/');
        }

        return currentPath === path;
    };

    const toggleSubmenu = (itemId: string, itemPath: string) => {
        if (openSubmenu === itemId) {
            setOpenSubmenu(null);
        } else {
            setOpenSubmenu(itemId);
            // Jeśli nie ma submenu, nawiguj
            const item = navigationItems.find((i) => i.id === itemId);
            if (!item?.submenu) {
                handleNavigate(itemPath);
            }
        }
    };

    const toggleSidebar = () => {
        setIsMobileOpen(!isMobileOpen);
    };

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <>
            <ToggleSidebarButton onClick={toggleSidebar} aria-label="Otwórz menu">
                <Menu size={24} />
            </ToggleSidebarButton>

            <MobileOverlay $isOpen={isMobileOpen} onClick={() => setIsMobileOpen(false)} />

            <SidebarContainer $isCollapsed={isCollapsed && !isMobileOpen}>
                <SidebarHeader>
                    <Logo>
                        <LogoIcon>
                            <Car size={28} />
                        </LogoIcon>
                        <LogoText $isCollapsed={isCollapsed}>
                            <LogoTitle>Transport CRM</LogoTitle>
                            <LogoSubtitle>System zarządzania</LogoSubtitle>
                        </LogoText>
                    </Logo>
                    <CollapseButton
                        onClick={toggleCollapse}
                        aria-label={isCollapsed ? 'Rozwiń menu' : 'Zwiń menu'}
                    >
                        {isCollapsed ? <ChevronRight size={20} /> : <X size={20} />}
                    </CollapseButton>
                </SidebarHeader>

                <SidebarNav>
                    <NavSection>
                        <NavSectionTitle $isCollapsed={isCollapsed}>Zarządzanie</NavSectionTitle>
                        {navigationItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.path);
                            const hasSubmenu = Boolean(item.submenu);
                            const isSubmenuOpen = openSubmenu === item.id;

                            return (
                                <div key={item.id}>
                                    <NavItem
                                        $isActive={active}
                                        $isCollapsed={isCollapsed}
                                        onClick={() => toggleSubmenu(item.id, item.path)}
                                        aria-label={item.label}
                                        aria-current={active ? 'page' : undefined}
                                        aria-expanded={hasSubmenu ? isSubmenuOpen : undefined}
                                    >
                                        <NavItemIcon>
                                            <Icon size={20} />
                                        </NavItemIcon>
                                        <NavItemText $isCollapsed={isCollapsed}>
                                            {item.label}
                                        </NavItemText>
                                        {hasSubmenu && !isCollapsed && (
                                            <ChevronIcon $isOpen={isSubmenuOpen}>
                                                <ChevronDown size={16} />
                                            </ChevronIcon>
                                        )}
                                    </NavItem>

                                    {hasSubmenu && item.submenu && (
                                        <SubmenuContainer $isOpen={isSubmenuOpen} $isCollapsed={isCollapsed}>
                                            {item.submenu.map((subitem) => {
                                                const SubIcon = subitem.icon;
                                                const subActive = currentPath === subitem.path;

                                                return (
                                                    <SubmenuItem
                                                        key={subitem.id}
                                                        $isActive={subActive}
                                                        $isCollapsed={isCollapsed}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleNavigate(subitem.path);
                                                        }}
                                                    >
                                                        <SubIcon size={16} />
                                                        {!isCollapsed && subitem.label}
                                                    </SubmenuItem>
                                                );
                                            })}
                                        </SubmenuContainer>
                                    )}
                                </div>
                            );
                        })}
                    </NavSection>
                </SidebarNav>

                <SidebarFooter>
                    <FooterButton
                        $isCollapsed={isCollapsed}
                        onClick={toggleCollapse}
                        aria-label={isCollapsed ? 'Rozwiń menu' : 'Zwiń menu'}
                    >
                        <NavItemIcon>
                            {isCollapsed ? (
                                <ChevronRight size={20} />
                            ) : (
                                <ChevronLeft size={20} />
                            )}
                        </NavItemIcon>
                        <NavItemText $isCollapsed={isCollapsed}>
                            {isCollapsed ? 'Rozwiń' : 'Zwiń menu'}
                        </NavItemText>
                    </FooterButton>
                </SidebarFooter>
            </SidebarContainer>
        </>
    );
};