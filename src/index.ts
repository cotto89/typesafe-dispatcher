export interface Dispatch<T> {
    <K extends keyof T>(event: K, payload: T[K]): void;
}

export type Subscriber<T> = {[P in keyof T]?: (payload: T[P]) => any};

export interface Subscribe<T> {
    (subscriber: Subscriber<T>): Function;
}

export interface SubscribeAll<T> {
    <K extends keyof T>(subscriber: (event: K, payload: T[K]) => any): Function;
}

export type Reactions<T> = {[P in keyof T]?: (payload: T[P]) => Partial<T> | Promise<Partial<T>>};

export interface Reaction<T> {
    (reactions: Reactions<T>): Function;
}

export class Dispatcher<T> {
    readonly events: Map<keyof T, ((payload: any) => any)[]> = new Map();
    readonly reacts: Map<keyof T, ((payload: any) => Partial<T>)[]> = new Map();
    readonly listeners: Function[] = [];

    /**
     * Dispatch an event
     *
     * @param {string} event
     * @param {EventTypes[K]} payload
     */
    /* tslint:disable:no-unused-expression */
    dispatch<K extends keyof T>(event: K, payload: T[K]) {
        // publish for subscribeAll
        this.listeners.forEach((f) => f(event, payload));

        // publish for subscriber
        const subscriber = this.events.get(event);
        subscriber && subscriber.forEach((f) => f(payload));

        // invoke reaction
        const react = this.reacts.get(event);
        react && react.forEach((f) => {
            const ret = f(payload);

            if (ret instanceof Promise) {
                Promise.resolve(ret).then((r) => {
                    this._dispatchFromObject(r);
                });
            } else {
                this._dispatchFromObject(ret);
            }
        });
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


    /**
     * Reaction(Subscribe event for reaction)
     * Reaction is subscribe event -> publish other event
     */
    reaction(reactions: Reactions<T>): Function {
        Object.keys(reactions).forEach((k: keyof T) => {
            if (!this.reacts.has(k)) {
                this.reacts.set(k, []);
            }

            (this.reacts.get(k) as Function[]).push(reactions[k] as Function);
        });

        /* dispose */
        return () => {
            Object.keys(reactions).forEach((k: keyof T) => {
                const reacts = this.reacts.get(k);

                if (!reacts) return;

                const idx = reacts.findIndex(t => t === reactions[k]);
                reacts.splice(idx, 1);
            });
        };
    }


    get eventCount() {
        return this.events.size;
    }

    getSubscribers(event: keyof T) {
        return [...this.events.get(event) as Function[]];
    }


    private _dispatchFromObject(obj: any) {
        Object.keys(obj).forEach((k: any) => {
            this.dispatch(k, obj[k]);
        });
    };

}

export default Dispatcher;
