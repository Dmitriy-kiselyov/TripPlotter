import React from 'react';
import { Text } from '../Text/Text';

import './ClickableText.scss';

interface IClickableText {
    children: string;
    onClick?: () => void;
    set?: boolean;
}

export const ClickableText: React.FC<IClickableText> = props => {
    return (
        <Text
            className="ClickableText"
            oneLine
            color={props.set ? 'primary' : 'black'}
            onClick={props.onClick}
        >
            {props.children}
        </Text>
    )
};
