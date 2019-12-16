import { ACTION_TYPES } from '../types/actions';

export function setDate(date: Date) {
    return {
        type: ACTION_TYPES.SET_DATE,
        date
    }
}
