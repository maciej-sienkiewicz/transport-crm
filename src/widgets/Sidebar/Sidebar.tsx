// src/widgets/Sidebar/Sidebar.tsx - POPRAWIONA WERSJA

import React, { useState, useEffect } from 'react';
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
    AlertTriangle, // Zmieniam z AlertCircle na AlertTriangle dla lepszej widoczności
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

interface NavItemConfig {
    id: string;
    label: string;
    icon: React.ComponentType<{ size?: number }>;
    path: string;
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
        id: 'unassigned',
        label: 'Nieprzypisane',
        icon: AlertTriangle,
        path: '/routes/unassigned',
    },
];

export const Sidebar: React.FC = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [currentPath, setCurrentPath] = useState(window.location.pathname);

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
        console.log('🔵 Sidebar: Navigating to:', path); // DEBUG
        window.history.pushState({}, '', path);
        window.dispatchEvent(new PopStateEvent('popstate'));
        setCurrentPath(path);
        setIsMobileOpen(false);
    };

    // POPRAWIONA FUNKCJA isActive - bardziej precyzyjna
    const isActive = (path: string): boolean => {
        // Exact match dla specjalnych ścieżek
        if (path === '/routes/unassigned') {
            return currentPath === '/routes/unassigned';
        }

        if (path === '/routes/create') {
            return currentPath === '/routes/create';
        }

        if (path === '/dashboard') {
            return currentPath === '/dashboard' || currentPath === '/';
        }

        // Dla /routes - tylko główna lista tras (bez podstron)
        if (path === '/routes') {
            return currentPath === '/routes';
        }

        // Dla /guardians - główna strona lub szczegóły
        if (path === '/guardians') {
            return currentPath === '/guardians' ||
                (currentPath.startsWith('/guardians/') && currentPath !== '/guardians');
        }

        // Dla pozostałych - standardowe sprawdzenie
        if (path === '/children' || path === '/vehicles' || path === '/drivers') {
            return currentPath === path || currentPath.startsWith(path + '/');
        }

        return currentPath === path;
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

                            return (
                                <NavItem
                                    key={item.id}
                                    $isActive={active}
                                    $isCollapsed={isCollapsed}
                                    onClick={() => {
                                        console.log('🟢 Clicked:', item.label, 'Path:', item.path); // DEBUG
                                        handleNavigate(item.path);
                                    }}
                                    aria-label={item.label}
                                    aria-current={active ? 'page' : undefined}
                                >
                                    <NavItemIcon>
                                        <Icon size={20} />
                                    </NavItemIcon>
                                    <NavItemText $isCollapsed={isCollapsed}>
                                        {item.label}
                                    </NavItemText>
                                </NavItem>
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