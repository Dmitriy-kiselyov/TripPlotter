const request = require('request');

const { saveAsset, getAsset } = require('./utils');

// fetchGeometry('museum');

function getUrl(address) {
    return `https://search-maps.yandex.ru/v1?apikey=be39a139-2985-44f6-8752-b8df9c786aa3&text=${encodeURIComponent(address)}&results=1&lang=ru_RU`;
}

async function fetchGeometry(assetName, rewrite = false) {
    const asset = getAsset(assetName);
    const size = asset.length;
    let count = 0;

    for (const organization of asset) {
        count++;
        if (!rewrite && asset.geometry) {
            continue;
        }

        try {
            organization.geometry = await getGeometry(organization);
        }
        catch (e) {
            console.log('ERROR: ' + e.message);
        }
        finally {
            console.log(`${count} из ${size}`);
        }
    }

    saveAsset(assetName + '_cpy', asset);
}

function getGeometry(organization) {
    if (!organization.address) {
        throw new Error(`Организация "${organization.id}" не содержит адрес`);
    }

    const url = getUrl(organization.address);

    return new Promise((resolve, reject) => {
        request(url, function (error, response, body) {
            if (!body) {
                reject(`Нет ответа по адресу "${body}"`);
            }

            resolve(getGeometryFromResponse(organization.address, body));
        });
    });
}

function getGeometryFromResponse(address, responce) {
    let features;

    try {
        features = JSON.parse(responce).features;
    } catch (e) {
        throw new Error(`Нет ответа по адресу "${address}"`);
    }


    if (!Array.isArray(features)) {
        throw new Error(`Адрес "${address}" не найден`);
    }

    if (features.length !== 1) {
        throw new Error(`Адрес "${address}" дал несколько результатов в поиске O_o`);
    }

    const { geometry } = features[0];

    if (!geometry) {
        throw new Error(`Для адреса "${address}" не найдено расположение`);
    }

    return geometry;
}
