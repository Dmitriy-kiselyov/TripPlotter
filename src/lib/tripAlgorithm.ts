import { IAlgorithmParams, IAlgorithmOrganizationParam, IAlgorithmAvailableParam, IAlgorithmOutput, IAlgorithmTripOutput, IAlgorithmExtraOutput } from '../types/algorithm';

interface IOrgTravelTime {
    //для связи времени посещения с организацией
    travelTime: number;
    organization: IAlgorithmOrganizationParam;
    backwardTime: number;
}

export default function getRoute(algorithmParams: IAlgorithmParams, callback: any){
    let currentTime: number = algorithmParams.from;
    const ultimateTime: number = algorithmParams.to;
    let currentPoint: IAlgorithmOrganizationParam = {
        coordinates: algorithmParams.coordinates,
        id: "Начальная точка", 
        timeSpend: 0, 
        available: [{
            from: 0, 
            to: 0
        }]
    };  

    let visitedOrganizations: Array<IAlgorithmTripOutput> = [];
    let unvisitedOrganizations: Array<IAlgorithmOrganizationParam> = algorithmParams.organizations;

    let routeIsBuilt: boolean = false;

    getNextRoute(currentPoint, visitedOrganizations, unvisitedOrganizations, currentTime, ultimateTime, routeIsBuilt, callback);
}


//функция, возвр массив [visit, unvisit] на одном шаге алгоритма
function getNextRoute(currentPoint: IAlgorithmOrganizationParam, visitedOrganizations: Array<IAlgorithmTripOutput>, 
        unvisitedOrganizations: Array<IAlgorithmOrganizationParam>, currentTime: number, ultimateTime: number, 
        routeIsBuilt: boolean, callback: any){
    getSortedRoutesTimeArray(currentPoint, unvisitedOrganizations, function(routesTime: Array<IOrgTravelTime>){
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
                    let newOrg: IAlgorithmTripOutput = {
                        id: routesTime[j].organization.id,
                        from: arrivalTime,
                        to: departureTime,
                        coordinates: routesTime[j].organization.coordinates
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
            getNextRoute(currentPoint, visitedOrganizations, unvisitedOrganizations, currentTime, ultimateTime, routeIsBuilt, callback);
        } else {
            let extraOut: Array<IAlgorithmExtraOutput> = [];
            for (let unv of unvisitedOrganizations){
                extraOut.push({
                    id: unv.id,
                    coordinates: unv.coordinates
                });
            }
            let result: IAlgorithmOutput = {
                tripList: visitedOrganizations,
                extra: extraOut
            }
            callback(result);
        }   
    });
}

//массив расстояний от StartOrg до каждой из EndOrgs + обратно
function getSortedRoutesTimeArray(StartOrg: IAlgorithmOrganizationParam, EndOrgs: Array<IAlgorithmOrganizationParam>, callback: any){
    let travelTime: Array<IOrgTravelTime> = [];
    for (let eo of EndOrgs){
        getRouteTime(StartOrg.coordinates, eo.coordinates, function(routesTimeFor: number, routesTimeBack: number){
            travelTime.push({
                travelTime: routesTimeFor,
                organization: eo,
                backwardTime: routesTimeBack
            });
            if (travelTime.length == EndOrgs.length) {
                travelTime.sort(function(a, b) {return a.travelTime - b.travelTime});
                callback(travelTime);
            }
        });
    }
}

//время пути между двумя точками в минутах 
function getRouteTime(StartPoint: [number, number], EndPoint: [number, number], callback: any) {
    // @ts-ignore
    ymaps.ready(init);  
    function init() {
        // @ts-ignore
        ymaps.route(
        [StartPoint, EndPoint, StartPoint], //нужно также проверять, успеем ли обратно
        {routingMode: "auto"})
        // @ts-ignore  
        .then(function (route) {
            let routesTimeFor: number = route.getPaths().get(0).getJamsTime(); //время в секундах с учетом пробок "туда"
            let routesTimeBack: number = route.getPaths().get(1).getJamsTime(); //"обратно"
            routesTimeFor = Math.floor(routesTimeFor / 60);
            routesTimeBack = Math.floor(routesTimeBack / 60);
            callback(routesTimeFor, routesTimeBack); 
        });
    }
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