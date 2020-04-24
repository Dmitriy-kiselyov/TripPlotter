import { IAlgorithmDayOutput, IAlgorithmOutput, IAlgorithmStartItemOutput } from '../../types/algorithm';
import { IStore } from '../../types/store';
import { formatTime, parseTime } from '../../lib/time';
import { formatDistance } from '../../lib/distance';

export function printRoute(store: IStore, route: IAlgorithmOutput): void {
    for (let day = 0; day < route.days.length; day++) {
        if (day) {
            console.log('----------------', '\n');
        }

        printDay(day, route.days[day], store);
    }

    if (route.extra) {
        printExtra(store, route);
    }
}

function printDay(day: number, route: IAlgorithmDayOutput | null, store: IStore): void {
    console.log('День №', day + 1);

    if (!route) {
        console.log('В этот день нечего делать :(');
        return;
    }

    console.log('Время начала:', formatTime(route.start.time));

    let lastTime = route.start.time;

    route.route.forEach((routeItem, i) => {
        const name = findOrgName(store, routeItem.id);
        const routeTime = routeItem.from - lastTime;
        const distance = formatDistance(routeItem.distance);

        console.log();
        console.log(i + 1 + '.', name);
        console.log('   В пути', distance, '(', formatTime(routeTime), ')');
        routeItem.wait && console.log('   Ожидание открытия', formatTime(routeItem.wait));
        console.log('   Посещение с', formatTime(routeItem.from + (routeItem.wait || 0)), 'до', formatTime(routeItem.to));

        lastTime = routeItem.to;
    });

    console.log();
    console.log('Дорога домой', formatDistance(route.finish.distance), '(', formatTime(route.finish.time - lastTime), ')');
    console.log('Дома', formatTime(route.finish.time));
    console.log('В запасе осталось', formatTime(parseTime(store.endTime) - route.finish.time));
}

function printExtra(store: IStore, route: IAlgorithmOutput) {
    console.log();
    console.log('Не вместившиеся организации:');

    route.extra.forEach(org => console.log(findOrgName(store, org.id)));
}

function findOrgName(store: IStore, id: string): string {
    for (const org of store.tripList) {
        if (org.organization.id === id) {
            return org.organization.name;
        }
    }

    return 'Неизвестная организация';
}
