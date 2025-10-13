import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Clock, MapPin } from 'lucide-react';
import styled from 'styled-components';
import { ChildSchedule } from '../../types';
import { useSchedules } from '../../hooks/useSchedules';
import { useCreateSchedule } from '../../hooks/useCreateSchedule';
import { useUpdateSchedule } from '../../hooks/useUpdateSchedule';
import { useDeleteSchedule } from '../../hooks/useDeleteSchedule';
import { ScheduleForm } from '../ScheduleForm';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { Modal } from '@/shared/ui/Modal';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';

const SectionHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SectionTitle = styled.h2`
    font-size: 1.125rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[900]};
`;

const SchedulesGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: ${({ theme }) => theme.spacing.md};

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        grid-template-columns: 1fr;
    }
`;

const ScheduleCard = styled.div`
    padding: ${({ theme }) => theme.spacing.lg};
    background: white;
    border: 1px solid ${({ theme }) => theme.colors.slate[200]};
    border-radius: ${({ theme }) => theme.borderRadius.xl};
    transition: all ${({ theme }) => theme.transitions.normal};

    &:hover {
        box-shadow: ${({ theme }) => theme.shadows.md};
    }
`;

const ScheduleHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: ${({ theme }) => theme.spacing.md};
    gap: ${({ theme }) => theme.spacing.sm};
`;

const ScheduleName = styled.h3`
    font-size: 1rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[900]};
    flex: 1;
`;

const ScheduleActions = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.xs};
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
`;

const ScheduleInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};
    margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const InfoRow = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.slate[600]};
`;

const DaysList = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: ${({ theme }) => theme.spacing.xs};
`;

const EmptyState = styled.div`
    padding: ${({ theme }) => theme.spacing.xl};
    text-align: center;
    color: ${({ theme }) => theme.colors.slate[500]};
    background: ${({ theme }) => theme.colors.slate[50]};
    border-radius: ${({ theme }) => theme.borderRadius.xl};
    border: 1px dashed ${({ theme }) => theme.colors.slate[300]};
`;

interface ScheduleManagementProps {
    childId: string;
}

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
    const [editingSchedule, setEditingSchedule] = useState<ChildSchedule | null>(null);

    const { data: schedulesData, isLoading } = useSchedules(childId);
    const createSchedule = useCreateSchedule(childId);
    const updateSchedule = useUpdateSchedule(editingSchedule?.id || '', childId);
    const deleteSchedule = useDeleteSchedule(childId);

    const schedules = schedulesData?.schedules || [];

    const handleCreate = async (data: any) => {
        await createSchedule.mutateAsync(data);
        setShowCreateModal(false);
    };

    const handleUpdate = async (data: any) => {
        if (editingSchedule) {
            await updateSchedule.mutateAsync(data);
            setEditingSchedule(null);
        }
    };

    const handleDelete = async (scheduleId: string, scheduleName: string) => {
        if (window.confirm(`Czy na pewno chcesz usunąć harmonogram "${scheduleName}"?`)) {
            await deleteSchedule.mutateAsync(scheduleId);
        }
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
                <SchedulesGrid>
                    {schedules.map((schedule) => (
                        <ScheduleCard key={schedule.id}>
                            <ScheduleHeader>
                                <ScheduleName>{schedule.name}</ScheduleName>
                                <ScheduleActions>
                                    {schedule.active ? (
                                        <Badge variant="success">Aktywny</Badge>
                                    ) : (
                                        <Badge variant="default">Nieaktywny</Badge>
                                    )}
                                    <IconButton
                                        onClick={() => setEditingSchedule(schedule)}
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
                                </ScheduleActions>
                            </ScheduleHeader>

                            <ScheduleInfo>
                                <InfoRow>
                                    <Clock size={16} />
                                    {schedule.pickupTime} → {schedule.dropoffTime}
                                </InfoRow>
                                <InfoRow>
                                    <MapPin size={16} />
                                    {schedule.pickupAddress.label} → {schedule.dropoffAddress.label}
                                </InfoRow>
                            </ScheduleInfo>

                            <DaysList>
                                {schedule.days.map((day) => (
                                    <Badge key={day} variant="primary">
                                        {dayLabels[day]}
                                    </Badge>
                                ))}
                            </DaysList>
                        </ScheduleCard>
                    ))}
                </SchedulesGrid>
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
                isOpen={!!editingSchedule}
                onClose={() => setEditingSchedule(null)}
                title="Edytuj harmonogram"
            >
                {editingSchedule && (
                    <ScheduleForm
                        mode="edit"
                        initialData={editingSchedule}
                        onSubmit={handleUpdate}
                        onCancel={() => setEditingSchedule(null)}
                        isLoading={updateSchedule.isPending}
                    />
                )}
            </Modal>
        </>
    );
};