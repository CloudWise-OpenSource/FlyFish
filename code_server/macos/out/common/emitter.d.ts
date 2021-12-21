/**
 * Event emitter callback. Called with the emitted value and a promise that
 * resolves when all emitters have finished.
 */
export declare type Callback<T, R = void | Promise<void>> = (t: T, p: Promise<void>) => R;
export interface Disposable {
    dispose(): void;
}
export interface Event<T> {
    (listener: Callback<T>): Disposable;
}
/**
 * Emitter typecasts for a single event type.
 */
export declare class Emitter<T> {
    private listeners;
    get event(): Event<T>;
    /**
     * Emit an event with a value.
     */
    emit(value: T): Promise<void>;
    dispose(): void;
}
