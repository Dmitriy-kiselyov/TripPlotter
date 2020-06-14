import React from 'react';

import { cn } from '../../../lib/cn';

import './Text.scss';

export type ITextChild = string | number | React.ReactElement;
export type ITextSize = 'm' | 'l' | 'xl';

export interface ITextProps {
    className?: string;
    children: ITextChild | ITextChild[];
    color?: 'black' | 'grey' | 'white' | 'red' | 'primary';
    bold?: boolean;
    newLine?: boolean;
    center?: boolean;
    oneLine?: boolean;
    onClick?: () => void;
    size?: ITextSize;
}

export const Text: React.FC<ITextProps> = props => {
    const mods = {
        color: props.color || 'black',
        newLine: props.newLine || false,
        center: props.center || false,
        oneLine: props.oneLine || false,
        bold: props.bold || false,
        size: props.size || 'm'
    };

    return (
        <span
            className={cn('Text', mods, props.className)}
            onClick={props.onClick}
        >
            {props.children}
        </span>
    );
};
