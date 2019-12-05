import { IGeometry } from '../../types/organization';

export interface IObjectManager {
    type: 'FeatureCollection';
    features: IObjectManagerFeature[];
}

export interface IObjectManagerFeature {
    type: 'Feature';
    id: number;
    geometry: IGeometry;
    properties: IBalloon;
}

export interface IBalloon {
    balloonContentBody: string;
}
