const request = require('request');
const fs = require('fs');

const cfg = {
    apiKey: 'eb1ad8b8-fb23-4b5f-85e9-2c184260c137',
    fileType: 'json',
    filePath: './'
};

module.exports = {
    run(requestText) {
        if (!requestText.includes('Республика Крым')) {
            requestText += ',Республика Крым';
        }

        return this._sendRequest(requestText)
            .then(res => {
                const result = [];
                for (const item of res) {
                    result.push({'CompanyMetaData': item['properties']['CompanyMetaData']});
                }
                return this._writeToFile(requestText, result);
            })
            .catch(err => {
                console.error(err);
            });
    },

    _writeToFile(requestText, data) {
        return new Promise((resolve, reject) => {
            const fileName = cfg.filePath + requestText.replace(',Республика Крым', '') + '.' + cfg.fileType;

            fs.writeFile(fileName, JSON.stringify(data), (err) => {
                if (err) {
                    return reject(err);
                }

                return resolve(fileName);
            });
        });
    },

    _sendRequest(text, type = 'biz', results = 500) {
        return new Promise((resolve, reject) => {
            request.get({
                url: `https://search-maps.yandex.ru/v1/?text=${encodeURI(text)}&type=${type}&lang=ru_RU&results=${results}&apikey=${cfg.apiKey}`
            }, (err, response, body) => {
                if (err) {
                    return reject(err);
                }

                if (body) {
                    try {
                        const parsed = JSON.parse(body);
                        return resolve(parsed.features);
                    } catch (err) {
                        reject(new Error('Bad body.', body));
                    }
                } else {
                    reject(new Error('Empty Body'));
                }
            });
        });
    }
};
