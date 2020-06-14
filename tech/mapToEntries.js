/*
 * Скрипт, чтобы вычленить кэш расстояний из браузера
 */

// const map = new Map([['a', { aa: 5, aaa: 15 }], ['b', { bb: 10, bbb: 100 }]]);

function printEntries(map) {
    return '[' + Array.from(map.entries()).map(entry => `['${entry[0]}',${printObject(entry[1])}]`) + ']';
}

function printObject(obj) {
    return '{' + Object.entries(obj).map(entry => `${entry[0]}:${entry[1]}`).join(',') + '}';
}

console.log(printEntries(window.__routeInfoCache));
