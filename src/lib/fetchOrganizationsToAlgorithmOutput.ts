import { IAlgorithmExtraOutput, IAlgorithmOutput, IAlgorithmTripItemOutput } from '../types/algorithm';
import { IStoreTripRoute } from '../types/store';
import { store } from '../store/store';

export function fetchOrganizationsToAlgorithmOutput(route: IAlgorithmOutput): IStoreTripRoute {
    return {
        start: route.start,
        route: fetchTripList(route.route),
        finish: route.finish,
        extra: route.extra ? fetchExtras(route.extra) : undefined,
    };
}

function fetchTripList(routeItems: IAlgorithmTripItemOutput[]) {
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

