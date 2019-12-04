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
            const location = [44.948237, 34.100318];

            _this.map = new window.ymaps.Map('map', {
                center: location,
                zoom: 8
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
