import { ACTION_TYPES, IActionSetBalloon } from '../types/actions';

export function setBalloon(id: string): IActionSetBalloon {
    return {
        type: ACTION_TYPES.SET_BALLOON,
        id
    };
}
