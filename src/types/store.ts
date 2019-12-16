import { IOrganization } from './organization';
import { IAssetName } from './assets';

export interface IStore {
    startTime: string;
    endTime: string;
    date: Date | null;
    tripList: IStoreTripItem[];
}

export interface IStoreTripItem {
    organization: IOrganization;
    category: IAssetName;
    time: string;
}
