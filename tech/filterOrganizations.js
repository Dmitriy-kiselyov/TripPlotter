const path = require('path');
const fs = require('fs');

filterOrganizations();

function filterOrganizations() {
    const assetsPath = path.resolve(__dirname, '..', 'assets/organizations');
    const files = fs.readdirSync(assetsPath).map(file => path.resolve(assetsPath, file));

    for (const fileName of files) {
        filterOrganization(fileName);
    }
}

function filterOrganization(fileName) {
    const organizations = require(fileName);
    const name = path.basename(fileName, '.json');
    const filters = [
        {
            name: 'по категориям',
            filter: categoryFilter,
            count: 0
        },
        {
            name: 'с нулевым посещением',
            filter: ratingFilter,
            count: 0
        }
    ];
    let filtered = [];

    for (const org of organizations) {
        let ok = true;

        for (const filter of filters) {
            if (!filter.filter(name, org)) {
                filter.count++;
                ok = false;

                break;
            }
        }

        if (ok) {
            pushExtra(name, org);

            filtered.push(org);
        }
    }

    if (filtered.length !== organizations.length) {
        console.log(`Отфильтрованно ${organizations.length - filtered.length} организаций`);
    }

    for (const filter of filters) {
        if (filter.count > 0) {
            console.log(`При помощи фильтра ${filter.name} отсеянно ${filter.count} из ${organizations.length} организаций`);
        }
    }

    writeOrganizations(name, filtered);
    console.log('----------------------------------------');
}

function pushExtra(name, organization) {
    const ratings = require(path.resolve(__dirname, '..', `assets/ratings/${name}.json`));

    organization.extra = ratings[organization.id];
}

function categoryFilter(name, organization) {
    const categories = organization.Categories;

    for (const category of categories) {
        if (name === category.class || category.name === 'Водопад') {
            return true;
        }
    }

    return false;
}

function ratingFilter(name, organization) {
    const ratings = require(path.resolve(__dirname, '..', `assets/ratings/${name}.json`));
    const rating = ratings[organization.id];

    return rating && !rating.error && rating.count > 0;
}

function writeOrganizations(name, organizations) {
    const fileName = path.resolve(__dirname, '..', `assets/filteredOrganizations/${name}.json`);

    try {
        fs.writeFileSync(fileName, JSON.stringify(organizations, null, 4));

        console.log('УДАЧНАЯ ЗАПИСЬ ' + name);
    } catch (e) {
        console.log('НЕУДАЧНАЯ ПОПЫТКА ЗАПИСИ ' + name);
        console.log(e);
    }
}
