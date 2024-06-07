import { withoutNulls } from "./utils/arrays";

export const DOM_TYPES = {
  TEXT: "text",
  ELEMENT: "element",
  FRAGMENT: "fragment",
};

/**
 * Creares a virtual DOM node with the given parameters; (h is short for hypertext)
 *
 * @param {string} tag - the type of the DOM node (e.g., 'div', 'span').
 * @param {Object} [props={}] - the properties of the DOM node.
 * @param {Array} [children=[]] - the children of the DOM nod.
 * @returns {Object} the virtual DOM node
 */
export function h(tag, props = {}, children = []) {
  return {
    tag,
    props,
    children: mapTextNodes(withoutNulls(children)),
    type: DOM_TYPES.ELEMENT,
  };
}

/**
 * Convert texts into Text Nodes
 *
 * @param {Array} children - the children (nodes)
 * @returns {Array} - children nodes with texts be converted to the text node
 */
function mapTextNodes(children) {
  return children.map((child) => {
    return typeof child === "string" ? hString(child) : child;
  });
}

/**
 * Convert a text into a text node
 *
 * @param {String} str - the text in the element
 * @returns {Object} - virtual DOM text node
 */
export function hString(str) {
  return { type: DOM_TYPES.TEXT, value: str };
}

/**
 * Convert a fragment into a fragment node
 *
 * @param {Array} vNodes - virtual DOM nodes
 * @returns {Object} - virtual DOM fragment node
 */
export function hFragment(vNodes) {
  return {
    type: DOM_TYPES.FRAGMENT,
    children: mapTextNodes(withoutNulls(vNodes)),
  };
}

export function extractChildren(vdom) {
  if (vdom.children === null || vdom.children === undefined) return [];
  const children = [];
  for (const child of vdom.children) {
    if (child.type === DOM_TYPES.FRAGMENT) {
      children.push(...extractChildren(child));
    } else {
      children.push(child);
    }
  }
  return children;
}
