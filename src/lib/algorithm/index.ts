import { IAlgorithmOutput, IAlgorithmParams } from '../../types/algorithm';
import { bfsTripAlgorithm } from './bfs';

export function tripAlgorithm(algorithmParams: IAlgorithmParams): Promise<IAlgorithmOutput> {
    return bfsTripAlgorithm(algorithmParams);
}
