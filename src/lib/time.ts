export function parseTime(time: string): number {
    const [h, m] = time.split(':');

    return Number(h) * 60 + Number(m);
}

export function timeSection(minutes: number) {
    return [Math.floor(minutes / 60), minutes % 60];
}
