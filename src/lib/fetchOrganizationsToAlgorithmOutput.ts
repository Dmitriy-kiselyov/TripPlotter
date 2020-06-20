import {
    IAlgorithmDayOutput,
    IAlgorithmExtraOutput,
    IAlgorithmOutput,
    IAlgorithmTripItemOutput
} from '../types/algorithm';
import { IStoreTripRouteDay, IStoreTripRoute, IStoreTripRouteItem } from '../types/store';
import { store } from '../store/store';

export function fetchOrganizationsToAlgorithmOutput(output: IAlgorithmOutput): IStoreTripRoute {
    return {
        coordinates: output.coordinates,
        days: fetchTripDays(output.days),
        extra: output.extra ? fetchExtras(output.extra) : undefined,
    };
}

function fetchTripDays(days: Array<IAlgorithmDayOutput | null>): IStoreTripRouteDay[] {
    return days.map(day => {
        if (!day) {
            return null;
        }

        return {
            start: day.start,
            finish: day.finish,
            route: fetchTripList(day.route)
        }
    });
}

function fetchTripList(routeItems: IAlgorithmTripItemOutput[]): IStoreTripRouteItem[] {
    const { tripList } = store.getState();

    return routeItems.map(item => {
        for (const listItem of tripList) {
            if (item.id === listItem.organization.id) {
                return { ...item, ...listItem };
            }
        }
    });
}

function fetchExtras(extras: IAlgorithmExtraOutput[]) {
    const { tripList } = store.getState();

    return extras.map(item => {
        for (const listItem of tripList) {
            if (item.id === listItem.organization.id) {
                return { ...item, ...listItem };
            }
        }
    });
}

