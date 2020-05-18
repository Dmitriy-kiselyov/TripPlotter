/*
 * Я знаю, что он один на странице
 *
 * TODO: поддержать, когда результаты идут в случайном порядке, и удалять скрипты
 */
export const callbackId = 'id_158976536674670743814';

export function makeRequest(address: string) {
    const script = document.createElement('script');

    script.src = buildQuery(address);
    script.type = 'text/javascript';
    script.async = true;

    document.body.appendChild(script);
}

function buildQuery(address: string): string {
    const wholeAddress = 'Россия, Республика Крым, ' + address;
    const count = 10;

    return `https://suggest-maps.yandex.ru/suggest-geo?callback=${callbackId}&v=5&search_type=tp&part=${wholeAddress}&lang=ru_RU&n=${count}&origin=jsapi2Geocoder`;
}
