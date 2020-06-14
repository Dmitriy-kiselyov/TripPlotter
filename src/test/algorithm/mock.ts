// @ts-ignore
import { ImportMock } from 'ts-mock-imports';

declare global {
    namespace NodeJS {
        interface Global {
            window: any
        }
    }
}

global.window = {};

// store
import * as storeModule from '../../store/store';
import { testStore } from '../testStore';

ImportMock.mockOther(storeModule, 'store', { getState: () => testStore });

// getRouteInfo
import { getRouteInfo, IRouteInfo } from '../../lib/algorithm/getRouteInfo';
getRouteInfo(); // проснись

import cache from './cache';

const cacheMap = global.window.__routeInfoCache as Map<string, IRouteInfo>;

(cache as [string, IRouteInfo][]).forEach(c => cacheMap.set(c[0], c[1]));
