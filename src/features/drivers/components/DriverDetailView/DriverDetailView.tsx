// src/features/drivers/components/DriverDetailView/DriverDetailView.tsx
import React, { useState } from 'react';
import { ArrowLeft, Edit2, Trash2, User, Calendar, Phone, Mail, FileText, Clock } from 'lucide-react';
import { useDriverDetail } from '../../hooks/useDriverDetail';
import { useDeleteDriver } from '../../hooks/useDeleteDriver';
import { usePlannedRoutes } from '../../hooks/useDriverRoutes';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { driverStatusLabels } from '../../lib/constants';
import { formatDate, calculateAge, isExpired, isExpiringWithin30Days } from '../../lib/utils';
import { StatusDocumentsTab } from '../StatusDocumentsTab';
import { PlannedRoutesTab } from '../PlannedRoutesTab';
import { RouteHistoryTab } from '../RouteHistoryTab';
import { NotesTab } from '../NotesTab';
import {
    PageContainer,
    DetailHeader,
    HeaderTop,
    HeaderLeft,
    Breadcrumb,
    DriverName,
    HeaderMeta,
    MetaItem,
    HeaderActions,
    QuickInfoBar,
    ContentWrapper,
    MainContent,
    RightSidebar,
    SidebarContent,
    SidebarCard,
    CardTitle,
    StatItem,
    StatLabel,
    StatValue,
    ProgressBar,
    AlertCard,
    AlertHeader,
    AlertIcon,
    AlertContent,
    AlertTitle,
    AlertText,
    AlertActions,
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
} from './DriverDetailView.styles';
import { AlertTriangle, Check, X } from 'lucide-react';
import {DriverActivityHistory} from "@/features/drivers/components/DriverActivityHistory";
import {
    DetailRow,
    DocumentCard,
    DocumentDetails,
    DocumentHeader, DocumentIcon,
    DocumentInfo,
    DocumentSubtitle,
    DocumentTitle
} from "@/features/drivers/components/StatusDocumentsTab/StatusDocumentsTab.styles.ts";
import {DriverAbsencesTab} from "@/features/drivers/components/DriverAbsencesTab";

interface DriverDetailViewProps {
    id: string;
    onEdit: () => void;
    onBack: () => void;
}

type TabType = 'status' | 'planned' | 'history' | 'absences' | 'notes' | 'activity';

export const DriverDetailView: React.FC<DriverDetailViewProps> = ({ id, onEdit, onBack }) => {
    const [activeTab, setActiveTab] = useState<TabType>('status');
    const { data: driver, isLoading } = useDriverDetail(id);
    const { data: plannedRoutes } = usePlannedRoutes(id);
    const deleteDriver = useDeleteDriver();

    const handleDelete = async () => {
        if (window.confirm(`Czy na pewno chcesz usunąć kierowcę ${driver?.firstName} ${driver?.lastName}?`)) {
            await deleteDriver.mutateAsync(id);
            onBack();
        }
    };

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return 'success';
            case 'INACTIVE':
                return 'danger';
            case 'ON_LEAVE':
                return 'warning';
            default:
                return 'default';
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

    const getEventColor = (type: string) => {
        switch (type) {
            case 'ROUTE':
                return '#3b82f6';
            case 'DOCUMENT':
                return '#8b5cf6';
            case 'NOTE':
                return '#f59e0b';
            case 'STATUS':
                return '#10b981';
            default:
                return '#64748b';
        }
    };

    const getTimeUntilRoute = (startTime: string) => {
        const now = new Date();
        const start = new Date(startTime);
        const diffMs = start.getTime() - now.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 60) return `Za ${diffMins} min`;
        const diffHours = Math.floor(diffMins / 60);
        return `Za ${diffHours} godz. ${diffMins % 60} min`;
    };

    if (isLoading || !driver) {
        return (
            <PageContainer>
                <DetailHeader>
                    <HeaderTop>
                        <HeaderLeft>
                            <Breadcrumb onClick={onBack}>
                                <ArrowLeft size={16} />
                                Powrót do listy kierowców
                            </Breadcrumb>
                            <DriverName>Ładowanie...</DriverName>
                        </HeaderLeft>
                    </HeaderTop>
                </DetailHeader>
                <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center' }}>
                    <LoadingSpinner />
                </div>
            </PageContainer>
        );
    }

    const licenseExpired = isExpired(driver.drivingLicense.validUntil);
    const licenseExpiring = isExpiringWithin30Days(driver.drivingLicense.validUntil);
    const medicalExpired = isExpired(driver.medicalCertificate.validUntil);
    const medicalExpiring = isExpiringWithin30Days(driver.medicalCertificate.validUntil);

    const hasAlerts = licenseExpired || licenseExpiring || medicalExpired || medicalExpiring;

    const nextRoute = plannedRoutes?.[0];

    const getMedicalStatus = (): 'valid' | 'expiring' | 'expired' => {
        if (medicalExpired) return 'expired';
        if (medicalExpiring) return 'expiring';
        return 'valid';
    };

    const getLicenseStatus = (): 'valid' | 'expiring' | 'expired' => {
        if (licenseExpired) return 'expired';
        if (licenseExpiring) return 'expiring';
        return 'valid';
    };

    // Mock recent activity
    const mockRecentActivity = [
        {
            id: '1',
            type: 'ROUTE',
            text: 'Zakończył trasę RT-2845',
            timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
        },
        {
            id: '2',
            type: 'ROUTE',
            text: 'Rozpoczął trasę RT-2843',
            timestamp: new Date(Date.now() - 4 * 3600000).toISOString(),
        },
        {
            id: '3',
            type: 'NOTE',
            text: 'Dodano notatkę przez A.Kowalska',
            timestamp: new Date(Date.now() - 86400000).toISOString(),
        },
    ];

    return (
        <PageContainer>
            <DetailHeader>
                <HeaderTop>
                    <HeaderLeft>
                        <Breadcrumb onClick={onBack}>
                            <ArrowLeft size={16} />
                            Powrót do listy kierowców
                        </Breadcrumb>
                        <DriverName>
                            {driver.firstName} {driver.lastName}, {calculateAge(driver.dateOfBirth)} lat
                        </DriverName>
                        <HeaderMeta>
                            <MetaItem>
                                <User size={16} />
                                ID: {driver.id}
                            </MetaItem>
                            <MetaItem>
                                <Phone size={16} />
                                {driver.phone}
                            </MetaItem>
                            <MetaItem>
                                <Mail size={16} />
                                {driver.email}
                            </MetaItem>
                            <Badge variant={getStatusVariant(driver.status)}>
                                {driverStatusLabels[driver.status]}
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
                    <DocumentCard $status={getLicenseStatus()}>
                        <DocumentHeader>
                            <DocumentIcon $status={getLicenseStatus()}>
                                {licenseExpired ? (
                                    <X size={20} />
                                ) : licenseExpiring ? (
                                    <AlertTriangle size={20} />
                                ) : (
                                    <Check size={20} />
                                )}
                            </DocumentIcon>
                            <DocumentInfo>
                                <DocumentTitle>Prawo jazdy</DocumentTitle>
                                <DocumentSubtitle>
                                    {driver.drivingLicense.categories.join(', ')}
                                </DocumentSubtitle>
                            </DocumentInfo>
                        </DocumentHeader>
                        <DocumentDetails>
                            <DetailRow>
                                <strong>Numer:</strong> {driver.drivingLicense.licenseNumber}
                            </DetailRow>
                            <DetailRow>
                                <strong>Ważne do:</strong> {formatDate(driver.drivingLicense.validUntil)}
                            </DetailRow>
                        </DocumentDetails>
                    </DocumentCard>

                    <DocumentCard $status={driver.latestCEPIKCheck?.status === 'ACTIVE' ? 'valid' : 'expired'}>
                        <DocumentHeader>
                            <DocumentIcon $status={driver.latestCEPIKCheck?.status === 'ACTIVE' ? 'valid' : 'expired'}>
                                {driver.latestCEPIKCheck?.status === 'ACTIVE' ? (
                                    <Check size={20} />
                                ) : (
                                    <X size={20} />
                                )}
                            </DocumentIcon>
                            <DocumentInfo>
                                <DocumentTitle>Status CEPIK</DocumentTitle>
                                <DocumentSubtitle>
                                    {driver.latestCEPIKCheck?.status === 'ACTIVE' ? 'Aktywne' : 'Nieaktywne'}
                                </DocumentSubtitle>
                            </DocumentInfo>
                        </DocumentHeader>
                        <DocumentDetails>
                            <DetailRow>
                                <strong>Ostatnie sprawdzenie:</strong>
                            </DetailRow>
                            <DetailRow>
                                {driver.latestCEPIKCheck
                                    ? new Date(driver.latestCEPIKCheck.timestamp).toLocaleString('pl-PL')
                                    : 'Brak danych'}
                            </DetailRow>
                        </DocumentDetails>
                    </DocumentCard>

                    <DocumentCard $status={getMedicalStatus()}>
                        <DocumentHeader>
                            <DocumentIcon $status={getMedicalStatus()}>
                                {medicalExpired ? (
                                    <X size={20} />
                                ) : medicalExpiring ? (
                                    <AlertTriangle size={20} />
                                ) : (
                                    <Check size={20} />
                                )}
                            </DocumentIcon>
                            <DocumentInfo>
                                <DocumentTitle>Badania lekarskie</DocumentTitle>
                                <DocumentSubtitle>
                                    {medicalExpiring
                                        ? `⚠️ Wygasa za ${Math.ceil((new Date(driver.medicalCertificate.validUntil).getTime() - Date.now()) / 86400000)} dni`
                                        : 'Aktualne'}
                                </DocumentSubtitle>
                            </DocumentInfo>
                        </DocumentHeader>
                        <DocumentDetails>
                            <DetailRow>
                                <strong>Data wydania:</strong> {formatDate(driver.medicalCertificate.issueDate)}
                            </DetailRow>
                            <DetailRow>
                                <strong>Ważne do:</strong> {formatDate(driver.medicalCertificate.validUntil)}
                            </DetailRow>
                        </DocumentDetails>
                    </DocumentCard>

                    <DocumentCard $status={nextRoute ? 'valid' : 'expiring'}>
                        <DocumentHeader>
                            <DocumentIcon $status={nextRoute ? 'valid' : 'expiring'}>
                                <Calendar size={20} />
                            </DocumentIcon>
                            <DocumentInfo>
                                <DocumentTitle>Najbliższa trasa</DocumentTitle>
                                <DocumentSubtitle>
                                    {nextRoute ? getTimeUntilRoute(nextRoute.startTime) : 'Brak tras'}
                                </DocumentSubtitle>
                            </DocumentInfo>
                        </DocumentHeader>
                        {nextRoute ? (
                            <DocumentDetails>
                                <DetailRow>
                                    <strong>Trasa #{nextRoute.routeNumber}</strong>
                                </DetailRow>
                                <DetailRow>
                                    {nextRoute.childrenCount} dzieci
                                </DetailRow>
                                <DetailRow>
                                    {nextRoute.startLocation} → {nextRoute.endLocation}
                                </DetailRow>
                            </DocumentDetails>
                        ) : (
                            <DocumentDetails>
                                <DetailRow>Brak zaplanowanych tras</DetailRow>
                            </DocumentDetails>
                        )}
                    </DocumentCard>
                </QuickInfoBar>
            </DetailHeader>

            <ContentWrapper>
                <MainContent>
                    <TabsContainer>
                        <TabsHeader>
                            <Tab $active={activeTab === 'status'} onClick={() => setActiveTab('status')}>
                                📄 Status i dokumenty
                            </Tab>
                            <Tab $active={activeTab === 'planned'} onClick={() => setActiveTab('planned')}>
                                🗓️ Zaplanowane trasy
                            </Tab>
                            <Tab $active={activeTab === 'history'} onClick={() => setActiveTab('history')}>
                                📊 Historia tras
                            </Tab>
                            <Tab $active={activeTab === 'absences'} onClick={() => setActiveTab('absences')}>
                                🚫 Nieobecności
                            </Tab>
                            <Tab $active={activeTab === 'notes'} onClick={() => setActiveTab('notes')}>
                                📝 Notatki
                            </Tab>
                            <Tab $active={activeTab === 'activity'} onClick={() => setActiveTab('activity')}>
                                🕐 Historia aktywności
                            </Tab>
                        </TabsHeader>

                        <TabContent>
                            {activeTab === 'status' && <StatusDocumentsTab driverId={id} />}
                            {activeTab === 'planned' && <PlannedRoutesTab driverId={id} />}
                            {activeTab === 'history' && <RouteHistoryTab driverId={id} />}
                            {activeTab === 'absences' && <DriverAbsencesTab driverId={id} />}
                            {activeTab === 'notes' && <NotesTab driverId={id} />}
                            {activeTab === 'activity' && <DriverActivityHistory driverId={id} />}
                        </TabContent>
                    </TabsContainer>
                </MainContent>

                <RightSidebar>
                    <SidebarContent>
                        {hasAlerts && (
                            <AlertCard $severity={licenseExpired || medicalExpired ? 'danger' : 'warning'}>
                                <AlertHeader>
                                    <AlertIcon>
                                        <AlertTriangle size={20} color={licenseExpired || medicalExpired ? '#ef4444' : '#f59e0b'} />
                                    </AlertIcon>
                                    <AlertContent>
                                        <AlertTitle>
                                            {licenseExpired || medicalExpired ? 'Wymagana natychmiastowa akcja' : 'Ostrzeżenie'}
                                        </AlertTitle>
                                        <AlertText>
                                            {licenseExpired && 'Prawo jazdy wygasło. '}
                                            {medicalExpired && 'Badania lekarskie wygasły. '}
                                            {!licenseExpired && licenseExpiring && 'Prawo jazdy wygasa w ciągu 30 dni. '}
                                            {!medicalExpired && medicalExpiring && 'Badania lekarskie wygasają w ciągu 30 dni. '}
                                        </AlertText>
                                    </AlertContent>
                                </AlertHeader>
                                <AlertActions>
                                    <Button size="sm" variant="secondary" fullWidth>
                                        Zaplanuj badania
                                    </Button>
                                    <Button size="sm" variant="secondary" fullWidth>
                                        Dodaj notatkę
                                    </Button>
                                </AlertActions>
                            </AlertCard>
                        )}

                        <SidebarCard>
                            <CardTitle>📊 Statystyki bieżące</CardTitle>
                            <div>
                                <StatLabel style={{ marginBottom: '0.5rem', fontWeight: 600 }}>Dzisiaj:</StatLabel>
                                <StatItem>
                                    <StatLabel>Trasy</StatLabel>
                                    <StatValue>{driver.stats.today.completedRoutes}/{driver.stats.today.totalRoutes}</StatValue>
                                </StatItem>
                                <ProgressBar $percentage={(driver.stats.today.completedRoutes / driver.stats.today.totalRoutes) * 100} />

                                <StatItem style={{ marginTop: '0.5rem' }}>
                                    <StatLabel>Czas</StatLabel>
                                    <StatValue>{driver.stats.today.hoursWorked.toFixed(1)}/{driver.stats.today.totalHours}h</StatValue>
                                </StatItem>
                                <ProgressBar $percentage={(driver.stats.today.hoursWorked / driver.stats.today.totalHours) * 100} />

                                <StatItem style={{ marginTop: '0.5rem' }}>
                                    <StatLabel>Przejechane</StatLabel>
                                    <StatValue>{driver.stats.today.kmDriven} km</StatValue>
                                </StatItem>
                            </div>

                            <div style={{ marginTop: '1rem' }}>
                                <StatLabel style={{ marginBottom: '0.5rem', fontWeight: 600 }}>Ten tydzień:</StatLabel>
                                <StatItem>
                                    <StatLabel>Trasy</StatLabel>
                                    <StatValue>{driver.stats.week.totalRoutes}</StatValue>
                                </StatItem>
                                <StatItem>
                                    <StatLabel>Absencje</StatLabel>
                                    <StatValue>{driver.stats.week.absences}</StatValue>
                                </StatItem>
                                <StatItem>
                                    <StatLabel>Opóźnienia</StatLabel>
                                    <StatValue>{driver.stats.week.delays} ({driver.stats.week.delayPercentage}%)</StatValue>
                                </StatItem>
                            </div>
                        </SidebarCard>

                        <SidebarCard>
                            <CardTitle>⚡ Szybkie akcje</CardTitle>
                            <QuickActions>
                                <Button variant="secondary" size="sm" fullWidth>
                                    <FileText size={14} />
                                    Pobierz raport
                                </Button>
                                <Button variant="secondary" size="sm" fullWidth>
                                    <FileText size={14} />
                                    Dodaj notatkę
                                </Button>
                                <Button variant="secondary" size="sm" fullWidth onClick={() => window.location.href = `tel:${driver.phone}`}>
                                    <Phone size={14} />
                                    Zadzwoń
                                </Button>
                                <Button variant="secondary" size="sm" fullWidth onClick={() => window.location.href = `mailto:${driver.email}`}>
                                    <Mail size={14} />
                                    Wyślij email
                                </Button>
                            </QuickActions>
                        </SidebarCard>

                        <SidebarCard>
                            <CardTitle>🕐 Ostatnie zdarzenia</CardTitle>
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
                            <ViewAllButton onClick={() => setActiveTab('activity')}>
                                Zobacz wszystkie
                            </ViewAllButton>
                        </SidebarCard>
                    </SidebarContent>
                </RightSidebar>
            </ContentWrapper>
        </PageContainer>
    );
};