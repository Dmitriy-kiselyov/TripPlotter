import React from 'react';

import { Text } from '../Text/Text';
import { cn } from '../../../lib/cn';

import './Checkbox.scss';

export interface ICheckboxProps {
    className?: string;
    checked: boolean;
    text: string;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
}

export const Checkbox: React.FC<ICheckboxProps> = props => (
    <Text
        className={cn('Checkbox', { checked: props.checked, disabled: props.disabled }, props.className)}
        oneLine
        onClick={() => props.onChange(!props.checked)}
    >
        <span className="Checkbox-Check"/>
        {props.text}
    </Text>
);
