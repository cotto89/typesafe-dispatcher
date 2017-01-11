# Typesafe dispatcher

This Dispatcher is using `keyof` and `MappedTypes`. So, This package require `"typescript": "^2.1.4"`.

## Install

```
npm i typesafe-dispatcher
```

https://www.npmjs.com/package/typesafe-dispatcher

## Example

```js
import Dispatcher from 'typesafe-dispatcher';
// or import * as Dispatcher from 'typesafe-disaptcher';


// { eventName: payloadTypes }
interface EventTypes {
    action: number;
    action2: { count: number };
    aciton3: string;
}

// create an instance with EventTypes
const dispatcher = new Dispatcher<EventTypes>();


// subscribe
const unsubscribe = dispatcher.subscribe({
	action: (payload) => {
		assert(typeof payload === 'number')
	},

	action2: (payload) => {
		assert(typeof payload.count === 'number')
	}
})


// subscribeAll
dispatcher.subscribeAll((event, payload) => {
    console.log({ event, payload });
})


// reaction
// reaction is event -> event
dispatcher.reaction({
    action: (count) => ({ action3: count + '' }),
    action2: ({count}) => Promise.resolve({ action3: count + '' })
})

/*
same as above

dispatcher.subscribe({
    action: (count) => dispatch('action3', count + '')),
    action2: ({ count }) => Promise.resolve(count).then(() => dispatch('action3', count + ''))
});
*/



// dispatch
dispatcher.dispatch('action', 1)
dispatcher.dispatch('action2', {count: 1})


// unsubscribe
unsubscribe();
```

![](https://raw.githubusercontent.com/cotto89/typesafe-dispatcher/master/img/typesafe-dispatcher2.png)
![](https://raw.githubusercontent.com/cotto89/typesafe-dispatcher/master/img/typesafe-dispatcher1.png)


## HelperTypes

### Subscriber

```js
type Subscriber<T> = {[P in keyof T]?: (payload: T[P]) => any};
```

```js
import { Subscriber } from 'typesafe-dispatcher';

const subscriber: Subscriber<EventTypes> = {
    action: (count) => count + 1,
}

dispatcher.subscribe(subscriber)
```

### Reactions

```js
type Reactions<T> = {[P in keyof T]?: (payload: T[P]) => Partial<T> | Promise<Partial<T>>};
```

```js
import { Subscriber } from 'typesafe-dispatcher';

const reactions: Reactions<EventTypes> = {
    action: (count) => Promise.resolve<Partial<EventTypes>>({ action2: { count } }),
    action2: ({ count }) => ({ action3: count + '' })
}

dispatcher.reaction(reactions)
```

### For bind()

```js
import Dispatcher, { Dispatch, Subscribe, SubscribeAll } from 'typesafe-dispatcher';

const dispatcher = new Dispatcher<EventTypes>();
const dispatch: Dispatch<EventTypes> = dispatcher.dispatch.bind(dispatcher);
const subscribeAll: SubscribeAll<EventTypes> = dispatcher.subscribeAll.bind(dispatcher);
const reaction: Reaction<EventTypes> = dispatcher.reaction.bind(dispatcher);
```

