// src/features/drivers/components/DriverDetail/DriverDetail.tsx
import React from 'react';
import { Edit2, Trash2, ArrowLeft, AlertTriangle } from 'lucide-react';
import { useDriver } from '../../hooks/useDriver';
import { useDeleteDriver } from '../../hooks/useDeleteDriver';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { driverStatusLabels } from '../../lib/constants';
import { formatDate, formatBirthDate, calculateAge, isExpired, isExpiringWithin30Days } from '../../lib/utils';
import {
    DetailContainer,
    DetailHeader,
    HeaderInfo,
    DriverName,
    DriverSubtitle,
    HeaderActions,
    InfoGrid,
    InfoItem,
    InfoLabel,
    InfoValue,
    WarningBadge,
    CategoriesList,
} from './DriverDetail.styles';

interface DriverDetailProps {
    id: string;
    onEdit: () => void;
    onBack: () => void;
}

export const DriverDetail: React.FC<DriverDetailProps> = ({ id, onEdit, onBack }) => {
    const { data: driver, isLoading } = useDriver(id);
    const deleteDriver = useDeleteDriver();

    const handleDelete = async () => {
        if (
            window.confirm(
                `Czy na pewno chcesz usunąć kierowcę ${driver?.firstName} ${driver?.lastName}?`
            )
        ) {
            await deleteDriver.mutateAsync(id);
            onBack();
        }
    };

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return 'success';
            case 'INACTIVE':
                return 'danger';
            case 'ON_LEAVE':
                return 'warning';
            default:
                return 'default';
        }
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (!driver) {
        return (
            <Card>
                <Card.Content>
                    <p>Nie znaleziono kierowcy</p>
                </Card.Content>
            </Card>
        );
    }

    const licenseExpired = isExpired(driver.drivingLicense.validUntil);
    const licenseExpiring = isExpiringWithin30Days(driver.drivingLicense.validUntil);
    const medicalExpired = isExpired(driver.medicalCertificate.validUntil);
    const medicalExpiring = isExpiringWithin30Days(driver.medicalCertificate.validUntil);

    return (
        <DetailContainer>
            <DetailHeader>
                <HeaderInfo>
                    <DriverName>
                        {driver.firstName} {driver.lastName}
                    </DriverName>
                    <DriverSubtitle>
                        {driver.email} • {driver.phone}
                    </DriverSubtitle>
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
                    <Card.Title>Informacje podstawowe</Card.Title>
                </Card.Header>
                <Card.Content>
                    <InfoGrid>
                        <InfoItem>
                            <InfoLabel>Status</InfoLabel>
                            <InfoValue>
                                <Badge variant={getStatusVariant(driver.status)}>
                                    {driverStatusLabels[driver.status]}
                                </Badge>
                            </InfoValue>
                        </InfoItem>
                        <InfoItem>
                            <InfoLabel>Data urodzenia</InfoLabel>
                            <InfoValue>
                                {formatBirthDate(driver.dateOfBirth)} ({calculateAge(driver.dateOfBirth)} lat)
                            </InfoValue>
                        </InfoItem>
                    </InfoGrid>
                </Card.Content>
            </Card>

            <Card>
                <Card.Header>
                    <Card.Title>Adres</Card.Title>
                </Card.Header>
                <Card.Content>
                    <InfoGrid>
                        <InfoItem>
                            <InfoLabel>Ulica i numer</InfoLabel>
                            <InfoValue>
                                {driver.address.street} {driver.address.houseNumber}
                                {driver.address.apartmentNumber && `/${driver.address.apartmentNumber}`}
                            </InfoValue>
                        </InfoItem>
                        <InfoItem>
                            <InfoLabel>Miasto</InfoLabel>
                            <InfoValue>
                                {driver.address.postalCode} {driver.address.city}
                            </InfoValue>
                        </InfoItem>
                    </InfoGrid>
                </Card.Content>
            </Card>

            <Card>
                <Card.Header>
                    <Card.Title>Prawo jazdy</Card.Title>
                </Card.Header>
                <Card.Content>
                    <InfoGrid>
                        <InfoItem>
                            <InfoLabel>Numer prawa jazdy</InfoLabel>
                            <InfoValue>{driver.drivingLicense.licenseNumber}</InfoValue>
                        </InfoItem>
                        <InfoItem>
                            <InfoLabel>Kategorie</InfoLabel>
                            <CategoriesList>
                                {driver.drivingLicense.categories.map((category) => (
                                    <Badge key={category} variant="primary">
                                        {category}
                                    </Badge>
                                ))}
                            </CategoriesList>
                        </InfoItem>
                        <InfoItem>
                            <InfoLabel>Ważne do</InfoLabel>
                            <InfoValue>{formatDate(driver.drivingLicense.validUntil)}</InfoValue>
                        </InfoItem>
                    </InfoGrid>
                    {licenseExpired && (
                        <WarningBadge $variant="danger">
                            <AlertTriangle size={16} />
                            Prawo jazdy wygasło
                        </WarningBadge>
                    )}
                    {!licenseExpired && licenseExpiring && (
                        <WarningBadge $variant="warning">
                            <AlertTriangle size={16} />
                            Prawo jazdy wygasa w ciągu 30 dni
                        </WarningBadge>
                    )}
                </Card.Content>
            </Card>

            <Card>
                <Card.Header>
                    <Card.Title>Badania lekarskie</Card.Title>
                </Card.Header>
                <Card.Content>
                    <InfoGrid>
                        <InfoItem>
                            <InfoLabel>Data wydania</InfoLabel>
                            <InfoValue>{formatDate(driver.medicalCertificate.issueDate)}</InfoValue>
                        </InfoItem>
                        <InfoItem>
                            <InfoLabel>Ważne do</InfoLabel>
                            <InfoValue>{formatDate(driver.medicalCertificate.validUntil)}</InfoValue>
                        </InfoItem>
                    </InfoGrid>
                    {medicalExpired && (
                        <WarningBadge $variant="danger">
                            <AlertTriangle size={16} />
                            Badania lekarskie wygasły
                        </WarningBadge>
                    )}
                    {!medicalExpired && medicalExpiring && (
                        <WarningBadge $variant="warning">
                            <AlertTriangle size={16} />
                            Badania lekarskie wygasają w ciągu 30 dni
                        </WarningBadge>
                    )}
                </Card.Content>
            </Card>
        </DetailContainer>
    );
};