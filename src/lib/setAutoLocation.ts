import { Dispatch } from 'react';

import { getAddress } from './parseGeocode';
import { setLocation } from '../store/setLocation';
import { IActionSetLocation } from '../types/actions';

interface ILocation {
    coordinates: [number, number];
    address: string;
}

declare const ymaps: any;

let autoLocationMemo: ILocation | null = null;

export function setAutoLocation(dispatch: Dispatch<IActionSetLocation>): void {
    if (autoLocationMemo) {
        setLocationFromMemo(dispatch);

        return;
    }

ymaps.geolocation.get({ provider: 'auto' }).then((ans: any) => {
    autoLocationMemo = {
        coordinates: ans.geoObjects.position,
        address: getAddress(ans)
    };

    setLocationFromMemo(dispatch);
});
}

function setLocationFromMemo(dispatch: Dispatch<IActionSetLocation>): void {
    if (autoLocationMemo) {
        dispatch(setLocation(autoLocationMemo.coordinates, autoLocationMemo.address, true));
    }
}
