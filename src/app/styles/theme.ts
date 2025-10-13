import { DefaultTheme } from 'styled-components';

export const theme: DefaultTheme = {
    colors: {
        slate: {
            50: '#f8fafc',
            100: '#f1f5f9',
            200: '#e2e8f0',
            300: '#cbd5e1',
            400: '#94a3b8',
            500: '#64748b',
            600: '#475569',
            700: '#334155',
            800: '#1e293b',
            900: '#0f172a',
        },
        primary: {
            50: '#eff6ff',
            100: '#dbeafe',
            500: '#3b82f6',
            600: '#2563eb',
            700: '#1d4ed8',
        },
        success: {
            50: '#ecfdf5',
            100: '#d1fae5',
            500: '#10b981',
            600: '#059669',
            700: '#047857',
        },
        warning: {
            50: '#fffbeb',
            100: '#fef3c7',
            500: '#f59e0b',
            600: '#d97706',
            700: '#b45309',
        },
        danger: {
            50: '#fef2f2',
            100: '#fee2e2',
            500: '#ef4444',
            600: '#dc2626',
            700: '#b91c1c',
        },
        accent: {
            400: '#a78bfa',
            500: '#8b5cf6',
            600: '#7c3aed',
        },
    },

    gradients: {
        primaryButton: 'linear-gradient(to right, #2563eb, #7c3aed)',
        cardHeader: 'linear-gradient(to right, #eff6ff, #e0e7ff)',
        avatar: 'linear-gradient(to bottom right, #a78bfa, #7c3aed)',
        hoverOverlay: 'linear-gradient(to bottom right, rgba(59, 130, 246, 0.05), rgba(139, 92, 246, 0.05))',
    },

    shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.07)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.15)',
        primaryGlow: '0 10px 30px -5px rgba(37, 99, 235, 0.3)',
        accentGlow: '0 10px 30px -5px rgba(139, 92, 246, 0.3)',
    },

    borderRadius: {
        sm: '0.375rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.5rem',
        full: '9999px',
    },

    spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
    },

    breakpoints: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
    },

    transitions: {
        fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
        normal: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
        slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    },

    typography: {
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        letterSpacing: {
            tight: '-0.03em',
            normal: '0',
            wide: '0.025em',
        },
    },
};

declare module 'styled-components' {
    export interface DefaultTheme {
        colors: typeof theme.colors;
        gradients: typeof theme.gradients;
        shadows: typeof theme.shadows;
        borderRadius: typeof theme.borderRadius;
        spacing: typeof theme.spacing;
        breakpoints: typeof theme.breakpoints;
        transitions: typeof theme.transitions;
        typography: typeof theme.typography;
    }
}