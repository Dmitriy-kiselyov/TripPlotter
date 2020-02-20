import { IOrganization } from './organization';
import { IAssetName } from './assets';
import { IStoreTripRoute } from './store';

export enum ACTION_TYPES {
    ADD_TO_LIST = 'ADD_TO_LIST',
    CHANGE_TIME = 'CHANGE_TIME',
    REMOVE_FROM_LIST = 'REMOVE_FROM_LIST',
    SET_START_TIME = 'SET_START_TIME',
    SET_END_TIME = 'SET_END_TIME',
    SET_DATE = 'SET_DATE',
    SET_ROUTE = 'SET_ROUTE',
    REMOVE_ROUTE = 'REMOVE_ROUTE',
    SET_BALLOON = 'SET_BALLOON'
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

export interface IActionSetStartTime {
    type: ACTION_TYPES.SET_START_TIME;
    time: string;
}

export interface IActionSetEndTime {
    type: ACTION_TYPES.SET_END_TIME;
    time: string;
}

export interface IActionSetDate {
    type: ACTION_TYPES.SET_DATE;
    date: Date;
}

export interface IActionSetRoute {
    type: ACTION_TYPES.SET_ROUTE;
    route: IStoreTripRoute;
}

export interface IActionRemoveRoute {
    type: ACTION_TYPES.REMOVE_ROUTE;
}

export interface IActionSetBalloon {
    type: ACTION_TYPES.SET_BALLOON;
    id: string | null;
}

export type IActions = IActionAddToList | IActionChangeTime | IActionRemoveFromList |
    IActionSetStartTime | IActionSetEndTime | IActionSetDate | IActionSetRoute | IActionRemoveRoute | IActionSetBalloon;
