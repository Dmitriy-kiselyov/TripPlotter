import { IObjectManager, IBalloonFactory, IObjectManagerFeature } from '../types';
import { IOrganization } from '../../../types/organization';
import { getBalloonLayout } from './getBalloonLayout';
import { orgColor, orgPreset } from './colors';
import { IAssetName } from '../../../types/assets';
import { IStoreTripItem } from '../../../types/store';

export function getOrganizationsFeatures(category: IAssetName, organizations: IOrganization[], balloonFactory: IBalloonFactory): IObjectManagerFeature[] {
    return organizations.map(org => getFeatureFromOrganization(category, org, balloonFactory));
}

export function getTripListFeatures(tripList: IStoreTripItem[], balloonFactory: IBalloonFactory): IObjectManagerFeature[] {
    return tripList.map(tripItem => getFeatureFromOrganization(tripItem.category, tripItem.organization, balloonFactory));
}

function getFeatureFromOrganization(category: IAssetName, org: IOrganization, balloonFactory: IBalloonFactory): IObjectManagerFeature {
    return {
        type: 'Feature' as 'Feature',
        id: org.id,
        category,
        geometry: org.geometry,
        properties: {
            hintContent: org.name
        },
        options: {
            balloonContentLayout: getBalloonLayout(balloonFactory),
            preset: orgPreset,
            iconColor: orgColor
        },
    }
}

export function getObjectManagerProps(features: IObjectManagerFeature[]): IObjectManager {
    return {
        type: 'FeatureCollection',
        features
    }
}
