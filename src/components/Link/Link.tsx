import React from 'react';

import './Link.scss';

export interface ILinkProps {
    url: string;
    text: string;
}

export const Link: React.FC<ILinkProps> = props => (
    <a
        className="Link"
        href={props.url}
        target="_blank"
    >
        {props.text}
    </a>
);
