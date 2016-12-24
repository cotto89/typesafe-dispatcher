export type Subscriber<T> = {[P in keyof T]?: (payload: T[P]) => any};

export class Dispatcher<EventTypes> {
    events: Map<keyof EventTypes, ((payload: any) => any)[]> = new Map();

    constructor() {
        this.events = new Map();
    }

    /**
     * Dispatch an event
     *
     * @param {string} event
     * @param {EventTypes[K]} payload
     */
    dispatch = <K extends keyof EventTypes>(event: K, payload: EventTypes[K]) => {
        const fns = this.events.get(event);

        if (!fns) return;

        fns.forEach((f) => f(payload));
    }

    /**
     * Subscribe events
     *
     * @param {Subscriber<EventTypes>} subscriber
     * @returns {Function} unsubscribe
     */
    subscribe = (subscriber: Subscriber<EventTypes>) => {
        Object.keys(subscriber).forEach((k: keyof EventTypes) => {
            if (!this.events.has(k)) {
                this.events.set(k, []);
            }

            (this.events.get(k) as Function[]).push(subscriber[k] as Function);
        });

        /* unsubscribe */
        return () => {
            Object.keys(subscriber).forEach((k: keyof EventTypes) => {
                const fns = this.events.get(k);

                if (!fns) return;

                const idx = fns.findIndex(target => target === subscriber[k]);
                fns.splice(idx, 1);
            });
        };
    }

    get eventCount() {
        return this.events.size;
    }

    getSubscribers(event: keyof EventTypes) {
        return [...this.events.get(event) as Function[]];
    }
}

export default Dispatcher;
