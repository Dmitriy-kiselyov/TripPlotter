import { ACTION_TYPES, IActionSetLocation } from '../types/actions';

export function setLocation(coordinates: [number, number], auto: boolean): IActionSetLocation {
    return {
        type: ACTION_TYPES.SET_LOCATION,
        coords: coordinates,
        auto
    };
}
