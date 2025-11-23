import React from 'react';
import { Edit2, Trash2, ArrowLeft } from 'lucide-react';
import { useGuardian } from '../../hooks/useGuardian';
import { useDeleteGuardian } from '../../hooks/useDeleteGuardian';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import {
    DetailContainer,
    DetailHeader,
    HeaderInfo,
    GuardianName,
    GuardianEmail,
    HeaderActions,
    InfoGrid,
    InfoItem,
    InfoLabel,
    InfoValue,
    SectionTitle,
    ChildrenGrid,
    ChildCard,
    ChildName,
    ChildInfo,
    Badge,
} from './GuardianDetail.styles';

interface GuardianDetailProps {
    id: string;
    onEdit: () => void;
    onBack: () => void;
}

const relationshipLabels: Record<string, string> = {
    PARENT: 'Rodzic',
    LEGAL_GUARDIAN: 'Opiekun prawny',
    GRANDPARENT: 'Dziadek/Babcia',
    RELATIVE: 'Inny członek rodziny',
    OTHER: 'Inna osoba upoważniona',
};

export const GuardianDetail: React.FC<GuardianDetailProps> = ({ id, onEdit, onBack }) => {
    const { data: guardian, isLoading } = useGuardian(id);
    const deleteGuardian = useDeleteGuardian();

    const handleDelete = async () => {
        if (window.confirm(`Czy na pewno chcesz usunąć opiekuna ${guardian?.firstName} ${guardian?.lastName}?`)) {
            await deleteGuardian.mutateAsync(id);
            onBack();
        }
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (!guardian) {
        return (
            <Card>
                <Card.Content>
                    <p>Nie znaleziono opiekuna</p>
                </Card.Content>
            </Card>
        );
    }

    return (
        <DetailContainer>
            <DetailHeader>
                <HeaderInfo>
                    <GuardianName>
                        {guardian.firstName} {guardian.lastName}
                    </GuardianName>
                    {guardian.email && <GuardianEmail>{guardian.email}</GuardianEmail>}
                </HeaderInfo>
                <HeaderActions>
                    <Button variant="ghost" onClick={onBack}>
                        <ArrowLeft size={16} />
                        Powrót
                    </Button>
                    <Button variant="secondary" onClick={onEdit}>
                        <Edit2 size={16} />
                        Edytuj
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        <Trash2 size={16} />
                        Usuń
                    </Button>
                </HeaderActions>
            </DetailHeader>

            <Card>
                <Card.Header>
                    <Card.Title>Dane kontaktowe</Card.Title>
                </Card.Header>
                <Card.Content>
                    <InfoGrid>
                        <InfoItem>
                            <InfoLabel>Telefon</InfoLabel>
                            <InfoValue>{guardian.phone}</InfoValue>
                        </InfoItem>
                        {guardian.email && (
                            <InfoItem>
                                <InfoLabel>Email</InfoLabel>
                                <InfoValue>{guardian.email}</InfoValue>
                            </InfoItem>
                        )}
                    </InfoGrid>
                </Card.Content>
            </Card>

            {guardian.address && (
                <Card>
                    <Card.Header>
                        <Card.Title>Adres</Card.Title>
                    </Card.Header>
                    <Card.Content>
                        <InfoGrid>
                            <InfoItem>
                                <InfoLabel>Ulica i numer</InfoLabel>
                                <InfoValue>
                                    {guardian.address.street} {guardian.address.houseNumber}
                                    {guardian.address.apartmentNumber && `/${guardian.address.apartmentNumber}`}
                                </InfoValue>
                            </InfoItem>
                            <InfoItem>
                                <InfoLabel>Miasto</InfoLabel>
                                <InfoValue>
                                    {guardian.address.postalCode} {guardian.address.city}
                                </InfoValue>
                            </InfoItem>
                        </InfoGrid>
                    </Card.Content>
                </Card>
            )}

            {guardian.children && guardian.children.length > 0 && (
                <div>
                    <SectionTitle>Dzieci ({guardian.children.length})</SectionTitle>
                    <ChildrenGrid>
                        {guardian.children.map((child) => (
                            <ChildCard
                                key={child.id}
                                onClick={() => (window.location.href = `/children/${child.id}`)}
                            >
                                <ChildName>
                                    {child.firstName} {child.lastName}
                                </ChildName>
                                <ChildInfo>{child.age} lat</ChildInfo>
                                <ChildInfo>{relationshipLabels[child.relationship]}</ChildInfo>
                                {child.isPrimary && <Badge $variant="success">Opiekun główny</Badge>}
                            </ChildCard>
                        ))}
                    </ChildrenGrid>
                </div>
            )}
        </DetailContainer>
    );
};