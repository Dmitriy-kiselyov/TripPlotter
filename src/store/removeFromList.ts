import { IAssetName } from '../types/assets';
import { ACTION_TYPES, IActionRemoveFromList } from '../types/actions';

export function removeFromList(id: string): IActionRemoveFromList {
    return {
        type: ACTION_TYPES.REMOVE_FROM_LIST,
        id
    };
}
