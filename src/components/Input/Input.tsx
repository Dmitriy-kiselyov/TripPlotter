import React from 'react';

import { cn } from '../../lib/cn';

import './Input.scss';

export interface IInputProps {
    id?: string;
    className?: string;
    placeholder?: string;
    readonly?: boolean;
    textCenter?: boolean;
}

export const Input: React.FC<IInputProps> = props => {
    const mods = {
        readonly: props.readonly,
        center: props.textCenter
    };

    return (
        <input
            className={cn('Input', mods) + (props.className ? ' ' + props.className : '')}
            type="text"
            readOnly={props.readonly}
            id={props.id}
            placeholder={props.placeholder}
        />
    );
};
