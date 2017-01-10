export type Subscriber<T> = {[P in keyof T]?: (payload: T[P]) => any};

export interface Dispatch<T> {
    <K extends keyof T>(event: K, payload: T[K]): void;
}

export interface Subscribe<T> {
    (subscriber: Subscriber<T>): Function;
}

export interface SubscribeAll<T> {
    <K extends keyof T>(event: K, payload: T[K]): Function;
}

export type Events<T> = Map<keyof T, ((payload: any) => any)[]>;

export class Dispatcher<T> {
    readonly events: Events<T> = new Map();
    readonly listeners: Function[] = [];

    /**
     * Dispatch an event
     *
     * @param {string} event
     * @param {EventTypes[K]} payload
     */
    dispatch<K extends keyof T>(event: K, payload: T[K]) {
        const subscriber = this.events.get(event);

        this.listeners.forEach((f) => f(event, payload));

        if (!subscriber) return;
        subscriber.forEach((f) => f(payload));
    }


    /**
     * Subscribe events
     *
     * @param {Subscriber<T>} subscriber
     * @returns {Function} unsubscribe
     */
    subscribe(subscriber: Subscriber<T>): Function {

        Object.keys(subscriber).forEach((k: keyof T) => {
            if (!this.events.has(k)) {
                this.events.set(k, []);
            }

            (this.events.get(k) as Function[]).push(subscriber[k] as Function);
        });

        /* unsubscribe */
        return () => {
            Object.keys(subscriber).forEach((k: keyof T) => {
                const fns = this.events.get(k);

                if (!fns) return;

                const idx = fns.findIndex(target => target === subscriber[k]);
                fns.splice(idx, 1);
            });
        };
    }


    /**
     * SubscribeAll events
     *
     * @param {subscriber}
     * @returns {Function} unsubscribe
     */
    subscribeAll<K extends keyof T>(subscriber: (event: K, payload: T[K]) => any) {
        this.listeners.push(subscriber);

        /* unsubscribe */
        return () => {
            const idx = this.listeners.findIndex(t => t === subscriber);
            this.listeners.splice(idx, 1);
        };
    }

    get eventCount() {
        return this.events.size;
    }

    getSubscribers(event: keyof T) {
        return [...this.events.get(event) as Function[]];
    }
}

export default Dispatcher;
