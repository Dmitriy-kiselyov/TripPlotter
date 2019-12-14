import { IOrganization } from '../types/organization';
import { IAssetName } from '../types/assets';
import { ACTION_TYPES, IActionAddToList } from '../types/actions';

export function addToList(category: IAssetName, organization: IOrganization, time: string): IActionAddToList {
    return {
        type: ACTION_TYPES.ADD_TO_LIST,
        category,
        organization,
        time
    };
}
