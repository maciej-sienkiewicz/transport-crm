// /routes/components/RouteDetail/RouteDetailHeader/RouteDetailHeader.tsx

import React from 'react';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import {
    Calendar,
    User,
    Truck,
    Clock,
    Edit,
    CheckCircle,
    XCircle,
} from 'lucide-react';
import {
    RouteHeaderContainer,
    RouteTitleRow,
    RouteTitle,
    SimplifiedMetaGrid,
    MetaItem,
    MetaLabel,
    MetaLinkButton,
    ActionButtons,
    LeftColumn,
} from './RouteDetailHeader.styles';
import { statusVariants, statusLabels } from '../../hooks/useRouteDetailLogic';
import {RouteDetail} from "@/features/routes/types.ts";

interface RouteDetailHeaderProps {
    route: RouteDetail
    isEditMode: boolean;
    onEditToggle: () => void;
    onSave: () => void;
    onCancel: () => void;
    onDriverClick: () => void;
    onVehicleClick: () => void;
}

export const RouteDetailHeader: React.FC<RouteDetailHeaderProps> = ({
                                                                        route,
                                                                        isEditMode,
                                                                        onEditToggle,
                                                                        onSave,
                                                                        onCancel,
                                                                        onDriverClick,
                                                                        onVehicleClick,
                                                                    }) => {
    return (
        <LeftColumn>
            <RouteHeaderContainer>
                <RouteTitleRow>
                    <RouteTitle>{route.routeName}</RouteTitle>
                    <Badge variant={statusVariants[route.status]}>
                        {statusLabels[route.status]}
                    </Badge>
                </RouteTitleRow>
                <SimplifiedMetaGrid>
                    <MetaItem>
                        <Calendar size={18} />
                        <div>
                            <MetaLabel>Data:</MetaLabel>{' '}
                            {new Date(route.date).toLocaleDateString('pl-PL', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                            })}
                        </div>
                    </MetaItem>
                    <MetaItem>
                        <User size={18} />
                        <div>
                            <MetaLabel>Kierowca:</MetaLabel>{' '}
                            <MetaLinkButton onClick={onDriverClick}>
                                {route.driver.firstName} {route.driver.lastName}
                            </MetaLinkButton>
                        </div>
                    </MetaItem>
                    <MetaItem>
                        <Truck size={18} />
                        <div>
                            <MetaLabel>Pojazd:</MetaLabel>{' '}
                            <MetaLinkButton onClick={onVehicleClick}>
                                {route.vehicle.registrationNumber} ({route.vehicle.make}{' '}
                                {route.vehicle.model})
                            </MetaLinkButton>
                        </div>
                    </MetaItem>
                    <MetaItem>
                        <Clock size={18} />
                        <div>
                            <MetaLabel>Plan:</MetaLabel> {route.estimatedStartTime} -{' '}
                            {route.estimatedEndTime}
                        </div>
                    </MetaItem>
                </SimplifiedMetaGrid>
            </RouteHeaderContainer>

            <ActionButtons>
                {route.status === 'PLANNED' && !isEditMode && (
                    <Button variant="secondary" size="md" onClick={onEditToggle}>
                        <Edit size={18} />
                        Edytuj kolejność
                    </Button>
                )}
                {route.status === 'PLANNED' && isEditMode && (
                    <>
                        <Button variant="primary" size="md" onClick={onSave}>
                            <CheckCircle size={18} />
                            Zapisz
                        </Button>
                        <Button variant="secondary" size="md" onClick={onCancel}>
                            <XCircle size={18} />
                            Anuluj
                        </Button>
                    </>
                )}
            </ActionButtons>
        </LeftColumn>
    );
};