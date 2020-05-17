import React from 'react';

import { Input } from '../Input/Input';
import { generateId } from '../../../lib/generateId';
import { loadMap } from '../../../lib/loadMap';
import { maxCoords, minCoords } from '../../../lib/mapCoords';

export interface ISearchInputProps {
    className?: string;
    placeholder?: string;
    value?: string;
    onSelected?: (value: string) => void;
    validationError?: boolean;
    disabled?: boolean;
}

declare const ymaps: any;

interface IState {
    value: string;
}

export class SearchInput extends React.PureComponent<ISearchInputProps, IState> {
    state = {
        value: this.props.value || ''
    }

    private id = generateId('search');
    private suggest: any;

    componentDidMount() {
        loadMap(() => {
            this.suggest = new ymaps.SuggestView(this.id, {
                offset: [-1, 5, -1, 0],
                results: 10,
                boundedBy: [minCoords, maxCoords],
                strictBounds: true
            });

            this.suggest.events.add('select', (item: any) => {
                const address = item.get('item').value;

                if (this.props.onSelected) {
                    this.props.onSelected(address);
                }
            })
        });
    }

    componentDidUpdate(prevProps: ISearchInputProps, prevState: IState) {
        if (this.props.value !== prevProps.value && this.props.value !== this.state.value) {
            this.setState({
                value: this.props.value
            });
        }
    }

    componentWillUnmount() {
        if (this.suggest) {
            this.suggest.destroy();
        }
    }

    render() {
        return (
            <Input
                id={this.id}
                className={this.props.className}
                placeholder={this.props.placeholder}
                value={this.state.value}
                onChange={value => this.setState({ value })}
                validationError={this.props.validationError}
                disabled={this.props.disabled}
            />
        );
    }
}
