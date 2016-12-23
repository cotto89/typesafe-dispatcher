export declare type Subscriber<T> = {
    [P in keyof T]?: (payload: T[P]) => any;
};
export declare class Dispatcher<EventTypes> {
    events: Map<keyof EventTypes, ((payload: any) => any)[]>;
    constructor();
    /**
     * eventをtrigger
     *
     * @param {string} event
     * @param {EventTypes[K]} payload
     */
    dispatch: <K extends keyof EventTypes>(event: K, payload: EventTypes[K]) => void;
    /**
     * eventをsubscribeする
     *
     * @param {Subscriber<EventTypes>} subscriber
     * @returns {Function} unsubscribe
     */
    subscribe: (subscriber: Subscriber<EventTypes>) => () => void;
    readonly eventCount: number;
    getSubscribers(event: keyof EventTypes): Function[];
}
export default Dispatcher;
