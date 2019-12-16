import React from 'react';

import { cn } from '../../lib/cn';

import './Text.scss';

export interface ITextProps {
    className?: string;
    children: string;
    color?: 'black' | 'grey' | 'white' | 'red';
    newLine?: boolean;
    center?: boolean;
    oneLine?: boolean;
}

export const Text: React.FC<ITextProps> = props => {
    const mods = {
        color: props.color || 'black',
        newLine: props.newLine || false,
        center: props.center || false,
        oneLine: props.oneLine || false,
    };

    return (
        <span className={cn('Text', mods, props.className)}>
            {props.children}
        </span>
    );
};
