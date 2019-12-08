import React from 'react';

import { Map } from '../Map/Map';
import { Title } from '../Title/Title';
import { Hint } from '../Hint/Hint';
import { RootLayout } from '../RootLayout/RootLayout';
import { ToggleAssetsGroup } from '../ToggleAssetsGroup/ToggleAssetsGroup';
import { IOrganization } from '../../types/organization';
import { assetsNameMap } from '../../lib/assetsNameMap';

interface IState {
    organizations: IOrganization[] | null;
}

export class Root extends React.PureComponent<{}, IState> {
    state: IState = {
        organizations: null
    };

    render() {
        const { organizations } = this.state;

        const left = (
            <Map
                organizations={organizations ? organizations : undefined}
            />
        );

        const right = (
            <>
                <Title text="Выберите дату"/>
                <Hint text="Мы подготовили для вас варианты:" />
                <ToggleAssetsGroup
                    items={assetsNameMap}
                    onAssetChanged={this.handleAssetChanged}
                />
            </>
        );

        return (
            <RootLayout left={left} right={right} />
        );
    }

    private handleAssetChanged = (asset: IOrganization[] | null) => {
        this.setState({
            organizations: asset
        });
    }
}
