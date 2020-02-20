import React from 'react';
import { useSelector } from 'react-redux';

import { Text } from '../../construct/Text/Text';
import { IAssetNameMap } from '../../../types/assets';
import { IStore } from '../../../types/store';

interface IToggleAssetsGroupTextProps extends IAssetNameMap {
    set: boolean;
}

export const ToggleAssertGroupText: React.FC<IToggleAssetsGroupTextProps> = props => {
    const tripList = useSelector((store: IStore) => store.tripList);

    const count = tripList.reduce((count, item) => count += item.category === props.id ? 1 : 0, 0);
    let countText = null;

    if (count) {
        countText = (
            <Text
                oneLine
                color={props.set ? 'white' : 'primary'}
            >
                {` (${count})`}
            </Text>
        )
    }

    return (
        <>
            <Text
                oneLine
                color={props.set ? 'white' : 'black'}
            >
                {props.text}
            </Text>
            {countText}
        </>
    );
};
