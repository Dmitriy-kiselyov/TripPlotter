import { IObjectManager, IObjectManagerFeature } from '../types';
import { IOrganization } from '../../../types/organization';
import { getBalloonLayout } from './getBalloonLayout';
import { orgColor, orgPreset } from './colors';
import { IAssetName } from '../../../types/assets';
import { IStoreTripItem } from '../../../types/store';

export function getOrganizationsFeatures(category: IAssetName, organizations: IOrganization[]): IObjectManagerFeature[] {
    return organizations.map(org => getFeatureFromOrganization(category, org));
}

export function getTripListFeatures(tripList: IStoreTripItem[]): IObjectManagerFeature[] {
    return tripList.map(tripItem => getFeatureFromOrganization(tripItem.category, tripItem.organization));
}

function getFeatureFromOrganization(category: IAssetName, org: IOrganization): IObjectManagerFeature {
    return {
        type: 'Feature' as 'Feature',
        id: org.id,
        category,
        geometry: org.geometry,
        properties: {
            hintContent: org.name
        },
        options: {
            balloonContentLayout: getBalloonLayout(),
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
