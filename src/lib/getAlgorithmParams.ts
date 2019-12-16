import { store } from '../store/store';
import { IAlgorithmParams, IAlgorithmOrganizationParam, IAlgorithmAvailableParam } from '../types/algorithm';
import { parseTime } from './time';
import { IStoreTripItem } from '../types/store';
import { IAvailableHours, IHourInterval, IHours } from '../types/organization';

export function getAlgorithmParams(): IAlgorithmParams {
    const state = store.getState();

    return {
        from: parseTime(state.startTime),
        to: parseTime(state.endTime),
        coordinates: [44.936675, 34.134293], // универ
        organizations: state.tripList.map((item: IStoreTripItem) => getOrganizationParams(item, state.date))
    }
}

function getOrganizationParams(item: IStoreTripItem, date: Date): IAlgorithmOrganizationParam {
    return {
        coordinates: item.organization.geometry.coordinates,
        id: item.organization.id,
        timeSpend: parseTime(item.time),
        available: getAvailable(item.organization.Hours, date)
    }
}

function getAvailable(availableHours: IHours | undefined, date: Date): IAlgorithmAvailableParam[] {
    const allDayHours = {
        from: 0,
        to: 24 * 60
    };

    if (!availableHours) {
        return [allDayHours];
    }

    const hours: IAlgorithmAvailableParam[] = [];
    const weekNames = getWeekNames(date);

    for (const available of availableHours.Availabilities) {
        let match = false;

        for (const week of weekNames) {
            if (available[week]) {
                match = true;
                break;
            }
        }

        if (!match) {
            continue;
        }

        if (available.Intervals) {
            pushIntervals(hours, available.Intervals)
        } else { // TwentyFourHours
            hours.push(allDayHours);
        }
    }

    return hours;
}

type IWeekKey = keyof IAvailableHours;

function getWeekNames(date: Date): IWeekKey[] {
    let day = date.getDay();

    if (day === 0) {
        day = 7; // вс
    }

    const weekNames: IWeekKey[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const names: IWeekKey[] = ['Everyday', weekNames[day - 1]];

    if (day <= 5) {
        names.push('Weekdays');
    } else {
        names.push('Weekend');
    }

    return names;
}

function pushIntervals(available: IAlgorithmAvailableParam[], hourIntervals: IHourInterval[]) {
    for (const hourInterval of hourIntervals) {
        available.push({
            from: parseTime(hourInterval.from),
            to: parseTime(hourInterval.to)
        })
    }
}
