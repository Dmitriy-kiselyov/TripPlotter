import React from 'react';

import { Text } from '../../Text/Text';
import { makeRequest, callbackId } from '../helpers/makeRequest';

import './SearchInput-Suggest.scss';

// @ts-ignore
window[callbackId] = (res) => {
    console.log('RES', res);
}

export const SearchInputSuggest: React.FC = () => {
    makeRequest('Блюхера');

    const data = [
        'Ялта',
        'Евпаторийское шоссе',
        'Оченб дитаотывраров апропва рофпаорфнпв sd asd asd as djhasdaks dgasdfasjdfasd'
    ];
    const content = data.map((value, i) => (
        <Text
            className="SearchInput-SuggestText"
            key={i}
            newLine
            oneLine
        >
            {value}
        </Text>
    ));

    return (
        <div className="SearchInput-Suggest">
            {content}
        </div>
    );
}
