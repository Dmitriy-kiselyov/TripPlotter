import { ACTION_TYPES, IActionRemoveRoute } from '../types/actions';

export function removeRoute(): IActionRemoveRoute {
    return {
        type: ACTION_TYPES.REMOVE_ROUTE
    };
}
