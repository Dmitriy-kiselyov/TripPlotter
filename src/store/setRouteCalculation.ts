import { ACTION_TYPES, IActionSetRouteCalculation } from '../types/actions';
import { IStoreRouteCalculation } from '../types/store';

export function setRouteCalculation(current?: IStoreRouteCalculation): IActionSetRouteCalculation {
    return {
        type: ACTION_TYPES.SET_ROUTE_CALCULATION,
        current,
    }
}
