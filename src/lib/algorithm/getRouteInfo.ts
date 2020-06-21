declare const ymaps: any;

export interface IRouteInfo {
    time: number; // в минутах
    distance: number; // в метрах
}

const cache: Map<string, IRouteInfo> = new Map();

// @ts-ignore Для тестирования алгоритма на сервере
window.__routeInfoCache = cache;

const throttleTime = 50; // в мс
let lastTime = 0;

/*
 * Чтобы основное ядро отдыхало и страница не висла
 */
function throttlePromise<T>(data: T): Promise<T> {
    const curTime = Date.now();

    if (curTime - lastTime > throttleTime) {
        lastTime = curTime;

        return new Promise(resolve => {
            setTimeout(() => resolve(data), 0);
        });
    }

    return Promise.resolve(data);
}

export function getRouteInfo(...coordinates: [number, number][]): Promise<IRouteInfo[]> {
    const info = tryGetCacheInfo(coordinates);

    if (info) {
        return throttlePromise(info);
    }

    return ymaps.route(coordinates, { routingMode: 'auto' })
        .then((route: any) => {
            const info: IRouteInfo[] = [];

            for (let i = 1; i < coordinates.length; i++) {
                const routeInfo = {
                    time: getPathTime(route.getPaths().get(i - 1)),
                    distance: route.getPaths().get(0).getLength()
                };
                const key = createKey(coordinates[i - 1], coordinates[i]);

                cache.set(key, routeInfo);
                info.push(routeInfo);
            }

            return info;
        });
}

function getPathTime(path: any): number {
    let time: number = path.getTime() / 60;

    time *= 1.1; // карты слишком оптимистичны
    time += 5; // 5 минут на разобраться с парковкой

    return Math.floor(time);
}

function tryGetCacheInfo(coordinates: [number, number][]): IRouteInfo[] | null {
    const info: IRouteInfo[] = [];

    for (let i = 1; i < coordinates.length; i++) {
        const key = createKey(coordinates[i - 1], coordinates[i]);
        const routeInfo = cache.get(key);

        if (!routeInfo) {
            return null;
        }

        info.push(routeInfo);
    }

    return info;
}

function createKey(coord1: [number, number], coord2: [number, number]): string {
    return coord1.join(';') + ';' + coord2.join(';');
}
