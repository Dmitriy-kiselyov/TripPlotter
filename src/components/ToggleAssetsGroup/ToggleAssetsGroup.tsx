import React from 'react';

import { IToggleGroupItem, ToggleGroup } from '../ToggleGroup/ToggleGroup';
import { loadAsset } from '../../lib/loadAsset'
import { IOrganization } from '../../types/organization';

export interface IToggleAssetsGroupProps {
    items: IToggleGroupItem[];
    onAssetChanged: (asset: IOrganization[] | null) => void;
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

    private handleSet = (id: string) => {
        loadAsset(id, this.props.onAssetChanged);
    };

    private handleUnset = () => {
        this.props.onAssetChanged(null);
    };

    private handleChange = (from: string, to: string) => {
        loadAsset(to, this.props.onAssetChanged);
    }
}
