export declare type Subscriber<T> = {
    [P in keyof T]?: (payload: T[P]) => any;
};
export interface Dispatch<T> {
    <K extends keyof T>(event: K, payload: T[K]): void;
}
export interface Subscribe<T> {
    (subscriber: Subscriber<T>): Function;
}
export interface SubscribeAll<T> {
    <K extends keyof T>(event: K, payload: T[K]): Function;
}
export declare type Events<T> = Map<keyof T, ((payload: any) => any)[]>;
export declare class Dispatcher<T> {
    readonly events: Events<T>;
    readonly listeners: Function[];
    /**
     * Dispatch an event
     *
     * @param {string} event
     * @param {EventTypes[K]} payload
     */
    dispatch<K extends keyof T>(event: K, payload: T[K]): void;
    /**
     * Subscribe events
     *
     * @param {Subscriber<T>} subscriber
     * @returns {Function} unsubscribe
     */
    subscribe(subscriber: Subscriber<T>): Function;
    /**
     * SubscribeAll events
     *
     * @param {subscriber}
     * @returns {Function} unsubscribe
     */
    subscribeAll<K extends keyof T>(subscriber: (event: K, payload: T[K]) => any): () => void;
    readonly eventCount: number;
    getSubscribers(event: keyof T): Function[];
}
export default Dispatcher;
