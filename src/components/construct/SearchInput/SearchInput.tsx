import React from 'react';

import { Input } from '../Input/Input';
import { loadMap } from '../../../lib/loadMap';
import { SearchInputSuggest } from './Suggest/SearchInput-Suggest';

import './SearchInput.scss';

export interface ISearchInputProps {
    className?: string;
    placeholder?: string;
    value?: string;
    onSelected?: (value: string) => void;
    validationError?: boolean;
    disabled?: boolean;
}

interface IState {
    value: string;
    suggest?: boolean;
}

export class SearchInput extends React.PureComponent<ISearchInputProps, IState> {
    state: IState = {
        value: this.props.value || ''
    }

    componentDidMount() {
        loadMap(() => {
            this.setState({
                suggest: true
            });
        });
    }

    private handleSelect(address: string): void {
        if (this.props.onSelected) {
            this.props.onSelected(address);
        }
    }

    componentDidUpdate(prevProps: ISearchInputProps, prevState: IState) {
        if (this.props.value !== prevProps.value && this.props.value !== this.state.value) {
            this.setState({
                value: this.props.value
            });
        }
    }

    render() {
        return (
            <div className="SearchInput">
                <Input
                    className={this.props.className}
                    placeholder={this.props.placeholder}
                    value={this.state.value}
                    onChange={value => this.setState({ value })}
                    validationError={this.props.validationError}
                    disabled={this.props.disabled}
                />
                { this.state.suggest && <SearchInputSuggest /> }
            </div>
        );
    }
}
