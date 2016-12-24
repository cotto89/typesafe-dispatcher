"use strict";
class Dispatcher {
    constructor() {
        this.events = new Map();
        /**
         * Dispatch an event
         *
         * @param {string} event
         * @param {EventTypes[K]} payload
         */
        this.dispatch = (event, payload) => {
            const fns = this.events.get(event);
            if (!fns)
                return;
            fns.forEach((f) => f(payload));
        };
        /**
         * Subscribe events
         *
         * @param {Subscriber<EventTypes>} subscriber
         * @returns {Function} unsubscribe
         */
        this.subscribe = (subscriber) => {
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
        };
        this.events = new Map();
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