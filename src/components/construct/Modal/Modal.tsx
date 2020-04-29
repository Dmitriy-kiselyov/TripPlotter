import React from 'react';

import { cn } from '../../../lib/cn';

import './Modal.scss';

export interface IModal {
    className?: string;
    children?: React.ReactElement;
    visible?: boolean;
}

export const Modal: React.FC<IModal> = props => {
    return (
        <div className={cn('Modal', { visible: props.visible }, props.className)}>
            {props.children}
        </div>
    );
}
