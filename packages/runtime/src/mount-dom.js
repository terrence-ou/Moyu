import { DOM_TYPES } from "./h";

/**
 * Mounte the virtual DOM to the real DOM.
 *
 * @param {Object} vdom the virtual DOM to mound
 * @param {HTMLElement} parentEl the parent HTML element to mount vDOM
 */
export function mountDom(vdom, parentEl) {
  switch (vdom.type) {
    case DOM_TYPES.TEXT: {
      createTextNode(vdom, parentEl);
      break;
    }
    case DOM_TYPES.ELEMENT: {
      createElementNode(vdom, parentEl);
      break;
    }
    case DOM_TYPES.FRAGMENT: {
      createFragmentNode(vdom, parentEl);
      break;
    }
    default: {
      throw new Error(`Failed to mount DOM of type ${vdom.type}`);
    }
  }
}

/**
 * Mount an text vDOM to DOM with document API
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/createTextNode}
 * @param {Object} vdom
 * @param {HTMLElement} parentEl
 */
export function createTextNode(vdom, parentEl) {
  const { value } = vdom;
  const textNode = document.createTextNode(value); // Create a text node with document API
  vdom.el = textNode; // This is a reference to the real DOM
  parentEl.append(textNode);
}

export function createElementNode(vdom, parentEl) {
  const { children } = vdom;
  vdom.el = parentEl;
  children.forEach((child) => mountDom(child, parentEl));
}

export function createFragmentNode(vdom, parentEl) {}
