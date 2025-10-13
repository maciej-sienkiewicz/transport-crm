import React from 'react';
import {
    StyledCard,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from './Card.styles';

interface CardProps {
    variant?: 'default' | 'glass' | 'gradient';
    hoverable?: boolean;
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

interface CardSubComponents {
    Header: typeof CardHeader;
    Title: typeof CardTitle;
    Content: typeof CardContent;
    Footer: typeof CardFooter;
}

export const Card: React.FC<CardProps> & CardSubComponents = ({
                                                                  variant = 'default',
                                                                  hoverable = false,
                                                                  children,
                                                                  className,
                                                                  onClick,
                                                              }) => {
    return (
        <StyledCard
            $variant={variant}
            $hoverable={hoverable}
            className={className}
            onClick={onClick}
        >
            {children}
        </StyledCard>
    );
};

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Content = CardContent;
Card.Footer = CardFooter;