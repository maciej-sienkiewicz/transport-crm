import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Clock, ChevronDown, ChevronUp, Home, School, TrendingUp } from 'lucide-react';
import styled from 'styled-components';
import { useSchedules } from '../../hooks/useSchedules';
import { useSchedule } from '../../hooks/useSchedule';
import { useCreateSchedule } from '../../hooks/useCreateSchedule';
import { useUpdateSchedule } from '../../hooks/useUpdateSchedule';
import { useDeleteSchedule } from '../../hooks/useDeleteSchedule';
import { ScheduleForm } from '../ScheduleForm';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { Modal } from '@/shared/ui/Modal';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { RouteHistoryList } from '@/features/routes/components/RouteHistoryList';
import { UpcomingRoutesList } from '@/features/routes/components/UpcomingRoutesList';

const SectionHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${({ theme }) => theme.spacing.lg};

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        flex-direction: column;
        gap: ${({ theme }) => theme.spacing.md};
        align-items: flex-start;
    }
`;

const SectionTitle = styled.h2`
    font-size: 1.125rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[900]};
`;

const SchedulesList = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
`;

const ScheduleCard = styled.div`
    background: white;
    border: 1px solid ${({ theme }) => theme.colors.slate[200]};
    border-radius: ${({ theme }) => theme.borderRadius.xl};
    overflow: hidden;
    transition: all ${({ theme }) => theme.transitions.normal};

    &:hover {
        box-shadow: ${({ theme }) => theme.shadows.md};
        border-color: ${({ theme }) => theme.colors.primary[200]};
    }
`;

const ScheduleHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
    background: ${({ theme }) => theme.gradients.cardHeader};
    border-bottom: 1px solid ${({ theme }) => theme.colors.slate[200]};
    gap: ${({ theme }) => theme.spacing.md};

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
        flex-wrap: wrap;
    }
`;

const ScheduleMainInfo = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.lg};
    flex: 1;
    min-width: 0;

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        flex-direction: column;
        align-items: flex-start;
        gap: ${({ theme }) => theme.spacing.sm};
        width: 100%;
    }
`;

const ScheduleName = styled.h3`
    font-size: 1rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[900]};
    min-width: 0;

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        font-size: 0.9375rem;
    }
`;

const ScheduleTime = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.slate[600]};
    white-space: nowrap;
`;

const DaysList = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: ${({ theme }) => theme.spacing.xs};
`;

const ScheduleActions = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.xs};
    align-items: center;

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        width: 100%;
        justify-content: space-between;
    }
`;

const IconButton = styled.button`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    padding: 0;
    background: transparent;
    border: none;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    color: ${({ theme }) => theme.colors.slate[600]};
    cursor: pointer;
    transition: all ${({ theme }) => theme.transitions.fast};

    &:hover {
        background: ${({ theme }) => theme.colors.slate[100]};
        color: ${({ theme }) => theme.colors.slate[900]};
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const ExpandButton = styled.button`
    display: inline-flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
    background: transparent;
    border: none;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    color: ${({ theme }) => theme.colors.primary[600]};
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all ${({ theme }) => theme.transitions.fast};

    &:hover {
        background: ${({ theme }) => theme.colors.primary[50]};
    }
`;

const ScheduleDetails = styled.div<{ $isExpanded: boolean }>`
    max-height: ${({ $isExpanded }) => ($isExpanded ? '1000px' : '0')};
    opacity: ${({ $isExpanded }) => ($isExpanded ? '1' : '0')};
    overflow: hidden;
    transition: all ${({ theme }) => theme.transitions.slow};
`;

const DetailsContent = styled.div`
    padding: ${({ theme }) => theme.spacing.xl};
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: ${({ theme }) => theme.spacing.xl};

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        grid-template-columns: 1fr;
        padding: ${({ theme }) => theme.spacing.lg};
    }
`;

const AddressBlock = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};
`;

const AddressHeader = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
    font-size: 0.875rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[700]};
    text-transform: uppercase;
    letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wide};
`;

const AddressLabel = styled.div`
    font-size: 1rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[900]};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const AddressLine = styled.div`
    font-size: 0.9375rem;
    color: ${({ theme }) => theme.colors.slate[600]};
    line-height: 1.5;
`;

const SpecialInstructions = styled.div`
    grid-column: 1 / -1;
    padding: ${({ theme }) => theme.spacing.md};
    background: ${({ theme }) => theme.colors.slate[50]};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    border-left: 3px solid ${({ theme }) => theme.colors.primary[500]};
`;

const InstructionsLabel = styled.div`
    font-size: 0.875rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[700]};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const InstructionsText = styled.div`
    font-size: 0.9375rem;
    color: ${({ theme }) => theme.colors.slate[600]};
    line-height: 1.5;
`;

const EmptyState = styled.div`
    padding: ${({ theme }) => theme.spacing.xl};
    text-align: center;
    color: ${({ theme }) => theme.colors.slate[500]};
    background: ${({ theme }) => theme.colors.slate[50]};
    border-radius: ${({ theme }) => theme.borderRadius.xl};
    border: 1px dashed ${({ theme }) => theme.colors.slate[300]};
`;

const LoadingDetails = styled.div`
    padding: ${({ theme }) => theme.spacing.xl};
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${({ theme }) => theme.colors.slate[500]};
`;

const RoutesSection = styled.div<{ $isExpanded: boolean }>`
    max-height: ${({ $isExpanded }) => ($isExpanded ? '3000px' : '0')};
    opacity: ${({ $isExpanded }) => ($isExpanded ? '1' : '0')};
    overflow: hidden;
    transition: all ${({ theme }) => theme.transitions.slow};
    grid-column: 1 / -1;
`;

const RoutesSectionContent = styled.div`
    padding-top: ${({ theme }) => theme.spacing.xl};
    border-top: 2px solid ${({ theme }) => theme.colors.slate[200]};
`;

const RoutesSectionHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const RoutesSectionTitle = styled.h4`
    font-size: 1rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[900]};
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
`;

const TabsContainer = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.xs};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    border-bottom: 2px solid ${({ theme }) => theme.colors.slate[200]};
`;

const Tab = styled.button<{ $active: boolean }>`
    padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
    background: ${({ $active, theme }) =>
    $active ? theme.gradients.primaryButton : 'transparent'};
    color: ${({ $active }) => ($active ? 'white' : '#64748b')};
    border: none;
    border-radius: ${({ theme }) => theme.borderRadius.lg} ${({ theme }) => theme.borderRadius.lg} 0 0;
    font-weight: 600;
    font-size: 0.9375rem;
    cursor: pointer;
    transition: all ${({ theme }) => theme.transitions.normal};

    &:hover {
        background: ${({ $active, theme }) =>
    $active ? theme.gradients.primaryButton : theme.colors.slate[100]};
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
        font-size: 0.875rem;
    }
`;

const ShowRoutesButton = styled(Button)`
    margin-top: ${({ theme }) => theme.spacing.md};
`;

interface ScheduleManagementProps {
    childId: string;
}

const daysOrder = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
const dayLabels: Record<string, string> = {
    MONDAY: 'Pon',
    TUESDAY: 'Wt',
    WEDNESDAY: 'Śr',
    THURSDAY: 'Czw',
    FRIDAY: 'Pt',
    SATURDAY: 'Sob',
    SUNDAY: 'Ndz',
};

export const ScheduleManagement: React.FC<ScheduleManagementProps> = ({ childId }) => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null);
    const [expandedScheduleId, setExpandedScheduleId] = useState<string | null>(null);
    const [routesExpandedScheduleId, setRoutesExpandedScheduleId] = useState<string | null>(null);
    const [activeRoutesTab, setActiveRoutesTab] = useState<'history' | 'upcoming'>('history');

    const { data: schedulesData, isLoading } = useSchedules(childId);
    const { data: scheduleDetails, isLoading: isLoadingDetails } = useSchedule(
        expandedScheduleId || '',
        !!expandedScheduleId
    );
    const { data: editingScheduleData, isLoading: isLoadingEditData } = useSchedule(
        editingScheduleId || '',
        !!editingScheduleId
    );

    const createSchedule = useCreateSchedule(childId);
    const updateSchedule = useUpdateSchedule(editingScheduleId || '', childId);
    const deleteSchedule = useDeleteSchedule(childId);

    const schedules = schedulesData?.schedules || [];

    useEffect(() => {
        if (updateSchedule.isSuccess) {
            setEditingScheduleId(null);
        }
    }, [updateSchedule.isSuccess]);

    useEffect(() => {
        if (createSchedule.isSuccess) {
            setShowCreateModal(false);
        }
    }, [createSchedule.isSuccess]);

    const handleCreate = async (data: any) => {
        await createSchedule.mutateAsync(data);
    };

    const handleUpdate = async (data: any) => {
        if (editingScheduleId) {
            await updateSchedule.mutateAsync(data);
        }
    };

    const handleDelete = async (scheduleId: string, scheduleName: string) => {
        if (window.confirm(`Czy na pewno chcesz usunąć harmonogram "${scheduleName}"?`)) {
            if (expandedScheduleId === scheduleId) {
                setExpandedScheduleId(null);
            }
            if (routesExpandedScheduleId === scheduleId) {
                setRoutesExpandedScheduleId(null);
            }
            await deleteSchedule.mutateAsync(scheduleId);
        }
    };

    const toggleExpand = (scheduleId: string) => {
        setExpandedScheduleId(expandedScheduleId === scheduleId ? null : scheduleId);
    };

    const toggleRoutesExpand = (scheduleId: string) => {
        setRoutesExpandedScheduleId(routesExpandedScheduleId === scheduleId ? null : scheduleId);
    };

    const handleEdit = (scheduleId: string) => {
        setEditingScheduleId(scheduleId);
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <>
            <SectionHeader>
                <SectionTitle>Harmonogramy ({schedules.length})</SectionTitle>
                <Button size="sm" onClick={() => setShowCreateModal(true)}>
                    <Plus size={16} />
                    Dodaj harmonogram
                </Button>
            </SectionHeader>

            {schedules.length === 0 ? (
                <EmptyState>
                    <p>Brak harmonogramów</p>
                    <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                        Dodaj pierwszy harmonogram, aby zaplanować transport dziecka
                    </p>
                </EmptyState>
            ) : (
                <SchedulesList>
                    {schedules.map((schedule) => {
                        const isExpanded = expandedScheduleId === schedule.id;
                        const isRoutesExpanded = routesExpandedScheduleId === schedule.id;
                        const detailsToShow = isExpanded ? scheduleDetails : null;

                        return (
                            <ScheduleCard key={schedule.id}>
                                <ScheduleHeader>
                                    <ScheduleMainInfo>
                                        <ScheduleName>{schedule.name}</ScheduleName>
                                        <ScheduleTime>
                                            <Clock size={16} />
                                            {schedule.pickupTime} → {schedule.dropoffTime}
                                        </ScheduleTime>
                                        <DaysList>
                                            {[...schedule.days]
                                                .sort((a, b) => daysOrder.indexOf(a) - daysOrder.indexOf(b))
                                                .map((day) => (
                                                    <Badge key={day} variant="primary">
                                                        {dayLabels[day]}
                                                    </Badge>
                                                ))
                                            }
                                        </DaysList>
                                    </ScheduleMainInfo>
                                    <ScheduleActions>
                                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                                            {schedule.active ? (
                                                <Badge variant="success">Aktywny</Badge>
                                            ) : (
                                                <Badge variant="default">Nieaktywny</Badge>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                                            <ExpandButton onClick={() => toggleExpand(schedule.id)}>
                                                {isExpanded ? (
                                                    <>
                                                        <ChevronUp size={16} />
                                                        Zwiń
                                                    </>
                                                ) : (
                                                    <>
                                                        <ChevronDown size={16} />
                                                        Rozwiń
                                                    </>
                                                )}
                                            </ExpandButton>
                                            <IconButton
                                                onClick={() => handleEdit(schedule.id)}
                                                title="Edytuj"
                                            >
                                                <Edit2 size={16} />
                                            </IconButton>
                                            <IconButton
                                                onClick={() => handleDelete(schedule.id, schedule.name)}
                                                title="Usuń"
                                            >
                                                <Trash2 size={16} />
                                            </IconButton>
                                        </div>
                                    </ScheduleActions>
                                </ScheduleHeader>

                                <ScheduleDetails $isExpanded={isExpanded}>
                                    {isExpanded && (
                                        <>
                                            {isLoadingDetails ? (
                                                <LoadingDetails>
                                                    <LoadingSpinner />
                                                </LoadingDetails>
                                            ) : detailsToShow ? (
                                                <DetailsContent>
                                                    <AddressBlock>
                                                        <AddressHeader>
                                                            <Home size={16} />
                                                            Odbiór
                                                        </AddressHeader>
                                                        {detailsToShow.pickupAddress && (
                                                            <>
                                                                <AddressLabel>
                                                                    {detailsToShow.pickupAddress.label}
                                                                </AddressLabel>
                                                                <AddressLine>
                                                                    {detailsToShow.pickupAddress.street}{' '}
                                                                    {detailsToShow.pickupAddress.houseNumber}
                                                                    {detailsToShow.pickupAddress.apartmentNumber &&
                                                                        `/${detailsToShow.pickupAddress.apartmentNumber}`}
                                                                </AddressLine>
                                                                <AddressLine>
                                                                    {detailsToShow.pickupAddress.postalCode}{' '}
                                                                    {detailsToShow.pickupAddress.city}
                                                                </AddressLine>
                                                            </>
                                                        )}
                                                    </AddressBlock>

                                                    <AddressBlock>
                                                        <AddressHeader>
                                                            <School size={16} />
                                                            Dowóz
                                                        </AddressHeader>
                                                        {detailsToShow.dropoffAddress && (
                                                            <>
                                                                <AddressLabel>
                                                                    {detailsToShow.dropoffAddress.label}
                                                                </AddressLabel>
                                                                <AddressLine>
                                                                    {detailsToShow.dropoffAddress.street}{' '}
                                                                    {detailsToShow.dropoffAddress.houseNumber}
                                                                    {detailsToShow.dropoffAddress.apartmentNumber &&
                                                                        `/${detailsToShow.dropoffAddress.apartmentNumber}`}
                                                                </AddressLine>
                                                                <AddressLine>
                                                                    {detailsToShow.dropoffAddress.postalCode}{' '}
                                                                    {detailsToShow.dropoffAddress.city}
                                                                </AddressLine>
                                                            </>
                                                        )}
                                                    </AddressBlock>

                                                    {detailsToShow.specialInstructions && (
                                                        <SpecialInstructions>
                                                            <InstructionsLabel>
                                                                Specjalne instrukcje
                                                            </InstructionsLabel>
                                                            <InstructionsText>
                                                                {detailsToShow.specialInstructions}
                                                            </InstructionsText>
                                                        </SpecialInstructions>
                                                    )}

                                                    <RoutesSection $isExpanded={true}>
                                                        <RoutesSectionContent>
                                                            <RoutesSectionHeader>
                                                                <RoutesSectionTitle>
                                                                    <TrendingUp size={20} />
                                                                    Trasy harmonogramu
                                                                </RoutesSectionTitle>
                                                            </RoutesSectionHeader>

                                                            <TabsContainer>
                                                                <Tab
                                                                    $active={activeRoutesTab === 'history'}
                                                                    onClick={() => setActiveRoutesTab('history')}
                                                                >
                                                                    Historia
                                                                </Tab>
                                                                <Tab
                                                                    $active={activeRoutesTab === 'upcoming'}
                                                                    onClick={() => setActiveRoutesTab('upcoming')}
                                                                >
                                                                    Nadchodzące
                                                                </Tab>
                                                            </TabsContainer>

                                                            {activeRoutesTab === 'history' ? (
                                                                <RouteHistoryList scheduleId={schedule.id} />
                                                            ) : (
                                                                <UpcomingRoutesList scheduleId={schedule.id} />
                                                            )}
                                                        </RoutesSectionContent>
                                                    </RoutesSection>
                                                </DetailsContent>
                                            ) : null}
                                        </>
                                    )}
                                </ScheduleDetails>
                            </ScheduleCard>
                        );
                    })}
                </SchedulesList>
            )}

            <Modal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Dodaj harmonogram"
            >
                <ScheduleForm
                    mode="create"
                    onSubmit={handleCreate}
                    onCancel={() => setShowCreateModal(false)}
                    isLoading={createSchedule.isPending}
                />
            </Modal>

            <Modal
                isOpen={!!editingScheduleId}
                onClose={() => setEditingScheduleId(null)}
                title="Edytuj harmonogram"
            >
                {isLoadingEditData ? (
                    <LoadingSpinner />
                ) : editingScheduleData ? (
                    <ScheduleForm
                        mode="edit"
                        initialData={editingScheduleData}
                        onSubmit={handleUpdate}
                        onCancel={() => setEditingScheduleId(null)}
                        isLoading={updateSchedule.isPending}
                    />
                ) : null}
            </Modal>
        </>
    );
};