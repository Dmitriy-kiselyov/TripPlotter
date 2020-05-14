import { IOrganization } from './organization';
import { IAssetName } from './assets';
import {
    IAlgorithmExtraOutput,
    IAlgorithmOutput,
    IAlgorithmTripItemOutput,
    IAlgorithmStartItemOutput,
    IAlgorithmFinishItemOutput, IAlgorithmDayOutput
} from './algorithm';

export interface IStore {
    startTime: string;
    endTime: string;
    date: IStoreDate;
    location?: IStoreLocation;
    tripRouteDay?: number;
    tripList: IStoreTripItem[];
    tripRoute?: IStoreTripRoute;
    openedBalloon?: string;
    routeCalculating?: boolean;
}

export type IStoreFilledDate = Date | [Date, Date];
export type IStoreDate = IStoreFilledDate | null | [null, null];

export interface IStoreLocation {
    coords: [number, number];
    auto: boolean;
}

export interface IStoreTripItem {
    organization: IOrganization;
    category: IAssetName;
    time: string;
}

export interface IStoreTripRoute extends IAlgorithmOutput {
    days: Array<IStoreTripRouteDay | null>; // null – нечего делать в этот день
    extra?: IStoreTripRouteExtra[];
}

export type IStoreTripRouteStart = IAlgorithmStartItemOutput;
export type IStoreTripRouteFinish = IAlgorithmFinishItemOutput;
export type IStoreTripRouteItem = IAlgorithmTripItemOutput & IStoreTripItem;
export interface IStoreTripRouteDay extends IAlgorithmDayOutput { route: IStoreTripRouteItem[] }
export type IStoreTripRouteExtra = IAlgorithmExtraOutput & IStoreTripItem;
