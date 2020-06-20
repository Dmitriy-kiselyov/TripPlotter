export class AlgorithmStopper {
    private stopped?: boolean;

    public stop() {
        this.stopped = true;
    }

    public isStopped() {
        return this.stopped;
    }
}
