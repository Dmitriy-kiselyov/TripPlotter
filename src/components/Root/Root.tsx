import React from 'react';

import { Map } from '../Map/Map';
import { Title } from '../Title/Title';
import { Hint } from '../Hint/Hint';
import { RootLayout } from '../RootLayout/RootLayout';
import { ToggleAssetsGroup } from '../ToggleAssetsGroup/ToggleAssetsGroup';
import { ICompany } from '../../types/index';

interface IState {
    asset: object | null;
}

export class Root extends React.PureComponent<{}, IState> {
    state: IState = {
        asset: null
    };

    render() {
        const left = <Map />;
        const right = (
            <>
                <Title text="Выберите дату"/>
                <Hint text="Мы подготовили для вас варианты:" />
                <ToggleAssetsGroup
                    items={[
                        {
                            text: 'Достопримечательности',
                            id: 'landmark'
                        },
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

    private handleAssetChanged = (asset: ICompany[]) => {
        console.log('ASSET', asset);

        this.setState({
            asset
        });
    }
}
