// src/features/vehicles/components/VehiclesList/VehiclesList.tsx
import React, { useState } from 'react';
import { Plus, Truck } from 'lucide-react';
import { useVehicles } from '../../hooks/useVehicles';
import { VehicleStatus, VehicleType } from '../../types';
import { Button } from '@/shared/ui/Button';
import { Select } from '@/shared/ui/Select';
import { Table } from '@/shared/ui/Table';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { VehiclesListItem } from './VehiclesListItem';
import { vehicleStatusOptions, vehicleTypeOptions } from '../../lib/constants';
import {
    ListContainer,
    ListHeader,
    FiltersWrapper,
    FilterSelect,
    ActionsWrapper,
    EmptyState,
    EmptyStateIcon,
    EmptyStateTitle,
    EmptyStateText,
} from './VehiclesList.styles';

interface VehiclesListProps {
    onCreateClick: () => void;
}

export const VehiclesList: React.FC<VehiclesListProps> = ({ onCreateClick }) => {
    const [page, setPage] = useState(0);
    const [status, setStatus] = useState<VehicleStatus | undefined>(undefined);
    const [vehicleType, setVehicleType] = useState<VehicleType | undefined>(undefined);

    const { data, isLoading, error } = useVehicles({
        page,
        size: 20,
        status,
        vehicleType,
    });

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <EmptyState>
                <EmptyStateIcon>
                    <Truck size={32} />
                </EmptyStateIcon>
                <EmptyStateTitle>Błąd ładowania</EmptyStateTitle>
                <EmptyStateText>
                    Nie udało się załadować listy pojazdów. Spróbuj ponownie.
                </EmptyStateText>
            </EmptyState>
        );
    }

    if (!data?.content.length && !status && !vehicleType) {
        return (
            <EmptyState>
                <EmptyStateIcon>
                    <Truck size={32} />
                </EmptyStateIcon>
                <EmptyStateTitle>Brak pojazdów</EmptyStateTitle>
                <EmptyStateText>
                    Nie dodano jeszcze żadnych pojazdów. Kliknij przycisk poniżej, aby dodać pierwszy pojazd.
                </EmptyStateText>
                <Button onClick={onCreateClick}>
                    <Plus size={16} />
                    Dodaj pojazd
                </Button>
            </EmptyState>
        );
    }

    return (
        <ListContainer>
            <ListHeader>
                <FiltersWrapper>
                    <FilterSelect>
                        <Select
                            value={status || ''}
                            onChange={(e) => {
                                setStatus((e.target.value as VehicleStatus) || undefined);
                                setPage(0);
                            }}
                            options={[{ value: '', label: 'Wszystkie statusy' }, ...vehicleStatusOptions]}
                        />
                    </FilterSelect>
                    <FilterSelect>
                        <Select
                            value={vehicleType || ''}
                            onChange={(e) => {
                                setVehicleType((e.target.value as VehicleType) || undefined);
                                setPage(0);
                            }}
                            options={[{ value: '', label: 'Wszystkie typy' }, ...vehicleTypeOptions]}
                        />
                    </FilterSelect>
                </FiltersWrapper>
                <ActionsWrapper>
                    <Button onClick={onCreateClick}>
                        <Plus size={16} />
                        Dodaj pojazd
                    </Button>
                </ActionsWrapper>
            </ListHeader>

            {!data?.content.length ? (
                <EmptyState>
                    <EmptyStateIcon>
                        <Truck size={32} />
                    </EmptyStateIcon>
                    <EmptyStateTitle>Brak wyników</EmptyStateTitle>
                    <EmptyStateText>
                        Nie znaleziono pojazdów o wybranych filtrach
                    </EmptyStateText>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            setStatus(undefined);
                            setVehicleType(undefined);
                        }}
                    >
                        Wyczyść filtry
                    </Button>
                </EmptyState>
            ) : (
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.Head>Numer rejestracyjny</Table.Head>
                            <Table.Head>Marka i model</Table.Head>
                            <Table.Head>Rok</Table.Head>
                            <Table.Head>Typ</Table.Head>
                            <Table.Head>Miejsca</Table.Head>
                            <Table.Head>Status</Table.Head>
                            <Table.Head className="text-right">Akcje</Table.Head>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {data?.content.map((vehicle) => (
                            <VehiclesListItem key={vehicle.id} vehicle={vehicle} />
                        ))}
                    </Table.Body>
                </Table>
            )}
        </ListContainer>
    );
};