import React, { useState } from 'react';
import { Plus, Users, Search, X } from 'lucide-react';
import { useGuardians } from '../../hooks/useGuardians';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Table } from '@/shared/ui/Table';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { GuardiansListItem } from './GuardiansListItem';
import {
    ListContainer,
    ListHeader,
    SearchWrapper,
    ActionsWrapper,
    EmptyState,
    EmptyStateIcon,
    EmptyStateTitle,
    EmptyStateText,
    SearchInfo,
    SearchInfoText,
    ClearSearchButton,
} from './GuardiansList.styles';

interface GuardiansListProps {
    onCreateClick: () => void;
}

export const GuardiansList: React.FC<GuardiansListProps> = ({ onCreateClick }) => {
    const [page, setPage] = useState(0);
    const [searchInput, setSearchInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const { data, isLoading, error } = useGuardians({
        page,
        size: 20,
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
                    <Users size={32} />
                </EmptyStateIcon>
                <EmptyStateTitle>Błąd ładowania</EmptyStateTitle>
                <EmptyStateText>
                    Nie udało się załadować listy opiekunów. Spróbuj ponownie.
                </EmptyStateText>
            </EmptyState>
        );
    }

    if (!data?.content.length && !searchQuery) {
        return (
            <EmptyState>
                <EmptyStateIcon>
                    <Users size={32} />
                </EmptyStateIcon>
                <EmptyStateTitle>Brak opiekunów</EmptyStateTitle>
                <EmptyStateText>
                    Nie dodano jeszcze żadnych opiekunów. Kliknij przycisk poniżej, aby dodać pierwszego opiekuna.
                </EmptyStateText>
                <Button onClick={onCreateClick}>
                    <Plus size={16} />
                    Dodaj opiekuna
                </Button>
            </EmptyState>
        );
    }

    return (
        <ListContainer>
            <ListHeader>
                <SearchWrapper>
                    <Input
                        type="text"
                        placeholder="Szukaj po imieniu, nazwisku, email lub telefonie..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={handleSearchKeyDown}
                    />
                </SearchWrapper>
                <ActionsWrapper>
                    {searchInput && (
                        <Button variant="secondary" onClick={handleSearch}>
                            <Search size={16} />
                            Szukaj
                        </Button>
                    )}
                    {searchQuery && (
                        <Button variant="ghost" onClick={handleClearSearch}>
                            Wyczyść
                        </Button>
                    )}
                    <Button onClick={onCreateClick}>
                        <Plus size={16} />
                        Dodaj opiekuna
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

            {!data?.content.length && searchQuery ? (
                <EmptyState>
                    <EmptyStateIcon>
                        <Users size={32} />
                    </EmptyStateIcon>
                    <EmptyStateTitle>Brak wyników</EmptyStateTitle>
                    <EmptyStateText>
                        Nie znaleziono opiekunów pasujących do zapytania "{searchQuery}"
                    </EmptyStateText>
                    <Button variant="secondary" onClick={handleClearSearch}>
                        Wyczyść wyszukiwanie
                    </Button>
                </EmptyState>
            ) : (
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.Head>Imię i nazwisko</Table.Head>
                            <Table.Head>Email</Table.Head>
                            <Table.Head>Telefon</Table.Head>
                            <Table.Head>Liczba dzieci</Table.Head>
                            <Table.Head className="text-right">Akcje</Table.Head>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {data?.content.map((guardian) => (
                            <GuardiansListItem key={guardian.id} guardian={guardian} />
                        ))}
                    </Table.Body>
                </Table>
            )}
        </ListContainer>
    );
};