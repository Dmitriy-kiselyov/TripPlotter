import { ACTION_TYPES, IActionSetDate } from '../types/actions';
import { IStoreDate } from '../types/store';

export function setDate(date: IStoreDate): IActionSetDate {
    return {
        type: ACTION_TYPES.SET_DATE,
        date
    }
}
