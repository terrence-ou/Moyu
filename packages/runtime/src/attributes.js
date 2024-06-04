/**
 * Add attributes to the HTML element
 *
 * @param {HTMLElement} el the HTML to add attribute to
 * @param {Object} attrs the attributes
 */
export function setAttributes(el, attrs) {
  const { class: className, style, ...otherAttrs } = attrs;
  if (className) setClass(el, className);
  if (style) {
    Object.entries(style).forEach(([prop, value]) => {
      setStyle(el, prop, value);
    });
  }

  for (const [name, value] of Object.entries(otherAttrs)) {
    setAttribute(el, name, value);
  }
}

function setClass(el, className) {
  el.className = ""; // First clear the class attribute
  if (typeof className === "string") {
    el.className = className;
  }
  if (Array.isArray(className)) {
    el.classList.add(...className);
  }
}

export function setAttribute(el, name, value) {
  if (value === null || value === undefined) {
    removeAttribute(el, name);
  } else if (name.startsWith("data-")) {
    el.setAttribute(name, value);
  } else {
    el[name] = value;
  }
}

export function removeAttribute(el, name) {
  el[name] = null;
  el.removeAttribute(name);
}

export function setStyle(el, name, value) {
  el.style[name] = value;
}
export function removeStyle(el, name) {
  el.style[name] = null;
}
