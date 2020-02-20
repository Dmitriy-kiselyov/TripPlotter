import { getAsset } from './loadAsset';
import { IOrganization } from '../types/organization';

import { IAssetName } from '../types/assets';

export function findOrganization(category: IAssetName, id: string): IOrganization | null {
    const organizations = getAsset(category);

    if (!organizations) {
        return null;
    }

    for (const organization of organizations) {
        if (organization.id === id) {
            return organization;
        }
    }

    return null;
}
