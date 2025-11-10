// src/features/routes/components/AddChildToRouteModal/AddChildToRouteModal.tsx

import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { X, Search, User, Clock, MapPin } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { useAvailableChildren } from '../../hooks/useAvailableChildren';
import { useAddScheduleToRoute } from '../../hooks/useAddScheduleToRoute';
import { AvailableChild } from '../../types';

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${({ theme }) => theme.spacing.lg};
  animation: fadeIn 0.2s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  box-shadow: ${({ theme }) => theme.shadows['2xl']};
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xl};
  border-bottom: 1px solid ${({ theme }) => theme.colors.slate[200]};
  background: ${({ theme }) => theme.gradients.cardHeader};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']}
    ${({ theme }) => theme.borderRadius['2xl']} 0 0;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.slate[900]};
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.slate[600]};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.slate[100]};
    color: ${({ theme }) => theme.colors.slate[900]};
  }
`;

const ModalContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.xl};

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.slate[50]};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.slate[300]};
    border-radius: ${({ theme }) => theme.borderRadius.sm};

    &:hover {
      background: ${({ theme }) => theme.colors.slate[400]};
    }
  }
`;

const SearchBox = styled.div`
  position: relative;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md}
    ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.md}
    ${({ theme }) => theme.spacing['2xl']};
  border: 2px solid ${({ theme }) => theme.colors.slate[200]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  font-size: 0.9375rem;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[50]};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.slate[400]};
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.slate[400]};
`;

const ChildrenList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ChildCard = styled.button<{ $isSelected: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  border: 2px solid
    ${({ theme, $isSelected }) =>
    $isSelected ? theme.colors.primary[500] : theme.colors.slate[200]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  background: ${({ theme, $isSelected }) =>
    $isSelected ? theme.colors.primary[50] : 'white'};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  text-align: left;
  width: 100%;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[400]};
    background: ${({ theme }) => theme.colors.primary[50]};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }

  &:active {
    transform: translateY(0);
  }
`;

const ChildAvatar = styled.div`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.gradients.avatar};
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-weight: 700;
  font-size: 1.125rem;
  flex-shrink: 0;
`;

const ChildInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ChildName = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.slate[900]};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ChildMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.slate[600]};
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing['2xl']};
  text-align: center;
  color: ${({ theme }) => theme.colors.slate[500]};
`;

const EmptyIcon = styled.div`
  width: 64px;
  height: 64px;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.slate[100]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.slate[400]};
`;

const EmptyText = styled.p`
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.slate[600]};
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.xl};
  border-top: 1px solid ${({ theme }) => theme.colors.slate[200]};
  background: ${({ theme }) => theme.colors.slate[50]};
  border-radius: 0 0 ${({ theme }) => theme.borderRadius['2xl']}
    ${({ theme }) => theme.borderRadius['2xl']};
`;

interface AddChildToRouteModalProps {
    isOpen: boolean;
    onClose: () => void;
    routeId: string;
    routeDate: string;
    maxStopOrder: number;
}

export const AddChildToRouteModal: React.FC<AddChildToRouteModalProps> = ({
                                                                              isOpen,
                                                                              onClose,
                                                                              routeId,
                                                                              routeDate,
                                                                              maxStopOrder,
                                                                          }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedChild, setSelectedChild] = useState<AvailableChild | null>(null);

    const { data: availableChildren, isLoading } = useAvailableChildren(routeDate, isOpen);
    const addSchedule = useAddScheduleToRoute();

    const filteredChildren = useMemo(() => {
        if (!availableChildren) return [];
        if (!searchQuery) return availableChildren;

        const query = searchQuery.toLowerCase();
        return availableChildren.filter(
            (child) =>
                child.firstName.toLowerCase().includes(query) ||
                child.lastName.toLowerCase().includes(query)
        );
    }, [availableChildren, searchQuery]);

    const handleAdd = async () => {
        if (!selectedChild) return;

        try {
            await addSchedule.mutateAsync({
                routeId,
                data: {
                    childId: selectedChild.id,
                    scheduleId: selectedChild.schedule.id,
                    pickupStop: {
                        stopOrder: maxStopOrder + 1,
                        estimatedTime: selectedChild.schedule.pickupTime,
                        address: selectedChild.schedule.pickupAddress,
                    },
                    dropoffStop: {
                        stopOrder: maxStopOrder + 2,
                        estimatedTime: selectedChild.schedule.dropoffTime,
                        address: selectedChild.schedule.dropoffAddress,
                    },
                },
            });

            onClose();
            setSelectedChild(null);
            setSearchQuery('');
        } catch (error) {
            console.error('Error adding child to route:', error);
        }
    };

    const handleClose = () => {
        onClose();
        setSelectedChild(null);
        setSearchQuery('');
    };

    return (
        <ModalOverlay $isOpen={isOpen} onClick={handleClose}>
            <ModalContainer onClick={(e) => e.stopPropagation()}>
                <ModalHeader>
                    <ModalTitle>Dodaj dziecko do trasy</ModalTitle>
                    <CloseButton onClick={handleClose}>
                        <X size={20} />
                    </CloseButton>
                </ModalHeader>

                <ModalContent>
                    <SearchBox>
                        <SearchIcon size={18} />
                        <SearchInput
                            type="text"
                            placeholder="Wyszukaj dziecko..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </SearchBox>

                    {isLoading ? (
                        <EmptyState>
                            <EmptyText>Ładowanie dostępnych dzieci...</EmptyText>
                        </EmptyState>
                    ) : filteredChildren.length === 0 ? (
                        <EmptyState>
                            <EmptyIcon>
                                <User size={32} />
                            </EmptyIcon>
                            <EmptyText>
                                {searchQuery
                                    ? 'Nie znaleziono dzieci pasujących do wyszukiwania'
                                    : 'Brak dostępnych dzieci na ten dzień'}
                            </EmptyText>
                        </EmptyState>
                    ) : (
                        <ChildrenList>
                            {filteredChildren.map((child) => (
                                <ChildCard
                                    key={child.id}
                                    $isSelected={selectedChild?.id === child.id}
                                    onClick={() => setSelectedChild(child)}
                                >
                                    <ChildAvatar>
                                        {child.firstName.charAt(0)}
                                        {child.lastName.charAt(0)}
                                    </ChildAvatar>
                                    <ChildInfo>
                                        <ChildName>
                                            {child.firstName} {child.lastName}, {child.age} lat
                                        </ChildName>
                                        <ChildMeta>
                                            <MetaRow>
                                                <Clock size={14} />
                                                Odbiór: {child.schedule.pickupTime} | Dowóz:{' '}
                                                {child.schedule.dropoffTime}
                                            </MetaRow>
                                            <MetaRow>
                                                <MapPin size={14} />
                                                {child.schedule.pickupAddress.street}{' '}
                                                {child.schedule.pickupAddress.houseNumber},{' '}
                                                {child.schedule.pickupAddress.city}
                                            </MetaRow>
                                        </ChildMeta>
                                    </ChildInfo>
                                </ChildCard>
                            ))}
                        </ChildrenList>
                    )}
                </ModalContent>

                <ModalFooter>
                    <Button variant="secondary" onClick={handleClose}>
                        Anuluj
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleAdd}
                        disabled={!selectedChild || addSchedule.isPending}
                        isLoading={addSchedule.isPending}
                    >
                        Dodaj do trasy
                    </Button>
                </ModalFooter>
            </ModalContainer>
        </ModalOverlay>
    );
};