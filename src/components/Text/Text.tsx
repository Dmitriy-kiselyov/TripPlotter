import React from 'react';

import './Text.scss';

export interface ITextProps {
    className?: string;
    children: string;
}

export const Text: React.FC<ITextProps> = props => (
    <span className={'Text' + (props.className ? ' ' + props.className : '')}>
        {props.children}
    </span>
);
