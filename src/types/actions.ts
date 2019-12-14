import { IOrganization } from './organization';
import { IAssetName } from './assets';

export enum ACTION_TYPES {
    ADD_TO_LIST = 'ADD_TO_LIST',
    CHANGE_TIME = 'CHANGE_TIME',
    REMOVE_FROM_LIST = 'REMOVE_FROM_LIST'
}

export interface IActionAddToList {
    type: ACTION_TYPES.ADD_TO_LIST,
    category: IAssetName,
    organization: IOrganization,
    time: string
}

export interface IActionChangeTime {
    type: ACTION_TYPES.CHANGE_TIME;
    id: string;
    time: string;
}

export interface IActionRemoveFromList {
    type: ACTION_TYPES.REMOVE_FROM_LIST;
    id: string;
}

export type IActions = IActionAddToList | IActionChangeTime | IActionRemoveFromList;
