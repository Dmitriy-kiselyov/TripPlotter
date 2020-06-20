import { IStoreRouteCalculation } from '../../types/store';

export type IAlgorithmBestRoute = IStoreRouteCalculation;
export type IAlgorithmRouteCallback = (route: IAlgorithmBestRoute) => void;
