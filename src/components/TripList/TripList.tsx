import React from 'react';
import { connect, DispatchProp } from 'react-redux';

import { IOrganization } from '../../types/organization';
import { IAssetName } from '../../types/assets';
import { Title } from '../construct/Title/Title';
import { Text } from '../construct/Text/Text';
import { Icon } from '../construct/Icon/Icon';
import { TimePicker } from '../construct/TimePicker/TimePicker';
import { getAssetName } from '../../lib/assetsNameMap';
import { parseTime, timeSection } from '../../lib/time';
import { multiLang } from '../../lib/multiLang';
import { changeTime } from '../../store/changeTime';
import { removeFromList } from '../../store/removeFromList';
import { IStore } from '../../types/store';
import { ClickableText } from '../construct/ClickableText/ClickableText';
import { setBalloon } from '../../store/setBalloon';

import './TripList.scss';

interface IConnectProps {
    items: ITripListItemProps[];
    openedBalloon?: string;
}

export interface ITripListProps extends DispatchProp, IConnectProps {
    validationError?: boolean;
}

export interface ITripListItemProps {
    category: IAssetName;
    organization: IOrganization;
    time: string;
}

const countDictionary = {
    none: 'мест',
    one: 'место',
    some: 'места',
    many: 'мест',
};
const hoursDictionary = {
    none: 'часов',
    one: 'час',
    some: 'часа',
    many: 'часов',
};
const minutesDictionary = {
    none: 'минут',
    one: 'минута',
    some: 'минуты',
    many: 'минут',
};

class TripListPresenter extends React.PureComponent<ITripListProps> {
    render() {
        return (
            <div className="TripList">
                <Title text="Список мест"/>
                {
                    this.props.items.length === 0 ?
                        <Text
                            color={ this.props.validationError ? 'red' : 'grey'}
                            newLine
                            center
                        >
                            Вы не выбрали места
                        </Text> :
                        <>
                            {this.renderStats()}
                            {this.props.items.map(item => this.renderItem(item.category, item.organization, item.time))}
                        </>
                }
            </div>
        )
    }

    private renderStats(): React.ReactElement {
        const count = this.props.items.length;
        let minutes = 0;

        for (const item of this.props.items) {
            minutes += parseTime(item.time);
        }

        const totalTime = timeSection(minutes);
        const label = [
            'Выбрано',
            count,
            multiLang(count, countDictionary),
            'на',
            (totalTime[0] === 0 ? '' : totalTime[0] + ' ' + multiLang(totalTime[0], hoursDictionary)),
            (totalTime[1] === 0 ? ' ' : totalTime[1] + ' ' + multiLang(totalTime[1], minutesDictionary)),
            'посещения'
        ].join(' ');

        return <Text className="TripList-Stats" newLine center color="grey">{label}</Text>;
    }

    private renderItem(category: IAssetName, organization: IOrganization, time: string) {
        return (
            <div className="TripList-Item" key={organization.id}>
                <Icon
                    type="cross"
                    size={12}
                    onClick={() => this.props.dispatch(removeFromList(organization.id))}
                />
                <ClickableText
                    set={organization.id === this.props.openedBalloon}
                    onClick={() => this.props.dispatch(setBalloon(organization.id))}
                >
                    {organization.name}
                </ClickableText>
                <Text oneLine className="TripList-Category" color="grey">{getAssetName(category)}</Text>
                <TimePicker
                    value={time}
                    place="top"
                    onChange={time => this.props.dispatch(changeTime(organization.id, time))}
                />
            </div>
        );
    }
}

export const TripList = connect((state: IStore) => ({
    items: state.tripList,
    openedBalloon: state.openedBalloon,
}))(TripListPresenter);
