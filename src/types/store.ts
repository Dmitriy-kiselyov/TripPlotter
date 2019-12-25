import { IOrganization } from './organization';
import { IAssetName } from './assets';
import { IAlgorithmOutput } from './algorithm';

export interface IStore {
    startTime: string;
    endTime: string;
    date: Date | null;
    tripList: IStoreTripItem[];
    tripRoute?: IAlgorithmOutput;
}

export interface IStoreTripItem {
    organization: IOrganization;
    category: IAssetName;
    time: string;
}
