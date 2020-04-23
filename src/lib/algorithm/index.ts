import { IAlgorithmParams } from '../../types/algorithm';
import { bfsTripAlgorithm } from './bfs';

export function tripAlgorithm(algorithmParams: IAlgorithmParams, callback: any) {
    return bfsTripAlgorithm(algorithmParams, callback);
}
