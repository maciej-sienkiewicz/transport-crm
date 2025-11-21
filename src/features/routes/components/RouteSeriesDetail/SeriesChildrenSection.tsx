// src/features/routes/components/RouteSeriesDetail/SeriesChildrenSection.tsx

import React, { useState } from 'react';
import styled from 'styled-components';
import { UserPlus, UserMinus, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { RouteSeriesDetail } from '../../types';
import { SectionCard, SectionHeader, SectionTitle, SectionContent } from './RouteSeriesDetail.styles';
import { AddChildToSeriesModal } from '../AddChildToSeriesModal';
import { RemoveChildFromSeriesDialog } from '../RemoveChildFromSeriesDialog';

const ChildrenList = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
`;

const ChildCard = styled.div`
    padding: ${({ theme }) => theme.spacing.lg};
    background: ${({ theme }) => theme.colors.slate[50]};
    border: 1px solid ${({ theme }) => theme.colors.slate[200]};
    border-radius: ${({ theme }) => theme.borderRadius.xl};
    transition: all ${({ theme }) => theme.transitions.fast};

    &:hover {
        background: ${({ theme }) => theme.colors.slate[100]};
        border-color: ${({ theme }) => theme.colors.slate[300]};
    }
`;

const ChildHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.md};
    margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ChildInfo = styled.div`
    flex: 1;
`;

const ChildName = styled.h4`
    font-size: 1rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.slate[900]};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ChildMeta = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: ${({ theme }) => theme.spacing.md};
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.slate[600]};
`;

const MetaItem = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
`;

const ChildDetails = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: ${({ theme }) => theme.spacing.md};
    padding-top: ${({ theme }) => theme.spacing.md};
    border-top: 1px solid ${({ theme }) => theme.colors.slate[200]};
`;

const DetailItem = styled.div`
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.slate[600]};

    strong {
        color: ${({ theme }) => theme.colors.slate[900]};
    }
`;

const EmptyState = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: ${({ theme }) => theme.spacing['2xl']};
    text-align: center;
    color: ${({ theme }) => theme.colors.slate[500]};
    background: ${({ theme }) => theme.colors.slate[50]};
    border-radius: ${({ theme }) => theme.borderRadius.xl};
`;

interface SeriesChildrenSectionProps {
    series: RouteSeriesDetail;
}

const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pl-PL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
};

export const SeriesChildrenSection: React.FC<SeriesChildrenSectionProps> = ({ series }) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
    const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);

    const handleRemoveClick = (scheduleId: string) => {
        setSelectedScheduleId(scheduleId);
        setIsRemoveDialogOpen(true);
    };

    const canAddChildren = series.status === 'ACTIVE';

    return (
        <>
            <SectionCard>
                <SectionHeader>
                    <SectionTitle>Dzieci w serii ({series.schedules?.length || 0})</SectionTitle>
                    {canAddChildren && (
                        <Button variant="primary" size="sm" onClick={() => setIsAddModalOpen(true)}>
                            <UserPlus size={16} />
                            Dodaj dziecko
                        </Button>
                    )}
                </SectionHeader>
                <SectionContent>
                    {!series.schedules || series.schedules.length === 0 ? (
                        <EmptyState>
                            <UserPlus size={48} style={{ marginBottom: '1rem', color: '#94a3b8' }} />
                            <p style={{ fontSize: '1rem', color: '#475569', marginBottom: '0.5rem' }}>
                                Brak dzieci w tej serii
                            </p>
                            <p style={{ fontSize: '0.875rem' }}>
                                Dodaj dzieci, aby automatycznie generować dla nich trasy
                            </p>
                        </EmptyState>
                    ) : (
                        <ChildrenList>
                            {series.schedules.map((schedule) => (
                                <ChildCard key={schedule.scheduleId}>
                                    <ChildHeader>
                                        <ChildInfo>
                                            <ChildName>
                                                {schedule.childFirstName} {schedule.childLastName}
                                            </ChildName>
                                            <ChildMeta>
                                                <MetaItem>
                                                    <Calendar size={14} />
                                                    Od: {formatDate(schedule.effectiveFrom)}
                                                </MetaItem>
                                                {schedule.effectiveTo && (
                                                    <MetaItem>
                                                        Do: {formatDate(schedule.effectiveTo)}
                                                    </MetaItem>
                                                )}
                                            </ChildMeta>
                                        </ChildInfo>
                                        {canAddChildren && (
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleRemoveClick(schedule.scheduleId)}
                                            >
                                                <UserMinus size={16} />
                                                Usuń
                                            </Button>
                                        )}
                                    </ChildHeader>
                                    <ChildDetails>
                                        <DetailItem>
                                            <MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} />
                                            <strong>Odbiór:</strong> pozycja {schedule.pickupStopOrder}
                                        </DetailItem>
                                        <DetailItem>
                                            <MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} />
                                            <strong>Dowóz:</strong> pozycja {schedule.dropoffStopOrder}
                                        </DetailItem>
                                        <DetailItem>
                                            <strong>ID Harmonogramu:</strong> {schedule.scheduleId}
                                        </DetailItem>
                                    </ChildDetails>
                                </ChildCard>
                            ))}
                        </ChildrenList>
                    )}
                </SectionContent>
            </SectionCard>

            <AddChildToSeriesModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                series={series}
            />

            {selectedScheduleId && (
                <RemoveChildFromSeriesDialog
                    isOpen={isRemoveDialogOpen}
                    onClose={() => {
                        setIsRemoveDialogOpen(false);
                        setSelectedScheduleId(null);
                    }}
                    seriesId={series.id}
                    scheduleId={selectedScheduleId}
                    childName={
                        series.schedules?.find((s) => s.scheduleId === selectedScheduleId)
                            ? `${series.schedules.find((s) => s.scheduleId === selectedScheduleId)!.childFirstName} ${
                                series.schedules.find((s) => s.scheduleId === selectedScheduleId)!.childLastName
                            }`
                            : ''
                    }
                />
            )}
        </>
    );
};