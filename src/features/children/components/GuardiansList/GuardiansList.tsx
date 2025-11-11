import React from 'react';
import { Plus, Phone, Mail, Star, CheckCircle, XCircle } from 'lucide-react';
import styled from 'styled-components';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { relationshipLabels } from '../../lib/constants';
import { ChildGuardian } from '../../types';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xl};
`;

const Header = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: ${({ theme }) => theme.spacing.lg};

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        justify-content: flex-start;
    }
`;

const GuardiansGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: ${({ theme }) => theme.spacing.lg};

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        grid-template-columns: 1fr;
    }
`;

const GuardianCard = styled.div`
    padding: ${({ theme }) => theme.spacing.lg};
    background: white;
    border: 1px solid ${({ theme }) => theme.colors.slate[200]};
    border-radius: ${({ theme }) => theme.borderRadius.xl};
    transition: all ${({ theme }) => theme.transitions.normal};

    &:hover {
        transform: translateY(-2px);
        box-shadow: ${({ theme }) => theme.shadows.md};
        border-color: ${({ theme }) => theme.colors.primary[200]};
    }
`;

const CardHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: ${({ theme }) => theme.spacing.md};
    padding-bottom: ${({ theme }) => theme.spacing.md};
    border-bottom: 1px solid ${({ theme }) => theme.colors.slate[200]};
`;

const GuardianInfo = styled.div`
    flex: 1;
`;

const GuardianName = styled.h3`
    font-size: 1.125rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[900]};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
`;

const GuardianRelation = styled.div`
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.slate[600]};
`;

const ContactSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};
    margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ContactItem = styled.a`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
    padding: ${({ theme }) => theme.spacing.sm};
    background: ${({ theme }) => theme.colors.slate[50]};
    border: 1px solid ${({ theme }) => theme.colors.slate[200]};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.slate[700]};
    text-decoration: none;
    transition: all ${({ theme }) => theme.transitions.fast};

    &:hover {
        background: ${({ theme }) => theme.colors.slate[100]};
        border-color: ${({ theme }) => theme.colors.primary[300]};
        color: ${({ theme }) => theme.colors.primary[600]};
    }
`;

const PermissionsSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xs};
    margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const PermissionLabel = styled.div`
    font-size: 0.75rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[600]};
    text-transform: uppercase;
    letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wide};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const PermissionItem = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.slate[700]};
`;

const Actions = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.xs};
    padding-top: ${({ theme }) => theme.spacing.md};
    border-top: 1px solid ${({ theme }) => theme.colors.slate[200]};
`;

const EmptyState = styled.div`
    padding: ${({ theme }) => theme.spacing['2xl']};
    text-align: center;
    background: ${({ theme }) => theme.colors.slate[50]};
    border-radius: ${({ theme }) => theme.borderRadius.xl};
    border: 1px dashed ${({ theme }) => theme.colors.slate[300]};
`;

const EmptyTitle = styled.h3`
    font-size: 1.125rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[900]};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const EmptyText = styled.p`
    font-size: 0.9375rem;
    color: ${({ theme }) => theme.colors.slate[600]};
`;

interface GuardiansListProps {
    childId: string;
    guardians: ChildGuardian[];
}

export const GuardiansList: React.FC<GuardiansListProps> = ({ childId, guardians }) => {
    return (
        <Container>
            <Header>
                <Button size="sm">
                    <Plus size={16} />
                    Dodaj opiekuna
                </Button>
            </Header>

            {guardians.length === 0 ? (
                <EmptyState>
                    <EmptyTitle>Brak przypisanych opiekunów</EmptyTitle>
                    <EmptyText>
                        Dodaj pierwszego opiekuna, aby móc zarządzać kontaktami i uprawnieniami
                    </EmptyText>
                </EmptyState>
            ) : (
                <GuardiansGrid>
                    {guardians.map((guardian) => (
                        <GuardianCard key={guardian.id}>
                            <CardHeader>
                                <GuardianInfo>
                                    <GuardianName>
                                        {guardian.firstName} {guardian.lastName}
                                        {guardian.isPrimary && (
                                            <Star size={16} fill="#f59e0b" color="#f59e0b" />
                                        )}
                                    </GuardianName>
                                    <GuardianRelation>
                                        {relationshipLabels[guardian.relationship]}
                                        {guardian.isPrimary && ' • Główny kontakt'}
                                    </GuardianRelation>
                                </GuardianInfo>
                            </CardHeader>

                            <ContactSection>
                                <ContactItem href={`tel:${guardian.phone}`}>
                                    <Phone size={16} />
                                    {guardian.phone}
                                </ContactItem>
                                <ContactItem href={`mailto:${guardian.email}`}>
                                    <Mail size={16} />
                                    {guardian.email}
                                </ContactItem>
                            </ContactSection>

                            <PermissionsSection>
                                <PermissionLabel>Uprawnienia</PermissionLabel>
                                <PermissionItem>
                                    {guardian.canPickup ? (
                                        <CheckCircle size={16} color="#10b981" />
                                    ) : (
                                        <XCircle size={16} color="#ef4444" />
                                    )}
                                    Może odbierać dziecko
                                </PermissionItem>
                                <PermissionItem>
                                    {guardian.canAuthorize ? (
                                        <CheckCircle size={16} color="#10b981" />
                                    ) : (
                                        <XCircle size={16} color="#ef4444" />
                                    )}
                                    Może autoryzować zmiany
                                </PermissionItem>
                            </PermissionsSection>

                            <Actions>
                                <Button variant="secondary" size="sm" fullWidth>
                                    Edytuj
                                </Button>
                                <Button variant="danger" size="sm" fullWidth>
                                    Usuń
                                </Button>
                            </Actions>
                        </GuardianCard>
                    ))}
                </GuardiansGrid>
            )}
        </Container>
    );
};