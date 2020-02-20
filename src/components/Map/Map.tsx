import React from 'react';
import { connect, DispatchProp } from 'react-redux';

import {
    getObjectManagerProps, getOrganizationsFeatures, getTripListFeatures
} from './helpers/getObjectManagerProps';
import { IBalloonFactoryProps, IObjectManagerFeature } from './types';
import { orgColor, orgPreset, tripColor, tripPreset } from './helpers/colors';

import { loadScript } from '../../lib/loadScript';
import { IOrganization } from '../../types/organization';
import { IAssetName } from '../../types/assets';
import { Balloon } from '../Balloon/Balloon';
import { IAlgorithmTripOutput } from '../../types/algorithm';
import { IStore, IStoreTripItem } from '../../types/store';
import { setBalloon } from '../../store/setBalloon';

import './Map.scss';

declare global {
    interface Window { ymaps: any; }
}

interface IConnectProps {
    tripRoute?: ITrip;
    tripList: IStoreTripItem[];
    openedBalloon?: string;
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
    private knownIds: Set<string> = new Set();
    private shownIds: Set<string> = new Set();
    private balloonId: string | null = null;

    componentDidUpdate(prevProps: Readonly<IMapPropsWithConnect>) {
        if (
            prevProps.organizations !== this.props.organizations ||
            prevProps.tripList !== this.props.tripList
        ) {
            this.updateOrganizations();
        }

        if (this.props.openedBalloon && prevProps.openedBalloon !== this.props.openedBalloon) {
            this.openBalloon();
        }
        if (prevProps.openedBalloon && !this.props.openedBalloon) {
            this.closeBalloon();
        }

        if (this.props.tripRoute && !prevProps.tripRoute) {
            this.hideOrganizations();
            this.showTrip();
        }
        if (!this.props.tripRoute && prevProps.tripRoute) {
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
                hideIconOnBalloonOpen: false
            });
            _this.objectManager.clusters.options.set({
                clusterIconLayout: 'default#pieChart',
                clusterIconPieChartRadius: 20,
                clusterIconPieChartCoreRadius: 10
            });

            // @ts-ignore
            _this.objectManager.objects.balloon.events.add('open', e => {
                const id = e.get('target')._objectIdWithOpenBalloon;

                _this.balloonId = id;
                _this.props.dispatch(setBalloon(id));
            });
            _this.objectManager.objects.balloon.events.add('userclose', () => {
                _this.balloonId = null;
                _this.props.dispatch(setBalloon(null));
            });

            _this.objectManager.setFilter(_this.objectManagerFilter.bind(_this));

            _this.map.geoObjects.add(_this.objectManager);

            _this.updateOrganizations();
        });
    };

    private updateOrganizations() {
        if (!this.map) {
            return;
        }

        this.setShownIds();

        const unknownFeatures = this.getUnknownFeatures();

        this.rememberIds(unknownFeatures);

        this.objectManager.add(getObjectManagerProps(unknownFeatures));
        this.objectManager.setFilter(this.objectManagerFilter.bind(this)); // force rerender

        this.setOrganizationsPresets(); // after render
    }

    private getUnknownFeatures(): IObjectManagerFeature[] {
        const orgs = this.props.organizations ? this.props.organizations.filter(org => !this.knownIds.has(org.id)) : [];
        const tripItems = this.props.tripList.filter(item => !this.knownIds.has(item.organization.id));

        return getOrganizationsFeatures(this.props.category, orgs, this.balloonFactory)
            .concat(getTripListFeatures(tripItems, this.balloonFactory));
    }

    private rememberIds(features: IObjectManagerFeature[]): void {
        for (const feature of features) {
            this.knownIds.add(feature.id);
        }
    }

    private setShownIds(): void {
        this.hideOrganizations();

        for (const org of this.props.organizations || []) {
            this.shownIds.add(org.id);
        }

        for (const item of this.props.tripList) {
            this.shownIds.add(item.organization.id);
        }
    }

    private hideOrganizations() {
        this.shownIds.clear();
    }

    private setOrganizationsPresets(): void {
        const tripListIds = this.props.tripList.map(item => item.organization.id);

        this.objectManager.objects.each((feature: IObjectManagerFeature) => {
            const expectedPreset = tripListIds.includes(feature.id) ? tripPreset : orgPreset;
            const expectedColor = tripListIds.includes(feature.id) ? tripColor : orgColor;

            if (expectedPreset !== feature.options.preset || expectedColor !== feature.options.iconColor) {
                this.objectManager.objects.setObjectOptions(feature.id, { preset: expectedPreset, iconColor: expectedColor });
            }
        });
    }

    private objectManagerFilter(feature: IObjectManagerFeature): boolean {
        return this.shownIds.has(feature.id);
    }

    private openBalloon() {
        if (this.balloonId !== this.props.openedBalloon) {
            const _this = this;
            setTimeout(() => _this.objectManager.objects.balloon.open(_this.props.openedBalloon));
        }
    }

    private closeBalloon() {
        if (this.balloonId !== null) {
            this.objectManager.objects.balloon.close();
        }
    }

    private showTrip() {
        const { location, organizations } = this.props.tripRoute;
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
        const connectProps: IConnectProps = {
            tripList: state.tripList,
            openedBalloon: state.openedBalloon
        };

        if (state.tripRoute && state.tripRoute.route) {
            const trip = state.tripRoute.route;

            connectProps.tripRoute = {
                organizations: trip.length > 0 ? trip : undefined,
                location: state.tripRoute.location
            };
        }

        return connectProps;
    }
)(MapPresenter);
