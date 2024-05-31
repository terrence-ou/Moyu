import { mountDOM } from "./mount-dom";
import { destroyDOM } from "./destroy-dom";
import { Dispatcher } from "./dispatcher";
import { patchDOM } from "./patch-dom";

/**
 *
 * state - initial state of an application
 * view - the top-level component of the application
 */

export function createApp({ state, view, reducers = {} }) {
  let parentEl = null;
  let vdom = null;
  let isMounted = false;

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
    // if (vdom) {
    //   destroyDOM(vdom);
    // }

    const newVdom = view(state, emit);
    // vdom = view(state, emit);
    // mountDOM(vdom, parentEl);
    vdom = patchDOM(vdom, newVdom, parentEl);
  }

  return {
    mount(_parentEl) {
      if (isMounted) {
        throw new Error("The application is already mounted");
      }
      parentEl = _parentEl;
      // renderApp();
      vdom = view(state, emit);
      mountDOM(vdom, parentEl);

      isMounted = true;
    },

    unmount() {
      destroyDOM(vdom);
      vdom = null;
      subscriptions.forEach((unsubscribe) => unsubscribe());

      isMounted = false;
    },
  };
}
