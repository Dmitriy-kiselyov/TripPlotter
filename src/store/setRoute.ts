import { ACTION_TYPES, IActionSetRoute } from '../types/actions';
import { IAlgorithmOutput } from '../types/algorithm';

export function setRoute(route: IAlgorithmOutput): IActionSetRoute {
    return {
        type: ACTION_TYPES.SET_ROUTE,
        route
    };
}
