import React from 'react';

import { Map } from '../Map/Map';
import { Title } from '../Title/Title';
import { Hint } from '../Hint/Hint';
import { RootLayout } from '../RootLayout/RootLayout';
import { ToggleAssetsGroup } from '../ToggleAssetsGroup/ToggleAssetsGroup';
import { IOrganization } from '../../types/organization';
import { assetsNameMap } from '../../lib/assetsNameMap';
import { ArrayLayout } from '../ArrayLayout/ArrayLayout';
import { DatePicker } from '../DatePicker/DatePicker';
import { TimePicker } from '../TimePicker/TimePicker';
import { IAssetName } from '../../types/assets';
import { TripList } from '../TripList/TripList';

interface IState {
    category: IAssetName | null;
    organizations: IOrganization[] | null;
}

export class Root extends React.PureComponent<{}, IState> {
    state: IState = {
        category: null,
        organizations: null
    };

    render() {
        const { organizations, category } = this.state;

        const left = (
            <Map
                category={category ? category : undefined}
                organizations={organizations ? organizations : undefined}
                lockArea
            />
        );

        const right = (
            <>
                <Title text="Выберите дату"/>
                <ArrayLayout>
                    <DatePicker/>
                    <ArrayLayout>
                        <TimePicker
                            place="bottom"
                            placeholder="Начало"
                        />
                        <TimePicker
                            place="bottom"
                            placeholder="Конец"
                        />
                    </ArrayLayout>
                </ArrayLayout>
                <Hint text="Мы подготовили для вас варианты:" />
                <ToggleAssetsGroup
                    items={assetsNameMap}
                    onAssetChanged={this.handleAssetChanged}
                />
                // @ts-ignore
                <TripList
                    items={[
                        {
                            category: 'attraction',
                            organization: {
                                name: 'Парк развлечений',
                            },
                            time: '12:00',
                        },
                        {
                            category: 'museum',
                            organization: {
                                name: 'Музей всего на свете и того и того и сего и всего и чего',
                            },
                            time: '3:30',
                        }
                    ]}
                />
            </>
        );

        return (
            <RootLayout left={left} right={right} />
        );
    }

    private handleAssetChanged = (assetName: IAssetName, asset: IOrganization[] | null) => {
        this.setState({
            category: assetName,
            organizations: asset
        });
    }
}
