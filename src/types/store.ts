import { IOrganization } from './organization';
import { IAssetName } from './assets';
import { IAlgorithmExtraOutput, IAlgorithmOutput, IAlgorithmTripOutput } from './algorithm';

export interface IStore {
    startTime: string;
    endTime: string;
    date: Date | null;
    tripList: IStoreTripItem[];
    tripRoute?: IStoreTripRoute;
}

export interface IStoreTripItem {
    organization: IOrganization;
    category: IAssetName;
    time: string;
}

export interface IStoreTripRoute extends IAlgorithmOutput {
    tripList: IStoreTripRouteItem[];
    extra?: IStoreTripRouteExtra[];
    location: [number, number];
}

export type IStoreTripRouteItem = IAlgorithmTripOutput & IStoreTripItem;
export type IStoreTripRouteExtra = IAlgorithmExtraOutput & IStoreTripItem;
