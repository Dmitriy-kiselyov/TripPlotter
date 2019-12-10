import React from 'react';

import { IToggleGroupItem, ToggleGroup } from '../ToggleGroup/ToggleGroup';
import { loadAsset } from '../../lib/loadAsset'
import { IOrganization } from '../../types/organization';
import { IAssetName } from '../../types/assets';

export interface IToggleAssetsGroupProps {
    items: IToggleGroupItem[];
    onAssetChanged: (assetName: IAssetName, asset: IOrganization[] | null) => void;
}

export class ToggleAssetsGroup extends React.PureComponent<IToggleAssetsGroupProps> {
    render() {
        return (
            <ToggleGroup
                items={this.props.items}
                onSet={this.handleSet}
                onUnset={this.handleUnset}
                onChange={this.handleChange}
            />
        )
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
