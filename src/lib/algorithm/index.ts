import { IAlgorithmOutput, IAlgorithmParams } from '../../types/algorithm';
import { bfsTripAlgorithm } from './bfs';
import { IAlgorithmRouteCallback } from './typings';
import { AlgorithmStopper } from './stopper';

export function tripAlgorithm(algorithmParams: IAlgorithmParams, routeCb?: IAlgorithmRouteCallback, stopper?: AlgorithmStopper): Promise<IAlgorithmOutput> {
    return bfsTripAlgorithm(algorithmParams, routeCb, stopper);
}
