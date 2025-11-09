// /routes/components/RouteDetail/RouteMapTile/RouteMapTile.styles.ts

import styled from 'styled-components';

export const MapTileContainer = styled.div`
    height: 450px; /* Stała wysokość dla "kafelka" */
    border-radius: ${({ theme }) => theme.borderRadius.xl};
    overflow: hidden;
    border: 1px solid ${({ theme }) => theme.colors.slate[200]};
    flex-shrink: 0; /* Zapobiega kurczeniu się na siatce */
    
    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        height: 400px; /* Mniejsza wysokość na tabletach/mobilnych */
    }
`;