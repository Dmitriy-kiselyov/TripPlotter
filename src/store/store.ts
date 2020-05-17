// @ts-ignore
import { createStore } from 'redux';

import { IStore, IStoreDate } from '../types/store';
import {
    ACTION_TYPES,
    IActionAddToList,
    IActionChangeTime,
    IActionRemoveFromList,
    IActions,
    IActionSetBalloon,
    IActionSetDate,
    IActionSetDateMode,
    IActionSetEndTime,
    IActionSetLocation,
    IActionSetRoute,
    IActionSetRouteDay,
    IActionSetStartTime
} from '../types/actions';
import { testStore } from '../test/initialStore';

function reducer(state: IStore, action: IActions): IStore {
    switch (action.type) {
        case ACTION_TYPES.ADD_TO_LIST:
            return reduceAddToList(state, action);
        case ACTION_TYPES.REMOVE_FROM_LIST:
            return reduceRemoveFromList(state, action);
        case ACTION_TYPES.CHANGE_TIME:
            return reduceChangeTime(state, action);
        case ACTION_TYPES.SET_START_TIME:
            return reduceSetStartTime(state, action);
        case ACTION_TYPES.SET_END_TIME:
            return reduceSetEndTime(state, action);
        case ACTION_TYPES.SET_DATE:
            return reduceSetDate(state, action);
        case ACTION_TYPES.SET_ROUTE:
            return reduceSetRoute(state, action);
        case ACTION_TYPES.REMOVE_ROUTE:
            return reduceRemoveRoute(state);
        case ACTION_TYPES.SET_BALLOON:
            return reduceSetBalloon(state, action);
        case ACTION_TYPES.SET_ROUTE_DAY:
            return reduceSetRouteDay(state, action);
        case ACTION_TYPES.SET_DATE_MODE:
            return reduceSetDateMode(state, action);
        case ACTION_TYPES.SET_ROUTE_CALCULATING:
            return reduceSetRouteCalculating(state);
        case ACTION_TYPES.SET_LOCATION:
            return reduceSetLocation(state, action);
        case ACTION_TYPES.REMOVE_LOCATION:
            return reduceRemoveLocation(state);
        default:
            return state;
    }
}

function reduceAddToList(state: IStore, action: IActionAddToList): IStore {
    return {
        ...state,
        tripList: state.tripList.concat({
            organization: action.organization,
            category: action.category,
            time: action.time
        })
    }
}

function reduceRemoveFromList(state: IStore, action: IActionRemoveFromList): IStore {
    let newState = { ...state };

    if (action.id === state.openedBalloon) {
        delete newState.openedBalloon;
    }

    newState.tripList = newState.tripList.filter(item => item.organization.id !== action.id);

    return newState;
}

function reduceChangeTime(state: IStore, action: IActionChangeTime): IStore {
    return {
        ...state,
        tripList: state.tripList.map(item => {
            if (item.organization.id === action.id) {
                return {
                    ...item,
                    time: action.time
                }
            }

            return item;
        })
    }
}

function reduceSetStartTime(state: IStore, action: IActionSetStartTime) {
    return {
        ...state,
        startTime: action.time
    };
}

function reduceSetEndTime(state: IStore, action: IActionSetEndTime) {
    return {
        ...state,
        endTime: action.time
    };
}

function reduceSetDate(state: IStore, action: IActionSetDate) {
    return {
        ...state,
        date: action.date
    }
}

function reduceSetRoute(state: IStore, action: IActionSetRoute) {
    const newState = {
        ...state,
        tripRoute: action.route,
        routeCalculating: false
    };

    if (action.route.days.length > 1) {
        newState.tripRouteDay = 0;
    }

    return newState;
}

function reduceRemoveRoute(state: IStore) {
    const { tripRoute, ...newState } = state;

    return newState;
}

function reduceSetBalloon(state: IStore, action: IActionSetBalloon): IStore {
    if (!action.id) {
        const { openedBalloon, ...newState } = state;

        return newState;
    }

    return {
        ...state,
        openedBalloon: action.id
    };
}

function reduceSetRouteDay(state: IStore, action: IActionSetRouteDay): IStore {
    return {
        ...state,
        tripRouteDay: action.day
    }
}

function reduceSetDateMode(state: IStore, action: IActionSetDateMode): IStore {
    let date: IStoreDate = null;

    if (action.mode === 'multi') {
        if (state.date && !Array.isArray(state.date)) {
            const nextDate = new Date(state.date.getTime());

            nextDate.setDate(nextDate.getDate() + 1);

            date = [state.date, nextDate];
        } else {
            date = [null, null];
        }
    } else {
        if (Array.isArray(state.date)) {
            date = state.date[0];
        }
    }

    return {
        ...state,
        date
    };
}

function reduceSetRouteCalculating(state: IStore): IStore {
    return {
        ...state,
        routeCalculating: true,
    }
}

function reduceSetLocation(state: IStore, action: IActionSetLocation): IStore {
    const { type, ...location } = action;

    return {
        ...state,
        location
    }
}

function reduceRemoveLocation(state: IStore): IStore {
    return {
        ...state,
        location: null
    }
}

const initialStore: IStore = {
    startTime: '',
    endTime: '',
    date: null,
    tripList: []
};

export const store = createStore(
    reducer,
    testStore,
    // @ts-ignore https://github.com/zalmoxisus/redux-devtools-extension#usage
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
