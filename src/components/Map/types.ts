import React from 'react';

import { IGeometry } from '../../types/organization';
import { IAssetName } from '../../types/assets';

export interface IObjectManager {
    type: 'FeatureCollection';
    features: IObjectManagerFeature[];
}

export interface IObjectManagerFeature {
    type: 'Feature';
    id: string;
    category: IAssetName;
    geometry: IGeometry;
    properties: IObjectManagerProperties;
    options: IObjectManagerOptions;
}

export interface IObjectManagerProperties {
    hintContent?: string;
}

export interface IObjectManagerOptions {
    balloonContentLayout: any;
    preset?: string;
}

export type IBalloonFactory = (props: IBalloonFactoryProps) => React.ReactElement;

export interface IBalloonFactoryProps {
    id: string;
    category: IAssetName;
}
