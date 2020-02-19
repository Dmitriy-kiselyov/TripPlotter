import React, { ChangeEvent } from 'react';

import { cn } from '../../../lib/cn';

import './Input.scss';

export interface IInputProps {
    id?: string;
    className?: string;
    placeholder?: string;
    readonly?: boolean;
    textCenter?: boolean;
    value?: string;
    onChange?: (value: string) => void;
    validationError?: boolean;
    disabled?: boolean;
}

export const Input: React.FC<IInputProps> = props => {
    const mods = {
        readonly: props.readonly,
        center: props.textCenter,
        error: props.validationError,
        disabled: props.disabled
    };

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (props.onChange) {
            props.onChange(event.target.value);
        }
    };

    return (
        <input
            className={cn('Input', mods, props.className)}
            type="text"
            value={props.value || ''}
            readOnly={props.readonly}
            onChange={onChange}
            id={props.id}
            placeholder={props.placeholder}
        />
    );
};
