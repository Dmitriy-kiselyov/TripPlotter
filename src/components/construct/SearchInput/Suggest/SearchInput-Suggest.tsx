import React from 'react';

import { ITextChild, Text } from '../../Text/Text';
import { makeRequest, callbackId } from '../helpers/makeRequest';
import { getStyledText } from '../helpers/getStyledText';

import './SearchInput-Suggest.scss';

export interface ISearchInputSuggestProps {
    value: string;
    onSelected?: (address: string) => void;
    focus?: boolean;
}

interface IState {
    addresses: IAddress[];
    selected?: string;
}

interface IAddress {
    value: string;
    style: Array<[number, number]>;
}

// @ts-ignore
window[callbackId] = (res: any) => {
    const addresses: IAddress[] = res[1].map((item: any) => ({
        value: item[1],
        style: item[3].hl
    }));

    // @ts-ignore
    window.update_suggest(addresses);
}

/*
 * Я знаю, что он один на странице
 */
export class SearchInputSuggest extends React.PureComponent<ISearchInputSuggestProps, IState> {
    state: IState = {
        addresses: [],
    }

    componentDidMount() {
        // @ts-ignore
        window.update_suggest = (addresses: string) => this.setState({ addresses });
    }

    componentWillUnmount() {
        // @ts-ignore
        window.update_suggest = () => {}
    }

    componentDidUpdate(prevProps: ISearchInputSuggestProps) {
        if (prevProps.value !== this.props.value && this.props.value && this.props.value !== this.state.selected && this.props.focus) {
            makeRequest(this.props.value);
        }
        if (prevProps.value && !this.props.value) {
            this.setState({
                addresses: []
            })
        }
    }

    render() {
        if (this.state.addresses.length === 0) {
            return null;
        }

        const content = this.state.addresses.map((address, i) => (
            <Text
                className="SearchInput-SuggestText"
                key={i}
                newLine
                oneLine
                onClick={() => this.handleSuggestClick(address.value)}
            >
                {this.renderTextContent(address)}
            </Text>
        ));

        return (
            <div className="SearchInput-Suggest">
                {content}
            </div>
        );
    }

    private handleSuggestClick(address: string) {
        if (this.props.onSelected) {
            this.props.onSelected(address);
        }

        this.setState({
            addresses: [],
            selected: address
        });
    }

    private renderTextContent(address: IAddress): ITextChild[] {
        const { value, style } = address;
        const styledText = getStyledText(value, style);

        return styledText.map(({ value, bold }, i) =>
            bold ? <Text key={`${value}_${i}`} bold>{value}</Text> : value
        );
    }
}
