import React from 'react';

import { ToggleAssertGroupText } from './Text/ToggleAssetsGroup-Text';

import { IToggleGroupItem, ToggleGroup } from '../construct/ToggleGroup/ToggleGroup';
import { loadAsset } from '../../lib/loadAsset'
import { IOrganization } from '../../types/organization';
import { IAssetName } from '../../types/assets';
import { assetsNameMap } from '../../lib/assetsNameMap';

export interface IToggleAssetsGroupProps {
    onAssetChanged: (assetName: IAssetName, asset: IOrganization[] | null) => void;
}

export class ToggleAssetsGroup extends React.PureComponent<IToggleAssetsGroupProps> {
    private items = this.prepareItems();

    render() {
        return (
            <ToggleGroup
                items={this.items}
                onSet={this.handleSet}
                onUnset={this.handleUnset}
                onChange={this.handleChange}
            />
        )
    }

    private prepareItems(): IToggleGroupItem[] {
        return assetsNameMap.map(({ text, id }) => ({
            id,
            text: (set: boolean) => (
                <ToggleAssertGroupText
                    id={id}
                    text={text}
                    set={set}
                />
            )
        }));
    }

    private handleSet = (id: IAssetName) => {
        loadAsset(id, asset => this.props.onAssetChanged(id, asset));
    };

    private handleUnset = (id: IAssetName) => {
        this.props.onAssetChanged(id, null);
    };

    private handleChange = (from: IAssetName, to: IAssetName) => {
        loadAsset(to, asset => this.props.onAssetChanged(to, asset));
    }
}
