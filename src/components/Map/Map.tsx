import React from 'react';
import { connect, DispatchProp } from 'react-redux';

import {
    getObjectManagerProps, getOrganizationsFeatures, getTripListFeatures
} from './helpers/getObjectManagerProps';
import { IObjectManagerCluster, IObjectManagerFeature } from './types';
import { locationPreset, orgColor, orgPreset, tripColor, tripPreset } from './helpers/colors';

import { loadMap } from '../../lib/loadMap';
import { IOrganization } from '../../types/organization';
import { IAssetName } from '../../types/assets';
import { IAlgorithmTripItemOutput } from '../../types/algorithm';
import { IStore, IStoreTripItem } from '../../types/store';
import { setBalloon } from '../../store/setBalloon';
import { getBalloonLayout } from './helpers/getBalloonLayout';
import { getAddress } from '../../lib/parseGeocode';
import { setLocation } from '../../store/setLocation';
import { centerCoords, minCoords, maxCoords } from '../../lib/mapCoords';
import { ScaleButton } from './buttons/ScaleButton';
import { ScaleFeaturesButton, getFeaturesBounds } from './buttons/ScaleFeaturesButton';

import './Map.scss';

declare const ymaps: any;

interface IConnectProps {
    tripRoute?: ITrip;
    tripList: IStoreTripItem[];
    userLocation?: [number, number];
    openedBalloon?: string;
    routeCalculating?: boolean;
}

interface ITrip {
    organizations: IAlgorithmTripItemOutput[];
    location: [number, number];
}

export interface IMapProps {
    category?: IAssetName;
    organizations?: IOrganization[];
}

type IMapPropsWithConnect = IMapProps & IConnectProps & DispatchProp;

const initialZoom = 8;

class MapPresenter extends React.PureComponent<IMapPropsWithConnect> {
    private map?: any;
    private objectManager?: any;
    private route?: any;
    private knownIds: Set<string> = new Set();
    private shownIds: Set<string> = new Set();
    private userLocationGeo?: any = null;

    componentDidUpdate(prevProps: Readonly<IMapPropsWithConnect>) {
        if (
            prevProps.organizations !== this.props.organizations ||
            prevProps.tripList !== this.props.tripList
        ) {
            this.updateOrganizations();
        }

        if (this.props.openedBalloon && prevProps.openedBalloon !== this.props.openedBalloon) {
            this.openBalloon(prevProps.openedBalloon);
        }
        if (prevProps.openedBalloon && !this.props.openedBalloon) {
            this.closeBalloon();
        }


        if (this.props.tripRoute && !prevProps.tripRoute) {
            this.hideOrganizations();
            this.hideUserLocation();
            this.showTrip();
            this.forceUpdate();
        }
        if (!this.props.tripRoute && prevProps.tripRoute) {
            this.hideTrip();
            this.updateOrganizations();
            this.showUserLocation();
        }
        if (this.props.tripRoute && prevProps.tripRoute && this.props.tripRoute.organizations !== prevProps.tripRoute.organizations) {
            this.hideTrip();
            this.showTrip();
        }

        if (!prevProps.userLocation && this.props.userLocation) {
            this.showUserLocation();
        }
        if (!prevProps.userLocation && this.props.userLocation && !prevProps.tripRoute) {
            this.moveToUserLocation();
        }
        if (prevProps.userLocation && this.props.userLocation && prevProps.userLocation !== this.props.userLocation) {
            this.hideUserLocation();
            this.showUserLocation();
            this.moveToUserLocation();
        }

        if (!prevProps.routeCalculating && this.props.routeCalculating) {
            this.scaleToFeatures();
        }
    }

    private moveToUserLocation(): void {
        if (this.props.userLocation) {
            this.map.setCenter(this.props.userLocation, 15);
        }
    }

    private scaleToFeatures(): void {
        this.map.setBounds(getFeaturesBounds());
    }

    private showUserLocation(): void {
        if (!this.props.userLocation) {
            return;
        }

        this.userLocationGeo = new ymaps.GeoObject({
            geometry: {
                type: "Point",
                coordinates: this.props.userLocation
            },
            properties: {
                hintContent: 'Начальная точка маршрута (тяните, чтобы изменить положение)'
            }
        }, {
            preset: locationPreset,
            draggable: true,
            zIndex: 1000,
        });

        this.userLocationGeo.events.add('dragend', (args: any) => {
            const coordinates = args.originalEvent.target.geometry._coordinates;

            ymaps.geocode(coordinates).then((geocode: any) => {
                const address = getAddress(geocode);

                this.props.dispatch(setLocation(coordinates, address, false));
            });
        });

        this.map.geoObjects.add(this.userLocationGeo);
    }

    private hideUserLocation(): void {
        if (this.userLocationGeo) {
            this.map.geoObjects.remove(this.userLocationGeo);

            this.userLocationGeo = null;
        }
    }

    componentDidMount(): void {
        loadMap(this.showMap);
    }

    private showMap = () => {
        this.map = new ymaps.Map('map', {
            center: centerCoords,
            zoom: initialZoom,
            controls: ['zoomControl', 'fullscreenControl']
        }, {
            restrictMapArea: [minCoords, maxCoords]
        });

        this.setupObjectManager();

        this.map.controls.add(ScaleFeaturesButton(this.map));
        this.map.controls.add(ScaleButton(this.map, initialZoom));
    };

    forceUpdate(): void {
        this.objectManager.setFilter(this.objectManagerFilter.bind(this));
    }

    private setupObjectManager = () => {
        this.objectManager = new ymaps.ObjectManager({
            clusterize: true,
            gridSize: 48,

            geoObjectOpenBalloonOnClick: false, // redux
            clusterDisableClickZoom: true,
            clusterOpenBalloonOnClick: false // redux
        });

        this.objectManager.objects.options.set({
            hideIconOnBalloonOpen: false
        });
        this.objectManager.clusters.options.set({
            clusterIconLayout: 'default#pieChart',
            iconPieChartRadius: 20,
            iconPieChartCoreRadius: 10,
            hideIconOnBalloonOpen: false,
            balloonContentLayout: getBalloonLayout()
        });

        let openBalloonTimeoutId: number;
        // @ts-ignore тупой ts берет тайпинги ноды
        const reopenBalloon = () => openBalloonTimeoutId = setTimeout(() => this.openBalloon(), 100);
        const doNotReopenBalloon = () => clearTimeout(openBalloonTimeoutId);
        const closeBalloon = () => {
            doNotReopenBalloon();

            this.props.dispatch(setBalloon(null));
        };

        // @ts-ignore
        this.objectManager.objects.events.add('click', e => {
            const id = e.get('objectId');

            this.props.dispatch(setBalloon(id));
        });
        this.objectManager.objects.balloon.events.add('open', doNotReopenBalloon);
        this.objectManager.objects.balloon.events.add('close', reopenBalloon);
        this.objectManager.objects.balloon.events.add('userclose', closeBalloon);

        // @ts-ignore
        this.objectManager.clusters.events.add('click', e => {
            const clusterId = e.get('objectId');
            const cluster = this.objectManager.clusters.getById(clusterId) as IObjectManagerCluster;
            const feature = cluster.features[0];

            this.props.dispatch(setBalloon(feature.id));
        });
        this.objectManager.clusters.balloon.events.add('open', doNotReopenBalloon);
        this.objectManager.clusters.balloon.events.add('close', reopenBalloon);
        this.objectManager.clusters.balloon.events.add('userclose', closeBalloon);

        this.objectManager.setFilter(this.objectManagerFilter.bind(this));

        this.map.geoObjects.add(this.objectManager);

        this.firstSetup();
    };

    private firstSetup(): void {
        if (this.props.tripRoute) {
            this.showTrip();
        } else {
            this.updateOrganizations();
        }
    }

    private updateOrganizations() {
        if (!this.map) {
            return;
        }

        this.setShownIds();

        const unknownFeatures = this.getUnknownFeatures();

        this.rememberIds(unknownFeatures);

        this.objectManager.add(getObjectManagerProps(unknownFeatures));
        this.forceUpdate();

        this.setOrganizationsPresets(); // after render
    }

    private getUnknownFeatures(): IObjectManagerFeature[] {
        const orgs = this.props.organizations ? this.props.organizations.filter(org => !this.knownIds.has(org.id)) : [];
        const tripItems = this.props.tripList.filter(item => !this.knownIds.has(item.organization.id));

        return getOrganizationsFeatures(this.props.category, orgs)
            .concat(getTripListFeatures(tripItems));
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

    private openBalloon(prevBalloon?: string) {
        const objectState = this.objectManager.getObjectState(this.props.openedBalloon);

        if (objectState.isClustered) {
            const cluster = objectState.cluster as IObjectManagerCluster;
            const isInsideCluster = prevBalloon && cluster.features.some(feature => feature.id === prevBalloon);

            if (!isInsideCluster) {
                setTimeout(() => this.objectManager.clusters.balloon.open(cluster.id));
            }
        } else {
            setTimeout(() => this.objectManager.objects.balloon.open(this.props.openedBalloon));
        }
    }

    private closeBalloon() {
        this.objectManager.objects.balloon.close();
        this.objectManager.clusters.balloon.close();
    }

    private showTrip() {
        const { location, organizations } = this.props.tripRoute;
        const coordinates = [location].concat(organizations.map(org => org.coordinates)).concat([location]);

        this.route = new ymaps.multiRouter.MultiRoute({
            referencePoints: coordinates
        }, {
            boundsAutoApply: true,
            wayPointFinishVisible: false,
        });

        this.map.geoObjects.add(this.route);
    }

    private hideTrip() {
        this.map.geoObjects.remove(this.route);
    }

    render() {
        return <div className="Map" id="map" />;
    }
}

export const Map = connect(
    (state: IStore): IConnectProps => {
        const connectProps: IConnectProps = {
            tripList: state.tripList,
            openedBalloon: state.openedBalloon,
            userLocation: state.location ? state.location.coords : undefined,
            routeCalculating: state.routeCalculating,
        };

        if (state.tripRoute) {
            const trip = state.tripRoute.days[state.tripRouteDay || 0].route;

            connectProps.tripRoute = {
                organizations: trip.length > 0 ? trip : undefined,
                location: state.tripRoute.coordinates
            };
        }

        return connectProps;
    }
)(MapPresenter);
