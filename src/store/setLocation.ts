import { ACTION_TYPES, IActionSetLocation } from '../types/actions';

export function setLocation(coordinates: [number, number], address: string, auto: boolean): IActionSetLocation {
    return {
        type: ACTION_TYPES.SET_LOCATION,
        coords: coordinates,
        address,
        auto
    };
}
