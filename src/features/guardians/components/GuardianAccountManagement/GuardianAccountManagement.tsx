// src/features/guardians/components/GuardianAccountManagement/GuardianAccountManagement.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { Shield, Key, UserPlus, UserX, Mail, Phone, CheckCircle, XCircle } from 'lucide-react';
import {
    useResetGuardianPassword,
    useCreateGuardianAccount,
    useDeactivateGuardianAccount
} from '../../hooks/useGuardianAccount';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { Checkbox } from '@/shared/ui/Checkbox';
import { Modal } from '@/shared/ui/Modal';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xl};
`;

const Section = styled.div`
    background: white;
    border: 1px solid ${({ theme }) => theme.colors.slate[200]};
    border-radius: ${({ theme }) => theme.borderRadius.xl};
    padding: ${({ theme }) => theme.spacing.lg};
`;

const SectionTitle = styled.h3`
    font-size: 1rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[900]};
    margin-bottom: ${({ theme }) => theme.spacing.md};
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
`;

const InfoGrid = styled.div`
    display: grid;
    gap: ${({ theme }) => theme.spacing.md};
`;

const InfoItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${({ theme }) => theme.spacing.md};
    background: ${({ theme }) => theme.colors.slate[50]};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
`;

const InfoLabel = styled.span`
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.slate[600]};
    font-weight: 500;
`;

const InfoValue = styled.span`
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.slate[900]};
    font-weight: 600;
`;

const ActionButtons = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: ${({ theme }) => theme.spacing.sm};
    margin-top: ${({ theme }) => theme.spacing.md};
`;

const WarningBox = styled.div`
    padding: ${({ theme }) => theme.spacing.md};
    background: ${({ theme }) => theme.colors.warning[50]};
    border: 1px solid ${({ theme }) => theme.colors.warning[200]};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    color: ${({ theme }) => theme.colors.warning[900]};
    font-size: 0.875rem;
    line-height: 1.5;
    margin-top: ${({ theme }) => theme.spacing.md};
`;

const FormContainer = styled.form`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.lg};
`;

const FormActions = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: ${({ theme }) => theme.spacing.md};
    margin-top: ${({ theme }) => theme.spacing.lg};

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        flex-direction: column-reverse;
        button {
            width: 100%;
        }
    }
`;

const CheckboxGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};
`;

interface GuardianAccountManagementProps {
    guardianId: string;
    accountInfo: {
        hasAccount: boolean;
        lastLogin?: string;
        loginCount30Days: number;
        loginCount7Days: number;
        accountCreatedAt?: string;
        accountStatus?: 'ACTIVE' | 'INACTIVE' | 'LOCKED';
    };
}

export const GuardianAccountManagement: React.FC<GuardianAccountManagementProps> = ({
                                                                                        guardianId,
                                                                                        accountInfo,
                                                                                    }) => {
    const [showResetModal, setShowResetModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDeactivateModal, setShowDeactivateModal] = useState(false);
    const [sendEmail, setSendEmail] = useState(true);
    const [sendSms, setSendSms] = useState(false);

    const resetPassword = useResetGuardianPassword(guardianId);
    const createAccount = useCreateGuardianAccount(guardianId);
    const deactivateAccount = useDeactivateGuardianAccount(guardianId);

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        await resetPassword.mutateAsync({ sendEmail, sendSms });
        setShowResetModal(false);
    };

    const handleCreateAccount = async () => {
        await createAccount.mutateAsync();
        setShowCreateModal(false);
    };

    const handleDeactivateAccount = async () => {
        await deactivateAccount.mutateAsync();
        setShowDeactivateModal(false);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('pl-PL', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <Container>
            <Section>
                <SectionTitle>
                    <Shield size={20} />
                    Status konta
                </SectionTitle>

                {!accountInfo.hasAccount ? (
                    <>
                        <InfoGrid>
                            <InfoItem>
                                <InfoLabel>Status</InfoLabel>
                                <Badge variant="default">
                                    <XCircle size={12} />
                                    Brak konta
                                </Badge>
                            </InfoItem>
                        </InfoGrid>
                        <ActionButtons>
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => setShowCreateModal(true)}
                            >
                                <UserPlus size={16} />
                                Utwórz konto
                            </Button>
                        </ActionButtons>
                    </>
                ) : (
                    <>
                        <InfoGrid>
                            <InfoItem>
                                <InfoLabel>Status</InfoLabel>
                                <Badge
                                    variant={accountInfo.accountStatus === 'ACTIVE' ? 'success' : 'danger'}
                                >
                                    {accountInfo.accountStatus === 'ACTIVE' ? (
                                        <CheckCircle size={12} />
                                    ) : (
                                        <XCircle size={12} />
                                    )}
                                    {accountInfo.accountStatus === 'ACTIVE' ? 'Aktywne' : 'Nieaktywne'}
                                </Badge>
                            </InfoItem>
                            {accountInfo.accountCreatedAt && (
                                <InfoItem>
                                    <InfoLabel>Utworzono</InfoLabel>
                                    <InfoValue>{formatDate(accountInfo.accountCreatedAt)}</InfoValue>
                                </InfoItem>
                            )}
                            <InfoItem>
                                <InfoLabel>Ostatnie logowanie</InfoLabel>
                                <InfoValue>
                                    {accountInfo.lastLogin
                                        ? formatDate(accountInfo.lastLogin)
                                        : 'Nigdy'}
                                </InfoValue>
                            </InfoItem>
                            <InfoItem>
                                <InfoLabel>Logowania (7 dni)</InfoLabel>
                                <InfoValue>{accountInfo.loginCount7Days}</InfoValue>
                            </InfoItem>
                            <InfoItem>
                                <InfoLabel>Logowania (30 dni)</InfoLabel>
                                <InfoValue>{accountInfo.loginCount30Days}</InfoValue>
                            </InfoItem>
                        </InfoGrid>

                        <ActionButtons>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => setShowResetModal(true)}
                            >
                                <Key size={16} />
                                Resetuj hasło
                            </Button>
                            {accountInfo.accountStatus === 'ACTIVE' && (
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => setShowDeactivateModal(true)}
                                >
                                    <UserX size={16} />
                                    Dezaktywuj konto
                                </Button>
                            )}
                        </ActionButtons>
                    </>
                )}
            </Section>

            {/* Reset Password Modal */}
            <Modal
                isOpen={showResetModal}
                onClose={() => setShowResetModal(false)}
                title="Resetuj hasło"
            >
                <FormContainer onSubmit={handleResetPassword}>
                    <p style={{ fontSize: '0.9375rem', color: '#64748b' }}>
                        Wybierz sposób wysłania linku do resetu hasła:
                    </p>

                    <CheckboxGroup>
                        <Checkbox
                            label={
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Mail size={16} />
                                    Wyślij link emailem
                                </span>
                            }
                            checked={sendEmail}
                            onChange={(e) => setSendEmail(e.target.checked)}
                        />
                        <Checkbox
                            label={
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Phone size={16} />
                                    Wyślij link SMS-em
                                </span>
                            }
                            checked={sendSms}
                            onChange={(e) => setSendSms(e.target.checked)}
                        />
                    </CheckboxGroup>

                    <WarningBox>
                        ⚠️ Link będzie ważny przez 24 godziny. Opiekun otrzyma instrukcje zmiany hasła.
                    </WarningBox>

                    <FormActions>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setShowResetModal(false)}
                            disabled={resetPassword.isPending}
                        >
                            Anuluj
                        </Button>
                        <Button
                            type="submit"
                            isLoading={resetPassword.isPending}
                            disabled={!sendEmail && !sendSms}
                        >
                            Wyślij link
                        </Button>
                    </FormActions>
                </FormContainer>
            </Modal>

            {/* Create Account Modal */}
            <Modal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Utwórz konto"
            >
                <div>
                    <p style={{ fontSize: '0.9375rem', color: '#64748b', marginBottom: '1rem' }}>
                        Czy na pewno chcesz utworzyć konto dla tego opiekuna?
                    </p>
                    <WarningBox>
                        ℹ️ Opiekun otrzyma email z instrukcjami aktywacji konta i ustawienia hasła.
                    </WarningBox>
                    <FormActions>
                        <Button
                            variant="secondary"
                            onClick={() => setShowCreateModal(false)}
                            disabled={createAccount.isPending}
                        >
                            Anuluj
                        </Button>
                        <Button
                            onClick={handleCreateAccount}
                            isLoading={createAccount.isPending}
                        >
                            Utwórz konto
                        </Button>
                    </FormActions>
                </div>
            </Modal>

            {/* Deactivate Account Modal */}
            <Modal
                isOpen={showDeactivateModal}
                onClose={() => setShowDeactivateModal(false)}
                title="Dezaktywuj konto"
            >
                <div>
                    <p style={{ fontSize: '0.9375rem', color: '#64748b', marginBottom: '1rem' }}>
                        Czy na pewno chcesz dezaktywować konto tego opiekuna?
                    </p>
                    <WarningBox>
                        ⚠️ Opiekun nie będzie mógł się zalogować do aplikacji. Dane nie zostaną usunięte.
                    </WarningBox>
                    <FormActions>
                        <Button
                            variant="secondary"
                            onClick={() => setShowDeactivateModal(false)}
                            disabled={deactivateAccount.isPending}
                        >
                            Anuluj
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleDeactivateAccount}
                            isLoading={deactivateAccount.isPending}
                        >
                            Dezaktywuj
                        </Button>
                    </FormActions>
                </div>
            </Modal>
        </Container>
    );
};