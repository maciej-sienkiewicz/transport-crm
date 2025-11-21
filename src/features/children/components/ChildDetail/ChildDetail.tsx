import React, { useState } from 'react';
import { ArrowLeft, Edit2, Trash2, Calendar, User, Check, X, Phone, Mail, Clock } from 'lucide-react';
import { useChild } from '../../hooks/useChild';
import { useDeleteChild } from '../../hooks/useDeleteChild';
import { ScheduleManagement } from '../ScheduleManagement';
import { AbsenceManagement } from '../AbsenceManagement';
import { GuardiansList } from '../GuardiansList';
import { ActivityHistory } from '../ActivityHistory';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { disabilityLabels, relationshipLabels } from '../../lib/constants';
import { formatBirthDate } from '../../lib/utils';
import {
    PageContainer,
    DetailHeader,
    HeaderTop,
    HeaderLeft,
    Breadcrumb,
    ChildName,
    HeaderMeta,
    MetaItem,
    HeaderActions,
    QuickInfoBar,
    InfoSection,
    InfoLabel,
    InfoContent,
    CheckItem,
    NotesText,
    ContentWrapper,
    MainContent,
    RightSidebar,
    SidebarContent,
    SidebarCard,
    CardTitle,
    StatItem,
    StatLabel,
    StatValue,
    GuardianCard,
    GuardianName,
    GuardianRole,
    ContactInfo,
    ContactItem,
    QuickActions,
    TimelineList,
    TimelineItem,
    TimelineDot,
    TimelineContent,
    TimelineText,
    TimelineTime,
    ViewAllButton,
    TabsContainer,
    TabsHeader,
    Tab,
    TabContent,
} from './ChildDetail.styles';
import {RouteSearchManagement} from "@/features/routes/components/RouteSearchManagement";

interface ChildDetailProps {
    id: string;
    onEdit: () => void;
    onBack: () => void;
}

type TabType = 'schedules' | 'absences' | 'guardians' | 'history' | 'routes';

export const ChildDetail: React.FC<ChildDetailProps> = ({ id, onEdit, onBack }) => {
    const [activeTab, setActiveTab] = useState<TabType>('schedules');
    const { data: child, isLoading } = useChild(id);
    const deleteChild = useDeleteChild();

    const handleDelete = async () => {
        if (
            window.confirm(
                `Czy na pewno chcesz usunąć dziecko ${child?.firstName} ${child?.lastName}?`
            )
        ) {
            await deleteChild.mutateAsync(id);
            onBack();
        }
    };

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return 'success';
            case 'INACTIVE':
                return 'danger';
            case 'TEMPORARY_INACTIVE':
                return 'warning';
            default:
                return 'default';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return 'Aktywny';
            case 'INACTIVE':
                return 'Nieaktywny';
            case 'TEMPORARY_INACTIVE':
                return 'Czasowo nieaktywny';
            default:
                return status;
        }
    };

    const getEventColor = (type: string) => {
        switch (type) {
            case 'SCHEDULE':
                return '#3b82f6';
            case 'GUARDIAN':
                return '#8b5cf6';
            case 'ABSENCE':
                return '#f59e0b';
            case 'PROFILE':
                return '#10b981';
            default:
                return '#64748b';
        }
    };

    const formatRelativeTime = (timestamp: string) => {
        const now = new Date();
        const time = new Date(timestamp);
        const diffMs = now.getTime() - time.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Przed chwilą';
        if (diffMins < 60) return `${diffMins} min temu`;
        if (diffHours < 24) return `${diffHours} godz. temu`;
        if (diffDays === 1) return 'Wczoraj';
        if (diffDays < 7) return `${diffDays} dni temu`;
        return time.toLocaleDateString('pl-PL', { day: '2-digit', month: 'short' });
    };

    if (isLoading || !child) {
        return (
            <PageContainer>
                <DetailHeader>
                    <HeaderTop>
                        <HeaderLeft>
                            <Breadcrumb onClick={onBack}>
                                <ArrowLeft size={16} />
                                Powrót do listy dzieci
                            </Breadcrumb>
                            <ChildName>Ładowanie...</ChildName>
                        </HeaderLeft>
                    </HeaderTop>
                </DetailHeader>
            </PageContainer>
        );
    }

    const primaryGuardian = child.guardians?.find((g) => g.isPrimary) || child.guardians?.[0];

    const mockRecentActivity = [
        {
            id: '1',
            type: 'SCHEDULE',
            text: 'Dodano harmonogram "Trasa poranna"',
            timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
        },
        {
            id: '2',
            type: 'ABSENCE',
            text: 'Zgłoszono nieobecność na 15 stycznia',
            timestamp: new Date(Date.now() - 5 * 3600000).toISOString(),
        },
        {
            id: '3',
            type: 'GUARDIAN',
            text: 'Zaktualizowano dane opiekuna',
            timestamp: new Date(Date.now() - 86400000).toISOString(),
        },
        {
            id: '4',
            type: 'PROFILE',
            text: 'Zmieniono status na Aktywny',
            timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
        },
        {
            id: '5',
            type: 'SCHEDULE',
            text: 'Edytowano harmonogram "Trasa popołudniowa"',
            timestamp: new Date(Date.now() - 3 * 86400000).toISOString(),
        },
    ];

    return (
        <PageContainer>
            <DetailHeader>
                <HeaderTop>
                    <HeaderLeft>
                        <Breadcrumb onClick={onBack}>
                            <ArrowLeft size={16} />
                            Powrót do listy dzieci
                        </Breadcrumb>
                        <ChildName>
                            {child.firstName} {child.lastName}, {child.age} lat
                        </ChildName>
                        <HeaderMeta>
                            <MetaItem>
                                <User size={16} />
                                ID: {child.id}
                            </MetaItem>
                            <MetaItem>
                                <Calendar size={16} />
                                {formatBirthDate(child.birthDate)}
                            </MetaItem>
                            <Badge variant={getStatusVariant(child.status)}>
                                {getStatusLabel(child.status)}
                            </Badge>
                        </HeaderMeta>
                    </HeaderLeft>
                    <HeaderActions>
                        <Button variant="secondary" onClick={onEdit}>
                            <Edit2 size={16} />
                            Edytuj
                        </Button>
                        <Button variant="danger" onClick={handleDelete}>
                            <Trash2 size={16} />
                            Usuń
                        </Button>
                    </HeaderActions>
                </HeaderTop>

                <QuickInfoBar>
                    <InfoSection>
                        <InfoLabel>
                            🧠 Niepełnosprawność
                        </InfoLabel>
                        <InfoContent>
                            {child.disability.map((d) => (
                                <Badge key={d} variant="primary">
                                    {disabilityLabels[d]}
                                </Badge>
                            ))}
                        </InfoContent>
                    </InfoSection>

                    <InfoSection>
                        <InfoLabel>
                            🦽 Potrzeby transportowe
                        </InfoLabel>
                        <InfoContent>
                            <CheckItem>
                                {child.transportNeeds.wheelchair ? (
                                    <Check size={14} color="#10b981" />
                                ) : (
                                    <X size={14} color="#ef4444" />
                                )}
                                Wózek
                            </CheckItem>
                            <CheckItem>
                                {child.transportNeeds.specialSeat ? (
                                    <Check size={14} color="#10b981" />
                                ) : (
                                    <X size={14} color="#ef4444" />
                                )}
                                Fotelik
                            </CheckItem>
                            <CheckItem>
                                {child.transportNeeds.safetyBelt ? (
                                    <Check size={14} color="#10b981" />
                                ) : (
                                    <X size={14} color="#ef4444" />
                                )}
                                Pasy
                            </CheckItem>
                        </InfoContent>
                    </InfoSection>

                    <InfoSection>
                        <InfoLabel>
                            ⚠️ Notatki
                        </InfoLabel>
                        <InfoContent>
                            {child.notes ? (
                                <NotesText>{child.notes}</NotesText>
                            ) : (
                                <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                                    Brak notatek
                                </span>
                            )}
                        </InfoContent>
                    </InfoSection>
                </QuickInfoBar>
            </DetailHeader>

            <ContentWrapper>
                <MainContent>
                    <TabsContainer>
                        <TabsHeader>
                            <Tab
                                $active={activeTab === 'schedules'}
                                onClick={() => setActiveTab('schedules')}
                            >
                                📅 Harmonogramy
                            </Tab>
                            <Tab
                                $active={activeTab === 'absences'}
                                onClick={() => setActiveTab('absences')}
                            >
                                🚫 Nieobecności
                            </Tab>
                            <Tab
                                $active={activeTab === 'guardians'}
                                onClick={() => setActiveTab('guardians')}
                            >
                                👨‍👩‍👧 Opiekunowie
                            </Tab>
                            <Tab
                                $active={activeTab === 'routes'}
                                onClick={() => setActiveTab('routes')}
                            >
                                🚌 Wyszukiwanie tras
                            </Tab>
                            <Tab
                                $active={activeTab === 'history'}
                                onClick={() => setActiveTab('history')}
                            >
                                📊 Historia aktywności
                            </Tab>
                        </TabsHeader>

                        <TabContent>
                            {activeTab === 'schedules' && <ScheduleManagement childId={id} />}
                            {activeTab === 'absences' && <AbsenceManagement childId={id} />}
                            {activeTab === 'guardians' && (
                                <GuardiansList childId={id} guardians={child.guardians || []} />
                            )}
                            {activeTab === 'routes' && <RouteSearchManagement childId={id} />}
                            {activeTab === 'history' && <ActivityHistory childId={id} />}
                        </TabContent>
                    </TabsContainer>
                </MainContent>

                <RightSidebar>
                    <SidebarContent>
                        <SidebarCard>
                            <CardTitle>Statystyki</CardTitle>
                            <StatItem>
                                <StatLabel>Harmonogramy</StatLabel>
                                <StatValue>{child.activeSchedulesCount || 0}</StatValue>
                            </StatItem>
                            <StatItem>
                                <StatLabel>Opiekunowie</StatLabel>
                                <StatValue>{child.guardiansCount || 0}</StatValue>
                            </StatItem>
                            <StatItem>
                                <StatLabel>Ostatnia zmiana</StatLabel>
                                <StatValue>
                                    {new Date(child.updatedAt).toLocaleDateString('pl-PL', {
                                        day: '2-digit',
                                        month: 'short',
                                    })}
                                </StatValue>
                            </StatItem>
                        </SidebarCard>

                        {primaryGuardian && (
                            <SidebarCard>
                                <CardTitle>Główny opiekun</CardTitle>
                                <GuardianCard>
                                    <GuardianName>
                                        {primaryGuardian.firstName} {primaryGuardian.lastName}
                                    </GuardianName>
                                    <GuardianRole>
                                        {relationshipLabels[primaryGuardian.relationship]} • Główny kontakt
                                    </GuardianRole>
                                    <ContactInfo>
                                        <ContactItem href={`tel:${primaryGuardian.phone}`}>
                                            <Phone size={16} />
                                            {primaryGuardian.phone}
                                        </ContactItem>
                                        <ContactItem href={`mailto:${primaryGuardian.email}`}>
                                            <Mail size={16} />
                                            {primaryGuardian.email}
                                        </ContactItem>
                                    </ContactInfo>
                                    <QuickActions>
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={() => window.location.href = `tel:${primaryGuardian.phone}`}
                                        >
                                            <Phone size={14} />
                                            Zadzwoń
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => window.location.href = `mailto:${primaryGuardian.email}`}
                                        >
                                            <Mail size={14} />
                                            Email
                                        </Button>
                                    </QuickActions>
                                </GuardianCard>
                            </SidebarCard>
                        )}

                        <SidebarCard>
                            <CardTitle>Ostatnie zmiany</CardTitle>
                            <TimelineList>
                                {mockRecentActivity.map((event) => (
                                    <TimelineItem key={event.id}>
                                        <TimelineDot $color={getEventColor(event.type)} />
                                        <TimelineContent>
                                            <TimelineText>{event.text}</TimelineText>
                                            <TimelineTime>
                                                <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                                                {formatRelativeTime(event.timestamp)}
                                            </TimelineTime>
                                        </TimelineContent>
                                    </TimelineItem>
                                ))}
                            </TimelineList>
                            <ViewAllButton onClick={() => setActiveTab('history')}>
                                Zobacz wszystkie
                            </ViewAllButton>
                        </SidebarCard>
                    </SidebarContent>
                </RightSidebar>
            </ContentWrapper>
        </PageContainer>
    );
};