import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ToggleButton } from '../construct/ToggleButton/ToggleButton';
import { setLocation } from '../../store/setLocation';
import { IStore } from '../../types/store';

declare const ymaps: any;

interface ILocationResult {
    geoObjects: {
        position: [number, number]
    }
}

export const AutoLocationButton: React.FC = () => {
    const selected = useSelector((state: IStore) => state.location && state.location.auto);
    const dispatch = useDispatch();

    const handleAutoLocation = () => {
        ymaps.geolocation.get({ provider: 'yandex' }).then((ans: ILocationResult) => dispatch(setLocation(ans.geoObjects.position, true)));
    }

    return (
        <ToggleButton
            id="geo-auto"
            set={selected}
            onClick={selected ? () => {} : handleAutoLocation}
        >
            Моё местоположение
        </ToggleButton>
    );
};
