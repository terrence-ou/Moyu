import { beforeEach, describe, expect, it } from "vitest";
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
