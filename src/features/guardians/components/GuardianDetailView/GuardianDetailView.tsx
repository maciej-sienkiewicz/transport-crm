// src/features/guardians/components/GuardianDetailView/GuardianDetailView.tsx
import React, { useState } from 'react';
import { ArrowLeft, Edit2, Trash2, Phone, Mail, User, Calendar, Clock, Shield } from 'lucide-react';
import { useGuardianDetail } from '../../hooks/useGuardianDetail';
import { useDeleteGuardian } from '../../hooks/useDeleteGuardian';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { GuardianChildren } from '../GuardianChildren';
import { GuardianNotes } from '../GuardianNotes';
import { GuardianContactHistory } from '../GuardianContactHistory';
import { GuardianDocuments } from '../GuardianDocuments';
import { GuardianAccountManagement } from '../GuardianAccountManagement';
import { GuardianActivityHistory } from '../GuardianActivityHistory';
import {
    PageContainer,
    DetailHeader,
    HeaderTop,
    HeaderLeft,
    Breadcrumb,
    GuardianName,
    HeaderMeta,
    MetaItem,
    HeaderActions,
    QuickInfoBar,
    InfoSection,
    InfoLabel,
    InfoContent,
    ContentWrapper,
    MainContent,
    RightSidebar,
    SidebarContent,
    SidebarCard,
    CardTitle,
    StatItem,
    StatLabel,
    StatValue,
    TabsContainer,
    TabsHeader,
    Tab,
    TabContent,
} from './GuardianDetailView.styles';

interface GuardianDetailViewProps {
    id: string;
    onEdit: () => void;
    onBack: () => void;
}

type TabType = 'children' | 'notes' | 'contacts' | 'documents' | 'account' | 'activity';

export const GuardianDetailView: React.FC<GuardianDetailViewProps> = ({
                                                                          id,
                                                                          onEdit,
                                                                          onBack
                                                                      }) => {
    const [activeTab, setActiveTab] = useState<TabType>('children');
    const { data: guardian, isLoading } = useGuardianDetail(id);
    const deleteGuardian = useDeleteGuardian();

    const handleDelete = async () => {
        if (
            window.confirm(
                `Czy na pewno chcesz usunąć opiekuna ${guardian?.firstName} ${guardian?.lastName}?`
            )
        ) {
            await deleteGuardian.mutateAsync(id);
            onBack();
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('pl-PL', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatRelativeTime = (dateString: string) => {
        const now = new Date();
        const date = new Date(dateString);
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffDays === 0) return 'Dzisiaj';
        if (diffDays === 1) return 'Wczoraj';
        if (diffDays < 7) return `${diffDays} dni temu`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} tyg. temu`;
        return `${Math.floor(diffDays / 30)} mies. temu`;
    };

    if (isLoading || !guardian) {
        return (
            <PageContainer>
                <DetailHeader>
                    <HeaderTop>
                        <HeaderLeft>
                            <Breadcrumb onClick={onBack}>
                                <ArrowLeft size={16} />
                                Powrót do listy opiekunów
                            </Breadcrumb>
                            <GuardianName>Ładowanie...</GuardianName>
                        </HeaderLeft>
                    </HeaderTop>
                </DetailHeader>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <DetailHeader>
                <HeaderTop>
                    <HeaderLeft>
                        <Breadcrumb onClick={onBack}>
                            <ArrowLeft size={16} />
                            Powrót do listy opiekunów
                        </Breadcrumb>
                        <GuardianName>
                            {guardian.firstName} {guardian.lastName}
                        </GuardianName>
                        <HeaderMeta>
                            <MetaItem>
                                <User size={16} />
                                ID: {guardian.id}
                            </MetaItem>
                            <MetaItem>
                                <Phone size={16} />
                                {guardian.phone}
                            </MetaItem>
                            {guardian.email && (
                                <MetaItem>
                                    <Mail size={16} />
                                    {guardian.email}
                                </MetaItem>
                            )}
                            {guardian.accountInfo.hasAccount && (
                                <Badge variant={guardian.accountInfo.accountStatus === 'ACTIVE' ? 'success' : 'default'}>
                                    <Shield size={12} />
                                    Konto {guardian.accountInfo.accountStatus === 'ACTIVE' ? 'aktywne' : 'nieaktywne'}
                                </Badge>
                            )}
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
                            👨‍👩‍👧 Dzieci
                        </InfoLabel>
                        <InfoContent>
                            <strong>{guardian.stats.activeChildren}</strong> aktywnych z{' '}
                            <strong>{guardian.stats.totalChildren}</strong> ogółem
                        </InfoContent>
                    </InfoSection>

                    {guardian.accountInfo.hasAccount && (
                        <InfoSection>
                            <InfoLabel>
                                🔐 Ostatnie logowanie
                            </InfoLabel>
                            <InfoContent>
                                {guardian.accountInfo.lastLogin
                                    ? formatRelativeTime(guardian.accountInfo.lastLogin)
                                    : 'Nigdy'}
                                {guardian.accountInfo.loginCount7Days > 0 && (
                                    <span style={{ marginLeft: '0.5rem', color: '#64748b' }}>
                                        ({guardian.accountInfo.loginCount7Days} w ciągu 7 dni)
                                    </span>
                                )}
                            </InfoContent>
                        </InfoSection>
                    )}

                    <InfoSection>
                        <InfoLabel>
                            📞 Kontakty
                        </InfoLabel>
                        <InfoContent>
                            {guardian.stats.recentContacts} w ostatnim miesiącu
                        </InfoContent>
                    </InfoSection>

                    {guardian.address && (
                        <InfoSection>
                            <InfoLabel>
                                📍 Adres
                            </InfoLabel>
                            <InfoContent>
                                {guardian.address.street} {guardian.address.houseNumber}
                                {guardian.address.apartmentNumber && `/${guardian.address.apartmentNumber}`},{' '}
                                {guardian.address.postalCode} {guardian.address.city}
                            </InfoContent>
                        </InfoSection>
                    )}
                </QuickInfoBar>
            </DetailHeader>

            <ContentWrapper>
                <MainContent>
                    <TabsContainer>
                        <TabsHeader>
                            <Tab
                                $active={activeTab === 'children'}
                                onClick={() => setActiveTab('children')}
                            >
                                👨‍👩‍👧 Dzieci ({guardian.stats.totalChildren})
                            </Tab>
                            <Tab
                                $active={activeTab === 'contacts'}
                                onClick={() => setActiveTab('contacts')}
                            >
                                📞 Historia kontaktów
                            </Tab>
                            <Tab
                                $active={activeTab === 'notes'}
                                onClick={() => setActiveTab('notes')}
                            >
                                📝 Notatki
                            </Tab>
                            <Tab
                                $active={activeTab === 'documents'}
                                onClick={() => setActiveTab('documents')}
                            >
                                📁 Dokumenty
                            </Tab>
                            <Tab
                                $active={activeTab === 'account'}
                                onClick={() => setActiveTab('account')}
                            >
                                🔐 Konto
                            </Tab>
                            <Tab
                                $active={activeTab === 'activity'}
                                onClick={() => setActiveTab('activity')}
                            >
                                📊 Aktywność
                            </Tab>
                        </TabsHeader>

                        <TabContent>
                            {activeTab === 'children' && (
                                <GuardianChildren
                                    guardianId={id}
                                    guardianName={`${guardian.firstName} ${guardian.lastName}`}
                                    children={guardian.children}
                                />
                            )}
                            {activeTab === 'contacts' && (
                                <GuardianContactHistory guardianId={id} />
                            )}
                            {activeTab === 'notes' && (
                                <GuardianNotes guardianId={id} />
                            )}
                            {activeTab === 'documents' && (
                                <GuardianDocuments guardianId={id} />
                            )}
                            {activeTab === 'account' && (
                                <GuardianAccountManagement
                                    guardianId={id}
                                    accountInfo={guardian.accountInfo}
                                />
                            )}
                            {activeTab === 'activity' && (
                                <GuardianActivityHistory guardianId={id} />
                            )}
                        </TabContent>
                    </TabsContainer>
                </MainContent>

                <RightSidebar>
                    <SidebarContent>
                        <SidebarCard>
                            <CardTitle>Szybkie akcje</CardTitle>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <Button
                                    variant="primary"
                                    size="sm"
                                >
                                    <Phone size={14} />
                                    {guardian.phone}
                                </Button>
                                {guardian.email && (
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                    >
                                        <Mail size={14} />
                                        {guardian.email}
                                    </Button>
                                )}
                            </div>
                        </SidebarCard>

                        <SidebarCard>
                            <CardTitle>Informacje</CardTitle>
                            <StatItem>
                                <StatLabel>Utworzono</StatLabel>
                                <StatValue>{formatDate(guardian.createdAt)}</StatValue>
                            </StatItem>
                            <StatItem>
                                <StatLabel>Ostatnia aktualizacja</StatLabel>
                                <StatValue>{formatDate(guardian.updatedAt)}</StatValue>
                            </StatItem>
                            {guardian.accountInfo.hasAccount && guardian.accountInfo.accountCreatedAt && (
                                <StatItem>
                                    <StatLabel>Konto utworzono</StatLabel>
                                    <StatValue>
                                        {formatDate(guardian.accountInfo.accountCreatedAt)}
                                    </StatValue>
                                </StatItem>
                            )}
                        </SidebarCard>

                        {guardian.stats.upcomingRoutes > 0 && (
                            <SidebarCard>
                                <CardTitle>Nadchodzące przejazdy</CardTitle>
                                <StatItem>
                                    <StatLabel>Zaplanowane trasy</StatLabel>
                                    <StatValue>{guardian.stats.upcomingRoutes}</StatValue>
                                </StatItem>
                            </SidebarCard>
                        )}
                    </SidebarContent>
                </RightSidebar>
            </ContentWrapper>
        </PageContainer>
    );
};