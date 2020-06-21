import { getAsset } from './loadAsset';
import { IOrganization } from '../types/organization';

import { IAssetName } from '../types/assets';
import { getFromFirstOrganizations } from './firstOrganizations';

export function findOrganization(category: IAssetName, id: string): IOrganization | null {
    let organizations = getAsset(category);

    if (!organizations) {
        return getFromFirstOrganizations(id);
    }

    for (const organization of organizations) {
        if (organization.id === id) {
            return organization;
        }
    }

    return null;
}
