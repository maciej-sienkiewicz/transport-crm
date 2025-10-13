import React, { useState } from 'react';
import { Plus, Baby } from 'lucide-react';
import { useChildren } from '../../hooks/useChildren';
import { ChildStatus } from '../../types';
import { Button } from '@/shared/ui/Button';
import { Select } from '@/shared/ui/Select';
import { Table } from '@/shared/ui/Table';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { ChildrenListItem } from './ChildrenListItem';
import { statusOptions } from '../../lib/constants';
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
} from './ChildrenList.styles';

interface ChildrenListProps {
    onCreateClick: () => void;
}

export const ChildrenList: React.FC<ChildrenListProps> = ({ onCreateClick }) => {
    const [page, setPage] = useState(0);
    const [status, setStatus] = useState<ChildStatus | undefined>(undefined);

    const { data, isLoading, error } = useChildren({
        page,
        size: 20,
        status,
    });

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <EmptyState>
                <EmptyStateIcon>
                    <Baby size={32} />
                </EmptyStateIcon>
                <EmptyStateTitle>Błąd ładowania</EmptyStateTitle>
                <EmptyStateText>
                    Nie udało się załadować listy dzieci. Spróbuj ponownie.
                </EmptyStateText>
            </EmptyState>
        );
    }

    if (!data?.content.length && !status) {
        return (
            <EmptyState>
                <EmptyStateIcon>
                    <Baby size={32} />
                </EmptyStateIcon>
                <EmptyStateTitle>Brak dzieci</EmptyStateTitle>
                <EmptyStateText>
                    Nie dodano jeszcze żadnych dzieci. Kliknij przycisk poniżej, aby dodać pierwsze dziecko.
                </EmptyStateText>
                <Button onClick={onCreateClick}>
                    <Plus size={16} />
                    Dodaj dziecko
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
                                setStatus((e.target.value as ChildStatus) || undefined);
                                setPage(0);
                            }}
                            options={[{ value: '', label: 'Wszystkie statusy' }, ...statusOptions]}
                        />
                    </FilterSelect>
                </FiltersWrapper>
                <ActionsWrapper>
                    <Button onClick={onCreateClick}>
                        <Plus size={16} />
                        Dodaj dziecko
                    </Button>
                </ActionsWrapper>
            </ListHeader>

            {!data?.content.length && status ? (
                <EmptyState>
                    <EmptyStateIcon>
                        <Baby size={32} />
                    </EmptyStateIcon>
                    <EmptyStateTitle>Brak wyników</EmptyStateTitle>
                    <EmptyStateText>
                        Nie znaleziono dzieci o wybranym statusie
                    </EmptyStateText>
                    <Button variant="secondary" onClick={() => setStatus(undefined)}>
                        Wyczyść filtr
                    </Button>
                </EmptyState>
            ) : (
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.Head>Imię i nazwisko</Table.Head>
                            <Table.Head>Wiek</Table.Head>
                            <Table.Head>Status</Table.Head>
                            <Table.Head>Niepełnosprawność</Table.Head>
                            <Table.Head>Opiekunowie</Table.Head>
                            <Table.Head className="text-right">Akcje</Table.Head>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {data?.content.map((child) => (
                            <ChildrenListItem key={child.id} child={child} />
                        ))}
                    </Table.Body>
                </Table>
            )}
        </ListContainer>
    );
};