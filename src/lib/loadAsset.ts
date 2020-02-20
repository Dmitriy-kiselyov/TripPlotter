import { IOrganization } from '../types/organization';

const assets: Record<string, IOrganization[]> = {};

export function loadAsset(id: string, cb: (asset: IOrganization[]) => void) {
    if (assets[id]) {
        cb(assets[id]);
        return;
    }

    load(id, (asset: IOrganization[]) => {
        assets[id] = asset;

        cb(asset);
    });
}

export function getAsset(id: string): IOrganization[] | null {
    return assets[id] ? assets[id] : null;
}

function load(id: string, cb: (asset: IOrganization[]) => void) {
    const path = `assets/organizations/${id}.json`;

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
