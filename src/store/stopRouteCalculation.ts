import { ACTION_TYPES, IActionStopRouteCalculation } from '../types/actions';

export function stopRouteCalculation(): IActionStopRouteCalculation {
    return {
        type: ACTION_TYPES.STOP_ROUTE_CALCULATION,
    }
}
