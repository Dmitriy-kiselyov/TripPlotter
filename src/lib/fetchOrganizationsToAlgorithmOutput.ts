import { IAlgorithmExtraOutput, IAlgorithmOutput, IAlgorithmTripOutput } from '../types/algorithm';
import { IStoreTripItem, IStoreTripRoute } from '../types/store';
import { store } from '../store/store';
import { getStartLocation } from './getAlgorithmParams';

export function fetchOrganizationsToAlgorithmOutput(route: IAlgorithmOutput): IStoreTripRoute {
    return {
        route: fetchTripList(route.route),
        extra: route.extra ? fetchExtras(route.extra) : undefined,
        location: getStartLocation()
    };
}

function fetchTripList(routeItems: IAlgorithmTripOutput[]) {
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

