import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useLogin } from '@/features/auth/hooks/useLogin';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.slate[50]};
`;

const LoadingText = styled.p`
  margin-top: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.slate[600]};
  font-size: 0.9375rem;
`;

interface AuthProviderProps {
    children: React.ReactNode;
}

// HARDCODED CREDENTIALS - DO USUNIĘCIA W PRZYSZŁOŚCI
const HARDCODED_CREDENTIALS = {
    email: 'admin@admin.com',
    password: 'admin',
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuthStore();
    const login = useLogin();
    const { isLoading: isCheckingSession } = useCurrentUser();
    const [isInitializing, setIsInitializing] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            if (isAuthenticated) {
                setIsInitializing(false);
                return;
            }

            // Jeśli sprawdzamy sesję, poczekaj
            if (isCheckingSession) {
                return;
            }

            // Jeśli nie ma aktywnej sesji, zaloguj automatycznie
            try {
                console.log('🔐 Automatyczne logowanie...');
                await login.mutateAsync(HARDCODED_CREDENTIALS);
                console.log('✅ Zalogowano pomyślnie');
            } catch (error) {
                console.error('❌ Błąd automatycznego logowania:', error);
            } finally {
                setIsInitializing(false);
            }
        };

        initAuth();
    }, [isAuthenticated, isCheckingSession]);

    // Pokazuj loading podczas inicjalizacji
    if (isInitializing || isLoading || isCheckingSession) {
        return (
            <LoadingContainer>
                <LoadingSpinner />
                <LoadingText>Ładowanie aplikacji...</LoadingText>
            </LoadingContainer>
        );
    }

    // Jeśli nie jesteśmy zalogowani po inicjalizacji, pokaż błąd
    if (!isAuthenticated) {
        return (
            <LoadingContainer>
                <LoadingText>Nie udało się zalogować. Odśwież stronę.</LoadingText>
            </LoadingContainer>
        );
    }

    return <>{children}</>;
};