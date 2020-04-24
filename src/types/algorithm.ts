export interface IAlgorithmParams {
    days: IAlgorithmDayParam[];
    coordinates: [number, number];
    organizations: IAlgorithmOrganizationParam[];
}

export interface IAlgorithmDayParam {
    from: number;
    to: number;
}

export interface IAlgorithmOrganizationParam {
    coordinates: [number, number];
    id: string;
    timeSpend: number;
    available: IAlgorithmAvailableParam[][];
}

export interface IAlgorithmAvailableParam {
    from: number;
    to: number;
}

export interface IAlgorithmOutput {
    coordinates: [number, number];
    days: Array<IAlgorithmDayOutput | null>; // null – нечего делать в этот день
    extra?: IAlgorithmExtraOutput[];
}

export interface IAlgorithmDayOutput {
    start: IAlgorithmStartItemOutput;
    route: IAlgorithmTripItemOutput[];
    finish: IAlgorithmFinishItemOutput;
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
    time: number;
}

export interface IAlgorithmFinishItemOutput extends IAlgorithmStartItemOutput {
    distance: number;
}

export interface IAlgorithmExtraOutput {
    id: string;
    coordinates: [number, number];
}
