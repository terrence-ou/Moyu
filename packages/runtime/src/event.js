/**
 * Add event listeners to the event target el, and returns the added listeners
 *
 * @param {object} listeners
 * @param {EventTarget} el
 * @returns added event listeners
 */
export function addEventListeners(listeners = {}, el) {
  const addedListeners = {};
  Object.entries(listeners).forEach(([eventName, handler]) => {
    const listener = addEventListener(eventName, handler, el);
    addEventListener[eventName] = listener;
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
export function addEventListener(eventName, handler, el) {
  el.addEventListener(eventName, handler);
  return handler;
}
