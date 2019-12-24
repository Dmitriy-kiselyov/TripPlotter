// @ts-nocheck

class AlgOutput {
    constructor(trip, extra){
        this.trip = trip;
        this.extra = extra;
    }
}

class Availabilities {
    constructor(from, to){
        this.from = from;
        this.to = to;
    }
}

class Organization {
    constructor (coordinates, id, timeSpend, available) {
        this.coordinates = coordinates;
        this.id = id;
        this.timeSpend = timeSpend; //в минутах -- сколько времени собираемся провести в этой организации
        this.available = available;
    }
}

class OrganizationTrip {
    constructor (id, from, to, coordinates){
        this.id = id;       //string
        this.from = from; //(в минутах) время прибытия в организацию
        this.to = to;     //(в минутах) время отбытия из организации
        this.coordinates = coordinates; //[x, y] (double)
    }
}

class OrganizationExtra {
    constructor (id, coordinates){
        this.id = id;       //string
        this.coordinates = coordinates; //[x, y] (double)
    }
}

class TestData {
  constructor(from, to, coordinates, org){
    this.from = from;
    this.to = to;
    this.coordinates = coordinates; //где находится турист (начало и конец пути)
    this.organizations = org;
  }
}


export default function getRoute(TestD, callback){
    let currentTime = TestD.from;
    const ultimateTime = TestD.to;
    let currentPoint = new Organization(TestD.coordinates, "Начальная точка", undefined, undefined);

    let visitedOrganizations = [];
    let unvisitedOrganizations = TestD.organizations;

    //массив времени пути от начальной точки до остальных организаций (т.к. проверяем, успеем ли вернуться домой) -- пока что берется из данных (старт->все организации) -- нужно ли отдельно считать в обратном направлении?
    let IsStart = true;
    let routeIsBuilt = false;
    let backwardTime = [];

    _getNextRoute(currentPoint, visitedOrganizations, unvisitedOrganizations, currentTime, ultimateTime, IsStart, routeIsBuilt, backwardTime, callback);
}


//функция, возвр массив [visit, unvisit] на одном шаге алгоритма
function _getNextRoute(currentPoint, visitedOrganizations, unvisitedOrganizations, currentTime, ultimateTime, IsStart, routeIsBuilt, backwardTime, callback){
    _getSortedRoutesTimeArray(currentPoint, unvisitedOrganizations, function(routesTime){
        if (IsStart) {
            backwardTime = routesTime;
            IsStart = false;
        } 
        let visitIsPossible = false;    //сможем ли посетить организацию
        //проверить, успеваем ли в ближайшую организацию
        for (let rt of routesTime){
            if (visitIsPossible) break;
            let arrivalTime = currentTime + rt.travelTime;  //время прибытия в организацию = текущее время дня + время чтоб добраться до организации
            let departureTime = arrivalTime + rt.organization.timeSpend;    //время отбытия из организации = время прибытия + время посещения
            /*можем посетить, если:
            departureTime <= время завершения работы организации
            && departureTime + route(организация, начальная точка) <= время завершения дневной экскурсии, т.е. успеваем вернуться домой*/
            let backTime = _findTimeById(rt, backwardTime);  //время для возвращения в начальную точку
             
            for (let i in rt.organization.available){
                let fromOrg = rt.organization.available[i].from;
                let toOrg = rt.organization.available[i].to;
                if (i > 0) {
                    //нахождение в организации делится на 2 промежутка по времени (сколько-то до обеда и сколько-то после)
                    departureTime += (rt.organization.available[1].from - rt.organization.available[0].to);
                }
                if (departureTime <= toOrg && departureTime + backTime <= ultimateTime){
                    visitedOrganizations.push(new OrganizationTrip(rt.organization.id, arrivalTime, departureTime, rt.organization.coordinates));
                    let idx = unvisitedOrganizations.indexOf(rt.organization);
                    currentPoint = rt.organization;
                    currentTime = departureTime;
                    unvisitedOrganizations.splice(idx, 1);
                    visitIsPossible = true;
                    break;
                }
            }
        }

        if (!visitIsPossible || unvisitedOrganizations.length == 0) routeIsBuilt = true;

        if (!routeIsBuilt){
            _getNextRoute(currentPoint, visitedOrganizations, unvisitedOrganizations, currentTime, ultimateTime, IsStart, routeIsBuilt, backwardTime, callback);
        } else {
            let extra = [];
            for (let unv of unvisitedOrganizations){
                extra.push(new OrganizationExtra(unv.id, unv.coordinates));
            }
            callback(new AlgOutput(visitedOrganizations, extra));
        }   
    });
}

//для поиска времени пути в начальную точку обратно 
//известно время для массива организаций, а мы возвращаем для одной
function _findTimeById(currentOrg, orgsTravelTime){
    for (let ott of orgsTravelTime){
        if (currentOrg.organization.id == ott.organization.id) return ott.travelTime;
    }
}

class _OrgTravelTime {
    //вспомогательный класс для связи времени посещения с организацией
    constructor(time, org){
        this.travelTime = time;
        this.organization = org;
    }
}

//массив расстояний от StartOrg до каждой из EndOrgs
function _getSortedRoutesTimeArray(StartOrg, EndOrgs, callback){
    let travelTime = [];
    for (let eo of EndOrgs){
        _getRouteTime(StartOrg.coordinates, eo.coordinates, function(routesTime){
            travelTime.push(new _OrgTravelTime(routesTime, eo));
            if (travelTime.length == EndOrgs.length) {
                travelTime.sort(function(a, b) {return a.travelTime - b.travelTime});
                callback(travelTime);
            }
        });
    }
}

//время пути между двумя точками в минутах 
function _getRouteTime(StartPoint, EndPoint, callback) {
    ymaps.ready(init);  
    function init() {
        ymaps.route(
        [StartPoint, EndPoint],
        {routingMode: "auto"})
        .then(function (route) {
            let routesTime = route.getJamsTime(); //время в секундах с учетом пробок
            routesTime /= 60;
            routesTime = parseInt(routesTime);
            callback(routesTime); 
        });
    }
}