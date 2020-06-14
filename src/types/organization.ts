export interface IOrganization {
    id: string;
    name: string;
    address: string;
    url?: string;
    Categories: ICategory[];
    Hours?: IHours;
    Phones?: IPhone[];
    geometry: IGeometry;
    extra: IOrganizationExtra;
}

export interface IOrganizationExtra {
    rating: number;
    count: number;
}

export interface ICategory {
    class?: string;
    name: string;
}

export interface IHours {
    text: string;
    Availabilities: IAvailableHours[];
}

export interface IAvailableHours {
    Intervals?: IHourInterval[];
    TwentyFourHours?: boolean;

    Everyday?: boolean;
    Weekdays?: boolean;
    Weekend?: boolean;
    Monday?: boolean;
    Tuesday?: boolean;
    Wednesday?: boolean;
    Thursday?: boolean;
    Friday?: boolean;
    Saturday?: boolean;
    Sunday?: boolean;
}

export interface IHourInterval {
    from: string;
    to: string;
}

export interface IPhone {
    type: string;
    formatted: string;
}

export interface IGeometry {
    type: 'Point';
    coordinates: [number, number]
}
