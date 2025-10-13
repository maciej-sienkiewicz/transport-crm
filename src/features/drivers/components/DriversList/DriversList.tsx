// src/features/drivers/components/DriversList/DriversList.tsx
import React, { useState } from 'react';
import { Plus, UserCog, Search, X } from 'lucide-react';
import { useDrivers } from '../../hooks/useDrivers';
import { DriverStatus } from '../../types';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Select } from '@/shared/ui/Select';
import { Table } from '@/shared/ui/Table';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { DriversListItem } from './DriversListItem';
import { driverStatusOptions } from '../../lib/constants';
import {
    ListContainer,
    ListHeader,
    FiltersWrapper,
    FilterSelect,
    SearchWrapper,
    ActionsWrapper,
    EmptyState,
    EmptyStateIcon,
    EmptyStateTitle,
    EmptyStateText,
    SearchInfo,
    SearchInfoText,
    ClearSearchButton,
} from './DriversList.styles';

interface DriversListProps {
    onCreateClick: () => void;
}

export const DriversList: React.FC<DriversListProps> = ({ onCreateClick }) => {
    const [page, setPage] = useState(0);
    const [status, setStatus] = useState<DriverStatus | undefined>(undefined);
    const [searchInput, setSearchInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const { data, isLoading, error } = useDrivers({
        page,
        size: 20,
        status,
        search: searchQuery || undefined,
    });

    const handleSearch = () => {
        setSearchQuery(searchInput);
        setPage(0);
    };

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleClearSearch = () => {
        setSearchInput('');
        setSearchQuery('');
        setPage(0);
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <EmptyState>
                <EmptyStateIcon>
                    <UserCog size={32} />
                </EmptyStateIcon>
                <EmptyStateTitle>Błąd ładowania</EmptyStateTitle>
                <EmptyStateText>
                    Nie udało się załadować listy kierowców. Spróbuj ponownie.
                </EmptyStateText>
            </EmptyState>
        );
    }

    if (!data?.content.length && !searchQuery && !status) {
        return (
            <EmptyState>
                <EmptyStateIcon>
                    <UserCog size={32} />
                </EmptyStateIcon>
                <EmptyStateTitle>Brak kierowców</EmptyStateTitle>
                <EmptyStateText>
                    Nie dodano jeszcze żadnych kierowców. Kliknij przycisk poniżej, aby dodać pierwszego kierowcę.
                </EmptyStateText>
                <Button onClick={onCreateClick}>
                    <Plus size={16} />
                    Dodaj kierowcę
                </Button>
            </EmptyState>
        );
    }

    return (
        <ListContainer>
            <ListHeader>
                <FiltersWrapper>
                    <SearchWrapper>
                        <Input
                            type="text"
                            placeholder="Szukaj po imieniu, nazwisku lub numerze prawa jazdy..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyDown={handleSearchKeyDown}
                        />
                    </SearchWrapper>
                    <FilterSelect>
                        <Select
                            value={status || ''}
                            onChange={(e) => {
                                setStatus((e.target.value as DriverStatus) || undefined);
                                setPage(0);
                            }}
                            options={[{ value: '', label: 'Wszystkie statusy' }, ...driverStatusOptions]}
                        />
                    </FilterSelect>
                </FiltersWrapper>
                <ActionsWrapper>
                    {searchInput && (
                        <Button variant="secondary" onClick={handleSearch}>
                            <Search size={16} />
                            Szukaj
                        </Button>
                    )}
                    {(searchQuery || status) && (
                        <Button
                            variant="ghost"
                            onClick={() => {
                                handleClearSearch();
                                setStatus(undefined);
                            }}
                        >
                            Wyczyść
                        </Button>
                    )}
                    <Button onClick={onCreateClick}>
                        <Plus size={16} />
                        Dodaj kierowcę
                    </Button>
                </ActionsWrapper>
            </ListHeader>

            {searchQuery && (
                <SearchInfo>
                    <SearchInfoText>
                        Wyniki wyszukiwania dla: <strong>"{searchQuery}"</strong>
                    </SearchInfoText>
                    <ClearSearchButton onClick={handleClearSearch}>
                        <X size={14} />
                        Wyczyść
                    </ClearSearchButton>
                </SearchInfo>
            )}

            {!data?.content.length ? (
                <EmptyState>
                    <EmptyStateIcon>
                        <UserCog size={32} />
                    </EmptyStateIcon>
                    <EmptyStateTitle>Brak wyników</EmptyStateTitle>
                    <EmptyStateText>
                        Nie znaleziono kierowców pasujących do wybranych kryteriów
                    </EmptyStateText>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            handleClearSearch();
                            setStatus(undefined);
                        }}
                    >
                        Wyczyść filtry
                    </Button>
                </EmptyState>
            ) : (
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.Head>Imię i nazwisko</Table.Head>
                            <Table.Head>Email</Table.Head>
                            <Table.Head>Telefon</Table.Head>
                            <Table.Head>Kategorie</Table.Head>
                            <Table.Head>Status</Table.Head>
                            <Table.Head>Dzisiejsze trasy</Table.Head>
                            <Table.Head className="text-right">Akcje</Table.Head>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {data?.content.map((driver) => (
                            <DriversListItem key={driver.id} driver={driver} />
                        ))}
                    </Table.Body>
                </Table>
            )}
        </ListContainer>
    );
};