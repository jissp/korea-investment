export interface Pipe<T, R> {
    transform(value: T): R;
}
