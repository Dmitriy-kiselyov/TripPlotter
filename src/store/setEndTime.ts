import { ACTION_TYPES } from '../types/actions';

export function setEndTime(time: string) {
    return {
        type: ACTION_TYPES.SET_END_TIME,
        time
    }
}
