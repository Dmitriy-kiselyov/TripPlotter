import {
    IAlgorithmParams,
    IAlgorithmOrganizationParam,
    IAlgorithmOutput,
    IAlgorithmTripItemOutput,
    IAlgorithmExtraOutput,
    IAlgorithmStartItemOutput,
    IAlgorithmFinishItemOutput, IAlgorithmDayOutput
} from '../../types/algorithm';
import { getRouteInfo, IRouteInfo } from './getRouteInfo';
import { PriorityQueue } from './priorityQueue';
import { IAlgorithmBestRoute, IAlgorithmRouteCallback } from './typings';
import { AlgorithmStopper } from './stopper';

interface IQueueNode {
    prevPath: IQueueNode | null; // экономим память на создание объектов
    cur: IAlgorithmTripItemOutputExtend;
    depth: number;
}

interface IAlgorithmTripItemOutputExtend extends IAlgorithmTripItemOutput {
    day: number; // порядковый номер даты
    finishTime: number; // для выбора лучшей точки
    finishDistance: number; // для формирования ответа алгоиритма
}

function nodeComparator(a: IQueueNode, b: IQueueNode): boolean {
    return a.cur.day !== b.cur.day ? a.cur.day < b.cur.day : a.cur.to < b.cur.to;
}

export async function bfsTripAlgorithm(algorithmParams: IAlgorithmParams, routeCb?: IAlgorithmRouteCallback, stopper?: AlgorithmStopper): Promise<IAlgorithmOutput> {
    const queue = new PriorityQueue<IQueueNode>(nodeComparator);

    queue.push({
        prevPath: null,
        cur: {
            id: 'start',
            from: algorithmParams.days[0].from,
            to: algorithmParams.days[0].from,
            day: 0,
            coordinates: algorithmParams.coordinates,
            distance: 0,
            finishTime: algorithmParams.days[0].from,
            finishDistance: 0,
        },
        depth: 0
    });

    let best = queue.peek();

    while (!queue.isEmpty()) {
        const prev = queue.pop();

        if (compareNodes(best, prev) < 0) {
            best = prev;

            routeCb && routeCb(prepareRouteCalculation(best));
        }

        if (stopper && stopper.isStopped()) {
            return prepareResult(best, algorithmParams);
        }

        const notVisitedOrganizations = algorithmParams.organizations.filter(org => !isVisited(prev, org.id));
        const promises = notVisitedOrganizations.map(org => countNextVertex(prev.cur, org, algorithmParams));
        const routes = await promiseAll(promises);

        for (const route of routes) {
            if (route !== null) {
                queue.push({
                    prevPath: prev,
                    cur: route,
                    depth: prev.depth + 1
                });
            }
        }
    }

    return prepareResult(best, algorithmParams);
}

function prepareRouteCalculation(best: IQueueNode): IAlgorithmBestRoute {
    const set: IAlgorithmBestRoute = new Set();

    while (best) {
        set.add(best.cur.id);

        best = best.prevPath;
    }

    return set;
}

function getExtraOutput(route: IAlgorithmTripItemOutput[], algorithmParams: IAlgorithmParams): IAlgorithmExtraOutput[] {
    const map = new Map<string, IAlgorithmOrganizationParam>(algorithmParams.organizations.map(r => [r.id, r]));

    route.forEach(org => map.delete(org.id));

    return Array.from(map.entries()).map(entry => ({ id: entry[0], coordinates: entry[1].coordinates }));
}

function isVisited(node: IQueueNode, id: string): boolean {
    do {
        if (node.cur.id === id) {
            return true;
        }

        node = node.prevPath;
    } while (node !== null);

    return false;
}

// a < b = < 0
function compareNodes(a: IQueueNode, b: IQueueNode): number {
    if (a.depth !== b.depth) {
        return a.depth - b.depth;
    }
    if (a.cur.day !== b.cur.day) {
        return a.cur.day - b.cur.day;
    }

    return a.cur.finishTime - b.cur.finishTime;
}

function promiseAll<T>(promises: Promise<T>[]): Promise<T[]> {
    if (promises.length === 0) {
        return Promise.resolve([]);
    }

    return new Promise(resolve => {
        const answers = new Array(promises.length);
        let count = 0;

        promises.forEach((promise, i) => {
            promise.then(answer => {
                answers[i] = answer;
                count++;

                if (count === answers.length) {
                    resolve(answers);
                }
            });
        });
    });
}

function countNextVertex(prev: IAlgorithmTripItemOutputExtend, next: IAlgorithmOrganizationParam, algorithmParams: IAlgorithmParams): Promise<IAlgorithmTripItemOutputExtend | null> {
    return getRouteInfo(prev.coordinates, next.coordinates, algorithmParams.coordinates, next.coordinates)
        .then(routeInfo => {
            let day = prev.day;
            let result = getNextTrimItem(prev.day, prev.to, next, algorithmParams, routeInfo[0], routeInfo[1]);

            while (!result && day + 1 < algorithmParams.days.length) {
                day++;

                result = getNextTrimItem(day, algorithmParams.days[day].from, next, algorithmParams, routeInfo[2], routeInfo[1]);
            }

            return result;
        });
}

function getNextTrimItem(
    day: number,
    fromTime: number,
    next: IAlgorithmOrganizationParam,
    algorithmParams: IAlgorithmParams,
    forwardRoute: IRouteInfo,
    backRoute: IRouteInfo
): IAlgorithmTripItemOutputExtend | null {
    const nextFromTime = fromTime + forwardRoute.time;
    const nextAvailableFromTime = closestAvailableTime(day, nextFromTime, next);

    if (nextAvailableFromTime == null) {
        return null;
    }

    const nextLeaveTime = nextAvailableFromTime + next.timeSpend;
    const estimateFinishTime = nextLeaveTime + backRoute.time;

    if (estimateFinishTime > algorithmParams.days[day].to) {
        return null;
    }

    const result: IAlgorithmTripItemOutputExtend = {
        id: next.id,
        from: nextFromTime,
        to: nextLeaveTime,
        day,
        coordinates: next.coordinates,
        distance: forwardRoute.distance,
        finishTime: nextLeaveTime + backRoute.time,
        finishDistance: backRoute.distance
    };

    if (nextAvailableFromTime - nextFromTime > 0) {
        result.wait = nextAvailableFromTime - nextFromTime;
    }

    return result;
}

function closestAvailableTime(day: number, time: number, org: IAlgorithmOrganizationParam): number | null {
    for (const available of org.available[day]) {
        if (available.from <= time && time + org.timeSpend <= available.to) {
            return time;
        }

        if (available.from > time && org.timeSpend <= available.to - available.from) {
            return available.from;
        }
    }

    return null;
}

function prepareResult(node: IQueueNode, algorithmParams: IAlgorithmParams): IAlgorithmOutput {
    let days: IAlgorithmDayOutput[] = [];
    let allRoutes: IAlgorithmTripItemOutput[] = [];

    for (let day = algorithmParams.days.length - 1; day >= 0; day--) {
        if (node.cur.day !== day) { // нечего делать в этот день
            days.push(null);
            continue;
        }

        const start: IAlgorithmStartItemOutput = {
            time: algorithmParams.days[day].from
        };
        const finish: IAlgorithmFinishItemOutput = {
            time: node.cur.finishTime,
            distance: node.cur.finishDistance
        };
        let route: IAlgorithmTripItemOutput[] = [];

        while(node.prevPath !== null && node.cur.day === day) {
            delete node.cur.finishTime;
            delete node.cur.finishDistance;
            delete node.cur.day;
            route.push(node.cur);

            node = node.prevPath;
        }

        route = route.reverse();
        allRoutes.push(...route);

        days.push({ start, route, finish });
    }

    days = days.reverse();

    const extra = getExtraOutput(allRoutes, algorithmParams);

    return {
        coordinates: algorithmParams.coordinates,
        days,
        extra
    };
}
