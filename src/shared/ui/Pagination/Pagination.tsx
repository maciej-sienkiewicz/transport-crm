import React from 'react';
import styled from 'styled-components';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.lg} 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-wrap: wrap;
  }
`;

const PaginationButton = styled.button<{ $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
  padding: 0 ${({ theme }) => theme.spacing.sm};
  background: ${({ $active, theme }) =>
    $active ? theme.gradients.primaryButton : 'white'};
  color: ${({ $active, theme }) =>
    $active ? 'white' : theme.colors.slate[700]};
  border: 1px solid
    ${({ $active, theme }) =>
    $active ? 'transparent' : theme.colors.slate[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  box-shadow: ${({ $active, theme }) =>
    $active ? theme.shadows.primaryGlow : theme.shadows.sm};

  &:hover:not(:disabled) {
    background: ${({ $active, theme }) =>
    $active ? theme.gradients.primaryButton : theme.colors.slate[50]};
    border-color: ${({ theme }) => theme.colors.primary[300]};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    min-width: 32px;
    height: 32px;
    font-size: 0.8125rem;
  }
`;

const PageInfo = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.slate[600]};
  padding: 0 ${({ theme }) => theme.spacing.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 0.8125rem;
  }
`;

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
                                                          currentPage,
                                                          totalPages,
                                                          onPageChange,
                                                      }) => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 0; i < totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage < 3) {
                for (let i = 0; i < 4; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages - 1);
            } else if (currentPage > totalPages - 4) {
                pages.push(0);
                pages.push('...');
                for (let i = totalPages - 4; i < totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(0);
                pages.push('...');
                pages.push(currentPage - 1);
                pages.push(currentPage);
                pages.push(currentPage + 1);
                pages.push('...');
                pages.push(totalPages - 1);
            }
        }

        return pages;
    };

    return (
        <PaginationContainer>
            <PaginationButton
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 0}
                aria-label="Poprzednia strona"
            >
                <ChevronLeft size={16} />
            </PaginationButton>

            {getPageNumbers().map((page, index) => {
                if (page === '...') {
                    return (
                        <PageInfo key={`ellipsis-${index}`}>...</PageInfo>
                    );
                }

                return (
                    <PaginationButton
                        key={page}
                        $active={page === currentPage}
                        onClick={() => onPageChange(page as number)}
                        aria-label={`Strona ${(page as number) + 1}`}
                        aria-current={page === currentPage ? 'page' : undefined}
                    >
                        {(page as number) + 1}
                    </PaginationButton>
                );
            })}

            <PaginationButton
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                aria-label="Następna strona"
            >
                <ChevronRight size={16} />
            </PaginationButton>
        </PaginationContainer>
    );
};