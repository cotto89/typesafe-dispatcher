"use strict";
class Dispatcher {
    constructor() {
        this.events = new Map();
        this.listeners = [];
    }
    /**
     * Dispatch an event
     *
     * @param {string} event
     * @param {EventTypes[K]} payload
     */
    dispatch(event, payload) {
        const subscriber = this.events.get(event);
        this.listeners.forEach((f) => f(event, payload));
        if (!subscriber)
            return;
        subscriber.forEach((f) => f(payload));
    }
    /**
     * Subscribe events
     *
     * @param {Subscriber<T>} subscriber
     * @returns {Function} unsubscribe
     */
    subscribe(subscriber) {
        Object.keys(subscriber).forEach((k) => {
            if (!this.events.has(k)) {
                this.events.set(k, []);
            }
            this.events.get(k).push(subscriber[k]);
        });
        /* unsubscribe */
        return () => {
            Object.keys(subscriber).forEach((k) => {
                const fns = this.events.get(k);
                if (!fns)
                    return;
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
    subscribeAll(subscriber) {
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
    getSubscribers(event) {
        return [...this.events.get(event)];
    }
}
exports.Dispatcher = Dispatcher;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Dispatcher;
//# sourceMappingURL=index.js.map