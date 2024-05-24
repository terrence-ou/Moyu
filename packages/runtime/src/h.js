import { withoutNulls } from "./utils/arrays";

export const DOM_TYPES = {
  TEXT: "text",
  ELEMENT: "element",
  FRAGMENT: "fragment",
};

/**
 * Creares a virtual DOM node with the given parameters; (h is short for hypertext)
 *
 * @param {string} tag - The type of the DOM node (e.g., 'div', 'span').
 * @param {Object} [props={}] - The properties of the DOM node.
 * @param {Array} [children=[]] - The children of the DOM nod.
 * @returns {Object} The virtual DOM node
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
 * @param {Array} children - The children (nodes)
 * @returns {Array} - Children nodes with texts be converted to the text node
 */
function mapTextNodes(children) {
  return children.map((child) =>
    typeof child === "string" ? hString(child) : child
  );
}

/**
 * Convert a text into a text node
 *
 * @param {String} str - The text in the element
 * @returns {Object} - Virtual DOM text node
 */
export function hString(str) {
  return { type: DOM_TYPES.TEXT, value: str };
}

/**
 * Convert a fragment into a fragment node
 *
 * @param {Array} vNodes
 * @returns {Object} - Virtual DOM fragment node
 */
export function hFragment(vNodes) {
  return {
    type: DOM_TYPES.FRAGMENT,
    children: mapTextNodes(withoutNulls(vNodes)),
  };
}

export function lipsum(n) {
  const text =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enimad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodoconsequat.";
  return hFragment(Array(n).fill(h("p", {}, [text])));
}
