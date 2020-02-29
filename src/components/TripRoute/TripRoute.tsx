import React from 'react';
import { connect } from 'react-redux';

import { cn } from '../../lib/cn';
import { Title } from '../construct/Title/Title';
import {
    IStore,
    IStoreTripRoute,
    IStoreTripRouteItem,
    IStoreTripRouteFinish, IStoreTripRouteStart
} from '../../types/store';
import { getAssetName } from '../../lib/assetsNameMap';
import { formatTime } from '../../lib/time';
import { Text } from '../construct/Text/Text';

import './TripRoute.scss';

interface IConnectProps {
    route?: IStoreTripRoute;
}

class TripRoutePresenter extends React.PureComponent<IConnectProps> {
    render() {
        const { route: routeProps } = this.props;

        if (!routeProps) {
            return null;
        }

        const { route, extra, start, finish } = routeProps;

        return (
            <div className="TripRoute">
                <Title text="Маршрут"/>
                {this.renderStartPoint()}
                {
                    route.map((item, index) => (
                        <React.Fragment key={item.id}>
                            {this.renderRouteInfo(index ? route[index - 1] : start, item)}
                            {this.renderPoint(item, index + 1)}
                        </React.Fragment>
                    ))
                }
                {this.renderRouteInfo(route[route.length - 1], finish)}
                {this.renderEndPoint()}
                {extra && extra.length > 0 ? this.renderExtra() : null}
            </div>
        )
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

    private renderStartPoint(): React.ReactElement {
        return (
            <div className="TripRoute-Item">
                <span className={cn('TripRoute-Point', { place: 'start' })}>{this.getLetter(0)}</span>
                <div className="TripRoute-Row">
                    <Text oneLine bold>Стартовая точка</Text>
                    &nbsp;
                    {this.renderTime(this.props.route.start.time)}
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
                                <Text color="primary">{`Ожидание открытия примерно ${formatTime(item.wait)}`}</Text>
                            </div>
                        ) : null
                    }
                    <div className="TripRoute-Row">
                        <Text>Посещение с</Text>
                        &nbsp;
                        <Text color="primary">{formatTime(from)}</Text>
                        &nbsp;
                        <Text>до</Text>
                        &nbsp;
                        <Text color="primary">{formatTime(to)}</Text>
                        &nbsp;
                        <Text>(</Text>
                        {this.renderTime(to - from)}
                        <Text>)</Text>
                    </div>
                </div>
            </div>
        );
    }

    private renderEndPoint(): React.ReactElement {
        return (
            <div className="TripRoute-Item">
                <span className={cn('TripRoute-Point', { place: 'end' })}>{this.getLetter(this.props.route.route.length + 1)}</span>
                <div className="TripRoute-Row">
                    <Text oneLine bold>Конечная точка</Text>
                    &nbsp;
                    {this.renderTime(this.props.route.finish.time)}
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
                <Text oneLine>В пути</Text>
                &nbsp;
                <Text color="primary">{this.formatDistance(curOrg.distance)}</Text>
                &nbsp;
                <Text>(</Text>
                {this.renderTime(toTime - fromTime)}
                <Text>)</Text>
            </div>
        );
    }

    private formatDistance(distance: number): string {
        distance = Math.round(distance);

        if (distance < 1000) {
            return distance + ' м';
        }

        distance /= 1000;
        distance = Math.floor(distance * 10) / 10;

        return distance + ' км';
    }

    private renderTime(time: number): React.ReactElement {
        return <Text color="primary">{formatTime(time)}</Text>;
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
