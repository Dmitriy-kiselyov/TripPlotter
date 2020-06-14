const path = require('path');
const request = require('request');
const fs = require('fs');

downloadRatings();

async function downloadRatings() {
    const assetsPath = path.resolve(__dirname, '..', 'assets/organizations');
    const files = fs.readdirSync(assetsPath).map(file => path.resolve(assetsPath, file));

    for (const fileName of files) {
        const organizations = require(fileName);
        const name = path.basename(fileName, '.json');

        console.log('ЧТЕНИЕ ' + name);

        const ratings = await getRatings(organizations);

        writeRatings(name, ratings);
    }
}

function writeRatings(name, ratings) {
    const fileName = path.resolve(__dirname, '..', `assets/ratings/${name}.json`);

    try {
        fs.writeFileSync(fileName, JSON.stringify(ratings, null, 4));

        console.log('УДАЧНАЯ ЗАПИСЬ ' + name);
    } catch (e) {
        console.log('НЕУДАЧНАЯ ПОПЫТКА ЗАПИСИ ' + name);
        console.log(e);
    }
}

async function getRatings(organizations) {
    const map = {};
    let count = 0;

    for (const org of organizations) {
        count++;

        await downloadRating(org.id)
            .then(rating => {
                if (!rating) {
                    console.log('ОШИБКА ЗАПРОСА ДЛЯ ' + org.id);
                    map[org.id] = {
                        error: true
                    };

                    return;
                }

                map[org.id] = rating;

                console.log(`УСПЕШНАЯ ЗАПИСЬ ${count} из ${organizations.length}`);
            });
        await sleep(500);
    }

    return map;
}

function downloadRating(id) {
    return new Promise(resolve => {
        request(`https://yandex.ru/maps-reviews-widget/${id}?comments`, {json: true}, (err, res, body) => {
            if (err) {
                resolve(null);
            }

            try {
                resolve(getRatingFromHTML(body));
            } catch (e) {
                resolve(null);
            }
        });
    });
}

function getRatingFromHTML(body) {
    const errTemplate = '<div class="error-view">';
    const ratingTemplate = /<p class="mini-badge__stars-count">(.+?)<\/p>/;
    const countTemplate = /<a class="mini-badge__rating" .+>.+ • (\d+) .+<\/a>/;

    if (body.includes(errTemplate)) {
        throw new Error();
    }

    try {
        const rating = Number(body.match(ratingTemplate)[1]);
        const count = Number(body.match(countTemplate)[1]);

        return {rating, count};
    } catch (e) {
        return { rating: 0, count: 0 };
    }
}

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}
