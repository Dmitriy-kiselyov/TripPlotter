import { IOrganization } from './organization';
import { IAssetName } from './assets';
import { IStoreDate, IStoreTripRoute } from './store';

export enum ACTION_TYPES {
    ADD_TO_LIST = 'ADD_TO_LIST',
    CHANGE_TIME = 'CHANGE_TIME',
    REMOVE_FROM_LIST = 'REMOVE_FROM_LIST',
    SET_START_TIME = 'SET_START_TIME',
    SET_END_TIME = 'SET_END_TIME',
    SET_DATE = 'SET_DATE',
    SET_ROUTE = 'SET_ROUTE',
    REMOVE_ROUTE = 'REMOVE_ROUTE',
    SET_BALLOON = 'SET_BALLOON',
    SET_DATE_MODE = 'SET_DATE_MODE',
    SET_ROUTE_DAY = 'SET_ROUTE_DAY',
    SET_ROUTE_CALCULATING = 'SET_ROUTE_CALCULATING'
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
    date: IStoreDate;
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

export interface IActionSetDateMode {
    type: ACTION_TYPES.SET_DATE_MODE;
    mode: 'single' | 'multi';
}

export interface IActionSetRouteDay {
    type: ACTION_TYPES.SET_ROUTE_DAY;
    day: number;
}

export interface IActionSetTripCalculating {
    type: ACTION_TYPES.SET_ROUTE_CALCULATING;
}

export type IActions = IActionAddToList | IActionChangeTime | IActionRemoveFromList | IActionSetStartTime |
    IActionSetEndTime | IActionSetDate | IActionSetRoute | IActionRemoveRoute | IActionSetBalloon | IActionSetDateMode |
    IActionSetRouteDay | IActionSetTripCalculating;
