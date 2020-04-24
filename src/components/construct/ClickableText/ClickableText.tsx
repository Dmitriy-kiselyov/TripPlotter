import React from 'react';

import { Text, ITextChild, ITextSize } from '../Text/Text';

import './ClickableText.scss';

interface IClickableText {
    children: ITextChild | ITextChild[];
    onClick?: () => void;
    set?: boolean;
    className?: string;
    newLine?: boolean;
    bold?: boolean;
    size?: ITextSize;
}

export const ClickableText: React.FC<IClickableText> = props => {
    return (
        <Text
            className={'ClickableText' + (props.className ? ' ' + props.className : '')}
            oneLine
            newLine={props.newLine}
            color={props.set ? 'primary' : 'black'}
            onClick={props.onClick}
            bold={props.bold}
            size={props.size}
        >
            {props.children}
        </Text>
    )
};
