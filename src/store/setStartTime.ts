import { ACTION_TYPES } from '../types/actions';

export function setStartTime(time: string) {
    return {
        type: ACTION_TYPES.SET_START_TIME,
        time
    }
}
