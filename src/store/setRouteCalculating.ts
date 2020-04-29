import { ACTION_TYPES, IActionSetTripCalculating } from '../types/actions';

export function setRouteCalculating(): IActionSetTripCalculating {
    return {
        type: ACTION_TYPES.SET_ROUTE_CALCULATING,
    }
}
