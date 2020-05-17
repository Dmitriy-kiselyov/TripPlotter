import { ACTION_TYPES, IActionRemoveLocation } from '../types/actions';

export function removeLocation(): IActionRemoveLocation {
    return {
        type: ACTION_TYPES.REMOVE_LOCATION
    }
}
