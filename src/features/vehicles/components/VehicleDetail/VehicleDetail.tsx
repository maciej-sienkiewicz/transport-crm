// src/features/vehicles/components/VehicleDetail/VehicleDetail.tsx
import React from 'react';
import { Edit2, Trash2, ArrowLeft, Check, AlertTriangle } from 'lucide-react';
import { useVehicle } from '../../hooks/useVehicle';
import { useDeleteVehicle } from '../../hooks/useDeleteVehicle';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { vehicleStatusLabels, vehicleTypeLabels } from '../../lib/constants';
import { formatDate, isExpired, isExpiringWithin30Days } from '../../lib/utils';
import {
    DetailContainer,
    DetailHeader,
    HeaderInfo,
    VehicleName,
    VehicleSubtitle,
    HeaderActions,
    InfoGrid,
    InfoItem,
    InfoLabel,
    InfoValue,
    WarningBadge,
    EquipmentList,
    EquipmentItem,
} from './VehicleDetail.styles';

interface VehicleDetailProps {
    id: string;
    onEdit: () => void;
    onBack: () => void;
}

export const VehicleDetail: React.FC<VehicleDetailProps> = ({ id, onEdit, onBack }) => {
    const { data: vehicle, isLoading } = useVehicle(id);
    const deleteVehicle = useDeleteVehicle();

    const handleDelete = async () => {
        if (
            window.confirm(
                `Czy na pewno chcesz usunąć pojazd ${vehicle?.registrationNumber}?`
            )
        ) {
            await deleteVehicle.mutateAsync(id);
            onBack();
        }
    };

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'AVAILABLE':
                return 'success';
            case 'IN_ROUTE':
                return 'primary';
            case 'MAINTENANCE':
                return 'warning';
            case 'OUT_OF_SERVICE':
                return 'danger';
            default:
                return 'default';
        }
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (!vehicle) {
        return (
            <Card>
                <Card.Content>
                    <p>Nie znaleziono pojazdu</p>
                </Card.Content>
            </Card>
        );
    }

    const insuranceExpired = isExpired(vehicle.insurance.validUntil);
    const insuranceExpiring = isExpiringWithin30Days(vehicle.insurance.validUntil);
    const inspectionExpired = isExpired(vehicle.technicalInspection.validUntil);
    const inspectionExpiring = isExpiringWithin30Days(vehicle.technicalInspection.validUntil);

    return (
        <DetailContainer>
            <DetailHeader>
                <HeaderInfo>
                    <VehicleName>{vehicle.registrationNumber}</VehicleName>
                    <VehicleSubtitle>
                        {vehicle.make} {vehicle.model} ({vehicle.year})
                    </VehicleSubtitle>
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
                                <Badge variant={getStatusVariant(vehicle.status)}>
                                    {vehicleStatusLabels[vehicle.status]}
                                </Badge>
                            </InfoValue>
                        </InfoItem>
                        <InfoItem>
                            <InfoLabel>Typ pojazdu</InfoLabel>
                            <InfoValue>{vehicleTypeLabels[vehicle.vehicleType]}</InfoValue>
                        </InfoItem>
                        <InfoItem>
                            <InfoLabel>Przebieg</InfoLabel>
                            <InfoValue>{vehicle.currentMileage.toLocaleString('pl-PL')} km</InfoValue>
                        </InfoItem>
                        {vehicle.vin && (
                            <InfoItem>
                                <InfoLabel>VIN</InfoLabel>
                                <InfoValue>{vehicle.vin}</InfoValue>
                            </InfoItem>
                        )}
                    </InfoGrid>
                </Card.Content>
            </Card>

            <Card>
                <Card.Header>
                    <Card.Title>Pojemność</Card.Title>
                </Card.Header>
                <Card.Content>
                    <InfoGrid>
                        <InfoItem>
                            <InfoLabel>Liczba miejsc</InfoLabel>
                            <InfoValue>{vehicle.capacity.totalSeats}</InfoValue>
                        </InfoItem>
                        <InfoItem>
                            <InfoLabel>Miejsca na wózki</InfoLabel>
                            <InfoValue>{vehicle.capacity.wheelchairSpaces}</InfoValue>
                        </InfoItem>
                        <InfoItem>
                            <InfoLabel>Foteliki dziecięce</InfoLabel>
                            <InfoValue>{vehicle.capacity.childSeats}</InfoValue>
                        </InfoItem>
                    </InfoGrid>
                </Card.Content>
            </Card>

            {vehicle.specialEquipment.length > 0 && (
                <Card>
                    <Card.Header>
                        <Card.Title>Wyposażenie specjalne</Card.Title>
                    </Card.Header>
                    <Card.Content>
                        <EquipmentList>
                            {vehicle.specialEquipment.map((item, index) => (
                                <EquipmentItem key={index}>
                                    <Check size={16} />
                                    {item}
                                </EquipmentItem>
                            ))}
                        </EquipmentList>
                    </Card.Content>
                </Card>
            )}

            <Card>
                <Card.Header>
                    <Card.Title>Ubezpieczenie</Card.Title>
                </Card.Header>
                <Card.Content>
                    <InfoGrid>
                        <InfoItem>
                            <InfoLabel>Numer polisy</InfoLabel>
                            <InfoValue>{vehicle.insurance.policyNumber}</InfoValue>
                        </InfoItem>
                        <InfoItem>
                            <InfoLabel>Ubezpieczyciel</InfoLabel>
                            <InfoValue>{vehicle.insurance.insurer}</InfoValue>
                        </InfoItem>
                        <InfoItem>
                            <InfoLabel>Ważne do</InfoLabel>
                            <InfoValue>{formatDate(vehicle.insurance.validUntil)}</InfoValue>
                        </InfoItem>
                    </InfoGrid>
                    {insuranceExpired && (
                        <WarningBadge $variant="danger">
                            <AlertTriangle size={16} />
                            Ubezpieczenie wygasło
                        </WarningBadge>
                    )}
                    {!insuranceExpired && insuranceExpiring && (
                        <WarningBadge $variant="warning">
                            <AlertTriangle size={16} />
                            Ubezpieczenie wygasa w ciągu 30 dni
                        </WarningBadge>
                    )}
                </Card.Content>
            </Card>

            <Card>
                <Card.Header>
                    <Card.Title>Przegląd techniczny</Card.Title>
                </Card.Header>
                <Card.Content>
                    <InfoGrid>
                        <InfoItem>
                            <InfoLabel>Stacja kontroli</InfoLabel>
                            <InfoValue>{vehicle.technicalInspection.inspectionStation}</InfoValue>
                        </InfoItem>
                        <InfoItem>
                            <InfoLabel>Ważny do</InfoLabel>
                            <InfoValue>{formatDate(vehicle.technicalInspection.validUntil)}</InfoValue>
                        </InfoItem>
                    </InfoGrid>
                    {inspectionExpired && (
                        <WarningBadge $variant="danger">
                            <AlertTriangle size={16} />
                            Przegląd wygasł
                        </WarningBadge>
                    )}
                    {!inspectionExpired && inspectionExpiring && (
                        <WarningBadge $variant="warning">
                            <AlertTriangle size={16} />
                            Przegląd wygasa w ciągu 30 dni
                        </WarningBadge>
                    )}
                </Card.Content>
            </Card>
        </DetailContainer>
    );
};