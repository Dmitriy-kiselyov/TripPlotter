export function getAddress(geocode: any): string {
    const geoObject = geocode.geoObjects.get(0);

    return geoObject.getAddressLine();
}

export function getCoords(geocode: any): [number, number] {
    const geoObject = geocode.geoObjects.get(0);

    return geoObject.geometry._coordinates;
}
