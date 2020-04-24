import { ACTION_TYPES, IActionSetRouteDay } from '../types/actions';

export function setRouteDay(day: number): IActionSetRouteDay {
    return {
        type: ACTION_TYPES.SET_ROUTE_DAY,
        day
    };
}
