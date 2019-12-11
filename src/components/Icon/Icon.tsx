import React from 'react';

import { cn } from '../../lib/cn';

import './Icon.scss';

export type IIconType = 'call' | 'clock' | 'site' | 'map';

export interface IIconProps {
    type: IIconType;
    size: number;
}

export const Icon: React.FC<IIconProps> = props => (
    <span
        className={cn('Icon', { type: props.type })}
        style={{ width: `${props.size}px`, height: `${props.size}px`}}
    />
);
