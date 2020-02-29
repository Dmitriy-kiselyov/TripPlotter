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
    start: IAlgorithmStartItemOutput;
    route: IAlgorithmTripItemOutput[];
    finish: IAlgorithmFinishItemOutput;
    extra?: IAlgorithmExtraOutput[];
}

export interface IAlgorithmTripItemOutput {
    id: string;
    from: number;
    to: number;
    wait?: number;
    coordinates: [number, number];
    distance: number;
}

export interface IAlgorithmStartItemOutput {
    coordinates: [number, number];
    time: number;
}

export interface IAlgorithmFinishItemOutput extends IAlgorithmStartItemOutput {
    distance: number;
}

export interface IAlgorithmExtraOutput {
    id: string;
    coordinates: [number, number];
}
