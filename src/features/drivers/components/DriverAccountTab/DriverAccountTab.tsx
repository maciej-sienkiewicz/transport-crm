import React, { useState } from 'react';
import {
    CheckCircle,
    XCircle,
    AlertTriangle,
    Clock,
    Unlock,
    RefreshCw,
    Ban,
    Play,
    Shield,
    Key,
    Calendar,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { useDriverDetail } from '../../hooks/useDriverDetail';
import {
    useUnlockAccount,
    useResetPassword,
    useSuspendAccount,
    useUnsuspendAccount,
} from '../../hooks/useDriverAccountManagement';
import { AccountStatus } from '../../types';
import {
    Container,
    StatusCard,
    StatusHeader,
    StatusIcon,
    StatusInfo,
    StatusTitle,
    StatusSubtitle,
    StatusDetails,
    DetailItem,
    DetailLabel,
    DetailValue,
    ActionsContainer,
    InfoSection,
    SectionTitle,
    InfoGrid,
    InfoBox,
    InfoBoxLabel,
    InfoBoxValue,
    TimelineContainer,
    TimelineList,
    TimelineItem,
    TimelineDot,
    TimelineContent,
    TimelineTitle,
    TimelineText,
    TimelineTime,
    EmptyState,
    PinDisplay,
    PinLabel,
    PinValue,
    WarningBox,
    WarningIcon,
    WarningText,
} from './DriverAccountTab.styles';

interface DriverAccountTabProps {
    driverId: string;
}

export const DriverAccountTab: React.FC<DriverAccountTabProps> = ({ driverId }) => {
    const { data: driver, isLoading } = useDriverDetail(driverId);
    const [newPin, setNewPin] = useState<string | null>(null);

    const unlockMutation = useUnlockAccount(driverId);
    const resetPasswordMutation = useResetPassword(driverId);
    const suspendMutation = useSuspendAccount(driverId);
    const unsuspendMutation = useUnsuspendAccount(driverId);

    const handleUnlock = () => {
        if (window.confirm('Czy na pewno chcesz odblokować konto tego kierowcy?')) {
            unlockMutation.mutate();
        }
    };

    const handleResetPassword = () => {
        if (
            window.confirm(
                'Czy na pewno chcesz zresetować hasło? Kierowca będzie musiał aktywować konto ponownie.'
            )
        ) {
            resetPasswordMutation.mutate(undefined, {
                onSuccess: (data) => {
                    setNewPin(data.newPin);
                },
            });
        }
    };

    const handleSuspend = () => {
        if (
            window.confirm(
                'Czy na pewno chcesz zawiesić konto? Kierowca nie będzie mógł się zalogować.'
            )
        ) {
            suspendMutation.mutate();
        }
    };

    const handleUnsuspend = () => {
        if (window.confirm('Czy na pewno chcesz przywrócić konto?')) {
            unsuspendMutation.mutate();
        }
    };

    const handleCopyPin = () => {
        if (newPin) {
            navigator.clipboard.writeText(newPin);
        }
    };

    if (isLoading || !driver) {
        return (
            <Container>
                <p>Ładowanie...</p>
            </Container>
        );
    }

    if (!driver.authStatus) {
        return (
            <Container>
                <EmptyState>
                    <p>Brak informacji o koncie kierowcy</p>
                </EmptyState>
            </Container>
        );
    }

    const { authStatus } = driver;

    const getStatusConfig = (status: AccountStatus) => {
        switch (status) {
            case 'ACTIVE':
                return {
                    variant: 'success' as const,
                    icon: <CheckCircle size={24} />,
                    title: 'Konto aktywne',
                    subtitle: 'Kierowca może się logować i korzystać z aplikacji',
                };
            case 'PENDING_ACTIVATION':
                return {
                    variant: 'warning' as const,
                    icon: <Clock size={24} />,
                    title: 'Oczekuje na aktywację',
                    subtitle: 'Kierowca musi aktywować konto przy pierwszym logowaniu',
                };
            case 'LOCKED':
                return {
                    variant: 'danger' as const,
                    icon: <XCircle size={24} />,
                    title: 'Konto zablokowane',
                    subtitle: 'Zablokowane po 3 nieudanych próbach logowania',
                };
            case 'SUSPENDED':
                return {
                    variant: 'danger' as const,
                    icon: <Ban size={24} />,
                    title: 'Konto zawieszone',
                    subtitle: 'Konto zostało zawieszone przez administratora',
                };
        }
    };

    const statusConfig = getStatusConfig(authStatus.accountStatus);

    const formatDateTime = (dateString?: string) => {
        if (!dateString) return 'Brak danych';
        return new Date(dateString).toLocaleString('pl-PL', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getTimeRemaining = (until?: string) => {
        if (!until) return null;
        const now = new Date();
        const unlockTime = new Date(until);
        const diffMs = unlockTime.getTime() - now.getTime();

        if (diffMs <= 0) return 'Czas minął';

        const hours = Math.floor(diffMs / 3600000);
        const minutes = Math.floor((diffMs % 3600000) / 60000);

        if (hours > 0) return `${hours}h ${minutes}min`;
        return `${minutes} min`;
    };

    const mockActivityHistory = [
        {
            id: '1',
            type: 'LOGIN_SUCCESS',
            title: 'Pomyślne logowanie',
            description: 'Kierowca zalogował się do aplikacji',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            color: '#10b981',
        },
        {
            id: '2',
            type: 'PASSWORD_CHANGED',
            title: 'Zmiana hasła',
            description: 'Kierowca zmienił hasło',
            timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
            color: '#3b82f6',
        },
        {
            id: '3',
            type: 'ACCOUNT_ACTIVATED',
            title: 'Aktywacja konta',
            description: 'Konto zostało aktywowane przez kierowcę',
            timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
            color: '#8b5cf6',
        },
    ];

    return (
        <Container>
            <StatusCard $status={statusConfig.variant}>
                <StatusHeader>
                    <StatusIcon $status={statusConfig.variant}>{statusConfig.icon}</StatusIcon>
                    <StatusInfo>
                        <StatusTitle>{statusConfig.title}</StatusTitle>
                        <StatusSubtitle>{statusConfig.subtitle}</StatusSubtitle>
                    </StatusInfo>
                    <Badge
                        variant={
                            authStatus.accountStatus === 'ACTIVE'
                                ? 'success'
                                : authStatus.accountStatus === 'PENDING_ACTIVATION'
                                    ? 'warning'
                                    : 'danger'
                        }
                    >
                        {authStatus.accountStatusDisplay}
                    </Badge>
                </StatusHeader>

                <StatusDetails>
                    <DetailItem>
                        <DetailLabel>Status logowania</DetailLabel>
                        <DetailValue>
                            {authStatus.canLogin ? '✅ Może się logować' : '❌ Nie może się logować'}
                        </DetailValue>
                    </DetailItem>

                    <DetailItem>
                        <DetailLabel>Nieudane próby logowania</DetailLabel>
                        <DetailValue>
                            {authStatus.failedLoginAttempts} / 3
                            {authStatus.failedLoginAttempts > 0 && (
                                <span style={{ color: '#f59e0b', marginLeft: '8px' }}>⚠️</span>
                            )}
                        </DetailValue>
                    </DetailItem>

                    {authStatus.lastFailedLoginAt && (
                        <DetailItem>
                            <DetailLabel>Ostatnia błędna próba</DetailLabel>
                            <DetailValue>{formatDateTime(authStatus.lastFailedLoginAt)}</DetailValue>
                        </DetailItem>
                    )}

                    {authStatus.isCurrentlyLocked && authStatus.lockedUntil && (
                        <DetailItem>
                            <DetailLabel>Odblokowanie za</DetailLabel>
                            <DetailValue style={{ color: '#ef4444', fontWeight: 700 }}>
                                {getTimeRemaining(authStatus.lockedUntil)}
                            </DetailValue>
                        </DetailItem>
                    )}
                </StatusDetails>

                <ActionsContainer>
                    {authStatus.accountStatus === 'LOCKED' && (
                        <Button
                            variant="primary"
                            onClick={handleUnlock}
                            isLoading={unlockMutation.isPending}
                        >
                            <Unlock size={16} />
                            Odblokuj teraz
                        </Button>
                    )}

                    {authStatus.accountStatus === 'SUSPENDED' && (
                        <Button
                            variant="success"
                            onClick={handleUnsuspend}
                            isLoading={unsuspendMutation.isPending}
                        >
                            <Play size={16} />
                            Przywróć konto
                        </Button>
                    )}

                    {(authStatus.accountStatus === 'ACTIVE' ||
                        authStatus.accountStatus === 'LOCKED' || authStatus.accountStatus == 'PENDING_ACTIVATION') && (
                        <>
                            <Button
                                variant="secondary"
                                onClick={handleResetPassword}
                                isLoading={resetPasswordMutation.isPending}
                            >
                                <RefreshCw size={16} />
                                Zresetuj hasło
                            </Button>

                            <Button
                                variant="danger"
                                onClick={handleSuspend}
                                isLoading={suspendMutation.isPending}
                            >
                                <Ban size={16} />
                                Zawieś konto
                            </Button>
                        </>
                    )}
                </ActionsContainer>

                {newPin && (
                    <>
                        <PinDisplay>
                            <PinLabel>Nowy PIN aktywacyjny</PinLabel>
                            <PinValue>{newPin}</PinValue>
                        </PinDisplay>
                        <WarningBox>
                            <WarningIcon>
                                <AlertTriangle size={20} />
                            </WarningIcon>
                            <WarningText>
                                <strong>Przekaż ten PIN kierowcy.</strong> Musi go użyć przy
                                aktywacji konta. PIN jest jednorazowy i może być użyty tylko raz.
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={handleCopyPin}
                                    style={{ marginTop: '8px' }}
                                >
                                    Skopiuj PIN
                                </Button>
                            </WarningText>
                        </WarningBox>
                    </>
                )}
            </StatusCard>

            <InfoSection>
                <SectionTitle>
                    <Shield size={20} />
                    Szczegóły konta
                </SectionTitle>
                <InfoGrid>
                    <InfoBox>
                        <InfoBoxLabel>
                            <Key size={14} style={{ display: 'inline', marginRight: '4px' }} />
                            Czy ma utworzone konto?
                        </InfoBoxLabel>
                        <InfoBoxValue>
                            {authStatus.hasCredentials ? '✅ Tak' : '❌ Nie'}
                        </InfoBoxValue>
                    </InfoBox>

                    <InfoBox>
                        <InfoBoxLabel>
                            <Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} />
                            Data aktywacji
                        </InfoBoxLabel>
                        <InfoBoxValue>{formatDateTime(authStatus.activatedAt)}</InfoBoxValue>
                    </InfoBox>

                    <InfoBox>
                        <InfoBoxLabel>
                            <Clock size={14} style={{ display: 'inline', marginRight: '4px' }} />
                            Ostatnia zmiana hasła
                        </InfoBoxLabel>
                        <InfoBoxValue>
                            {formatDateTime(authStatus.passwordChangedAt)}
                        </InfoBoxValue>
                    </InfoBox>

                    {authStatus.lockedAt && (
                        <InfoBox>
                            <InfoBoxLabel>
                                <XCircle size={14} style={{ display: 'inline', marginRight: '4px' }} />
                                Data zablokowania
                            </InfoBoxLabel>
                            <InfoBoxValue>{formatDateTime(authStatus.lockedAt)}</InfoBoxValue>
                        </InfoBox>
                    )}
                </InfoGrid>
            </InfoSection>

            <TimelineContainer>
                <SectionTitle>
                    <Clock size={20} />
                    Historia aktywności konta
                </SectionTitle>
                <TimelineList>
                    {mockActivityHistory.map((event) => (
                        <TimelineItem key={event.id}>
                            <TimelineDot $color={event.color}>
                                {event.type === 'LOGIN_SUCCESS' && <CheckCircle size={12} />}
                                {event.type === 'PASSWORD_CHANGED' && <Key size={12} />}
                                {event.type === 'ACCOUNT_ACTIVATED' && <Shield size={12} />}
                            </TimelineDot>
                            <TimelineContent>
                                <TimelineTitle>{event.title}</TimelineTitle>
                                <TimelineText>{event.description}</TimelineText>
                                <TimelineTime>
                                    <Clock size={12} />
                                    {formatDateTime(event.timestamp)}
                                </TimelineTime>
                            </TimelineContent>
                        </TimelineItem>
                    ))}
                </TimelineList>
            </TimelineContainer>
        </Container>
    );
};