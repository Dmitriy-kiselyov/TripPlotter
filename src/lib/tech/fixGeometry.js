const { saveAsset, getAsset } = require('./utils');

function fixGeometry(assetName) {
    const asset = getAsset(assetName);

    for (const organization of asset) {
        const { geometry } = organization;
        const { coordinates: coord } = geometry;

        geometry.coordinates = [coord[1], coord[0]];
    }

    saveAsset(assetName, asset);
}

// fixGeometry('museum');
