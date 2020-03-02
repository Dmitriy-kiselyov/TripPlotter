export function formatDistance(distance: number): string {
    distance = Math.round(distance);

    if (distance < 1000) {
        return distance + ' м';
    }

    distance /= 1000;
    distance = Math.floor(distance * 10) / 10;

    return distance + ' км';
}
