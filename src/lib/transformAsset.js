const fs = require('fs');

function transformAsset(id) {
    const asset = require(getPath(id));
    const transformed = asset.map(item => item.CompanyMetaData);

    saveAsset(id, transformed);
}

function saveAsset(id, asset) {
    fs.writeFile(getPath(id), JSON.stringify(asset, null, 2), function (err) {
        if (err) {
            return console.log(err);
        }

        console.log('Saved!');
    });
}

function getPath(id) {
    return `../../assets/${id}.json`;
}

// transformAsset('landmark');
