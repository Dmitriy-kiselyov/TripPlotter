import { IObjectManager } from '../types';
import { IOrganization } from '../../../types/organization';

export function getObjectManagerProps(organizations: IOrganization[]): IObjectManager {
    const features = organizations.map(org => {
        return {
            type: 'Feature' as 'Feature',
            id: Number(org.id),
            geometry: org.geometry,
            properties: {
                balloonContentBody: org.name
            }
        }
    });

    return {
        type: 'FeatureCollection',
        features
    }
}
