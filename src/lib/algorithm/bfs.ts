import {
    IAlgorithmParams,
    IAlgorithmOrganizationParam,
    IAlgorithmOutput,
    IAlgorithmTripItemOutput,
    IAlgorithmExtraOutput,
    IAlgorithmAvailableParam,
    IAlgorithmStartItemOutput, IAlgorithmFinishItemOutput
} from '../../types/algorithm';
import { getRouteInfo } from './getRouteInfo';
import { PriorityQueue } from './priorityQueue';

export type ITripAlgorithmCallback = (trip: IAlgorithmOutput) => void;

interface IQueueNode {
    prevPath: IQueueNode | null; // экономим память на создание объектов
    cur: IAlgorithmTripItemOutputExtend;
    depth: number;
}

interface IAlgorithmTripItemOutputExtend extends IAlgorithmTripItemOutput {
    finishTime: number; // для выбора лучшей точки
    finishDistance: number; // для формирования ответа алгоиритма
}

export async function bfsTripAlgorithm(algorithmParams: IAlgorithmParams, callback: ITripAlgorithmCallback) {
    const queue = new PriorityQueue<IQueueNode>((a, b) => a.cur.to < b.cur.to);

    queue.push({
        prevPath: null,
        cur: {
            id: 'start',
            from: algorithmParams.from,
            to: algorithmParams.from,
            coordinates: algorithmParams.coordinates,
            distance: 0,
            finishTime: 0,
            finishDistance: 0,
        },
        depth: 0
    });

    let best = queue.peek();

    while (!queue.isEmpty()) {
        const prev = queue.pop();

        if (compareNodes(best, prev) < 0) {
            best = prev;
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

    callback(prepareResult(best, algorithmParams));
}

function prepareResult(node: IQueueNode, algorithmParams: IAlgorithmParams): IAlgorithmOutput {
    const start: IAlgorithmStartItemOutput = {
        coordinates: algorithmParams.coordinates,
        time: algorithmParams.from
    };
    const finish: IAlgorithmFinishItemOutput = {
        coordinates: algorithmParams.coordinates,
        time: node.cur.finishTime,
        distance: node.cur.finishDistance
    };

    let route: IAlgorithmTripItemOutput[] = [];

    while(node.prevPath !== null) {
        delete node.cur.finishTime;
        delete node.cur.finishDistance;
        route.push(node.cur);

        node = node.prevPath;
    }

    route = route.reverse();

    const extra = getExtraOutput(route, algorithmParams);

    return {
        start,
        route,
        finish,
        extra
    };
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
    return getRouteInfo(prev.coordinates, next.coordinates, algorithmParams.coordinates)
        .then(routeInfo => {
            const nextFromTime = prev.to + routeInfo[0].time;
            const nextAvailableFromTime = closestAvailableTime(nextFromTime, next);

            if (nextAvailableFromTime == null) {
                return null;
            }

            const nextLeaveTime = nextAvailableFromTime + next.timeSpend;
            const estimateFinishTime = nextLeaveTime + routeInfo[1].time;

            if (estimateFinishTime > algorithmParams.to) {
                return null;
            }

            const result: IAlgorithmTripItemOutputExtend = {
                id: next.id,
                from: nextFromTime,
                to: nextLeaveTime,
                coordinates: next.coordinates,
                distance: routeInfo[0].distance,
                finishTime: nextLeaveTime + routeInfo[1].time,
                finishDistance: routeInfo[1].distance
            };

            if (nextAvailableFromTime - nextFromTime > 0) {
                result.wait = nextAvailableFromTime - nextFromTime;
            }

            return result;
        });
}

function closestAvailableTime(time: number, org: IAlgorithmOrganizationParam): number | null {
    for (const available of org.available) {
        if (available.from <= time && time + org.timeSpend <= available.to) {
            return time;
        }

        if (available.from > time && org.timeSpend <= available.to - available.from) {
            return available.from;
        }
    }

    return null;
}
