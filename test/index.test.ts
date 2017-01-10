import * as assert from 'power-assert';
import * as sinon from 'sinon';
import Dispatcher, { Dispatch } from './../src/index';

interface EventTypes {
    action: number;
    action2: { count: number };
}

describe('Dispatcher', () => {
    let dispatcher: Dispatcher<EventTypes>;
    let dispatch: Dispatch<EventTypes>;
    const spy1 = sinon.spy();
    const spy2 = sinon.spy();


    beforeEach(() => {
        dispatcher = new Dispatcher<EventTypes>();
        dispatch = dispatcher.dispatch.bind(dispatcher);
        spy1.reset();
        spy2.reset();
    });

    it('subscribe/dispatch/unsubscribe', () => {
        // subscribe
        const unsubscribe = dispatcher.subscribe({
            action: spy1,
            action2: spy2
        });

        assert.equal(dispatcher.eventCount, 2);

        const subscribers = dispatcher.getSubscribers('action');
        assert.deepEqual(subscribers, [spy1]);

        // dispatch and callback params
        dispatch('action', 10);
        dispatch('action2', { count: 10 });

        assert(spy1.calledWithExactly(10));
        assert(spy2.calledWithExactly({ count: 10 }));

        // unsubscribe
        unsubscribe();
        assert.strictEqual(dispatcher.getSubscribers('action').length, 0);
        assert.strictEqual(dispatcher.getSubscribers('action2').length, 0);
    });

    it('subscribeAll', () => {
        const unsubscribe = dispatcher.subscribeAll(spy1);

        assert.equal(dispatcher.listeners.length, 1);

        dispatch('action', 10);
        dispatch('action2', { count: 10 });

        assert(spy1.firstCall.calledWithExactly('action', 10));
        assert(spy1.secondCall.calledWithExactly('action2', { count: 10 }));

        unsubscribe();
        assert.equal(dispatcher.listeners.length, 0);
    });
});
