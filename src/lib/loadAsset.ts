import { ICompany } from '../types/index';

const assets: Record<string, ICompany[]> = {};

export function loadAsset(id: string, cb: (asset: ICompany[]) => void) {
    if (assets[id]) {
        cb(assets[id]);
    }

    load(id, (asset: ICompany[]) => {
        assets[id] = asset;

        cb(asset);
    });
}

function load(id: string, cb: (asset: ICompany[]) => void) {
    const path = `assets/${id}.json`;

    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open('GET', path, true);

    xhr.onreadystatechange = function() {
        if (xhr.status != 200) {
            console.log(xhr.status + ': ' + xhr.statusText);

            cb([]);
        } else {
            cb(xhr.response);
        }
    };

    xhr.send();
}
