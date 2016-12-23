# Typesafe dispatcher

This Dispatcher is using `keyof` and `MappedTypes`. So, This package required `"typescript": "^2.1.4"`.

## Install

```
npm i typesafe-dispatcher
```

https://www.npmjs.com/package/typesafe-dispatcher

## Example

```js
import Dispatcher from 'typesafe-dispatcher';
// or import * as Dispatcher from 'typesafe-disaptcher';

interface EventTypes {
    action: number;
    action2: { count: number };
}

// create an instance with EventTypes
const dispatcher = new Dispatcher<EventTypes>();

// subscribe
const unsubscribe = dispatcher.subscribe({
	action: (payload) => {
		assert.equal(typeof payload === 'number')
	},

	action2: (payload) => {
		assert.equal(typeof payload.count === 'number')
	}
})

// dispatch
dispatcher.dispatch('action', 1)
dispatcher.dispatch('action2', {count: 1})


// unsubscribe
unsubscribe();
```

Type of subscriber

```ts
type Subscriber<T> = {[P in keyof T]?: (payload: T[P]) => any};
```

```ts
import {Subscriber} from 'typesafe-dispatcher'

const subscriber: Subscriber<EventTypes> = {
	// ...
}
```