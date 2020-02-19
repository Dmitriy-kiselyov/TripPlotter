import React from 'react';

import './Hint.scss';

interface IHintProps {
    text: string;
}

export const Hint: React.FC<IHintProps> = function Hint(props) {
    return <div className="Hint">{props.text}</div>;
};
