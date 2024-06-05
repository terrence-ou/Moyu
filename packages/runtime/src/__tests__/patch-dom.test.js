import { beforeEach, describe, expect, it, vi } from "vitest";
import { mountDOM } from "../mount-dom";
import { patchDOM } from "../patch-dom";
import { h, hFragment, hString } from "../h";

beforeEach(() => {
  document.body.innerHTML = "";
});

function patch(oldVdom, newVdom, hostComponent = null) {
  mountDOM(oldVdom, document.body);
  return patchDOM(oldVdom, newVdom, document.body, hostComponent);
}
// TEST - Element mount and unmount
describe("Testing patching a single element", () => {
  it("identical vdoms", () => {
    const oldVdom = h("div", {}, ["hello"]);
    const newVdom = h("div", {}, ["hello"]);
    const vdom = patch(oldVdom, newVdom);

    expect(document.body.innerHTML).toEqual("<div>hello</div>");
    expect(newVdom.el).toBe(vdom.el);
  });

  it("root dom changed", () => {
    const oldVdom = h("div", {}, ["hello"]);
    const newVdom = h("span", {}, ["hello"]);

    const vdom = patch(oldVdom, newVdom);
    expect(document.body.innerHTML).toEqual("<span>hello</span>");
    expect(vdom.el).toBeInstanceOf(HTMLSpanElement);
    expect(newVdom.el).toBe(vdom.el);
  });

  it("replace the a dom element", () => {
    const baseVdom = h("p", {}, ["base"]);
    mountDOM(baseVdom, document.body);

    const oldVdom = h("div", {}, ["hello"]);
    const newVdom = h("span", {}, ["hello"]);
    mountDOM(oldVdom, document.body, 0);
    expect(document.body.innerHTML).toEqual("<div>hello</div><p>base</p>");
    patchDOM(oldVdom, newVdom, document.body);
    expect(document.body.innerHTML).toEqual("<span>hello</span><p>base</p>");
  });

  it("patch text node", () => {
    const oldVdom = hString("original");
    const newVdom = hString("replaced");
    patch(oldVdom, newVdom);
    expect(document.body.innerHTML).toBe("replaced");
  });
});

// TEST - fragment elements
describe("Testing patching fragments", () => {
  it("adding a child to the fragment", () => {
    const oldVdom = hFragment([hFragment([hString("foo")])]);
    const newVdom = hFragment([
      hFragment([hString("foo"), hString("bar")]),
      h("p", {}, ["baz"]),
    ]);
    patch(oldVdom, newVdom);
    expect(document.body.innerHTML).toBe("foobar<p>baz</p>");
  });

  it("adding children to (nested) fragments", () => {
    const oldVdom = hFragment([
      hString("A"),
      hFragment([hString("B"), hString("C")]),
    ]);
    const newVdom = hFragment([
      hFragment([hString("X"), hString("Y")]),
      hString("A"),
      hFragment([hString("B"), hFragment([hString(" plus ")]), hString("C")]),
    ]);
    patch(oldVdom, newVdom);
    expect(document.body.innerHTML).toBe("XYAB plus C");
  });

  it("removing children from fragments", () => {
    const oldVdom = hFragment([
      hFragment([hString("X"), hString("Y")]),
      hString("A"),
      hFragment([hString("B"), hFragment([hString(" plus ")]), hString("C")]),
    ]);
    const newVdom = hFragment([
      hString("A"),
      hFragment([hString("B"), hString("C")]),
    ]);
    patch(oldVdom, newVdom);
    expect(document.body.innerHTML).toBe("ABC");
  });

  it("compound fragments patching test", () => {
    const oldVdom = hFragment([
      hFragment([hString("X"), hString("Y")]),
      hString("A"),
      hFragment([hString("B"), hFragment([hString(" plus ")]), hString("C")]),
    ]);
    const newVdom = hFragment([
      hFragment([hString("x"), hString("Y"), hString("z")]),
      hString("A"),
      hFragment([hFragment([]), hString("B"), hString("C")]),
    ]);
    patch(oldVdom, newVdom);
    expect(document.body.innerHTML).toBe("xYzABC");
  });
});

// TEST - attribute updates
describe("Testing patching attributes", () => {
  it("attribute-adding", () => {
    const oldVdom = h("div", {}, []);
    const newVdom = h("div", { id: "test" }, []);
    patch(oldVdom, newVdom);
    expect(document.querySelector("div").id).toBe("test");
  });

  it("multiple attribute-adding", () => {
    const oldVdom = h("input", {}, []);
    const newVdom = h(
      "input",
      { type: "text", value: "temp value", placeholder: "type value here" },
      [],
    );
    patch(oldVdom, newVdom);
    const inputEl = document.querySelector("input");
    expect(inputEl.getAttribute("type")).toBe("text");
    expect(inputEl.getAttribute("placeholder")).toBe("type value here");
    expect(inputEl.value).toBe("temp value");
  });

  it("attribute value modification", () => {
    const oldVdom = h("div", { "data-val": "123321" }, []);
    const newVdom = h("div", { "data-val": "789987" }, []);
    patch(oldVdom, newVdom);
    const divEl = document.querySelector("div");
    expect(divEl.getAttribute("data-val")).toBe("789987");
  });
});

// TEST class updates
describe("Testing patching class(es)", () => {
  it("adding classes", () => {
    const oldVdom = h("div", { class: ["a", "b"] }, []);
    const newVdom = h("div", { class: ["a", "b", "c", "d"] }, []);
    patch(oldVdom, newVdom);
    const divEl = document.querySelector("div");
    expect(Array.from(divEl.classList)).toEqual(["a", "b", "c", "d"]);
  });

  it("from multiple classes to a single one", () => {
    const oldVdom = h("div", { class: ["a", "b"] }, []);
    const newVdom = h("div", { class: "a" }, []);
    patch(oldVdom, newVdom);
    const divEl = document.querySelector("div");
    expect(divEl.className).toBe("a");
  });

  it("from single class to multiple", () => {
    const oldVdom = h("div", { class: "a" }, []);
    const newVdom = h("div", { class: ["a", "b"] }, []);
    patch(oldVdom, newVdom);
    const divEl = document.querySelector("div");
    expect(Array.from(divEl.classList)).toEqual(["a", "b"]);
  });

  it("merging duplicated classnames", () => {
    const oldVdom = h("div", { class: ["a", "b"] }, []);
    const newVdom = h("div", { class: ["a", "b", "a", "b"] }, []);
    patch(oldVdom, newVdom);
    const divEl = document.querySelector("div");
    expect(Array.from(divEl.classList)).toEqual(["a", "b"]);
  });

  it("adding classname(s) from string", () => {
    const oldVdom = h("div", { class: "a b" }, []);
    const newVdom = h("div", { class: "a b c d" }, []);
    patch(oldVdom, newVdom);
    const divEl = document.querySelector("div");
    expect(Array.from(divEl.classList)).toEqual(["a", "b", "c", "d"]);
  });

  it("removing classname(s) from string", () => {
    const oldVdom = h("div", { class: "a b c d" }, []);
    const newVdom = h("div", { class: "a" }, []);
    patch(oldVdom, newVdom);
    const divEl = document.querySelector("div");
    expect(Array.from(divEl.classList)).toEqual(["a"]);
  });
});

// TEST - style updates
describe("Tesing style-patching", () => {
  it("adding a new style", () => {
    const oldVdom = h("div", { style: { color: "red" } });
    const newVdom = h("div", { style: { color: "red", display: "flex" } });
    patch(oldVdom, newVdom);
    const divEl = document.body;
    expect(divEl.innerHTML).toBe(
      '<div style="color: red; display: flex;"></div>',
    );
  });

  it("adding multiple styles", () => {
    const oldVdom = h("div", {});
    const newVdom = h("div", { style: { color: "red", display: "flex" } });
    patch(oldVdom, newVdom);
    const divEl = document.body;
    expect(divEl.innerHTML).toBe(
      '<div style="color: red; display: flex;"></div>',
    );
  });

  it("removing a style", () => {
    const oldVdom = h("div", { style: { color: "red", display: "flex" } });
    const newVdom = h("div", { style: { color: "red" } });
    patch(oldVdom, newVdom);
    const divEl = document.body;
    expect(divEl.innerHTML).toBe('<div style="color: red;"></div>');
  });

  it("removing all of the styles", () => {
    const oldVdom = h("div", { style: { color: "red", display: "flex" } });
    const newVdom = h("div", {});
    patch(oldVdom, newVdom);
    const divEl = document.body;
    expect(divEl.innerHTML).toBe('<div style=""></div>');
  });
});

// TEST - Event handler updates
describe("Testing patching event handlers", () => {
  it("adding an event handler", () => {
    const newHandler = vi.fn();
    const oldVdom = h("button", {}, ["Click Me"]);
    const newVdom = h("button", { on: { click: newHandler } }, ["Click Me"]);
    patch(oldVdom, newVdom);
    // click the button twice
    document.body.querySelector("button").click();
    document.body.querySelector("button").click();
    expect(newVdom.listeners).not.toBeUndefined();
    expect(newHandler).toHaveBeenCalledTimes(2);
  });

  it("updating an event handler", () => {
    const [oldHandler, newHandler] = [vi.fn(), vi.fn()];
    const oldVdom = h("button", { on: { click: oldHandler } }, ["Click Me"]);
    const newVdom = h("button", { on: { click: newHandler } }, ["Click Me"]);
    patch(oldVdom, newVdom);
    document.body.querySelector("button").click();
    expect(oldHandler).not.toHaveBeenCalled();
    expect(newVdom.listeners).not.toBeUndefined();
    expect(newHandler).toHaveBeenCalledOnce();
  });

  it("removing an event handler", () => {
    const oldHandler = vi.fn();
    const oldVdom = h("button", { on: { click: oldHandler } }, ["Click Me"]);
    const newVdom = h("button", {}, ["Click Me"]);
    patch(oldVdom, newVdom);
    document.body.querySelector("button").click();
    expect(oldHandler).not.toHaveBeenCalled();
    expect(newVdom.listeners).toStrictEqual({});
  });
});

// TEST - Children elements patching
describe("Testing patching children", () => {
  it("appending children to the end", () => {
    const oldVdom = h("div", {}, ["A"]);
    const newVdom = h("div", {}, ["A", "B", "C"]);
    patch(oldVdom, newVdom);
    const divEl = document.body;
    expect(divEl.innerHTML).toBe("<div>ABC</div>");
  });

  it("inserting children at the beginning", () => {
    const oldVdom = h("div", {}, ["A"]);
    const newVdom = h("div", {}, ["B", "C", "A"]);
    patch(oldVdom, newVdom);
    const divEl = document.body;
    expect(divEl.innerHTML).toBe("<div>BCA</div>");
  });

  it("inserting children in the middle", () => {
    const oldVdom = h("div", {}, ["A", "C"]);
    const newVdom = h("div", {}, ["A", "B", "C"]);
    patch(oldVdom, newVdom);
    const divEl = document.body;
    expect(divEl.innerHTML).toBe("<div>ABC</div>");
  });
});
