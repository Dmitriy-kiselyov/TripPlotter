import React from 'react';
import { connect } from 'react-redux';

import { cn } from '../../lib/cn';
import { Title } from '../Title/Title';
import { IStore, IStoreTripRoute, IStoreTripRouteItem } from '../../types/store';
import { getAssetName } from '../../lib/assetsNameMap';
import { formatTime } from '../../lib/time';
import { Text } from '../Text/Text';

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

        return (
            <div className="TripRoute">
                <Title text="Маршрут"/>
                {this.renderStartPoint()}
                {
                    route.tripList.map((item, index) => this.renderPoint(item, index + 1))
                }
                {this.renderEndPoint()}
                {route.extra ? this.renderExtra() : null}
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
                    <Text oneLine>Стартовая точка</Text>
                </div>
            </div>
        );
    }

    private renderPoint(item: IStoreTripRouteItem, index: number): React.ReactElement {
        return (
            <div className="TripRoute-Item" key={item.id}>
                <span className="TripRoute-Point">{this.getLetter(index)}</span>
                <div className="TripRoute-Rows">
                    <div className="TripRoute-Row">
                        <Text oneLine>{item.organization.name}</Text>
                        <Text oneLine className="TripRoute-Category" color="grey">{getAssetName(item.category)}</Text>
                    </div>
                    {
                        item.wait ? (
                            <div className="TripRoute-Row">
                                <Text oneLine color="primary">{`Ожидание открытия примерно ${formatTime(item.wait)}`}</Text>
                            </div>
                        ) : null
                    }
                    <div className="TripRoute-Row">
                        <Text oneLine>Посещение с</Text>
                        &nbsp;
                        <Text oneLine color="primary">{formatTime(item.from)}</Text>
                        &nbsp;
                        <Text oneLine>до</Text>
                        &nbsp;
                        <Text oneLine color="primary">{formatTime(item.to)}</Text>
                    </div>
                </div>
            </div>
        );
    }

    private renderEndPoint(): React.ReactElement {
        return (
            <div className="TripRoute-Item">
                <span className={cn('TripRoute-Point', { place: 'end' })}>{this.getLetter(this.props.route.tripList.length + 1)}</span>
                <div className="TripRoute-Row">
                    <Text oneLine>Конечная точка</Text>
                </div>
            </div>
        );
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
