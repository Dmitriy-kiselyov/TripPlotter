import React from 'react';

import './Title.scss';

interface ITitleProps {
    text: string;
    className?: string;
}

export function Title(props: ITitleProps) {
    return <div className={'Title' + (props.className ? ' ' + props.className : '')}>{props.text}</div>
}
