import { IOrganization } from './organization';
import { IAssetName } from './assets';

export interface IStore {
    tripList: IStoreTripItem[];
}

export interface IStoreTripItem {
    organization: IOrganization;
    category: IAssetName;
    time: string;
}
