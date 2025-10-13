import React from 'react';
import styled from 'styled-components';
import { User, LogOut } from 'lucide-react';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useLogout } from '@/features/auth/hooks/useLogout';

const InfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  background: white;
  border-bottom: 1px solid ${({ theme }) => theme.colors.slate[200]};
  box-shadow: ${({ theme }) => theme.shadows.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  }
`;

const UserDetails = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: ${({ theme }) => theme.gradients.avatar};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 32px;
    height: 32px;
  }
`;

const UserText = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.span`
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.slate[900]};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 0.875rem;
  }
`;

const UserRole = styled.span`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.slate[600]};
`;

const LogoutButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: transparent;
  color: ${({ theme }) => theme.colors.slate[700]};
  border: 1px solid ${({ theme }) => theme.colors.slate[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.slate[50]};
    border-color: ${({ theme }) => theme.colors.slate[300]};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
    font-size: 0.8125rem;

    span {
      display: none;
    }
  }
`;

const roleLabels: Record<string, string> = {
    ADMIN: 'Administrator',
    OPERATOR: 'Operator',
    GUARDIAN: 'Opiekun',
    DRIVER: 'Kierowca',
};

export const UserInfo: React.FC = () => {
    const user = useAuthStore((state) => state.user);
    const logout = useLogout();

    if (!user) return null;

    return (
        <InfoContainer>
            <UserDetails>
                <Avatar>
                    <User size={20} />
                </Avatar>
                <UserText>
                    <UserName>
                        {user.firstName} {user.lastName}
                    </UserName>
                    <UserRole>{roleLabels[user.role] || user.role}</UserRole>
                </UserText>
            </UserDetails>
            <LogoutButton onClick={() => logout.mutate()}>
                <LogOut size={16} />
                <span>Wyloguj</span>
            </LogoutButton>
        </InfoContainer>
    );
};