import { IObjectManager, IBalloonFactory } from '../types';
import { IOrganization } from '../../../types/organization';
import { getBalloonLayout } from './getBalloonLayout';
import { IAssetName } from '../../../types/assets';

export function getObjectManagerProps(category: IAssetName, organizations: IOrganization[], balloonFactory: IBalloonFactory): IObjectManager {
    const features = organizations.map(org => {
        return {
            type: 'Feature' as 'Feature',
            id: org.id,
            category,
            geometry: org.geometry,
            properties: {
                hintContent: org.name
            },
            options: {
                balloonContentLayout: getBalloonLayout(balloonFactory)
            },
        }
    });

    return {
        type: 'FeatureCollection',
        features
    }
}
