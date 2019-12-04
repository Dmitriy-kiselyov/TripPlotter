import React from 'react';

import { Map } from '../Map/Map';
import { Title } from '../Title/Title';
import { Hint } from '../Hint/Hint';
import { RootLayout } from '../RootLayout/RootLayout';
import { ToggleAssetsGroup } from '../ToggleAssetsGroup/ToggleAssetsGroup';
import { IOrganization } from '../../types/organization';
import { getMapCoords } from '../../lib/getMapCoords';

interface IState {
    asset: IOrganization[] | null;
}

export class Root extends React.PureComponent<{}, IState> {
    state: IState = {
        asset: null
    };

    render() {
        const { asset } = this.state;

        const left = (
            <Map
                coords={asset ? getMapCoords(asset) : undefined}
            />
        );

        const right = (
            <>
                <Title text="Выберите дату"/>
                <Hint text="Мы подготовили для вас варианты:" />
                <ToggleAssetsGroup
                    items={[
                        {
                            text: 'Музеи',
                            id: 'museum'
                        },
                        {
                            text: 'Парки',
                            id: 'park'
                        },
                        {
                            text: 'Парки2',
                            id: 'park2'
                        }
                    ]}
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
            asset
        });
    }
}
