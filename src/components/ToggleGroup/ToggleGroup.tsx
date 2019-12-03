import React from 'react';

import { ArrayLayout } from '../ArrayLayout/ArrayLayout';
import { ToggleButton } from '../ToggleButton/ToggleButton';

export interface IToggleGroupItem {
    id: string;
    text: string;
}

export interface IToggleGroupProps {
    items: IToggleGroupItem[];

    onSet?: (id: string) => void;
    onUnset?: (id: string) => void;
    onChange?: (from: string, to: string) => void;
}

interface IState {
    set: string | null; // id of set
}

export class ToggleGroup extends React.PureComponent<IToggleGroupProps, IState> {
    state: IState = {
        set: null
    };

    render() {
        const children = this.props.items.map(item => (
            <ToggleButton
                key={item.id}
                id={item.id}
                text={item.text}
                set={this.state.set === item.id}
                onClick={this.handleClick}
            />
        ));

        return (
            <ArrayLayout>
                {children}
            </ArrayLayout>
        );
    }

    private handleClick = (id: string) => {
        if (this.state.set === id) {
            this.handleUnset();
        } else {
            this.handleSet(id);
        }
    };

    private handleUnset = () => {
        const id = this.state.set;

        this.setState({
            set: null
        });

        this.props.onUnset && this.props.onUnset(id);
    };

    private handleSet = (id: string) => {
        const prevId = this.state.set;

        this.setState({
            set: id
        });

        if (prevId === null) {
            this.props.onSet && this.props.onSet(id);
        } else {
            this.props.onChange && this.props.onChange(prevId, id);
        }
    }
}
