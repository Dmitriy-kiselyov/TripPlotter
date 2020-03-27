import { IOrganization } from './organization';
import { IAssetName } from './assets';
import {
    IAlgorithmExtraOutput,
    IAlgorithmOutput,
    IAlgorithmTripItemOutput,
    IAlgorithmStartItemOutput,
    IAlgorithmFinishItemOutput
} from './algorithm';

export interface IStore {
    startTime: string;
    endTime: string;
    date: IStoreDate;
    tripList: IStoreTripItem[];
    tripRoute?: IStoreTripRoute;
    openedBalloon?: string;
}

export type IStoreDate = null | Date | [null, null] | [Date, Date];

export interface IStoreTripItem {
    organization: IOrganization;
    category: IAssetName;
    time: string;
}

export interface IStoreTripRoute extends IAlgorithmOutput {
    start: IAlgorithmStartItemOutput;
    route: IStoreTripRouteItem[];
    finish: IAlgorithmFinishItemOutput;
    extra?: IStoreTripRouteExtra[];
}

export type IStoreTripRouteStart = IAlgorithmStartItemOutput;
export type IStoreTripRouteFinish = IAlgorithmFinishItemOutput;
export type IStoreTripRouteItem = IAlgorithmTripItemOutput & IStoreTripItem;
export type IStoreTripRouteExtra = IAlgorithmExtraOutput & IStoreTripItem;
