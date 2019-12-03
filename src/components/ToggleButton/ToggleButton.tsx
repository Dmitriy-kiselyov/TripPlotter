import React from 'react';

import { cn } from '../../lib/cn';

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
                <span className="ToggleButton-Text">{this.props.text}</span>
            </button>
        );
    }

    private handleClick = () => {
        this.props.onClick(this.props.id);
    }
}
