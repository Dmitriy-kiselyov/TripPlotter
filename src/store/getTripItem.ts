import { store } from './store';
import { IStoreTripItem } from '../types/store';

export function getTripItem(id: string): IStoreTripItem | null {
    const state = store.getState();

    for (const item of state.tripList) {
        if (item.organization.id === id) {
            return item;
        }
    }

    return null;
}
