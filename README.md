# oui-dom-events [![Build Status](https://travis-ci.org/oneuijs/oui-dom-events.svg)](https://travis-ci.org/oneuijs/oui-dom-events) [![npm version](https://badge.fury.io/js/oui-dom-events.svg)](http://badge.fury.io/js/oui-dom-events)

DOM events manager with namespace support

## Installation

```bash
npm install oui-dom-events
```

## Usage

### .on(element, eventName, fn)
Bind `fn` to be called when `eventName` is triggered on `element`

```js
import E from 'oui-dom-events'

let el = document.querySelector('div');
let fn = function() { /*...*/ }

E.on(el, 'click', fn);

// bind with namespace
E.on(el, 'click.slider', fn);
```

### .off(element, eventName)
Remove all event callbacks bing called when `eventName` is triggered on `element`

```js
E.off(el, 'click');

// unbind with namespace
E.off(el, 'click.slider');
```

### .off(element, eventName, fn)
Remove fn from being called when eventName is triggered on element

```js
// this also unbind events with namespace
E.off(el, 'click', fn);

// only unbind fn with namespace
E.off(el, 'click.slider', fn);
```

### .delegate(element, selector, eventName, fn)
Delegate `fn` to be called when `eventName` is triggered on all elements that match `selector` under `element`

```js
E.delegate(el, '.item', 'click', fn);

// delegate with namespace
E.delegate(el, '.item', 'click.slider', fn);

```

### .undelegate(element, selector, eventName, fn)
Delegate `fn` to be called when `eventName` is triggered on all elements that match `selector` under `element`

```js
E.undelegate(el, '.item', 'click', fn);

// undelegate with namespace
E.undelegate(el, '.item', 'click.slider', fn);

E.undelegate(el, '.item', 'click.slider');

// off also unbind all delegated events
E.off(el, 'click');
```

### .trigger(element, eventName, dataObject)
Trigger an `eventName` with `dataObject` on `element`

```
E.trigger(el, 'click', {key1: 'data1'})
```

## Caveats

* `mouseenter` doesn't bubble, use `mouseover` and `mouseout` instead.

## Liscense

MIT
