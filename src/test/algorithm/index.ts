import './mock';

/*
 * Чтобы запустить, нужно прописать в tsconfig
 * "module": "commonjs"
 */

import { getAlgorithmParams } from '../../lib/getAlgorithmParams';
import { tripAlgorithm } from '../../lib/algorithm';
import { IAlgorithmOutput } from '../../types/algorithm';
import { printRoute } from './printRoute';
import { testStore } from '../initialStore';

const params = getAlgorithmParams();

console.log('START');

tripAlgorithm(params, (trip: IAlgorithmOutput) => {
    printRoute(testStore, trip);
});
