import { ACTION_TYPES, IActionSetRoute } from '../types/actions';
import { IStoreTripRoute } from '../types/store';

export function setRoute(route: IStoreTripRoute): IActionSetRoute {
    return {
        type: ACTION_TYPES.SET_ROUTE,
        route
    };
}
