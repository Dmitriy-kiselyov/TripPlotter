export function formatDate(date: Date): string {
    return withLeadZero(date.getDate()) + '.' + withLeadZero(date.getMonth() + 1) + '.' + date.getFullYear();
}

function withLeadZero(n: number): string {
    return n >= 10 ? String(n) : '0' + n;
}

const month = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
const week = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];

export function formatDateLong(date: Date): string {
    return `${getWeekName(date)}, ${date.getDate()} ${month[date.getMonth()]}`;
}

function getWeekName(date: Date) {
    let day = date.getDay();

    if (day === 0) {
        day = 7; // вс
    }

    return week[day - 1];
}
