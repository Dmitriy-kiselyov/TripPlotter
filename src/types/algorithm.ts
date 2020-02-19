export interface IAlgorithmParams {
    from: number;
    to: number;
    coordinates: [number, number];
    organizations: IAlgorithmOrganizationParam[];
}

export interface IAlgorithmOrganizationParam {
    coordinates: [number, number];
    id: string;
    timeSpend: number;
    available: IAlgorithmAvailableParam[];
}

export interface IAlgorithmAvailableParam {
    from: number;
    to: number;
}

export interface IAlgorithmOutput {
    route: IAlgorithmTripOutput[];
    extra?: IAlgorithmExtraOutput[];
}

export interface IAlgorithmTripOutput {
    id: string;
    from: number;
    to: number;
    wait?: number;
    coordinates: [number, number];
}

export interface IAlgorithmExtraOutput {
    id: string;
    coordinates: [number, number];
}
