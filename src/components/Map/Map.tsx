import React from 'react';
import { connect, DispatchProp } from 'react-redux';

import { getObjectManagerProps } from './helpers/getObjectManagerProps';
import { IBalloonFactoryProps } from './types';

import { loadScript } from '../../lib/loadScript';
import { IOrganization } from '../../types/organization';
import { IAssetName } from '../../types/assets';
import { Balloon } from '../Balloon/Balloon';
import { IAlgorithmTripOutput } from '../../types/algorithm';
import { IStore } from '../../types/store';

import './Map.scss';

declare global {
    interface Window { ymaps: any; }
}

interface IConnectProps {
    trip?: ITrip;
}

interface ITrip {
    organizations: IAlgorithmTripOutput[];
    location: [number, number];
}

export interface IMapProps {
    category?: IAssetName;
    organizations?: IOrganization[];
    lockArea?: boolean;
}

type IMapPropsWithConnect = IMapProps & IConnectProps & DispatchProp;

const mapSrc = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=86eaa852-1e95-493e-98e0-096aa08cc214';

const minCoords = [43.00, 30.25];
const maxCoords = [47.60, 38.75];
const startCoords = [average(minCoords[0], maxCoords[0]), average(minCoords[1], maxCoords[1])];

function average(a: number, b: number) {
    return (a + b) / 2;
}

class MapPresenter extends React.PureComponent<IMapPropsWithConnect> {
    private map?: any;
    private objectManager?: any;
    private route?: any;

    componentDidUpdate(prevProps: Readonly<IMapPropsWithConnect>) {
        if (!this.props.organizations && prevProps.organizations) {
            this.hideOrganizations();
        }
        if (this.props.organizations && prevProps.organizations !== this.props.organizations) {
            this.showOrganizations();
        }
        if (this.props.trip && !prevProps.trip) {
            this.hideOrganizations();
            this.showTrip();
        }
        if (!this.props.trip && prevProps.trip) {
            this.hideTrip();
        }
    }

    componentDidMount(): void {
        loadScript(mapSrc, this.showMap);
    }

    private showMap = () => {
        const _this = this;

        window.ymaps.ready(function () {
            _this.map = new window.ymaps.Map('map', {
                center: startCoords,
                zoom: 8,
                controls: ['zoomControl', 'fullscreenControl']
            }, {
                restrictMapArea: _this.props.lockArea ? [minCoords, maxCoords] : undefined
            });

            _this.objectManager = new window.ymaps.ObjectManager({
                clusterize: true,
                gridSize: 48,
            });

            _this.objectManager.objects.options.set({
                preset: 'islands#circleDotIcon',
                iconColor: 'darkslateblue',
                hideIconOnBalloonOpen: false
            });
            _this.objectManager.clusters.options.set({
                preset: 'islands#invertedVioletClusterIcons'
            });

            _this.map.geoObjects.add(_this.objectManager);
        });
    };

    private hideOrganizations() {
        this.objectManager.removeAll();
    }

    private showOrganizations() {
        if (!this.map) {
            return;
        }

        this.hideOrganizations();

        const marks = getObjectManagerProps(this.props.category, this.props.organizations, this.balloonFactory);

        this.objectManager.add(marks);
    }

    private showTrip() {
        const { location, organizations } = this.props.trip;
        const coordinates = [location].concat(organizations.map(org => org.coordinates)).concat([location]);

        this.route = new window.ymaps.multiRouter.MultiRoute({
            referencePoints: coordinates
        }, {
            boundsAutoApply: true
        });

        this.map.geoObjects.add(this.route);
    }

    private hideTrip() {
        this.map.geoObjects.remove(this.route);
    }

    private balloonFactory(balloon: IBalloonFactoryProps): React.ReactElement {
        const { id, category } = balloon;

        return (
            <Balloon
                id={id}
                category={category}
            />
        )
    }

    render() {
        return <div className="Map" id="map" />;
    }
}

export const Map = connect(
    (state: IStore): IConnectProps => {
        if (!state.tripRoute || !state.tripRoute.route) {
            return {};
        }

        const trip = state.tripRoute.route;

        return {
            trip: {
                organizations: trip.length > 0 ? trip : undefined,
                location: state.tripRoute.location
            }
        };
    }
)(MapPresenter);
