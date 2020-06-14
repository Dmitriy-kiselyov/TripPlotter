import React from 'react';

import { cn } from '../../../lib/cn';

import './Icon.scss';

export type IIconType = 'call' | 'clock' | 'site' | 'map' | 'cross' | 'star' | 'ratingStar' | 'ratingHalfStar' | 'ratingEmptyStar';

export interface IIconProps {
    type: IIconType;
    size: number;
    onClick?: () => void;
}

export const Icon: React.FC<IIconProps> = props => (
    <span
        className={cn('Icon', { type: props.type, clickable: Boolean(props.onClick) })}
        style={{ width: `${props.size}px`, height: `${props.size}px`}}
        onClick={props.onClick}
    />
);
