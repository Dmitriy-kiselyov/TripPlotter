import React from 'react';

import { IToggleGroupItem, ToggleGroup } from '../ToggleGroup/ToggleGroup';
import { loadAsset } from '../../lib/loadAsset'
import { ICompany } from '../../types/index';

export interface IToggleAssetsGroupProps {
    items: IToggleGroupItem[];
    onAssetChanged: (asset: ICompany[]) => void;
}

export class ToggleAssetsGroup extends React.PureComponent<IToggleAssetsGroupProps> {
    render() {
        return (
            <ToggleGroup
                items={this.props.items}
                onSet={this.handleSet}
                onChange={this.handleChange}
            />
        )
    }

    private handleSet = (id: string) => {
        loadAsset(id, this.props.onAssetChanged);
    };

    private handleChange = (from: string, to: string) => {
        loadAsset(to, this.props.onAssetChanged);
    }
}
