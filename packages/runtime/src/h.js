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

function mapTextNodes() {}
