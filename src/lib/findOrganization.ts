import { loadAsset } from './loadAsset';
import { IOrganization } from '../types/organization';

import { IAssetName } from '../types/assets';


export function findOrganization(category: IAssetName, id: string): IOrganization | null {
    const organizations = getOrganizations(category);

    for (const organization of organizations) {
        if (organization.id === id) {
            return organization;
        }
    }

    return null;
}

/*
 * Делаем вид, что ассет всегда загружен, а организация всегда есть
 * Потому что это правда, а обрабатывать нереальные случаи влом
 */
function getOrganizations(category: IAssetName): IOrganization[] {
    let organizations;

    loadAsset(category, asset => {
        organizations = asset;
    });

    return organizations;
}
