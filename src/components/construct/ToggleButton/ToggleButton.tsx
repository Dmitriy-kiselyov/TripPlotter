import React from 'react';

import { cn } from '../../../lib/cn';
import { Text } from '../Text/Text';

import './ToggleButton.scss';

interface IToggleButtonProps {
    id: string;
    text: string;
    set: boolean;
    onClick: (id: string) => void;
}

export class ToggleButton extends React.PureComponent<IToggleButtonProps> {
    render() {
        return (
            <button
                className={cn('ToggleButton', { set: this.props.set })}
                onClick={this.handleClick}
            >
                <Text
                    newLine
                    oneLine
                    color={this.props.set ? 'white' : 'black'}
                >
                    {this.props.text}
                </Text>
            </button>
        );
    }

    private handleClick = () => {
        this.props.onClick(this.props.id);
    }
}
