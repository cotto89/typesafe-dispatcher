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

interface EventTypes {
    action: number;
    action2: { count: number };
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

// dispatch
dispatcher.dispatch('action', 1)
dispatcher.dispatch('action2', {count: 1})


// unsubscribe
unsubscribe();
```

![](https://cl.ly/2Z2733433M3t/Image%202017-01-07%20at%204.14.57%20%E5%8D%88%E5%BE%8C.png)
![](https://cl.ly/1f2H14072b3i/Image%202017-01-07%20at%204.15.33%20%E5%8D%88%E5%BE%8C.png)

Type of subscriber

```ts
type Subscriber<T> = {[P in keyof T]?: (payload: T[P]) => any};
```

```ts
import {Subscriber} from 'typesafe-dispatcher'

const subscriber: Subscriber<EventTypes> = {
	action: (payload) => console.log(payload),
    // ...
}

dispatcher.subscribe(subscriber)
```