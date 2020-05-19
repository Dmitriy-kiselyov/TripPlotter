import React from 'react';
import { connect, DispatchProp } from 'react-redux';

import { cn } from '../../lib/cn';
import { Title } from '../construct/Title/Title';
import {
    IStore,
    IStoreTripRoute,
    IStoreTripRouteItem,
    IStoreTripRouteFinish,
    IStoreTripRouteStart,
    IStoreTripRouteDay,
    IStoreFilledDate
} from '../../types/store';
import { getAssetName } from '../../lib/assetsNameMap';
import { formatTime, formatTimeLong } from '../../lib/time';
import { Text } from '../construct/Text/Text';
import { formatDistance } from '../../lib/distance';
import { ClickableText } from '../construct/ClickableText/ClickableText';
import { formatDateLong } from '../../lib/date';
import { setRouteDay } from '../../store/setRouteDay';

import './TripRoute.scss';

interface IConnectProps {
    route: IStoreTripRoute;
    date: IStoreFilledDate;
    activeDay?: number;
    userAddress: string;
}

type ITripRoutePropsWithConnect = IConnectProps & DispatchProp;

class TripRoutePresenter extends React.PureComponent<ITripRoutePropsWithConnect> {
    render() {
        const { days, extra } = this.props.route;

        return (
            <div className="TripRoute">
                {this.isSingleDate() && <Title text="Маршрут"/>}
                {
                    days.map((day, i) => this.renderDay(day, i))
                }
                {extra && extra.length > 0 ? this.renderExtra() : null}
            </div>
        )
    }

    private isSingleDate(): boolean {
        return !Array.isArray(this.props.date);
    }

    private renderDay(day: IStoreTripRouteDay, dayNumber: number): React.ReactElement {
        const { start, finish, route } = day;

        return (
            <div
                className={cn('TripRoute-Day', { active: this.isSingleDate() || dayNumber === this.props.activeDay })}
                key={dayNumber}
            >
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
                {this.renderEndPoint(finish)}
            </div>
        );
    }

    private renderDayTitle(dayNumber: number): React.ReactElement {
        const { date } = this.props;

        if (this.isSingleDate()) {
            return null;
        }

        const currentDate = this.getNextDate((date as [Date, Date])[0], dayNumber);

        return (
            <>
                <div className="TripRoute-DayTitleWrap">
                    <div className="TripRoute-DayTitleLine" />
                    <ClickableText
                        className="TripRoute-DayTitle"
                        size="xl"
                        onClick={() => this.props.dispatch(setRouteDay(dayNumber))}
                    >
                        {`День ${dayNumber + 1}`}
                    </ClickableText>
                </div>
                <div className="TripRoute-DayDate">
                    <ClickableText
                        newLine
                        size="m"
                        onClick={() => this.props.dispatch(setRouteDay(dayNumber))}
                    >
                        {formatDateLong(currentDate)}
                    </ClickableText>
                </div>
            </>
        );
    }

    private getNextDate(date: Date, daysPassed: number): Date {
        const newDate = new Date(date.getTime());

        newDate.setDate(newDate.getDate() + daysPassed);

        return newDate;
    }

    private renderExtra(): React.ReactElement {
        const extra = this.props.route.extra.map(extra => (
            <div className="TripRoute-Item_no-point noprint" key={extra.id}>
                <div className="TripRoute-Row">
                    <Text oneLine>{extra.organization.name}</Text>
                    <Text oneLine className="TripRoute-Category" color="grey">{getAssetName(extra.category)}</Text>
                </div>
            </div>
        ));

        return (
            <>
                <Title className="TripRoute-ExtraTitle noprint" text="Не вместились в маршрут"/>
                {extra}
            </>
        );
    }

    private renderStartPoint(start: IStoreTripRouteStart): React.ReactElement {
        return (
            <div className="TripRoute-Item">
                <span className={cn('TripRoute-Point', { place: 'start' })}>{this.getLetter(0)}</span>
                <div className="TripRoute-Row">
                    <Text oneLine bold>{this.props.userAddress}</Text>
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

    private renderEndPoint(finish: IStoreTripRouteFinish): React.ReactElement {
        return (
            <div className="TripRoute-Item">
                <span className={cn('TripRoute-Point', { place: 'end' })}>{this.getLetter(0)}</span>
                <div className="TripRoute-Row">
                    <Text oneLine bold>{this.props.userAddress}</Text>
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
        route: state.tripRoute as IStoreTripRoute,
        date: state.date as IStoreFilledDate,
        activeDay: state.tripRouteDay,
        userAddress: shortAddress(state.location.address),
    })
)(TripRoutePresenter);

function shortAddress(address: string): string {
    const ending = ', Республика Крым, Россия';

    return address.endsWith(ending) ? address.slice(0, address.length - ending.length) : address;
}
