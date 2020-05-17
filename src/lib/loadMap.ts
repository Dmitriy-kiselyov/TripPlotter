declare const ymaps: any;

let loadStarted = false;
let loadEnded = false;
let callbacks: Array<() => void> = [];

export function loadMap(cb: () => void): void {
    if (loadEnded) {
        return cb();
    }

    if (!loadStarted) {
        loadScript(() => {
            ymaps.ready(() => {
                for (const cb of callbacks) {
                    cb();
                }

                callbacks = [];
                loadEnded = true;
            });
        });
    }

    callbacks.push(cb);
    loadStarted = true;
}

function loadScript(cb: () => void) {
    const script = document.createElement("script");

    script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=86eaa852-1e95-493e-98e0-096aa08cc214';
    script.type = 'text/javascript';
    script.async = true;

    script.onload = cb;

    document.body.appendChild(script);
}
