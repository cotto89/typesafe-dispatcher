"use strict";
var Dispatcher = (function () {
    function Dispatcher() {
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
    Dispatcher.prototype.dispatch = function (event, payload) {
        var _this = this;
        // publish for subscribeAll
        this.listeners.forEach(function (f) { return f(event, payload); });
        // publish for subscriber
        var subscriber = this.events.get(event);
        subscriber && subscriber.forEach(function (f) { return f(payload); });
        // invoke reaction
        var react = this.reacts.get(event);
        react && react.forEach(function (f) {
            var ret = f(payload);
            if (ret instanceof Promise) {
                Promise.resolve(ret).then(function (r) {
                    _this._dispatchFromObject(r);
                });
            }
            else {
                _this._dispatchFromObject(ret);
            }
        });
    };
    /**
     * Subscribe events
     *
     * @param {Subscriber<T>} subscriber
     * @returns {Function} unsubscribe
     */
    Dispatcher.prototype.subscribe = function (subscriber) {
        var _this = this;
        Object.keys(subscriber).forEach(function (k) {
            if (!_this.events.has(k)) {
                _this.events.set(k, []);
            }
            _this.events.get(k).push(subscriber[k]);
        });
        /* unsubscribe */
        return function () {
            Object.keys(subscriber).forEach(function (k) {
                var fns = _this.events.get(k);
                if (!fns)
                    return;
                var idx = fns.findIndex(function (target) { return target === subscriber[k]; });
                fns.splice(idx, 1);
            });
        };
    };
    /**
     * SubscribeAll events
     *
     * @param {subscriber}
     * @returns {Function} unsubscribe
     */
    Dispatcher.prototype.subscribeAll = function (subscriber) {
        var _this = this;
        this.listeners.push(subscriber);
        /* unsubscribe */
        return function () {
            var idx = _this.listeners.findIndex(function (t) { return t === subscriber; });
            _this.listeners.splice(idx, 1);
        };
    };
    /**
     * Reaction(Subscribe event for reaction)
     * Reaction is subscribe event -> publish other event
     */
    Dispatcher.prototype.reaction = function (reactions) {
        var _this = this;
        Object.keys(reactions).forEach(function (k) {
            if (!_this.reacts.has(k)) {
                _this.reacts.set(k, []);
            }
            _this.reacts.get(k).push(reactions[k]);
        });
        /* dispose */
        return function () {
            Object.keys(reactions).forEach(function (k) {
                var reacts = _this.reacts.get(k);
                if (!reacts)
                    return;
                var idx = reacts.findIndex(function (t) { return t === reactions[k]; });
                reacts.splice(idx, 1);
            });
        };
    };
    Object.defineProperty(Dispatcher.prototype, "eventCount", {
        get: function () {
            return this.events.size;
        },
        enumerable: true,
        configurable: true
    });
    Dispatcher.prototype.getSubscribers = function (event) {
        return this.events.get(event).slice();
    };
    Dispatcher.prototype._dispatchFromObject = function (obj) {
        var _this = this;
        Object.keys(obj).forEach(function (k) {
            _this.dispatch(k, obj[k]);
        });
    };
    ;
    return Dispatcher;
}());
exports.Dispatcher = Dispatcher;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Dispatcher;
//# sourceMappingURL=index.js.map