import React from 'react';
import { connect } from 'react-redux';

import { cn } from '../../lib/cn';
import { Title } from '../construct/Title/Title';
import {
    IStore, IStoreTripRoute, IStoreTripRouteItem, IStoreTripRouteFinish, IStoreTripRouteStart, IStoreTripRouteDay
} from '../../types/store';
import { getAssetName } from '../../lib/assetsNameMap';
import { formatTime, formatTimeLong } from '../../lib/time';
import { Text } from '../construct/Text/Text';
import { formatDistance } from '../../lib/distance';

import './TripRoute.scss';

interface IConnectProps {
    route?: IStoreTripRoute;
}

class TripRoutePresenter extends React.PureComponent<IConnectProps> {
    render() {
        const { route } = this.props;

        if (!route) {
            return null;
        }

        const { days, extra } = route;

        return (
            <div className="TripRoute">
                <Title text="Маршрут"/>
                {
                    days.map((day, i) => this.renderDay(day, i))
                }
                {extra && extra.length > 0 ? this.renderExtra() : null}
            </div>
        )
    }

    private renderDay(day: IStoreTripRouteDay, dayNumber: number): React.ReactElement {
        const { start, finish, route } = day;

        return (
            <React.Fragment key={dayNumber}>
                {this.renderDayTitle(dayNumber)}
                {this.renderStartPoint(start)}
                {
                    route.map((item, index) => (
                        <React.Fragment key={item.id}>
                            {this.renderRouteInfo(index ? route[index - 1] : start, item)}
                            {this.renderPoint(item, index + 1)}
                        </React.Fragment>
                    ))
                }
                {this.renderRouteInfo(route[route.length - 1], finish)}
                {this.renderEndPoint(finish, route.length)}
            </React.Fragment>
        );
    }

    private renderDayTitle(dayNumber: number): React.ReactElement {
        return (
            <div className="TripRoute-DayTitleWrap">
                <div className="TripRoute-DayTitleLine" />
                <Title
                    className="TripRoute-DayTitle"
                    text={`День ${dayNumber + 1}`}
                />
            </div>
        );
    }

    private renderExtra(): React.ReactElement {
        const extra = this.props.route.extra.map(extra => (
            <div className="TripRoute-Item_no-point" key={extra.id}>
                <div className="TripRoute-Row">
                    <Text oneLine>{extra.organization.name}</Text>
                    <Text oneLine className="TripRoute-Category" color="grey">{getAssetName(extra.category)}</Text>
                </div>
            </div>
        ));

        return (
            <>
                <Title className="TripRoute-ExtraTitle" text="Не вместились в маршрут"/>
                {extra}
            </>
        );
    }

    private renderStartPoint(start: IStoreTripRouteStart): React.ReactElement {
        return (
            <div className="TripRoute-Item">
                <span className={cn('TripRoute-Point', { place: 'start' })}>{this.getLetter(0)}</span>
                <div className="TripRoute-Row">
                    <Text oneLine bold>Стартовая точка</Text>
                    &nbsp;
                    {this.renderTime(start.time)}
                </div>
            </div>
        );
    }

    private renderPoint(item: IStoreTripRouteItem, index: number): React.ReactElement {
        const { wait = 0, to } = item;
        const from = item.from + wait;

        return (
            <div className="TripRoute-Item">
                <span className="TripRoute-Point">{this.getLetter(index)}</span>
                <div className="TripRoute-Rows">
                    <div className="TripRoute-Row">
                        <Text oneLine bold>{item.organization.name}</Text>
                        <Text oneLine className="TripRoute-Category" color="grey">{getAssetName(item.category)}</Text>
                    </div>
                    {
                        item.wait ? (
                            <div className="TripRoute-Row">
                                <Text color="primary">{`Ожидание открытия примерно ${formatTimeLong(item.wait)}`}</Text>
                            </div>
                        ) : null
                    }
                    <div className="TripRoute-Row">
                        <Text oneLine newLine>
                            {'Посещение с '}
                            {this.renderTime(from)}
                            {' до '}
                            {this.renderTime(to)}
                            {' ('}
                            {this.renderTime(to - from, true)}
                            )
                        </Text>
                    </div>
                </div>
            </div>
        );
    }

    private renderEndPoint(finish: IStoreTripRouteFinish, index: number): React.ReactElement {
        return (
            <div className="TripRoute-Item">
                <span className={cn('TripRoute-Point', { place: 'end' })}>{this.getLetter(index + 1)}</span>
                <div className="TripRoute-Row">
                    <Text oneLine bold>Конечная точка</Text>
                    &nbsp;
                    {this.renderTime(finish.time)}
                </div>
            </div>
        );
    }

    private renderRouteInfo(prevOrg: IStoreTripRouteItem | IStoreTripRouteStart, curOrg: IStoreTripRouteItem | IStoreTripRouteFinish): React.ReactElement {
        // @ts-ignore
        const fromTime: number = prevOrg.to !== undefined ? prevOrg.to : prevOrg.time;
        // @ts-ignore
        const toTime: number = curOrg.from !== undefined ? curOrg.from : curOrg.time;

        return (
            <div className="TripRoute-RouteInfo">
                <Text oneLine newLine>
                    {'В пути '}
                    <Text color="primary">{formatDistance(curOrg.distance)}</Text>
                    {' ('}
                    {this.renderTime(toTime - fromTime, true)}
                    )
                </Text>
            </div>
        );
    }

    private renderTime(time: number, long: boolean = false): React.ReactElement {
        const format = long ? formatTimeLong : formatTime;

        return <Text color="primary">{format(time)}</Text>;
    }

    private getLetter(index: number) {
        return String.fromCharCode(65 + index);
    }
}

export const TripRoute = connect(
    (state: IStore): IConnectProps => ({
        route: state.tripRoute
    })
)(TripRoutePresenter);
