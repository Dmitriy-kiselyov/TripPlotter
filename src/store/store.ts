// @ts-ignore
import { createStore } from 'redux';

import { IStore } from '../types/store';
import {
    ACTION_TYPES,
    IActionAddToList,
    IActionChangeTime,
    IActionRemoveFromList,
    IActions,
    IActionSetDate,
    IActionSetEndTime,
    IActionSetStartTime
} from '../types/actions';

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
    return {
        ...state,
        tripList: state.tripList.filter(item => item.organization.id !== action.id)
    }
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

const initialStore: IStore = {
    startTime: '',
    endTime: '',
    date: null,
    tripList: []
};

export const store = createStore(
    reducer,
    initialStore,
    // @ts-ignore https://github.com/zalmoxisus/redux-devtools-extension#usage
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
