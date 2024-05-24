import { DOM_TYPES } from "./h";
import { addEventListeners } from "./event";
import { setAttributes } from "./attributes";

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
function createTextNode(vdom, parentEl) {
  const { value } = vdom;
  const textNode = document.createTextNode(value); // Create a text node with document API
  vdom.el = textNode; // This is a reference to the real DOM
  parentEl.append(textNode);
}

function createFragmentNode(vdom, parentEl) {
  const { children } = vdom;
  vdom.el = parentEl;
  children.forEach((child) => mountDom(child, parentEl));
}

function createElementNode(vdom, parentEl) {
  const { tag, props, children } = vdom;
  const element = document.createElement(tag);

  addProps(element, props, vdom);
  children.forEach((child) => mountDom(child, element));
  parentEl.append(element);
}

function addProps(el, props, vdom) {
  const { on: events, ...attrs } = props;

  vdom.listeners = addEventListeners(events, el); // Plural
  setAttributes(el, attrs);
}
