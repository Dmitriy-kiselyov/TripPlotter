import {
    IAlgorithmParams,
    IAlgorithmOrganizationParam,
    IAlgorithmOutput,
    IAlgorithmTripItemOutput,
    IAlgorithmExtraOutput
} from '../types/algorithm';

interface IOrgTravelTime {
    //для связи времени прибытия с организацией
    travelTime: number;
    organization: IAlgorithmOrganizationParam;
    backwardTime: number;
    distance: number;
}

export default function getRoute(algorithmParams: IAlgorithmParams, callback: any){
    let currentTime: number = algorithmParams.from;
    const ultimateTime: number = algorithmParams.to;
    let globalStart: IAlgorithmOrganizationParam = {
        coordinates: algorithmParams.coordinates,
        id: "Начальная точка",
        timeSpend: 0,
        available: [{
            from: 0,
            to: 0
        }],
        // @ts-ignore
        timeStart: algorithmParams.from
    };

    let currentPoint: IAlgorithmOrganizationParam = globalStart;

    let visitedOrganizations: Array<IAlgorithmTripItemOutput> = [];
    let unvisitedOrganizations: Array<IAlgorithmOrganizationParam> = algorithmParams.organizations;

    let routeIsBuilt: boolean = false;

    getNextRoute(currentPoint, visitedOrganizations, unvisitedOrganizations, currentTime, ultimateTime, routeIsBuilt, globalStart, callback);
}


//функция, возвр массив [visit, unvisit] на одном шаге алгоритма
function getNextRoute(currentPoint: IAlgorithmOrganizationParam, visitedOrganizations: Array<IAlgorithmTripItemOutput>,
        unvisitedOrganizations: Array<IAlgorithmOrganizationParam>, currentTime: number, ultimateTime: number,
        routeIsBuilt: boolean, globalStart: IAlgorithmOrganizationParam, callback: any){
    getSortedRoutesTimeArray(currentPoint, unvisitedOrganizations, globalStart, function(routesTime: Array<IOrgTravelTime>){
        let visitIsPossible: boolean = false;    //сможем ли посетить организацию
        //проверить, успеваем ли в ближайшую организацию
        for (let j in routesTime){
            if (visitIsPossible) break;
            /*можем посетить, если:
            успеем выйти раньше начала обеда или закрытия
            успеем домой
           */
            let backTime: number = routesTime[j].backwardTime;  //время для возвращения в начальную точку
            let arrivalTime: number = currentTime + routesTime[j].travelTime;  //время прибытия в организацию = текущее время дня + время чтоб добраться до организации

            for (let i in routesTime[j].organization.available){   //промежутки времени [открытие, обед], [обед, закрытие]
                let fromOrg: number = routesTime[j].organization.available[i].from; //организация работает с...
                let toOrg: number = routesTime[j].organization.available[i].to;    //организация работает до...
                let departureTime: number; //время отбытия из организации

                let waitingTime: number = 0;

                if (arrivalTime >= fromOrg){    //приехали после открытия / обеда
                    departureTime = arrivalTime + routesTime[j].organization.timeSpend;
                } else if (getMinTimeOthers(routesTime, parseInt(j), currentTime) >= arrivalTime) { //приехали раньше: если не существует организации (из непросмотренных), в которую приедем раньше, добавляем эту в маршрут и ждем открытия
                    waitingTime = fromOrg - arrivalTime;
                    departureTime = fromOrg + routesTime[j].organization.timeSpend;
                } else {   //приехали раньше
                    break;   //возможно вернемся сюда позже
                }

                if (departureTime <= toOrg && departureTime + backTime <= ultimateTime){
                    let newOrg: IAlgorithmTripItemOutput = {
                        id: routesTime[j].organization.id,
                        from: arrivalTime,
                        to: departureTime,
                        coordinates: routesTime[j].organization.coordinates,
                        distance: routesTime[j].distance
                    };
                    if (waitingTime > 0) {
                        newOrg.wait = waitingTime
                    }
                    visitedOrganizations.push(newOrg);

                    let idx: number = unvisitedOrganizations.indexOf(routesTime[j].organization);
                    currentPoint = routesTime[j].organization;
                    currentTime = departureTime;
                    unvisitedOrganizations.splice(idx, 1);
                    visitIsPossible = true;
                    break;
                }
            }
        }

        if (!visitIsPossible || unvisitedOrganizations.length == 0) routeIsBuilt = true;

        if (!routeIsBuilt){
            getNextRoute(currentPoint, visitedOrganizations, unvisitedOrganizations, currentTime, ultimateTime, routeIsBuilt, globalStart, callback);
        } else {
            let extraOut: Array<IAlgorithmExtraOutput> = [];
            for (let unv of unvisitedOrganizations){
                extraOut.push({
                    id: unv.id,
                    coordinates: unv.coordinates
                });
            }

            const lastOrg = visitedOrganizations[visitedOrganizations.length - 1];

            getRouteTime(lastOrg.coordinates, globalStart.coordinates, globalStart.coordinates, (time: number, _: unknown, distance: number) => {
                const result: IAlgorithmOutput = {
                    start: {
                        coordinates: globalStart.coordinates,
                        // @ts-ignore
                        time: globalStart.timeStart
                    },
                    route: visitedOrganizations,
                    finish: {
                        coordinates: globalStart.coordinates,
                        time: lastOrg.to + time,
                        distance
                    },
                    extra: extraOut
                };

                callback(result);
            });
        }
    });
}

//массив расстояний от StartOrg до каждой из EndOrgs + обратно
function getSortedRoutesTimeArray(StartOrg: IAlgorithmOrganizationParam, EndOrgs: Array<IAlgorithmOrganizationParam>, globalStart: IAlgorithmOrganizationParam, callback: any){
    let travelTime: Array<IOrgTravelTime> = [];
    for (let eo of EndOrgs){
        getRouteTime(StartOrg.coordinates, eo.coordinates, globalStart.coordinates, function(routesTimeFor: number, routesTimeBack: number, distance: number){
            travelTime.push({
                travelTime: routesTimeFor,
                organization: eo,
                backwardTime: routesTimeBack,
                distance
            });
            if (travelTime.length == EndOrgs.length) {
                travelTime.sort(function(a, b) {return a.travelTime - b.travelTime});
                callback(travelTime);
            }
        });
    }
}

//время пути между двумя точками в минутах
function getRouteTime(StartPoint: [number, number], EndPoint: [number, number], globalStartPoint: [number, number], callback: any) {
    // @ts-ignore
    ymaps.route(
        [StartPoint, EndPoint, globalStartPoint], //нужно также проверять, успеем ли обратно
        {routingMode: "auto"})
        // @ts-ignore
        .then(function (route) {
            let routesTimeFor: number = route.getPaths().get(0).getJamsTime(); //время в секундах с учетом пробок "туда"
            let routesTimeBack: number = route.getPaths().get(1).getJamsTime(); //"обратно"
            const distance = route.getPaths().get(0).getLength() as number;
            routesTimeFor = Math.floor(routesTimeFor / 60);
            routesTimeBack = Math.floor(routesTimeBack / 60);
            callback(routesTimeFor, routesTimeBack, distance);
        });
}

//минимальное время прибытия в непросмотренные организации
function getMinTimeOthers(orgs: Array<IOrgTravelTime>, j: number, currentTime: number){
    j++;
    let minTime = currentTime + orgs[j].travelTime;
    for(j + 1; j < orgs.length; j++){
        if(currentTime + orgs[j].travelTime < minTime){
            minTime = currentTime + orgs[j].travelTime;
        }
    }
    return minTime;
}
