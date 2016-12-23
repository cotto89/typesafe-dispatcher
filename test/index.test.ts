import * as assert from 'power-assert';
import * as sinon from 'sinon';
import Dispatcher from './../src/index';

interface EventTypes {
    action: number;
    action2: { count: number };
}

it('Dispatcher', () => {
    const spy1 = sinon.spy();
    const spy2 = sinon.spy();
    const dispatcher = new Dispatcher<EventTypes>();
    const { subscribe, dispatch } = dispatcher;

    // subscribe
    const unsubscribe = subscribe({
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

