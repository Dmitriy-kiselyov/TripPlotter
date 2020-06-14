import './mock';

/*
 * Чтобы запустить, нужно прописать в tsconfig
 * "module": "commonjs"
 */

import { getAlgorithmParams } from '../../lib/getAlgorithmParams';
import { tripAlgorithm } from '../../lib/algorithm';
import { printRoute } from './printRoute';
import { testStore } from '../testStore';

const params = getAlgorithmParams();

tripAlgorithm(params).then(trip => printRoute(testStore, trip));
