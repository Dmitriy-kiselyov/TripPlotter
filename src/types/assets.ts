export type IAssetName = 'attraction' | 'cultural center' | 'exhibition center' | 'landmark' | 'museum' | 'viewpoint' |
    'baths' | 'entertainments' | 'forest' | 'library' | 'park' | 'waterfall' | 'beach' | 'equestrian' | 'gallery' |
    'mountain' | 'planetarium' | 'zoo';

export interface IAssetNameMap {
    text: string;
    id: IAssetName;
}

export type IAssetsNameMap = IAssetNameMap[];
