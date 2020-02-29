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
    date: Date | null;
    tripList: IStoreTripItem[];
    tripRoute?: IStoreTripRoute;
    openedBalloon?: string;
}

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
