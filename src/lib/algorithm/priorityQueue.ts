const top = 0;
const parent = (i: number) => ((i + 1) >>> 1) - 1;
const left = (i: number) => (i << 1) + 1;
const right = (i: number) => (i + 1) << 1;

export type IPriorityQueueComparator<T> = (a: T, b: T) => boolean;

export class PriorityQueue<T> {
    private heap: T[];
    private comparator: IPriorityQueueComparator<T>;
    private maxSize?: number;

    constructor(comparator: IPriorityQueueComparator<T>, maxSize?: number) {
        this.heap = [];
        this.comparator = comparator;
        this.maxSize = maxSize;
    }

    size() {
        return this.heap.length;
    }

    isEmpty() {
        return this.size() == 0;
    }

    peek() {
        return this.heap[top];
    }

    push(value: T) {
        this.heap.push(value);
        this._siftUp();

        if (this.maxSize && this.size() > this.maxSize) {
            this.pop();
        }

        return this.size();
    }

    pop() {
        const poppedValue = this.peek();
        const bottom = this.size() - 1;
        if (bottom > top) {
            this._swap(top, bottom);
        }
        this.heap.pop();
        this._siftDown();
        return poppedValue;
    }

    replace(value: T) {
        const replacedValue = this.peek();
        this.heap[top] = value;
        this._siftDown();
        return replacedValue;
    }

    _greater(i: number, j: number) {
        return this.comparator(this.heap[i], this.heap[j]);
    }

    _swap(i: number, j: number) {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }

    _siftUp() {
        let node = this.size() - 1;
        while (node > top && this._greater(node, parent(node))) {
            this._swap(node, parent(node));
            node = parent(node);
        }
    }

    _siftDown() {
        let node = top;
        while ((left(node) < this.size() && this._greater(left(node), node)) || (right(node) < this.size() && this._greater(right(node), node))) {
            let maxChild = (right(node) < this.size() && this._greater(right(node), left(node))) ? right(node) : left(node);
            this._swap(node, maxChild);
            node = maxChild;
        }
    }
}
