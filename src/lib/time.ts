export function parseTime(time: string): number {
    const [h, m] = time.split(':');

    return Number(h) * 60 + Number(m);
}

export function timeSection(minutes: number) {
    return [Math.floor(minutes / 60), minutes % 60];
}

export function formatTime(minutes: number): string {
    const sections = timeSection(minutes);

    return sections[0] + ':' + (sections[1] < 10 ? '0' + sections[1] : sections[1]);
}
