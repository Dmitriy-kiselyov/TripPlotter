import React from 'react';

import { getObjectManagerProps } from './helpers/getObjectManagerProps';

import { loadScript } from '../../lib/loadScript';
import { IOrganization } from '../../types/organization';

import './Map.scss';

declare global {
    interface Window { ymaps: any; }
}

export interface IMapProps {
    organizations?: IOrganization[];
}

const mapSrc = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=86eaa852-1e95-493e-98e0-096aa08cc214';

const minCoords = [43.00, 30.25];
const maxCoords = [47.60, 38.75];
const startCoords = [average(minCoords[0], maxCoords[0]), average(minCoords[1], maxCoords[1])];

function average(a: number, b: number) {
    return (a + b) / 2;
}

export class Map extends React.PureComponent<IMapProps> {
    private map?: any;
    private objectManager?: any;

    componentDidUpdate(prevProps: Readonly<IMapProps>) {
        if (!this.props.organizations && prevProps.organizations) {
            this.hideOrganizations();
        }
        if (this.props.organizations && prevProps.organizations !== this.props.organizations) {
            this.showOrganizations();
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
                restrictMapArea: [minCoords, maxCoords]
            });

            _this.objectManager = new window.ymaps.ObjectManager({
                clusterize: true,
                gridSize: 48,
            });

            _this.objectManager.objects.options.set({
                preset: 'islands#circleDotIcon',
                iconColor: 'darkslateblue'
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

        const marks = getObjectManagerProps(this.props.organizations);

        this.objectManager.add(marks);
    }

    render() {
        return <div className="Map" id="map" />;
    }
}
