const { saveAsset, getAsset } = require('./utils');

function transformAsset(assetName) {
    const asset = getAsset(assetName);
    const transformed = asset.map(item => item.CompanyMetaData);

    saveAsset(assetName, transformed);
}

// transformAsset('zoo');
