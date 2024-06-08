import { DOM_TYPES } from "./h";
import { addEventListeners } from "./events";
import { setAttributes } from "./attributes";

/**
 * Mounte the virtual DOM to the real DOM.
 *
 * @param {Object} vdom the virtual DOM to mound
 * @param {HTMLElement} parentEl the parent HTML element to mount vDOM
 */
export function mountDOM(vdom, parentEl, index, hostComponent = null) {
  switch (vdom.type) {
    case DOM_TYPES.TEXT: {
      createTextNode(vdom, parentEl, index);
      break;
    }
    case DOM_TYPES.ELEMENT: {
      createElementNode(vdom, parentEl, index, hostComponent);
      break;
    }
    case DOM_TYPES.FRAGMENT: {
      createFragmentNode(vdom, parentEl, index, hostComponent);
      break;
    }
    default: {
      throw new Error(`Failed to mount DOM of type ${vdom.type}`);
    }
  }
}

// insert an html node to the parent node
function insert(el, parentEl, index) {
  // If the index is null or undefined, just append
  if (index === null || index === undefined) {
    parentEl.append(el);
    return;
  }
  if (index < 0) {
    throw new Error(`Index must be a positive integer, got ${index}`);
  }
  const children = parentEl.childNodes;
  if (index >= children.length) parentEl.append(el);
  else parentEl.insertBefore(el, children[index]);
}

/**
 * Mount an text vDOM to DOM with document API
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/createTextNode}
 * @param {Object} vdom
 * @param {HTMLElement} parentEl
 * @param {Number} index the position the item should insert to the parentEl's children array
 */
function createTextNode(vdom, parentEl, index) {
  const { value } = vdom;
  const textNode = document.createTextNode(value); // Create a text node with document API
  vdom.el = textNode; // This is a reference to the real DOM
  // parentEl.append(textNode);
  insert(textNode, parentEl, index);
}

function createFragmentNode(vdom, parentEl, index, hostComponent) {
  const { children } = vdom;
  vdom.el = parentEl; // This is a reference to the parent, be careful when handling it
  children.forEach((child, i) =>
    mountDOM(child, parentEl, index ? index + i : null, hostComponent),
  );
}

function createElementNode(vdom, parentEl, index, hostComponent) {
  const { tag, props, children } = vdom;
  const element = document.createElement(tag);
  addProps(element, props, vdom, hostComponent);
  vdom.el = element;

  children.forEach((child) => mountDOM(child, element, null, hostComponent));
  insert(element, parentEl, index);
}

function addProps(el, props, vdom, hostComponent) {
  const { on: events, ...attrs } = props;
  vdom.listeners = addEventListeners(events, el, hostComponent);
  setAttributes(el, attrs);
}
