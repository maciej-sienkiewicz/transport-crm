import React from 'react';
import { Button } from '@/shared/ui/Button';
import { ReadinessCheck } from '../../types';
import { CHECK_TYPE_CONFIG } from '../../lib/checkConfig';
import {
    CheckItemContainer,
    StatusDot,
    CheckContent,
    CheckHeader,
    CheckMessage,
    CheckCount,
    CheckAction
} from './ReadinessSection.styles';

interface CheckItemProps {
    check: ReadinessCheck;
}

export const CheckItem: React.FC<CheckItemProps> = ({ check }) => {
    const config = CHECK_TYPE_CONFIG[check.type];
    const message = config.getMessage(check);
    const countDisplay = config.getCountDisplay(check);
    const action = config.getAction(check.status);

    const handleAction = () => {
        if (action) {
            window.history.pushState({}, '', action.route);
            window.dispatchEvent(new PopStateEvent('popstate'));
        }
    };

    return (
        <CheckItemContainer $status={check.status}>
            <StatusDot $status={check.status} />
            <CheckContent>
                <CheckHeader>
                    <CheckMessage>{message}</CheckMessage>
                    {countDisplay && (
                        <CheckCount $status={check.status}>
                            {countDisplay}
                        </CheckCount>
                    )}
                </CheckHeader>
                {action && (
                    <CheckAction>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleAction}
                        >
                            {action.label} →
                        </Button>
                    </CheckAction>
                )}
            </CheckContent>
        </CheckItemContainer>
    );
};