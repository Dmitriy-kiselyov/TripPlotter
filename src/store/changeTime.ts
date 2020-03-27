import { ACTION_TYPES, IActionChangeTime } from '../types/actions';

export function changeTime(id: string, time: string): IActionChangeTime {
    return {
        type: ACTION_TYPES.CHANGE_TIME,
        id,
        time
    };
}
