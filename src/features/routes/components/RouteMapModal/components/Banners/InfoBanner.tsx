// src/features/routes/components/RouteMapModal/components/Banners/InfoBanner.tsx
import React from 'react';
import { Sparkles } from 'lucide-react';
import { InfoBanner as StyledInfoBanner } from './Banners.styles';

interface InfoBannerProps {
    newPointsCount: number;
}

export const InfoBanner: React.FC<InfoBannerProps> = ({ newPointsCount }) => {
    return (
        <StyledInfoBanner>
            <Sparkles size={16} />
            <div>
                <strong>Dodajesz {newPointsCount === 2 ? 'nowe dziecko' : `${newPointsCount} nowe punkty`}</strong>
                <br />
                Ustaw właściwą kolejność używając strzałek
            </div>
        </StyledInfoBanner>
    );
};