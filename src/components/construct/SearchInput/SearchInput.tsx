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
    focus?: boolean;
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
                    onBlur={this.handleBlur}
                    onFocus={this.handleFocus}
                />
                {
                    this.state.suggest && (
                        <SearchInputSuggest
                            value={this.state.value}
                            onSelected={this.handleSelected}
                            focus={this.state.focus}
                        />
                    )
                }
            </div>
        );
    }

    private handleBlur = () => {
        this.setState({
            focus: false
        });
    }

    private handleFocus = () => {
        this.setState({
            focus: true
        });
    }

    private handleSelected = (address: string) => {
        if (address === this.props.value) {
            return this.setState({
                value: address
            });
        }

        if (this.props.onSelected) {
            return this.props.onSelected(address);
        }
    }
}
