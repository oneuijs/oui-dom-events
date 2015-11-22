// IE10+ Support
// inspired by zepto event https://github.com/madrobby/zepto/blob/master/src/event.js

let handlers = {};

let specialEvents = {};
specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents'

// every element and callback function will have an unique dtId
let _dtId = 1;

/**
 * Get dtId of Element or callback function
 * @param  {Object|Function} obj Element or callback function
 * @return {Number} unique dtId
 */
function getDtId(obj) {
  return obj._dtId || (obj._dtId = _dtId++);
}

/**
 * Get event object of event string, the first `.` is used to split event and namespace
 *
 * @param  {String} event Event type string with namespace or not
 * @return {Object} An Object with `e` and `ns` key
 */
function parse(event) {
  let dotIndex = event.indexOf('.');
  if (dotIndex > 0) {
    return {
      e: event.substring(0, event.indexOf('.')),
      ns: event.substring(dotIndex + 1, event.length)
    }
  } else {
    return {
      e: event
    }
  }
}

/**
 * Find matched event handlers
 * @param  {Element} el
 * @param  {String} selector Used by event delegation, null if not
 * @param  {String} event Event string may with namespace
 * @param  {Function} callback
 * @return {Array} Array of handlers bind to el
 */
function findHandlers(el, selector, event, callback) {
  event = parse(event);
  return (handlers[getDtId(el)] || []).filter(handler => {
    return handler
      && (!event.e  || handler.e === event.e)
      && (!event.ns || handler.ns === event.ns)
      && (!callback || handler.callback === callback)
      && (!selector || handler.selector === selector)
  });
}

/**
 * @param  {Element}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {Function}
 * @return {[type]}
 */
function removeEvent(el, selector, event, callback) {
  let eventName = parse(event).e;

  let handlers = findHandlers(el, selector, event, callback);
  handlers.forEach(handler => {
    if (el.removeEventListener) {
      el.removeEventListener(eventName, handler.delegator || handler.callback);
    } else if (el.detachEvent) {
      el.detachEvent('on' + eventName, handler.delegator || handler.callback);
    }
    handler = null;
  });
}

// delegator 只用于 delegate 时有用。
function bindEvent(el, selector, event, callback, delegator) {
  let eventName = parse(event).e;
  let ns = parse(event).ns;

  if (el.addEventListener) {
    el.addEventListener(eventName, delegator || callback, false);
  } else if (el.attachEvent) {
    el.attachEvent('on' + eventName, delegator || callback);
  }

  // push events to handlers
  let id = getDtId(el);
  let elHandlers = (handlers[id] || (handlers[id] = []));
  elHandlers.push({
    delegator: delegator,
    callback: callback,
    e: eventName,
    ns: ns,
    selector: selector
  });
}

const Events = {
  /**
   * Register a callback
   *
   * @param  {Element} el
   * @param  {String} eventType
   * @param  {Function} callback
   * @return {Null}
   */
  on(el, eventType, callback) {
    bindEvent(el, null, eventType, callback);
  },

  /**
   * Unregister a callback
   *
   * @param  {Element} el
   * @param  {String} eventType
   * @param  {Function} callback Optional
   * @return {Null}
   */
  off(el, eventType, callback) {
    // find callbacks
    removeEvent(el, null, eventType, callback);
  },

  /**
   * Register a callback that will execute exactly once
   *
   * @param  {Element} el
   * @param  {String} eventType
   * @param  {Function} callback
   * @return {Null}
   */
  once(el, eventType, callback) {
    let recursiveFunction = e => {
      Events.off(e.currentTarget, e.type, recursiveFunction);
      return callback(e);
    };

    this.on(el, eventType, recursiveFunction);
  },

  /**
   * Delegate a callback to selector under el
   *
   * @param  {Element} el
   * @param  {String} selector
   * @param  {String} eventType
   * @param  {Function} callback
   * @return {Null}
   */
  delegate(el, selector, eventType, callback) {
    // bind event to el. and check if selector match
    let delegator = e => {
      let els = el.querySelectorAll(selector);
      let matched = false;
      for(let i = 0; i < els.length; i++) {
        let _el = els[i];
        if (_el === e.target || _el.contains(e.target)) {
          matched = _el;
          break;
        }
      }
      if (matched) {
        callback.apply(matched, [].slice.call(arguments));
      }
    }

    bindEvent(el, selector, eventType, callback, delegator);
  },

  /**
   * Undelegate a callback to selector under el
   *
   * @param  {Element} el
   * @param  {String} selector
   * @param  {String} eventType
   * @param  {Function} callback
   * @return {Null}
   */
  undelegate(el, selector, eventType, callback) {
    removeEvent(el, selector, eventType, callback);
  },

  /**
   * Dispatch an event with props to el
   * @param  {Element} el
   * @param  {String} eventType
   * @param  {Object} props Optional
   * @return {Null}
   */
  trigger(el, eventType, props) {
    let event = document.createEvent(specialEvents[eventType] || 'Events');
    let bubbles = true;
    if (props) for (let name in props) (name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name])
    event.initEvent(eventType, bubbles, true);
    el.dispatchEvent(event);
  }
};

export default Events;
