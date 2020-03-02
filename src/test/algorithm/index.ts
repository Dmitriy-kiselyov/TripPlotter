import './mock';

import { getAlgorithmParams } from '../../lib/getAlgorithmParams';
import { tripAlgorithm } from '../../lib/algorithm';
import { IAlgorithmOutput } from '../../types/algorithm';

const params = getAlgorithmParams();

tripAlgorithm(params, (trip: IAlgorithmOutput) => console.log(trip));
