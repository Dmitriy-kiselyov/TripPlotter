import React from 'react';

import './Divider.scss';

interface IDividerProps {
    className?: string;
}

export const Divider: React.FC<IDividerProps> = props => (
    <div className={'Divider' + (props.className ? ' ' + props.className : '')} />
);
