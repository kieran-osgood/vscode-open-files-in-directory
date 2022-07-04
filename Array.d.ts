export {}

declare global {
    interface Array<T> {
        isNotEmpty(): boolean;
        isEmpty(): boolean;
    }
}
