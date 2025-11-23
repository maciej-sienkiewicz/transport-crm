// src/features/guardians/components/GuardianChildren/GuardianChildren.tsx
import React from 'react';
import styled from 'styled-components';
import { ArrowRight, Star, User } from 'lucide-react';
import { GuardianChild } from '../../types';
import { Badge } from '@/shared/ui/Badge';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.lg};
`;

const ChildrenGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: ${({ theme }) => theme.spacing.md};

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        grid-template-columns: 1fr;
    }
`;

const ChildCard = styled.div`
    padding: ${({ theme }) => theme.spacing.lg};
    background: white;
    border: 1px solid ${({ theme }) => theme.colors.slate[200]};
    border-radius: ${({ theme }) => theme.borderRadius.xl};
    transition: all ${({ theme }) => theme.transitions.normal};
    cursor: pointer;

    &:hover {
        transform: translateY(-2px);
        box-shadow: ${({ theme }) => theme.shadows.md};
        border-color: ${({ theme }) => theme.colors.primary[200]};
    }
`;

const ChildHeader = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: ${({ theme }) => theme.spacing.sm};
    margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ChildInfo = styled.div`
    flex: 1;
`;

const ChildName = styled.h3`
    font-size: 1rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[900]};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ChildMeta = styled.div`
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.slate[600]};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ChildBadges = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: ${({ theme }) => theme.spacing.xs};
    margin-top: ${({ theme }) => theme.spacing.sm};
`;

const ViewButton = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    background: ${({ theme }) => theme.colors.slate[100]};
    color: ${({ theme }) => theme.colors.slate[600]};
    transition: all ${({ theme }) => theme.transitions.fast};

    ${ChildCard}:hover & {
        background: ${({ theme }) => theme.colors.primary[100]};
        color: ${({ theme }) => theme.colors.primary[600]};
    }
`;

const EmptyState = styled.div`
    padding: ${({ theme }) => theme.spacing['2xl']};
    text-align: center;
    background: ${({ theme }) => theme.colors.slate[50]};
    border-radius: ${({ theme }) => theme.borderRadius.xl};
    border: 1px dashed ${({ theme }) => theme.colors.slate[300]};
`;

const EmptyIcon = styled.div`
    width: 64px;
    height: 64px;
    margin: 0 auto ${({ theme }) => theme.spacing.md};
    background: ${({ theme }) => theme.colors.slate[100]};
    border-radius: ${({ theme }) => theme.borderRadius.full};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.colors.slate[500]};
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

interface GuardianChildrenProps {
    guardianId: string;
    children: GuardianChild[];
}

const relationshipLabels: Record<string, string> = {
    PARENT: 'Rodzic',
    LEGAL_GUARDIAN: 'Opiekun prawny',
    GRANDPARENT: 'Dziadek/Babcia',
    RELATIVE: 'Inny członek rodziny',
    OTHER: 'Inna osoba upoważniona',
};

const statusLabels: Record<string, string> = {
    ACTIVE: 'Aktywny',
    INACTIVE: 'Nieaktywny',
    TEMPORARY_INACTIVE: 'Czasowo nieaktywny',
};

export const GuardianChildren: React.FC<GuardianChildrenProps> = ({ guardianId, children }) => {
    const handleChildClick = (childId: string) => {
        window.location.href = `/children/${childId}`;
    };

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return 'success';
            case 'INACTIVE':
                return 'danger';
            case 'TEMPORARY_INACTIVE':
                return 'warning';
            default:
                return 'default';
        }
    };

    if (children.length === 0) {
        return (
            <Container>
                <EmptyState>
                    <EmptyIcon>
                        <User size={32} />
                    </EmptyIcon>
                    <EmptyTitle>Brak dzieci</EmptyTitle>
                    <EmptyText>Ten opiekun nie ma jeszcze przypisanych dzieci</EmptyText>
                </EmptyState>
            </Container>
        );
    }

    return (
        <Container>
            <ChildrenGrid>
                {children.map((child) => (
                    <ChildCard key={child.id} onClick={() => handleChildClick(child.id)}>
                        <ChildHeader>
                            <ChildInfo>
                                <ChildName>
                                    {child.firstName} {child.lastName}
                                </ChildName>
                                <ChildMeta>{child.age} lat</ChildMeta>
                                <ChildMeta>{relationshipLabels[child.relationship]}</ChildMeta>
                            </ChildInfo>
                            <ViewButton>
                                <ArrowRight size={16} />
                            </ViewButton>
                        </ChildHeader>
                        <ChildBadges>
                            {child.isPrimary && (
                                <Badge variant="primary">
                                    <Star size={12} />
                                    Opiekun główny
                                </Badge>
                            )}
                            <Badge variant={getStatusVariant(child.status)}>
                                {statusLabels[child.status]}
                            </Badge>
                        </ChildBadges>
                    </ChildCard>
                ))}
            </ChildrenGrid>
        </Container>
    );
};