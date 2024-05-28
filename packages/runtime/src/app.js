import { mountDOM } from "./mount-dom";
import { destroyDOM } from "./destroy-dom";
import { Dispatcher } from "./dispatcher";

/**
 *
 * state - initial state of an application
 * view - the top-level component of the application
 */

export function createApp({ state, view, reducers = {} }) {
  // eslint-disable-next-line no-unused-vars
  let parentEl = null;
  let vdom = null;

  const dispatcher = new Dispatcher();
  const subscriptions = [dispatcher.afterEveryCommand(renderApp)];

  function emit(eventName, payload) {
    dispatcher.dispatch(eventName, payload);
  }

  for (const actionName in reducers) {
    const reducer = reducers[actionName];
    const subs = dispatcher.subscribe(actionName, (payload) => {
      state = reducer(state, payload);
    });
    subscriptions.push(subs);
  }

  function renderApp() {
    if (vdom) {
      destroyDOM(vdom);
    }

    vdom = view(state, emit);
    mountDOM(vdom);
  }

  return {
    mount(_parentEl) {
      parentEl = _parentEl;
      renderApp();
    },

    unmount() {
      destroyDOM(vdom);
      vdom = null;
      subscriptions.forEach((unsubscribe) => unsubscribe());
    },
  };
}
