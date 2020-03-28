import { multiLang, IMultiLang } from './multiLang';

export function parseTime(time: string): number {
    const [h, m] = time.split(':');

    return Number(h) * 60 + Number(m);
}

function timeSection(minutes: number) {
    return [Math.floor(minutes / 60), minutes % 60];
}

export function formatTime(minutes: number): string {
    const sections = timeSection(minutes);

    return sections[0] + ':' + (sections[1] < 10 ? '0' + sections[1] : sections[1]);
}

const hoursDictionary = {
    none: 'часов',
    one: 'час',
    some: 'часа',
    many: 'часов',
};
const minutesDictionary = {
    none: 'минут',
    one: 'минута',
    some: 'минуты',
    many: 'минут',
};

export function formatTimeLong(minutes: number): string {
    const sections = timeSection(minutes);
    const hoursString = longSection(sections[0], hoursDictionary);
    const minutesString = longSection(sections[1], minutesDictionary);
    const join = (hoursString.length === 0 || minutesString.length === 0) ? '' : ' ';

    return hoursString + join + minutesString;
}

function longSection(section: number, dict: IMultiLang): string {
    return section === 0 ? '' : section + ' ' + multiLang(section, dict);
}
