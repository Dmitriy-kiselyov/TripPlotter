import React from 'react';

import { cn } from '../../../lib/cn';
import { Text } from '../Text/Text';

import './ToggleButton.scss';

export type IToggleButtonChild = (set: boolean) => React.ReactElement;

interface IToggleButtonProps {
    id: string;
    children: string | IToggleButtonChild;
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
                {
                    typeof this.props.children === 'string' ?
                        this.renderText(this.props.children) :
                        // @ts-ignore
                        this.props.children(this.props.set)
                }
            </button>
        );
    }

    private renderText(text: string): React.ReactElement {
        return (
            <Text
                newLine
                oneLine
                color={this.props.set ? 'white' : 'black'}
            >
                {text}
            </Text>
        );
    }

    private handleClick = () => {
        this.props.onClick(this.props.id);
    }
}
