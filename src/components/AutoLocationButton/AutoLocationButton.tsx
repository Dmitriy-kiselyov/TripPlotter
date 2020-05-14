import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ToggleButton } from '../construct/ToggleButton/ToggleButton';
import { setLocation } from '../../store/setLocation';
import { IStore } from '../../types/store';
import { getAddress } from '../../lib/getAddress';

declare const ymaps: any;

export const AutoLocationButton: React.FC = () => {
    const selected = useSelector((state: IStore) => state.location && state.location.auto);
    const dispatch = useDispatch();

    const handleAutoLocation = () => {
        ymaps.geolocation.get({ provider: 'yandex' }).then((ans: any) => {
            dispatch(setLocation(ans.geoObjects.position, getAddress(ans), true));
        });
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
