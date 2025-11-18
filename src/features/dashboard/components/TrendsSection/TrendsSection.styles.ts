import styled from 'styled-components';

export const SectionContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.lg};
`;

export const KPIGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: ${({ theme }) => theme.spacing.lg};

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        grid-template-columns: 1fr;
    }
`;

export const ViewAllContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-top: ${({ theme }) => theme.spacing.md};
`;