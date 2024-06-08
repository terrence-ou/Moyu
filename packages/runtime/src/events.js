/**
 * Add event listeners to the event target el, and returns the added listeners
 *
 * @param {EventListener[]} listeners the event listeners
 * @param {EventTarget} el the HTML element we attach the listeners to
 * @returns added event listeners
 */
export function addEventListeners(listeners = {}, el, hostComponent = null) {
  const addedListeners = {};
  Object.entries(listeners).forEach(([eventName, handler]) => {
    const listener = addEventListener(eventName, handler, el, hostComponent);
    addedListeners[eventName] = listener;
  });
  return addedListeners;
}

/**
 * Attachs an event listener to the event target, and returns the event handler
 *
 * @param {string} eventName the name of the event
 * @param {(event:Event) => void} handler the event callback function
 * @param {EventTarget} el the element to add event listener to
 * @returns the event handler
 */
export function addEventListener(eventName, handler, el, hostComponent = null) {
  function boundHandler() {
    hostComponent
      ? handler.apply(hostComponent, arguments)
      : handler(...arguments);
  }
  el.addEventListener(eventName, boundHandler);
  return boundHandler;
}

/**
 * Remove event listener from a given event target
 *
 * @param {EventListener[]} listeners the event listeners to be removed
 * @param {EventTarget} el the element to remove event listeners from
 */
export function removeEventListeners(listeners = {}, el) {
  Object.entries(listeners).forEach(([eventName, handler]) => {
    el.removeEventListener(eventName, handler);
  });
}
