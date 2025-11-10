// src/features/routes/components/StopContextMenu/StopContextMenu.tsx

import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Trash2, Edit3 } from 'lucide-react';

const ContextMenuContainer = styled.div<{ $x: number; $y: number }>`
  position: fixed;
  left: ${({ $x }) => $x}px;
  top: ${({ $y }) => $y}px;
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.slate[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  min-width: 200px;
  z-index: 1100;
  animation: slideIn 0.15s cubic-bezier(0.4, 0, 0.2, 1);

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(-5px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
`;

const ContextMenuItem = styled.button<{ $danger?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border: none;
  background: transparent;
  text-align: left;
  font-size: 0.9375rem;
  font-weight: 500;
  color: ${({ theme, $danger }) =>
    $danger ? theme.colors.danger[700] : theme.colors.slate[700]};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:first-child {
    border-radius: ${({ theme }) => theme.borderRadius.lg}
      ${({ theme }) => theme.borderRadius.lg} 0 0;
  }

  &:last-child {
    border-radius: 0 0 ${({ theme }) => theme.borderRadius.lg}
      ${({ theme }) => theme.borderRadius.lg};
  }

  &:hover {
    background: ${({ theme, $danger }) =>
    $danger ? theme.colors.danger[50] : theme.colors.slate[50]};
    color: ${({ theme, $danger }) =>
    $danger ? theme.colors.danger[800] : theme.colors.slate[900]};
  }

  &:active {
    background: ${({ theme, $danger }) =>
    $danger ? theme.colors.danger[100] : theme.colors.slate[100]};
  }

  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.slate[100]};
  }
`;

interface StopContextMenuProps {
    x: number;
    y: number;
    onEdit: () => void;
    onDelete: () => void;
    onClose: () => void;
}

export const StopContextMenu: React.FC<StopContextMenuProps> = ({
                                                                    x,
                                                                    y,
                                                                    onEdit,
                                                                    onDelete,
                                                                    onClose,
                                                                }) => {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [onClose]);

    return (
        <ContextMenuContainer ref={menuRef} $x={x} $y={y}>
            <ContextMenuItem onClick={onEdit}>
                <Edit3 size={16} />
                Zmień adres punktu
            </ContextMenuItem>
            <ContextMenuItem $danger onClick={onDelete}>
                <Trash2 size={16} />
                Usuń z trasy
            </ContextMenuItem>
        </ContextMenuContainer>
    );
};