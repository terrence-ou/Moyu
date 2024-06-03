import { destroyDOM } from "./destroy-dom";
import { mountDOM } from "./mount-dom";
import { areNodesEqual } from "./node-equal";
import {
  removeAttribute,
  setAttribute,
  setStyle,
  removeStyle,
} from "./attributes";
import { objectsDiff } from "./utils/objects";
import { arraysDiff } from "./utils/arrays";
import { isNotBlankOrEmptyString } from "./utils/strings";
import { DOM_TYPES } from "./h";

export function patchDOM(oldVdom, newVdom, parentEl) {
  if (!areNodesEqual(oldVdom, newVdom)) {
    const index = findIndexInParent(parentEl, oldVdom.el);
    destroyDOM(oldVdom);
    mountDOM(newVdom, parentEl, index);
    return newVdom;
  }

  newVdom.el = oldVdom.el; // assign the current DOM ref to the newVdom

  switch (newVdom.type) {
    case DOM_TYPES.TEXT: {
      patchText(oldVdom, newVdom);
      return newVdom;
    }
    case DOM_TYPES.ELEMENT: {
      patchElement(oldVdom, newVdom);
      return newVdom;
    }
  }
}

function findIndexInParent(parentEl, el) {
  const index = Array.from(parentEl.childNodes).indexOf(el);
  if (index < 0) return null;
  return index;
}

function patchText(oldVdom, newVdom) {
  const el = oldVdom.el;
  const { value: oldText } = oldVdom;
  const { value: newText } = newVdom;

  if (oldText !== newText) el.nodeValue = newText;
}

function patchElement(oldVdom, newVdom) {
  const el = oldVdom.el;
  const {
    class: oldClass,
    style: oldStyle,
    on: oldEvents,
    ...oldAttrs
  } = oldVdom.props;
  const {
    class: newClass,
    style: newStyle,
    on: newEvents,
    ...newAttrs
  } = newVdom.props;
  const { listeners: oldListeners } = oldVdom;

  patchAttrs(el, oldAttrs, newAttrs);
  patchClasses(el, oldClass, newClass);
  patchStyles(el, oldStyle, newStyle);
  newVdom.listeners = patchEvents(el, oldListeners, oldEvents, newEvents);
}

function patchAttrs(el, oldAttrs, newAttrs) {
  const { added, removed, updated } = objectsDiff(oldAttrs, newAttrs);
  for (const attr of removed) {
    removeAttribute(el, attr);
  }
  for (const attr of added.concat(updated)) {
    setAttribute(el, attr, newAttrs[attr]);
  }
}

function patchClasses(el, oldClass, newClass) {
  const oldClasses = toClassList(oldClass);
  const newClasses = toClassList(newClass);

  const { added, removed } = arraysDiff(oldClasses, newClasses);
  if (removed.length > 0) el.classList.remove(...removed);
  if (added.length > 0) el.classList.add(...added);
}

function patchStyles(el, oldStyle = {}, newStyle = {}) {
  const { added, removed, updated } = objectsDiff(oldStyle, newStyle);
  for (const style of removed) removeStyle(el, style);
  for (const style of added.concat(updated))
    setStyle(el, style, newStyle[style]);
}

// TODO: patchEvents()
function patchEvents() {}

function toClassList(classes = "") {
  return Array.isArray(classes)
    ? classes.filter((className) => isNotBlankOrEmptyString(className))
    : classes
        .split(/(\s+)/)
        .filter((className) => isNotBlankOrEmptyString(className));
}
