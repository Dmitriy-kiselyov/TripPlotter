import { greedyTripAlgorithm } from './greedy';
import { IAlgorithmParams } from '../../types/algorithm';
import { bfsTripAlgorithm } from './bfs';

export function tripAlgorithm(algorithmParams: IAlgorithmParams, callback: any) {
    if (algorithmParams.organizations.length > 10) {
        return greedyTripAlgorithm(algorithmParams, callback);
    }

    return bfsTripAlgorithm(algorithmParams, callback);
}
