const fs = require('fs');
const path = require('path');

function getPath(assetName) {
    return path.resolve(__dirname, `../../../assets/${assetName}.json`);
}

function getAsset(assetName) {
    return require(getPath(assetName));
}

function saveAsset(assetName, asset) {
    fs.writeFile(getPath(assetName), JSON.stringify(asset, null, 2), function (err) {
        if (err) {
            return console.log(err);
        }

        console.log(`Saved ${assetName}!`);
    });
}

module.exports = {
    getPath,
    getAsset,
    saveAsset
};
