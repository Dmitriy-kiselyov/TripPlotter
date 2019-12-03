import React from 'react';

import { loadScript } from '../../lib/loadScript';

import './Map.scss';

declare global {
    interface Window { ymaps: any; }
}

const mapSrc = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=86eaa852-1e95-493e-98e0-096aa08cc214';

export class Map extends React.PureComponent {
    componentDidMount(): void {
        loadScript(mapSrc, this.showMap);
    }

    private showMap = () => {
        window.ymaps.ready(function () {
            const location = [44.948237, 34.100318];

            const map = new window.ymaps.Map('map', {
                center: location,
                zoom: 13
            }, {
                searchControlProvider: 'yandex#search'
            });
        });
    };

    render() {
        return <div className="Map" id="map" />;
    }
}
