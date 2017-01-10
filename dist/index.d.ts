export interface Dispatch<T> {
    <K extends keyof T>(event: K, payload: T[K]): void;
}
export declare type Subscriber<T> = {
    [P in keyof T]?: (payload: T[P]) => any;
};
export interface Subscribe<T> {
    (subscriber: Subscriber<T>): Function;
}
export interface SubscribeAll<T> {
    <K extends keyof T>(subscriber: (event: K, payload: T[K]) => any): Function;
}
export declare type Reactions<T> = {
    [P in keyof T]?: (payload: T[P]) => Partial<T> | Promise<Partial<T>>;
};
export interface Reaction<T> {
    (reactions: Reactions<T>): Function;
}
export declare class Dispatcher<T> {
    readonly events: Map<keyof T, ((payload: any) => any)[]>;
    readonly reacts: Map<keyof T, ((payload: any) => Partial<T>)[]>;
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
    /**
     * Reaction(Subscribe event for reaction)
     * Reaction is subscribe event -> publish other event
     */
    reaction(reactions: Reactions<T>): Function;
    readonly eventCount: number;
    getSubscribers(event: keyof T): Function[];
    private _dispatchFromObject(obj);
}
export default Dispatcher;
