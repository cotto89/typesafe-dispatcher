"use strict";
class Dispatcher {
    constructor() {
        this.events = new Map();
        this.reacts = new Map();
        this.listeners = [];
    }
    /**
     * Dispatch an event
     *
     * @param {string} event
     * @param {EventTypes[K]} payload
     */
    /* tslint:disable:no-unused-expression */
    dispatch(event, payload) {
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
            }
            else {
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
    /**
     * Reaction(Subscribe event for reaction)
     * Reaction is subscribe event -> publish other event
     */
    reaction(reactions) {
        Object.keys(reactions).forEach((k) => {
            if (!this.reacts.has(k)) {
                this.reacts.set(k, []);
            }
            this.reacts.get(k).push(reactions[k]);
        });
        /* dispose */
        return () => {
            Object.keys(reactions).forEach((k) => {
                const reacts = this.reacts.get(k);
                if (!reacts)
                    return;
                const idx = reacts.findIndex(t => t === reactions[k]);
                reacts.splice(idx, 1);
            });
        };
    }
    get eventCount() {
        return this.events.size;
    }
    getSubscribers(event) {
        return [...this.events.get(event)];
    }
    _dispatchFromObject(obj) {
        Object.keys(obj).forEach((k) => {
            this.dispatch(k, obj[k]);
        });
    }
    ;
}
exports.Dispatcher = Dispatcher;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Dispatcher;
//# sourceMappingURL=index.js.map