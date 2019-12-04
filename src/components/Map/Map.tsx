import React from 'react';

import { loadScript } from '../../lib/loadScript';
import { IMapCoords } from './types';

import './Map.scss';

declare global {
    interface Window { ymaps: any; }
}

export interface IMapProps {
    coords?: IMapCoords[];
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

    componentDidUpdate(prevProps: Readonly<IMapProps>) {
        if (!this.props.coords && prevProps.coords) {
            this.hideCoords();
        }
        if (this.props.coords && prevProps.coords !== this.props.coords) {
            this.showCoords();
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
        });
    };

    private hideCoords() {
        this.map.geoObjects.removeAll();
    }

    private showCoords() {
        if (!this.map) {
            return;
        }

        this.map.geoObjects.removeAll();

        const marks = new window.ymaps.GeoObjectCollection();

        for (let i = 0; i < this.props.coords.length; i++) {
            const point = this.props.coords[i];

            marks.add(new window.ymaps.Placemark(
                point.coords,
                { balloonContentBody: point.text }
            ));
        }

        this.map.geoObjects.add(marks);
    }

    render() {
        return <div className="Map" id="map" />;
    }
}
