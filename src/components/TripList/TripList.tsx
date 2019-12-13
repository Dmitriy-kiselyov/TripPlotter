import React from 'react';

import { IOrganization } from '../../types/organization';
import { IAssetName } from '../../types/assets';
import { Title } from '../Title/Title';
import { Text } from '../Text/Text';
import { Icon } from '../Icon/Icon';
import { TimePicker } from '../TimePicker/TimePicker';
import { getAssetName } from '../../lib/assetsNameMap';

import './TripList.scss';

export interface ITripListProps {
    items: ITripListItemProps[];
}

export interface ITripListItemProps {
    category: IAssetName;
    organization: IOrganization;
    time: string;
}

export class TripList extends React.PureComponent<ITripListProps> {
    render() {
        return (
            <div className="TripList">
                <Title text="Список мест"/>
                {
                    this.props.items.length === 0 ?
                        <Text color="grey" newLine center>Вы не выбрали места</Text> :
                        <>
                            {this.renderStats()}
                            {this.props.items.map(item => this.renderItem(item.category, item.organization, item.time))}
                        </>
                }
            </div>
        )
    }

    private renderStats(): React.ReactElement {
        return <Text className="TripList-Stats" newLine center color="grey">Выбрано 2 места на 15 часов 30 минут посещения</Text>;
    }

    private renderItem(category: IAssetName, organization: IOrganization, time: string) {
        return (
            <div className="TripList-Item">
                <Icon type="cross" size={12} onClick={() => {}}/>
                <Text oneLine>{organization.name}</Text>
                <Text className="TripList-Category" color="grey">{getAssetName(category)}</Text>
                <TimePicker value={time} place="left"/>
            </div>
        );
    }
}
