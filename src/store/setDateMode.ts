import { ACTION_TYPES, IActionSetDateMode } from '../types/actions';

export function setDateMode(mode: 'single' | 'multi'): IActionSetDateMode {
    return {
        type: ACTION_TYPES.SET_DATE_MODE,
        mode
    };
}
