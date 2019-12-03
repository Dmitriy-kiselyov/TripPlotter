export interface ICompany {
    id: string;
    name: string;
    address: string;
    url?: string;
    Categories: ICategory[];
    Hours?: IHours;
    Phones?: IPhone[];
}

export interface ICategory {
    class: string;
    name: string;
}

export interface IHours {
    text: string;
    Availabilities: IAvaliableHours[];
}

export interface IAvaliableHours {
    Intervals?: IHourInterval[];
    TwentyFourHours?: boolean;

    Everyday?: boolean;
    Weekdays?: string;
    Weekend?: string;
    Monday?: string;
    Tuesday?: string;
    Wednesday?: string;
    Thursday?: string;
    Friday?: string;
    Saturday?: string;
    Sunday?: string;
}

export interface IHourInterval {
    from: string;
    to: string;
}

export interface IPhone {
    type: string;
    formatted: string;
}
